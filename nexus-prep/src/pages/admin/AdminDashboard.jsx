import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Plus, Loader, Edit } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { ROUTES } from '../../constants/routes';

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await adminService.getAllCourses();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

const handleCreateDraft = async () => {
    try {
      // Generate a random 4-digit number to ensure the title is always unique
      const uniqueId = Math.floor(1000 + Math.random() * 9000);

      const newCourse = await adminService.createCourse({
        title: `New Course ${uniqueId}`,
        description: 'Provide a description here.',
        category: 'GATE',
        price: 0,
      });
      navigate(ROUTES.ADMIN_COURSE_EDITOR(newCourse._id));
    } catch (err) {
      alert('Failed to create course');
      console.error(err); 
    }
  };

  if (loading) return <div className="p-12 text-center"><Loader className="w-8 h-8 animate-spin mx-auto text-brand-600"/></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-display flex items-center gap-2"><BookOpen className="w-6 h-6"/> Course Management</h2>
          <p className="text-gray-500 text-sm">Create and manage your course catalog.</p>
        </div>
        <button onClick={handleCreateDraft} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4"/> New Course
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-50 border-b border-surface-200 text-gray-500">
            <tr>
              <th className="p-4 font-semibold">Course Title</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(c => (
              <tr key={c._id} className="border-b border-surface-100 hover:bg-surface-50">
                <td className="p-4 font-medium text-gray-900">{c.title}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${c.isPublished ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {c.isPublished ? 'PUBLISHED' : 'DRAFT'}
                  </span>
                </td>
                <td className="p-4">₹{c.price}</td>
                <td className="p-4 text-right">
                  <Link to={ROUTES.ADMIN_COURSE_EDITOR(c._id)} className="text-brand-600 hover:text-brand-800 font-medium flex items-center justify-end gap-1">
                    <Edit className="w-4 h-4"/> Edit
                  </Link>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr><td colSpan="4" className="p-8 text-center text-gray-500">No courses found. Click "New Course" to begin.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}