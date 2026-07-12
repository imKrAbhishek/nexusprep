// Settings.jsx — User account settings page
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { User, Bell, Shield, Save } from "lucide-react";
const EXAM_OPTIONS = [
  { value: "GATE", label: "GATE" },
  { value: "JEE", label: "JEE" },
  { value: "CAT", label: "CAT" },
  { value: "Placement", label: "Placements" },
  { value: "UPSC", label: "UPSC" }
];
export default function Settings() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Later: PUT /api/user/settings
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-display">Settings</h2>
        <p className="text-gray-500 mt-1">Manage your profile and preferences.</p>
      </div>

      {/* Profile settings */}
      <div className="card p-6 space-y-5">
        <h3 className="font-bold text-gray-900 flex items-center gap-2"><User className="w-5 h-5 text-brand-500" /> Profile</h3>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">{user?.avatar}</div>
          <div>
            <button className="btn-outline py-1.5 px-4 text-sm">Change Photo</button>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 2MB</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input defaultValue={user?.name} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input defaultValue={user?.email} type="email" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Target Exam</label>
            <select className="input appearance-none">
              {EXAM_OPTIONS.filter(o => o.value).map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
            <input placeholder="+91 98765 43210" className="input" />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-6 space-y-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2"><Bell className="w-5 h-5 text-brand-500" /> Notifications</h3>
        {[
          ["Live class reminders", "Get notified 15 minutes before a live class"],
          ["Quiz & test results", "Instant notification when results are published"],
          ["New course recommendations", "Weekly personalized course suggestions"],
          ["Platform announcements", "Important updates from NexusPrep"],
        ].map(([label, desc]) => (
          <div key={label} className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900">{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
            {/* Toggle */}
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-0.5">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-10 h-5 bg-gray-200 peer-checked:bg-brand-600 rounded-full transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
            </label>
          </div>
        ))}
      </div>

      {/* Security */}
      <div className="card p-6 space-y-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2"><Shield className="w-5 h-5 text-brand-500" /> Security</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
          <input type="password" placeholder="••••••••" className="input" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <input type="password" placeholder="Min. 8 characters" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
            <input type="password" placeholder="Repeat new password" className="input" />
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-4">
        <button onClick={handleSave} className="btn-primary px-8">
          <Save className="w-4 h-4" /> {saved ? "Saved!" : "Save Changes"}
        </button>
        {saved && <span className="text-emerald-500 text-sm font-medium">✓ Changes saved successfully</span>}
      </div>
    </div>
  );
}
