import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Share2, Mail, Phone } from 'lucide-react';

export default function Footer() {
  
  // Handles the native share menu on mobile, or copies link on desktop
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'NexusPrep',
          text: 'Master Your Exam. Shape Your Future with NexusPrep!',
          url: window.location.origin,
        });
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        alert('Website link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <footer className="bg-[#0f172a] text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* ── Brand & Action Buttons ── */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm font-mono">NP</span>
              </div>
              <span className="text-xl font-bold text-white font-display">NexusPrep</span>
            </Link>
            
            <p className="text-sm text-gray-400">Master Your Exam. Shape Your Future.</p>
            
            <div className="flex gap-3 pt-2">
              {/* Globe: Goes to Home */}
              <Link to="/" className="p-2.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Globe className="w-5 h-5 text-gray-300" />
              </Link>
              
              {/* Share: Triggers Web Share API */}
              <button onClick={handleShare} className="p-2.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Share2 className="w-5 h-5 text-gray-300" />
              </button>
              
              {/* Mail: Opens Email Client */}
              <a href="mailto:kumarabhishekbharthipur@gmail.com" className="p-2.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Mail className="w-5 h-5 text-gray-300" />
              </a>
              
              {/* Phone: Opens Dialer */}
              <a href="tel:+917004339435" className="p-2.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Phone className="w-5 h-5 text-gray-300" />
              </a>
            </div>
          </div>

          {/* ── Courses ── */}
          <div>
            <h3 className="text-white font-bold mb-4">Courses</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/catalog?category=jee" className="hover:text-white transition-colors">JEE Main & Advanced</Link></li>
              <li><Link to="/catalog?category=gate-cs" className="hover:text-white transition-colors">GATE CS</Link></li>
              <li><Link to="/catalog?category=gate-ee" className="hover:text-white transition-colors">GATE EE</Link></li>
              <li><Link to="/catalog?category=placements" className="hover:text-white transition-colors">Campus Placements</Link></li>
              <li><Link to="/catalog?category=cat" className="hover:text-white transition-colors">CAT / MBA</Link></li>
            </ul>
          </div>

          {/* ── Company ── */}
          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/press" className="hover:text-white transition-colors">Press</Link></li>
              <li><Link to="/partner" className="hover:text-white transition-colors">Partner with Us</Link></li>
            </ul>
          </div>

          {/* ── Contact Details ── */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <a href="mailto:kumarabhishekbharthipur@gmail.com" className="flex items-center gap-3 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" /> kumarabhishekbharthipur@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+917004339435" className="flex items-center gap-3 hover:text-white transition-colors">
                  <Phone className="w-4 h-4" /> +91 70043 39435
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} NexusPrep. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}