import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Sparkles, Plus, Loader, ArrowLeft } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function CourseEditor() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states for adding a lecture
  const [activeModule, setActiveModule] = useState(null);
  const [newLecture, setNewLecture] = useState({ title: '', videoUrl: '', notes: '' });
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const data = await adminService.getCourseById(courseId);
      setCourse(data);
    } catch (err) {
      alert("Failed to load course");
    } finally {
      setLoading(false);
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
      <div className="flex items-center gap-4 border-b border-surface-200 pb-4">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-900"><ArrowLeft className="w-5 h-5"/></button>
        <h2 className="text-2xl font-bold font-display flex-1">Editing: {course?.title}</h2>
        <button onClick={() => adminService.publishCourse(courseId).then(loadCourse)} disabled={course.isPublished} className="btn-primary">
          {course.isPublished ? 'Published' : 'Publish Course'}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Col: Modules List */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Curriculum</h3>
            <button onClick={handleAddModule} className="text-brand-600 hover:text-brand-800 text-sm font-semibold flex items-center"><Plus className="w-4 h-4"/> Module</button>
          </div>
          
          {course.modules.map((mod, idx) => (
            <div key={mod._id} className="bg-white border border-surface-200 rounded-xl p-3 shadow-sm">
              <h4 className="font-bold text-sm text-gray-800 mb-2">Module {idx+1}: {mod.title}</h4>
              <ul className="space-y-1 mb-3">
                {mod.lectures.map(l => (
                  <li key={l._id} className="text-xs text-gray-600 truncate border-l-2 border-brand-300 pl-2 py-1">{l.title}</li>
                ))}
              </ul>
              <button onClick={() => setActiveModule(mod._id)} className="w-full text-xs bg-surface-100 hover:bg-surface-200 text-gray-700 py-1.5 rounded-md font-medium">
                + Add Lecture
              </button>
            </div>
          ))}
        </div>

        {/* Right Col: Add Lecture Form */}
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
    </div>
  );
}