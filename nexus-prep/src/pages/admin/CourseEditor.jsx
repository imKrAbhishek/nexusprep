import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Sparkles, Plus, Loader, ArrowLeft, Edit, X } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { api } from '../../services/api'; // Imported for the update API call

export default function CourseEditor() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- MODULE & LECTURE STATES ---
  const [activeModule, setActiveModule] = useState(null);
  const [newLecture, setNewLecture] = useState({ title: '', videoUrl: '', notes: '' });
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  // --- COURSE METADATA EDIT STATES ---
  const [isEditing, setIsEditing] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    price: 0,
    category: ''
  });

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const data = await adminService.getCourseById(courseId);
      setCourse(data);
      // Pre-fill the edit form with the fetched data
      setEditData({
        title: data.title || '',
        description: data.description || '',
        price: data.price || 0,
        category: data.category || 'GATE CS'
      });
    } catch (err) {
      alert("Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLE UPDATING COURSE INFO ---
 // --- HANDLE UPDATING COURSE INFO ---
// In CourseEditor.jsx
  const handleSaveEdit = async () => {
    setSavingEdit(true);
    try {
      // ── FIXED: Pointing to the standard courses route ──
      await api.put(`/courses/${courseId}`, {
        title: editData.title,
        description: editData.description,
        price: Number(editData.price),
        category: editData.category
      });
      
      setIsEditing(false);
      loadCourse(); 
    } catch (error) {
      console.error("Failed to update course. Backend response:", error.response || error);
      alert(error.response?.data?.message || "Failed to save edits.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleAddModule = async () => {
    const title = prompt("Enter Module Title:");
    if (!title) return;
    await adminService.addModule(courseId, { title });
    loadCourse();
  };

  const handleAddLecture = async () => {
    if (!newLecture.title || !activeModule) return;
    await adminService.addLecture(courseId, activeModule, newLecture);
    setNewLecture({ title: '', videoUrl: '', notes: '' });
    setActiveModule(null);
    loadCourse();
  };

  const handleGenerateQuiz = async () => {
    if (!newLecture.notes || newLecture.notes.length < 50) {
      alert("Please paste at least 50 characters of notes first!");
      return;
    }
    setGeneratingQuiz(true);
    try {
      await adminService.generateAiQuiz({
        title: `${newLecture.title || 'Lecture'} Auto-Quiz`,
        context: newLecture.notes,
        category: course.category,
        courseId: course._id
      });
      alert("Magic complete! Quiz generated and saved successfully.");
    } catch (err) {
      alert(err.response?.data?.message || "AI Generation failed.");
    } finally {
      setGeneratingQuiz(false);
    }
  };

  if (loading) return <div className="p-12 text-center"><Loader className="w-8 h-8 animate-spin mx-auto text-brand-600"/></div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      
      {/* ── HEADER & CONTROLS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-surface-200 pb-4">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5"/>
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold font-display truncate">Editing: {course?.title}</h2>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
            <span className="font-semibold text-brand-600">{course?.category}</span>
            <span>₹{course?.price}</span>
            <span className={course?.isPublished ? "text-emerald-600" : "text-amber-500"}>
              {course?.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsEditing(true)} 
            className="btn-outline flex items-center gap-2 py-2"
          >
            <Edit className="w-4 h-4" /> Edit Info
          </button>
          
          <button 
            onClick={() => adminService.publishCourse(courseId).then(loadCourse)} 
            disabled={course?.isPublished} 
            className="btn-primary py-2"
          >
            {course?.isPublished ? 'Published' : 'Publish Course'}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* ── LEFT COL: MODULES LIST ── */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Curriculum</h3>
            <button onClick={handleAddModule} className="text-brand-600 hover:text-brand-800 text-sm font-semibold flex items-center">
              <Plus className="w-4 h-4"/> Module
            </button>
          </div>
          
          {course?.modules?.map((mod, idx) => (
            <div key={mod._id} className="bg-white border border-surface-200 rounded-xl p-3 shadow-sm">
              <h4 className="font-bold text-sm text-gray-800 mb-2">Module {idx+1}: {mod.title}</h4>
              <ul className="space-y-1 mb-3">
                {mod.lectures?.map(l => (
                  <li key={l._id} className="text-xs text-gray-600 truncate border-l-2 border-brand-300 pl-2 py-1">{l.title}</li>
                ))}
              </ul>
              <button onClick={() => setActiveModule(mod._id)} className="w-full text-xs bg-surface-100 hover:bg-surface-200 text-gray-700 py-1.5 rounded-md font-medium">
                + Add Lecture
              </button>
            </div>
          ))}
        </div>

        {/* ── RIGHT COL: ADD LECTURE FORM ── */}
        <div className="md:col-span-2">
          {activeModule ? (
            <div className="bg-white border border-surface-200 rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900 border-b border-surface-100 pb-2">Add New Lecture</h3>
              
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Lecture Title</label>
                <input type="text" className="input text-sm" value={newLecture.title} onChange={e => setNewLecture({...newLecture, title: e.target.value})} />
              </div>
              
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Video URL (YouTube/S3)</label>
                <input type="text" className="input text-sm" placeholder="https://..." value={newLecture.videoUrl} onChange={e => setNewLecture({...newLecture, videoUrl: e.target.value})} />
              </div>

              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="text-xs font-semibold text-gray-600">Lecture Notes / Transcript</label>
                  <button onClick={handleGenerateQuiz} disabled={generatingQuiz} className="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors">
                    {generatingQuiz ? <Loader className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>}
                    Generate AI Quiz from Notes
                  </button>
                </div>
                <textarea rows="6" className="input text-sm font-mono" placeholder="Paste transcript here to enable RAG AI Features..." value={newLecture.notes} onChange={e => setNewLecture({...newLecture, notes: e.target.value})} />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={handleAddLecture} className="btn-primary flex-1 py-2 text-sm flex items-center justify-center gap-2"><Save className="w-4 h-4"/> Save Lecture</button>
                <button onClick={() => setActiveModule(null)} className="btn-outline flex-1 py-2 text-sm">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-surface-200 rounded-xl text-gray-400 p-12 text-center">
              Select "+ Add Lecture" on a module to upload content.
            </div>
          )}
        </div>
      </div>

      {/* ── EDIT COURSE MODAL ── */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-fade-in relative">
            <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Edit className="w-6 h-6 text-brand-500" /> Edit Course Info
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Course Title</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                  value={editData.title} 
                  onChange={e => setEditData({...editData, title: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
                  <input 
                    type="number" 
                    className="w-full p-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                    value={editData.price} 
                    onChange={e => setEditData({...editData, price: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <select 
                    className="w-full p-3 border border-surface-200 rounded-xl bg-white focus:ring-2 focus:ring-brand-500"
                    value={editData.category} 
                    onChange={e => setEditData({...editData, category: e.target.value})}
                  >
                    <option value="GATE CS">GATE CS</option>
                    <option value="JEE Mains">JEE Mains</option>
                    <option value="Placements">Placements</option>
                    <option value="Web Development">Web Development</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea 
                  rows="4" 
                  className="w-full p-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                  value={editData.description} 
                  onChange={e => setEditData({...editData, description: e.target.value})} 
                />
              </div>

              <button 
                onClick={handleSaveEdit} 
                disabled={savingEdit}
                className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 flex items-center justify-center gap-2 mt-4"
              >
                {savingEdit ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {savingEdit ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}