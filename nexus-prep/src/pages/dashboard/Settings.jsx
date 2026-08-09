import React, { useState, useRef } from "react";
import { User, Bell, Upload, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Settings() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form with user context data
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    targetExam: user?.targetExam || "",
    phoneNumber: user?.phoneNumber || "",
    avatar: user?.avatar || null,
  });

  const [notifications, setNotifications] = useState({
    liveClass: true,
    quizResults: true,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image Upload & Preview
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Update global context so photo appears everywhere
    if (updateUser) {
      await updateUser({ ...user, ...formData });
    }
    
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 500);
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-display">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your profile and preferences.</p>
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6 border-b border-surface-200 pb-4">
          <User className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-gray-900">Profile</h2>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-xl bg-indigo-100 flex items-center justify-center overflow-hidden border-2 border-indigo-50">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-indigo-400" />
              )}
            </div>
            <div>
              <input 
                type="file" 
                accept="image/png, image/jpeg" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-200 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
              >
                <Upload className="w-4 h-4" /> Change Photo
              </button>
              <p className="text-xs text-gray-400 mt-2">JPG, PNG up to 2MB</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Exam</label>
              <input
                type="text"
                name="targetExam"
                value={formData.targetExam}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Notifications Section */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6 border-b border-surface-200 pb-4">
          <Bell className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900">Live class reminders</p>
              <p className="text-sm text-gray-500">Get notified 15 minutes before a live class</p>
            </div>
            <button 
              onClick={() => setNotifications({...notifications, liveClass: !notifications.liveClass})}
              className={`w-11 h-6 rounded-full transition-colors relative ${notifications.liveClass ? 'bg-indigo-600' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.liveClass ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}