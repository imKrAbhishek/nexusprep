import React from 'react';
import { Award } from 'lucide-react';

export default function SuccessStories() {
  return (
    <div className="min-h-screen bg-surface-50 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <Award className="w-16 h-16 text-brand-600 mx-auto" />
        <h1 className="text-4xl md:text-5xl font-black font-display text-gray-900">Success Stories</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join thousands of students who have transformed their careers with NexusPrep.
        </p>
        <div className="bg-white p-12 rounded-3xl border border-surface-200 shadow-sm mt-8">
          <p className="text-gray-500 font-medium">Student testimonials and placement records will appear here.</p>
        </div>
      </div>
    </div>
  );
}