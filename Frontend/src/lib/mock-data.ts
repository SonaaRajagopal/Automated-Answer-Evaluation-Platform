export type Student = {
  id: string;
  name: string;
  rollNo: string;
  class: string;
  email: string;
  avgScore: number;
  scriptsEvaluated: number;
};

export type Script = {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  class: string;
  marks: number;
  maxMarks: number;
  confidence: number;
  status: "evaluated" | "pending" | "review";
  evaluatedAt: string;
  feedback: string;
  rubricMatch: number;
  extractedText: string;
};

export const students: Student[] = [
  { id: "s1", name: "Aarav Patel", rollNo: "10A-01", class: "Class 10-A", email: "aarav@school.edu", avgScore: 87, scriptsEvaluated: 12 },
  { id: "s2", name: "Diya Sharma", rollNo: "10A-02", class: "Class 10-A", email: "diya@school.edu", avgScore: 92, scriptsEvaluated: 14 },
  { id: "s3", name: "Rohan Mehta", rollNo: "10A-03", class: "Class 10-A", email: "rohan@school.edu", avgScore: 74, scriptsEvaluated: 11 },
  { id: "s4", name: "Ananya Reddy", rollNo: "10B-01", class: "Class 10-B", email: "ananya@school.edu", avgScore: 81, scriptsEvaluated: 13 },
  { id: "s5", name: "Vihaan Kumar", rollNo: "10B-02", class: "Class 10-B", email: "vihaan@school.edu", avgScore: 68, scriptsEvaluated: 10 },
  { id: "s6", name: "Ishaan Gupta", rollNo: "10B-03", class: "Class 10-B", email: "ishaan@school.edu", avgScore: 95, scriptsEvaluated: 15 },
  { id: "s7", name: "Saanvi Iyer", rollNo: "9A-01", class: "Class 9-A", email: "saanvi@school.edu", avgScore: 89, scriptsEvaluated: 9 },
  { id: "s8", name: "Arjun Nair", rollNo: "9A-02", class: "Class 9-A", email: "arjun@school.edu", avgScore: 77, scriptsEvaluated: 9 },
];

export const subjects = ["Mathematics", "Science", "English", "History", "Geography", "Computer Science"];
export const classes = ["Class 9-A", "Class 9-B", "Class 10-A", "Class 10-B"];

export const scripts: Script[] = [
  { id: "sc1", studentId: "s1", studentName: "Aarav Patel", subject: "Mathematics", class: "Class 10-A", marks: 87, maxMarks: 100, confidence: 96, status: "evaluated", evaluatedAt: "2 hours ago", feedback: "Strong grasp of algebra. Minor errors in geometry proofs — review the angle-sum theorem.", rubricMatch: 92, extractedText: "Q1. Solve for x: 2x + 5 = 17… The student showed clear step-by-step working with correct substitution and arrived at x = 6." },
  { id: "sc2", studentId: "s2", studentName: "Diya Sharma", subject: "Science", class: "Class 10-A", marks: 92, maxMarks: 100, confidence: 98, status: "evaluated", evaluatedAt: "3 hours ago", feedback: "Excellent conceptual clarity in chemistry. Diagrams in biology section are well labeled.", rubricMatch: 95, extractedText: "Q1. Define photosynthesis… The student provided a precise definition including the chemical equation." },
  { id: "sc3", studentId: "s3", studentName: "Rohan Mehta", subject: "English", class: "Class 10-A", marks: 74, maxMarks: 100, confidence: 91, status: "evaluated", evaluatedAt: "5 hours ago", feedback: "Creative narrative writing. Work on grammar — particularly subject-verb agreement.", rubricMatch: 78, extractedText: "Essay: A Day at the Beach… Vivid descriptions, but several tense inconsistencies." },
  { id: "sc4", studentId: "s4", studentName: "Ananya Reddy", subject: "Mathematics", class: "Class 10-B", marks: 81, maxMarks: 100, confidence: 94, status: "evaluated", evaluatedAt: "1 day ago", feedback: "Good problem-solving approach. Practice trigonometric identities.", rubricMatch: 85, extractedText: "Q1. Find the value of sin(60°) + cos(30°)… Correct application of standard values." },
  { id: "sc5", studentId: "s5", studentName: "Vihaan Kumar", subject: "History", class: "Class 10-B", marks: 68, maxMarks: 100, confidence: 89, status: "review", evaluatedAt: "1 day ago", feedback: "Needs improvement in chronological accuracy. Strong on cause-effect analysis.", rubricMatch: 70, extractedText: "Q1. Causes of WWI… Mentioned alliance system and assassination but missed nationalism." },
  { id: "sc6", studentId: "s6", studentName: "Ishaan Gupta", subject: "Computer Science", class: "Class 10-B", marks: 95, maxMarks: 100, confidence: 99, status: "evaluated", evaluatedAt: "2 days ago", feedback: "Outstanding. Algorithm explanations are precise and code is well-commented.", rubricMatch: 97, extractedText: "Q1. Write a function to reverse a linked list… Iterative solution with O(n) time complexity." },
  { id: "sc7", studentId: "s7", studentName: "Saanvi Iyer", subject: "Geography", class: "Class 9-A", marks: 89, maxMarks: 100, confidence: 95, status: "evaluated", evaluatedAt: "2 days ago", feedback: "Detailed map work. Strengthen knowledge of climate zones.", rubricMatch: 90, extractedText: "Q1. Describe monsoon patterns… Clear explanation of southwest and northeast monsoons." },
  { id: "sc8", studentId: "s8", studentName: "Arjun Nair", subject: "Science", class: "Class 9-A", marks: 77, maxMarks: 100, confidence: 92, status: "pending", evaluatedAt: "Just now", feedback: "Awaiting final review.", rubricMatch: 80, extractedText: "Q1. State Newton's laws… Stated all three laws with examples." },
];

export const marksDistribution = [
  { range: "0-40", count: 3 },
  { range: "41-60", count: 8 },
  { range: "61-75", count: 18 },
  { range: "76-90", count: 24 },
  { range: "91-100", count: 11 },
];

export const performanceTrend = [
  { month: "Jan", avg: 72, accuracy: 91 },
  { month: "Feb", avg: 75, accuracy: 93 },
  { month: "Mar", avg: 78, accuracy: 94 },
  { month: "Apr", avg: 81, accuracy: 95 },
  { month: "May", avg: 79, accuracy: 96 },
  { month: "Jun", avg: 84, accuracy: 97 },
  { month: "Jul", avg: 86, accuracy: 97 },
];

export const subjectAverages = [
  { subject: "Math", score: 82 },
  { subject: "Science", score: 85 },
  { subject: "English", score: 76 },
  { subject: "History", score: 71 },
  { subject: "Geography", score: 79 },
  { subject: "CS", score: 89 },
];

export const weakTopics = [
  { topic: "Trigonometry", weakness: 62 },
  { topic: "Grammar — Tenses", weakness: 58 },
  { topic: "WWI Chronology", weakness: 54 },
  { topic: "Climate Zones", weakness: 49 },
  { topic: "Organic Chemistry", weakness: 45 },
];

export const classComparison = [
  { class: "9-A", avg: 82 },
  { class: "9-B", avg: 76 },
  { class: "10-A", avg: 84 },
  { class: "10-B", avg: 81 },
];

export const recentActivity = [
  { id: 1, action: "Evaluated 24 scripts", subject: "Mathematics — Class 10-A", time: "2h ago" },
  { id: 2, action: "Uploaded rubric", subject: "Science — Class 10-B", time: "4h ago" },
  { id: 3, action: "Generated report", subject: "Diya Sharma", time: "6h ago" },
  { id: 4, action: "Flagged for review", subject: "Vihaan Kumar — History", time: "1d ago" },
  { id: 5, action: "Evaluated 18 scripts", subject: "English — Class 9-A", time: "1d ago" },
];
