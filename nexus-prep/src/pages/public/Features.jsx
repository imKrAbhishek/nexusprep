import React from 'react';
import { Sparkles, Brain, Video, ShieldCheck } from 'lucide-react';

export default function Features() {
  return (
    <div className="min-h-screen bg-surface-50 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-black font-display text-gray-900 mb-4">Platform Features</h1>
          <p className="text-lg text-gray-600">Everything you need to excel in your preparation.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Example Feature Cards */}
          <div className="bg-white p-8 rounded-3xl border border-surface-200 shadow-sm">
            <Video className="w-10 h-10 text-brand-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">HD Video Lectures</h3>
            <p className="text-gray-600">Crystal clear, uninterrupted learning with seamless playback.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-surface-200 shadow-sm">
            <Brain className="w-10 h-10 text-brand-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">AI Doubt Solving</h3>
            <p className="text-gray-600">Get instant answers to your complex queries using our RAG AI.</p>
          </div>
        </div>
      </div>
    </div>
  );
}