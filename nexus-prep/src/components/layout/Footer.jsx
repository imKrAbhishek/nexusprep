// Footer.jsx — Site-wide footer for public pages
import React from "react";
import { Link } from "react-router-dom";
import { Globe, Share2, Mail, Phone } from "lucide-react";
const BRAND = {
  name: "NexusPrep",
  tagline: "Master Your Exam. Shape Your Future.",
  logo: "NP",
  email: "hello@nexusprep.com",
  phone: "+91 98765 43210",
};
export default function Footer() {
  return (
    <footer className="bg-surface-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm font-mono">{BRAND.logo}</span>
              </div>
              <span className="text-xl font-bold text-white font-display">{BRAND.name}</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">{BRAND.tagline}</p>
            <div className="flex gap-3">
              {[Globe, Share2, Mail, Phone].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-surface-800 hover:bg-brand-600 rounded-lg flex items-center justify-center transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Courses</h4>
            <ul className="space-y-2 text-sm">
              {["JEE Main & Advanced","GATE CS","GATE EE","Campus Placements","CAT / MBA"].map(l => (
                <li key={l}><Link to="/catalog" className="hover:text-brand-400 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              {["About Us","Careers","Blog","Press","Partner with Us"].map(l => (
                <li key={l}><a href="#" className="hover:text-brand-400 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-400" /><span>{BRAND.email}</span></div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-400" /><span>{BRAND.phone}</span></div>
            </div>
          </div>
        </div>
        <div className="border-t border-surface-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between text-xs text-gray-500 gap-2">
          <p>© 2024 {BRAND.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
            <a href="#" className="hover:text-gray-300">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
