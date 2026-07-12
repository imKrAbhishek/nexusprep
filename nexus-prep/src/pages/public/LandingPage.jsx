// ============================================================
// LandingPage.jsx — Public homepage
// Sections: Hero → Features → Courses → Testimonials → CTA → Footer
// ============================================================

import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, CheckCircle, ChevronRight, Brain, Video, BarChart2, FileText, Users, Award, Zap, Trophy, Play } from "lucide-react";
import CourseCard from "../../components/ui/CourseCard";
import Footer from "../../components/layout/Footer";

const BRAND = { 
  name: "NexusPrep", 
  logo: "NP",
  tagline: "Master Your Exam. Shape Your Future." 
};
const FEATURES = [
  { icon: "Brain", title: "AI Doubt Solver", description: "Get instant, step-by-step explanations for any problem.", color: "text-brand-500", bg: "bg-brand-50" },
  { icon: "Video", title: "Expert Live Classes", description: "Learn directly from industry professionals in interactive sessions.", color: "text-emerald-500", bg: "bg-emerald-50" },
  { icon: "BarChart2", title: "Adaptive Analytics", description: "Personalized weak-area reports powered by our MERN backend.", color: "text-purple-500", bg: "bg-purple-50" }
];

const COURSES = [
  { id: 1, title: "Advanced Backend Engineering (Node/Express)", instructor: "Nexus Admin", rating: 4.9, students: 4820, price: 4999, originalPrice: 8999, color: "from-blue-500 to-indigo-600", level: "Advanced", modules: 12, duration: "40 hrs" },
  { id: 2, title: "GATE CS — Algorithms & DS", instructor: "Prof. Sneha", rating: 4.8, students: 6100, price: 3999, originalPrice: 6999, color: "from-emerald-500 to-teal-600", level: "Intermediate", modules: 10, duration: "60 hrs" },
  { id: 3, title: "System Design for Placements", instructor: "Tech Lead", rating: 4.9, students: 3200, price: 2999, originalPrice: 5999, color: "from-purple-500 to-pink-600", level: "Advanced", modules: 8, duration: "30 hrs" }
];

const TESTIMONIALS = [
  { id: 1, name: "Kavya Reddy", exam: "GATE CS 2024", quote: "NexusPrep's AI doubt solver saved me so much time. The backend architecture is incredibly fast.", avatar: "KR" },
  { id: 2, name: "Rohan Sinha", exam: "Campus Placement", quote: "The mock tests gave me the edge I needed to clear my technical rounds.", avatar: "RS" }
];

const MOCK_USER = {
  name: "John Doe",
  fullName: "John Doe",
  role: "student"
};
// Icon map for feature icons stored as strings in mockData
const ICON_MAP = { Brain, Video, BarChart2, FileText, Users, Award, Zap, Trophy };

export default function LandingPage() {
  return (
    <div className="min-h-screen">

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-br from-surface-950 via-surface-900 to-surface-800 pt-32 pb-24 overflow-hidden">

        {/* Decorative background blobs — pure CSS, no images needed */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">

            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-500/30 rounded-full px-4 py-1.5 text-brand-300 text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              <span>Trusted by 50,000+ aspirants across India</span>
            </div>

          {/* Main headline */}
            <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight font-display mb-6">
              {BRAND?.tagline?.split(" ").slice(0, 3).join(" ") || "Master Your Exam."}{" "}
              <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
                {BRAND?.tagline?.split(" ").slice(3).join(" ") || "Shape Your Future."}
              </span>
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed mb-10 max-w-xl mx-auto">
              Expert-led courses, AI-powered doubt solving, and adaptive mock tests — everything you need to crack JEE, GATE, or land your dream job.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary text-base px-8 py-4">
                Start Learning Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/catalog" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl px-8 py-4 transition-all">
                <Play className="w-4 h-4" /> Explore Courses
              </Link>
            </div>

            {/* Social proof micro-stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-12 pt-12 border-t border-white/10">
              {[
                { n: "50K+", label: "Active Students" },
                { n: "200+", label: "Expert Instructors" },
                { n: "4.8★", label: "Average Rating" },
                { n: "95%", label: "Success Rate" },
              ].map(s => (
                <div key={s.n} className="text-center">
                  <p className="text-2xl font-bold text-white">{s.n}</p>
                  <p className="text-sm text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES SECTION
      ══════════════════════════════════════════ */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            label="Why NexusPrep"
            title="Everything you need to succeed"
            sub="Built by toppers, for toppers — the most comprehensive exam prep platform in India."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {FEATURES.map((f, i) => {
              const Icon = ICON_MAP[f.icon] || Brain;
              return (
                <div key={i} className="card p-6 hover:-translate-y-1 transition-transform duration-300">
                  <div className={`w-12 h-12 ${f.bg} rounded-2xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${f.color}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          COURSE SHOWCASE
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-surface-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <SectionHeader
              label="Popular Courses"
              title="Start with the best"
              sub="Handpicked courses with proven results."
              left
            />
            <Link to="/catalog" className="hidden sm:flex items-center gap-1 text-brand-600 font-semibold hover:gap-2 transition-all">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.slice(0, 3).map(c => <CourseCard key={c.id} course={c} />)}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link to="/catalog" className="btn-outline">Browse All Courses</Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <SectionHeader label="The Process" title="3 steps to exam success" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { step: "01", title: "Pick Your Goal", desc: "Choose your target exam — JEE, GATE, or Placement — and get a personalized study plan." },
              { step: "02", title: "Learn & Practice", desc: "Access expert video lectures, solve PYQs, take adaptive quizzes, and clear doubts instantly with AI." },
              { step: "03", title: "Track & Improve", desc: "Real-time analytics identify your weak spots. Rank predictors tell you exactly where you stand." },
            ].map(s => (
              <div key={s.step} className="relative">
                <div className="text-6xl font-black text-surface-100 font-display leading-none mb-4">{s.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 -mt-4">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════ */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-brand-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            label="Student Stories"
            title="Real results, real students"
            sub="Join thousands of aspirants who transformed their preparation with NexusPrep."
            light
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {TESTIMONIALS.map(t => (
              <div key={t.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-gold-400 fill-gold-400" />)}
                </div>
                {/* Quote */}
                <p className="text-white/90 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                {/* Student */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/60 text-xs">{t.exam} · {t.rank}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BOTTOM CTA BANNER
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto text-center px-6">
          <div className="inline-flex items-center gap-2 text-brand-600 bg-brand-50 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Trophy className="w-4 h-4" /> Limited Seats — Enroll Today
          </div>
          <h2 className="text-4xl font-bold text-gray-900 font-display mb-4">
            Ready to crack your exam?
          </h2>
          <p className="text-gray-500 mb-8">Join 50,000+ students already on their way to success.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-primary px-10 py-4 text-base">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/catalog" className="btn-outline px-10 py-4 text-base">Browse Courses</Link>
          </div>
          {/* Trust signals */}
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-gray-400">
            {["No credit card required", "7-day free trial", "Cancel anytime"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ── Helper: Section header ──
function SectionHeader({ label, title, sub, left = false, light = false }) {
  const align = left ? "text-left" : "text-center mx-auto";
  const textColor = light ? "text-white" : "text-gray-900";
  const subColor = light ? "text-white/70" : "text-gray-500";
  const badgeColor = light ? "bg-white/20 text-white" : "bg-brand-50 text-brand-600";

  return (
    <div className={`max-w-2xl ${align}`}>
      <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 ${badgeColor}`}>{label}</span>
      <h2 className={`text-3xl sm:text-4xl font-bold font-display ${textColor} mb-3`}>{title}</h2>
      {sub && <p className={`${subColor} leading-relaxed`}>{sub}</p>}
    </div>
  );
}
