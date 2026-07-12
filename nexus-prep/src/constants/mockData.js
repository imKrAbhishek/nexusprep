// ============================================================
// mockData.js — All fake/placeholder data for the platform
// Replace these values with real API responses later
// ============================================================

// Platform branding — update these when you have real branding
export const BRAND = {
  name: "NexusPrep",
  tagline: "Master Your Exam. Shape Your Future.",
  logo: "NP", // initials used as logo placeholder
  email: "hello@nexusprep.com",
  phone: "+91 98765 43210",
};

// Target exams offered on the platform
export const EXAM_OPTIONS = [
  { value: "", label: "Select Target Exam" },
  { value: "jee-main", label: "JEE Main" },
  { value: "jee-advanced", label: "JEE Advanced" },
  { value: "gate-cs", label: "GATE - Computer Science" },
  { value: "gate-ee", label: "GATE - Electrical Engineering" },
  { value: "gate-me", label: "GATE - Mechanical Engineering" },
  { value: "placement", label: "Campus Placements" },
  { value: "cat", label: "CAT / MBA" },
  { value: "upsc", label: "UPSC Civil Services" },
];

// Featured courses for catalog and landing page
export const COURSES = [
  {
    id: 1,
    title: "JEE Advanced Physics Masterclass",
    instructor: "Dr. Arjun Mehta",
    instructorAvatar: "AM",
    instructorBio: "IIT Delhi alumnus with 12 years of JEE coaching experience.",
    category: "JEE",
    level: "Advanced",
    duration: "120 hrs",
    modules: 18,
    students: 4820,
    rating: 4.9,
    reviews: 312,
    price: 4999,
    originalPrice: 8999,
    thumbnail: null, // replace with actual image URL
    color: "from-blue-500 to-indigo-600",
    tags: ["Mechanics", "Electrostatics", "Optics", "Modern Physics"],
    description:
      "A complete deep-dive into JEE Advanced level Physics — from fundamentals to advanced problem-solving strategies used by toppers.",
    modules_list: [
      { id: 1, title: "Units & Dimensions", lectures: 6, duration: "4h 20m", free: true },
      { id: 2, title: "Kinematics & Projectile Motion", lectures: 9, duration: "6h 10m", free: false },
      { id: 3, title: "Laws of Motion & Friction", lectures: 8, duration: "5h 40m", free: false },
      { id: 4, title: "Work, Energy & Power", lectures: 7, duration: "5h 00m", free: false },
      { id: 5, title: "Rotational Dynamics", lectures: 10, duration: "7h 30m", free: false },
      { id: 6, title: "Gravitation", lectures: 6, duration: "4h 00m", free: false },
    ],
    enrolled: true,
    progress: 42,
  },
  {
    id: 2,
    title: "GATE CS — Algorithms & DS",
    instructor: "Prof. Sneha Iyer",
    instructorAvatar: "SI",
    instructorBio: "Ex-Google SWE, PhD from IISc Bangalore. Teaching GATE CS for 8 years.",
    category: "GATE",
    level: "Intermediate",
    duration: "80 hrs",
    modules: 12,
    students: 6100,
    rating: 4.8,
    reviews: 489,
    price: 3999,
    originalPrice: 6999,
    thumbnail: null,
    color: "from-emerald-500 to-teal-600",
    tags: ["Arrays", "Trees", "Graphs", "Dynamic Programming", "Complexity"],
    description:
      "Comprehensive coverage of Data Structures & Algorithms for GATE CS — includes previous year questions, shortcuts, and timed mock tests.",
    modules_list: [
      { id: 1, title: "Time & Space Complexity", lectures: 5, duration: "3h 00m", free: true },
      { id: 2, title: "Arrays & Linked Lists", lectures: 8, duration: "5h 20m", free: false },
      { id: 3, title: "Stacks, Queues & Heaps", lectures: 7, duration: "4h 40m", free: false },
      { id: 4, title: "Trees & Binary Search Trees", lectures: 9, duration: "6h 00m", free: false },
      { id: 5, title: "Graphs — BFS, DFS, Dijkstra", lectures: 10, duration: "7h 00m", free: false },
      { id: 6, title: "Dynamic Programming", lectures: 12, duration: "8h 30m", free: false },
    ],
    enrolled: true,
    progress: 71,
  },
  {
    id: 3,
    title: "Campus Placement Bootcamp",
    instructor: "Rahul Kapoor",
    instructorAvatar: "RK",
    instructorBio: "Placed at Amazon & Microsoft. Mentored 500+ students into top tech firms.",
    category: "Placement",
    level: "Beginner",
    duration: "60 hrs",
    modules: 10,
    students: 9230,
    rating: 4.7,
    reviews: 731,
    price: 2999,
    originalPrice: 5999,
    thumbnail: null,
    color: "from-purple-500 to-pink-600",
    tags: ["DSA", "System Design", "HR Rounds", "Aptitude", "Resume"],
    description:
      "End-to-end placement prep — from DSA rounds to HR interviews. Includes mock interviews, live sessions, and placement tracker.",
    modules_list: [
      { id: 1, title: "Resume & Profile Building", lectures: 4, duration: "2h 30m", free: true },
      { id: 2, title: "Aptitude & Reasoning", lectures: 6, duration: "4h 00m", free: false },
      { id: 3, title: "Core DSA for Interviews", lectures: 10, duration: "7h 00m", free: false },
      { id: 4, title: "System Design Basics", lectures: 8, duration: "5h 30m", free: false },
      { id: 5, title: "HR Interview Masterclass", lectures: 5, duration: "3h 00m", free: false },
    ],
    enrolled: false,
    progress: 0,
  },
  {
    id: 4,
    title: "JEE Chemistry — Organic & Inorganic",
    instructor: "Dr. Priya Sharma",
    instructorAvatar: "PS",
    instructorBio: "IIT Bombay Chemistry topper, 10 years JEE coaching.",
    category: "JEE",
    level: "Intermediate",
    duration: "90 hrs",
    modules: 14,
    students: 3450,
    rating: 4.8,
    reviews: 218,
    price: 4499,
    originalPrice: 7999,
    thumbnail: null,
    color: "from-orange-500 to-red-600",
    tags: ["Organic", "Inorganic", "Physical Chemistry", "Reaction Mechanisms"],
    description:
      "Complete JEE Chemistry — master organic reactions, IUPAC nomenclature, coordination compounds, and physical chemistry numericals.",
    modules_list: [
      { id: 1, title: "Atomic Structure & Periodic Table", lectures: 6, duration: "4h 00m", free: true },
      { id: 2, title: "Chemical Bonding", lectures: 7, duration: "4h 40m", free: false },
      { id: 3, title: "Thermodynamics", lectures: 8, duration: "5h 30m", free: false },
      { id: 4, title: "Organic — Hydrocarbons", lectures: 9, duration: "6h 00m", free: false },
    ],
    enrolled: false,
    progress: 0,
  },
  {
    id: 5,
    title: "GATE EE — Power Systems",
    instructor: "Prof. Vikram Nair",
    instructorAvatar: "VN",
    instructorBio: "NIT Calicut alumnus. 15 years of GATE EE teaching experience.",
    category: "GATE",
    level: "Advanced",
    duration: "70 hrs",
    modules: 11,
    students: 2100,
    rating: 4.6,
    reviews: 143,
    price: 3499,
    originalPrice: 6499,
    thumbnail: null,
    color: "from-yellow-500 to-orange-500",
    tags: ["Power Systems", "Machines", "Control Systems", "Signals"],
    description:
      "Focused GATE EE preparation for Power Systems, Electrical Machines, and Control Systems with full previous-year analysis.",
    modules_list: [
      { id: 1, title: "Network Analysis", lectures: 8, duration: "5h 20m", free: true },
      { id: 2, title: "Electrical Machines", lectures: 10, duration: "7h 00m", free: false },
      { id: 3, title: "Power Systems", lectures: 9, duration: "6h 30m", free: false },
    ],
    enrolled: false,
    progress: 0,
  },
  {
    id: 6,
    title: "JEE Maths — Calculus & Algebra",
    instructor: "Ananya Desai",
    instructorAvatar: "AD",
    instructorBio: "IIT Madras Mathematics rank holder. 200+ JEE toppers mentored.",
    category: "JEE",
    level: "Advanced",
    duration: "100 hrs",
    modules: 16,
    students: 5670,
    rating: 4.9,
    reviews: 401,
    price: 4799,
    originalPrice: 8499,
    thumbnail: null,
    color: "from-cyan-500 to-blue-600",
    tags: ["Calculus", "Algebra", "Coordinate Geometry", "Probability"],
    description:
      "The most thorough JEE Mathematics course — covers integration tricks, matrix shortcuts, and 500+ practice problems.",
    modules_list: [
      { id: 1, title: "Sets, Relations & Functions", lectures: 5, duration: "3h 30m", free: true },
      { id: 2, title: "Trigonometry", lectures: 8, duration: "5h 40m", free: false },
      { id: 3, title: "Differential Calculus", lectures: 12, duration: "8h 20m", free: false },
      { id: 4, title: "Integral Calculus", lectures: 14, duration: "9h 30m", free: false },
    ],
    enrolled: false,
    progress: 0,
  },
];

// Student's enrolled courses (subset of above)
export const ENROLLED_COURSES = COURSES.filter(c => c.enrolled);

// Dashboard stats for the welcome card
export const DASHBOARD_STATS = [
  { label: "Courses Enrolled", value: "3", icon: "BookOpen", color: "brand" },
  { label: "Hours Studied", value: "47", icon: "Clock", color: "emerald" },
  { label: "Quizzes Attempted", value: "12", icon: "CheckCircle", color: "purple" },
  { label: "Current Streak", value: "7 days", icon: "Zap", color: "gold" },
];

// Upcoming tasks/schedule
export const UPCOMING_TASKS = [
  { id: 1, title: "Live Doubt Session — JEE Physics", time: "Today, 6:00 PM", type: "live", urgent: true },
  { id: 2, title: "Complete Module 5 — Rotational Dynamics", time: "Tomorrow", type: "lesson", urgent: false },
  { id: 3, title: "Mock Test — GATE DS Full Syllabus", time: "Sat, 10:00 AM", type: "test", urgent: false },
  { id: 4, title: "Assignment — Dynamic Programming Sheet", time: "Sun, 11:59 PM", type: "assignment", urgent: false },
];

// Recent quiz results
export const RECENT_QUIZZES = [
  { id: 1, title: "Mechanics — JEE Level Quiz", score: 82, total: 100, date: "2 days ago", status: "passed" },
  { id: 2, title: "Graphs & BFS — GATE Quiz", score: 91, total: 100, date: "4 days ago", status: "passed" },
  { id: 3, title: "Organic Chemistry — Unit Test", score: 63, total: 100, date: "1 week ago", status: "needs-improvement" },
];

// Testimonials for landing page
export const TESTIMONIALS = [
  {
    id: 1,
    name: "Kavya Reddy",
    exam: "JEE Advanced 2024",
    rank: "AIR 847",
    avatar: "KR",
    quote:
      "NexusPrep's structured approach and AI doubt solver saved me so much time. The Physics course by Dr. Mehta is absolutely world-class.",
  },
  {
    id: 2,
    name: "Rohan Sinha",
    exam: "GATE CS 2024",
    rank: "Score: 72.4",
    avatar: "RS",
    quote:
      "I tried multiple platforms but NexusPrep's algorithm-focused content and mock tests gave me the edge I needed. Got into NIT Trichy M.Tech.",
  },
  {
    id: 3,
    name: "Preethi V.",
    exam: "Campus Placement",
    rank: "Placed at Infosys & TCS",
    avatar: "PV",
    quote:
      "The placement bootcamp is incredibly realistic. Mock interviews, resume reviews, and the HR module — all top-notch. Got 2 offers!",
  },
];

// Features for landing page feature section
export const FEATURES = [
  {
    icon: "Brain",
    title: "AI Doubt Solver",
    description: "Get instant, step-by-step explanations for any concept or problem — available 24/7.",
    color: "text-brand-500",
    bg: "bg-brand-50",
  },
  {
    icon: "Video",
    title: "Expert Live Classes",
    description: "Learn directly from IIT/NIT alumni and industry professionals in interactive live sessions.",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    icon: "BarChart2",
    title: "Adaptive Analytics",
    description: "Personalized weak-area reports and study recommendations powered by AI.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: "FileText",
    title: "Previous Year Papers",
    description: "10+ years of solved PYQs with detailed video explanations and pattern analysis.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: "Users",
    title: "Peer Community",
    description: "Join thousands of serious aspirants in structured study groups and discussion forums.",
    color: "text-pink-500",
    bg: "bg-pink-50",
  },
  {
    icon: "Award",
    title: "Rank Predictor",
    description: "Real-time rank prediction based on your mock test performance and industry benchmarks.",
    color: "text-gold-500",
    bg: "bg-yellow-50",
  },
];

// Fake user for mock auth state
export const MOCK_USER = {
  name: "Aarav Gupta",
  email: "aarav.gupta@email.com",
  avatar: "AG",
  targetExam: "JEE Advanced",
  joinedDate: "January 2024",
};
