import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Construction } from 'lucide-react';

export default function StaticPage() {
  const location = useLocation();
  
  // Clean up the URL path to make it a readable title (e.g., "/refund-policy" -> "REFUND POLICY")
  const pageTitle = location.pathname
    .replace('/', '')
    .replace('-', ' ')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-surface-50 pt-32 pb-12 flex flex-col items-center text-center px-4">
      <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-6">
        <Construction className="w-8 h-8 text-brand-600" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-black text-gray-900 font-display mb-4">
        {pageTitle || "PAGE"}
      </h1>
      
      <p className="text-lg text-gray-600 mb-8 max-w-xl">
        This page is currently under construction. Check back soon as we continue to build and expand the platform!
      </p>
      
      <Link to="/" className="bg-brand-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-700 transition-colors shadow-sm">
        Return Home
      </Link>
    </div>
  );
}