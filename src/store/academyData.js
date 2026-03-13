// ─── Default Data ─────────────────────────────────────────────────────────────

export const DEFAULT_TOPPERS = [
  { id: 1, name: "Aryan Sharma", score: "99.8%ile", exam: "JEE Advanced", year: "2025", rank: "AIR 142", photo: "/topper_default.png", visible: true },
  { id: 2, name: "Priya Verma", score: "98.4%", exam: "Class 12 CBSE", year: "2025", rank: "School Topper", photo: "/topper_default.png", visible: true },
  { id: 3, name: "Rohit Bhatia", score: "97.6%ile", exam: "JEE Mains", year: "2025", rank: "State Rank 11", photo: "/topper_default.png", visible: true },
  { id: 4, name: "Sneha Patel", score: "96.2%", exam: "Class 12 CBSE", year: "2024", rank: "District Topper", photo: "/topper_default.png", visible: true },
  { id: 5, name: "Karan Mehta", score: "97.1%ile", exam: "BITSAT", year: "2025", rank: "BITS Pilani CSE", photo: "/topper_default.png", visible: true },
  { id: 6, name: "Ananya Singh", score: "95.8%", exam: "Class 11", year: "2025", rank: "Grade A+", photo: "/topper_default.png", visible: true },
];

export const DEFAULT_BATCHES = [
  { id: 1, name: "IIT/JEE Foundation", description: "Comprehensive 2-year program for Class 11 & 12 students targeting IIT-JEE. Small batches of max 20 students.", seats: 8, startDate: "April 2026", monthlyFee: "₹7,500/mo", yearlyFee: "₹80,000/yr", visible: true, tag: "Most Popular" },
  { id: 2, name: "Class 11 Excellence", description: "NCERT mastery + advanced concepts. Builds the foundation for competitive exams and Board exams.", seats: 12, startDate: "April 2026", monthlyFee: "₹4,500/mo", yearlyFee: "₹50,000/yr", visible: true, tag: "New Batch" },
  { id: 3, name: "Class 12 Board Booster", description: "Focused Board exam preparation with mock tests, PYQs, and revision sessions.", seats: 5, startDate: "Now Open", monthlyFee: "₹4,000/mo", yearlyFee: "₹45,000/yr", visible: true, tag: "Limited Seats" },
  { id: 4, name: "BITSAT Intensive", description: "Specialised coaching for BITS Pilani entrance. English, Logical Reasoning + PCM covered.", seats: 15, startDate: "June 2026", monthlyFee: "₹3,500/mo", yearlyFee: "₹35,000", visible: true, tag: "New" },
  { id: 5, name: "JEE Mains Crash Course", description: "60-day intensive crash course for JEE Mains. Daily tests, rank booster sessions.", seats: 10, startDate: "Jan 2027", monthlyFee: "₹5,000/mo", yearlyFee: "₹20,000 total", visible: true, tag: "Fast Track" },
  { id: 6, name: "NDA / MHT-CET", description: "Tailored for NDA aspirants and Maharashtra CET. PCM + GK + SSB prep guidance.", seats: 18, startDate: "April 2026", monthlyFee: "₹2,800/mo", yearlyFee: "₹30,000/yr", visible: false, tag: "Upcoming" },
];

export const DEFAULT_FACULTY = [
  { id: 1, name: "Dr. R. K. Sharma", subject: "Physics", qualification: "Ph.D, IIT Delhi", experience: "15 years", photo: "/teacher_physics.png", bio: "Former ALLEN faculty. Specialized in Electrodynamics and Mechanics. 500+ IIT selections.", phone: "+91 98765 00001", linkedIn: "https://linkedin.com/in/rksharma" },
  { id: 2, name: "Prof. Amit Gupta", subject: "Mathematics", qualification: "M.Sc, IIT Bombay", experience: "12 years", photo: "/teacher_maths.png", bio: "Calculus and Algebra expert. Author of 3 competitive exam preparation books.", phone: "+91 98765 00002", linkedIn: "https://linkedin.com/in/amitgupta" },
  { id: 3, name: "Dr. Priya Joshi", subject: "Chemistry", qualification: "Ph.D, Organic Chemistry", experience: "10 years", photo: "/teacher_chemistry.png", bio: "Organic Chemistry wizard. Known for making complex reactions simple and memorable.", phone: "+91 98765 00003", linkedIn: "https://linkedin.com/in/priyajoshi" },
];

export const DEFAULT_TIMETABLE = [
  { day: "Monday", slots: ["Physics (8-10 AM)", "Maths (4-6 PM)"] },
  { day: "Tuesday", slots: ["Chemistry (8-10 AM)", "Doubt Session (5-6 PM)"] },
  { day: "Wednesday", slots: ["Physics (8-10 AM)", "Maths (4-6 PM)"] },
  { day: "Thursday", slots: ["Chemistry (8-10 AM)", "Mock Test (5-7 PM)"] },
  { day: "Friday", slots: ["Physics (8-10 AM)", "Maths (4-6 PM)"] },
  { day: "Saturday", slots: ["Full Revision (8 AM - 1 PM)", "Test Analysis (2-4 PM)"] },
  { day: "Sunday", slots: ["Doubt Clearing (10 AM - 12 PM)"] },
];

export const DEFAULT_HERO = {
  headline: "India's Future IITians Start Here",
  subheadline: "Premium Coaching for Class 11, 12 & IIT/JEE — Small Batches. Giant Results.",
  announcement: "🎉 JEE Advanced 2025: 12 Students Selected! Admissions Open for 2026-27 Batch.",
};

// ─── Storage helpers ────────────────────────────────────────────────────────

function getFromStorage(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Data API ────────────────────────────────────────────────────────────────

export function getToppers() { return getFromStorage("academy_toppers", DEFAULT_TOPPERS); }
export function saveToppers(toppers) { saveToStorage("academy_toppers", toppers); }

export function getBatches() { return getFromStorage("academy_batches", DEFAULT_BATCHES); }
export function saveBatches(batches) { saveToStorage("academy_batches", batches); }

export function getFaculty() { return getFromStorage("academy_faculty", DEFAULT_FACULTY); }
export function saveFaculty(faculty) { saveToStorage("academy_faculty", faculty); }

export function getTimetable() { return getFromStorage("academy_timetable", DEFAULT_TIMETABLE); }
export function saveTimetable(timetable) { saveToStorage("academy_timetable", timetable); }

export function getHero() { return getFromStorage("academy_hero", DEFAULT_HERO); }
export function saveHero(hero) { saveToStorage("academy_hero", hero); }
