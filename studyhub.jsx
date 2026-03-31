import { useState, useEffect, useRef } from "react";

// ─── STYLES ──────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0d14;
    --surface: #111520;
    --surface2: #181e2e;
    --border: #232a3e;
    --accent: #4f8ef7;
    --accent2: #a78bfa;
    --accent3: #34d399;
    --accent4: #f472b6;
    --accent5: #fb923c;
    --text: #e8eaf2;
    --muted: #6b7498;
    --danger: #f87171;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* ── AUTH ── */
  .auth-wrap {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, #1a2040 0%, #0a0d14 70%);
    padding: 24px;
  }
  .auth-card {
    width: 100%; max-width: 440px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 40px 36px;
    box-shadow: 0 24px 80px #0006;
  }
  .auth-logo { font-family: var(--font-head); font-size: 28px; font-weight: 800; color: var(--accent); margin-bottom: 4px; }
  .auth-sub { color: var(--muted); font-size: 14px; margin-bottom: 32px; }
  .auth-step-title { font-family: var(--font-head); font-size: 20px; font-weight: 700; margin-bottom: 6px; }
  .auth-step-sub { color: var(--muted); font-size: 13px; margin-bottom: 24px; }
  .auth-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; color: var(--muted); font-size: 13px; }
  .auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .btn-google {
    width: 100%; padding: 12px; border: 1px solid var(--border); background: var(--surface2);
    color: var(--text); border-radius: 10px; font-family: var(--font-body); font-size: 14px;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: border-color .2s, background .2s;
  }
  .btn-google:hover { border-color: var(--accent); background: #1a2240; }
  .input-wrap { margin-bottom: 16px; }
  .input-label { font-size: 13px; color: var(--muted); margin-bottom: 6px; display: block; }
  .inp {
    width: 100%; padding: 12px 14px; background: var(--surface2); border: 1px solid var(--border);
    border-radius: 10px; color: var(--text); font-family: var(--font-body); font-size: 14px;
    outline: none; transition: border-color .2s;
  }
  .inp:focus { border-color: var(--accent); }
  .btn-primary {
    width: 100%; padding: 13px; background: var(--accent); color: #fff;
    border: none; border-radius: 10px; font-family: var(--font-head); font-size: 15px;
    font-weight: 700; cursor: pointer; transition: opacity .2s, transform .1s;
  }
  .btn-primary:hover { opacity: .9; }
  .btn-primary:active { transform: scale(.98); }
  .btn-sm {
    padding: 8px 16px; border-radius: 8px; font-family: var(--font-body); font-size: 13px;
    font-weight: 500; cursor: pointer; border: none; transition: opacity .2s;
  }
  .btn-sm:hover { opacity: .85; }
  .auth-toggle { text-align: center; margin-top: 18px; font-size: 13px; color: var(--muted); }
  .auth-toggle span { color: var(--accent); cursor: pointer; }
  .auth-toggle span:hover { text-decoration: underline; }

  /* ── LAYOUT ── */
  .layout { display: flex; min-height: 100vh; }
  .sidebar {
    width: 220px; min-height: 100vh; background: var(--surface);
    border-right: 1px solid var(--border); display: flex; flex-direction: column;
    padding: 24px 0; position: fixed; top: 0; left: 0; z-index: 100;
  }
  .sidebar-logo { font-family: var(--font-head); font-size: 22px; font-weight: 800; color: var(--accent); padding: 0 20px 28px; }
  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 20px;
    font-size: 14px; cursor: pointer; border-radius: 0; transition: background .15s, color .15s;
    color: var(--muted); font-weight: 500;
  }
  .nav-item.active { background: #1a2240; color: var(--accent); }
  .nav-item:hover:not(.active) { background: var(--surface2); color: var(--text); }
  .nav-icon { font-size: 18px; width: 22px; text-align: center; }
  .sidebar-footer { margin-top: auto; padding: 0 20px; }
  .user-chip {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    background: var(--surface2); border-radius: 10px; font-size: 13px;
  }
  .avatar {
    width: 30px; height: 30px; border-radius: 50%; background: var(--accent);
    display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; color: #fff;
  }
  .logout-btn { color: var(--muted); font-size: 12px; cursor: pointer; margin-top: 8px; text-align: center; }
  .logout-btn:hover { color: var(--danger); }
  .main { margin-left: 220px; flex: 1; padding: 32px; min-height: 100vh; }
  .page-title { font-family: var(--font-head); font-size: 26px; font-weight: 800; margin-bottom: 24px; }
  .section-label {
    font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 8px;
  }
  .card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px;
  }
  .card + .card { margin-top: 16px; }

  /* ── TABS ── */
  .tabs { display: flex; gap: 4px; margin-bottom: 24px; border-bottom: 1px solid var(--border); }
  .tab {
    padding: 10px 18px; font-size: 14px; font-weight: 500; cursor: pointer; color: var(--muted);
    border-bottom: 2px solid transparent; margin-bottom: -1px; transition: color .15s, border-color .15s;
  }
  .tab.active { color: var(--accent); border-bottom-color: var(--accent); }

  /* ── FLASHCARDS ── */
  .fc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
  .fc-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
    padding: 20px; cursor: pointer; min-height: 130px; display: flex; flex-direction: column;
    justify-content: space-between; transition: border-color .2s, transform .15s;
    perspective: 600px;
  }
  .fc-card:hover { border-color: var(--accent); transform: translateY(-2px); }
  .fc-q { font-size: 14px; font-weight: 500; }
  .fc-a { font-size: 13px; color: var(--accent3); display: none; }
  .fc-card.flipped .fc-q { display: none; }
  .fc-card.flipped .fc-a { display: block; }
  .fc-hint { font-size: 11px; color: var(--muted); margin-top: 10px; }

  /* ── STUDY ROOM / CHAT ── */
  .chat-layout { display: grid; grid-template-columns: 220px 1fr; gap: 0; height: calc(100vh - 96px); }
  .room-list { border-right: 1px solid var(--border); padding: 16px 0; overflow-y: auto; }
  .room-item {
    padding: 10px 16px; font-size: 13px; cursor: pointer; color: var(--muted);
    transition: background .15s, color .15s;
  }
  .room-item:hover, .room-item.active { background: var(--surface2); color: var(--text); }
  .room-item.active { border-left: 2px solid var(--accent); }
  .chat-panel { display: flex; flex-direction: column; }
  .chat-header { padding: 14px 20px; border-bottom: 1px solid var(--border); font-family: var(--font-head); font-size: 16px; font-weight: 700; }
  .messages { flex: 1; overflow-y: auto; padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; }
  .msg { display: flex; gap: 10px; max-width: 80%; }
  .msg.me { align-self: flex-end; flex-direction: row-reverse; }
  .msg-avatar { width: 28px; height: 28px; border-radius: 50%; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }
  .msg-bubble { background: var(--surface2); border-radius: 12px; padding: 8px 12px; font-size: 13px; line-height: 1.5; }
  .msg.me .msg-bubble { background: var(--accent); color: #fff; }
  .msg-time { font-size: 10px; color: var(--muted); margin-top: 4px; }
  .chat-input-row { padding: 14px 20px; border-top: 1px solid var(--border); display: flex; gap: 10px; }
  .chat-inp { flex: 1; }

  /* ── PLANNER ── */
  .planner-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .task-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 14px;
    background: var(--surface2); border-radius: 10px; margin-bottom: 8px;
    font-size: 13px;
  }
  .task-check { width: 16px; height: 16px; border-radius: 4px; border: 2px solid var(--border); cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .task-check.done { background: var(--accent3); border-color: var(--accent3); }
  .task-text.done { text-decoration: line-through; color: var(--muted); }
  .priority-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  /* ── GRADE PREDICTOR ── */
  .gp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
  .gp-course { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px; }
  .gp-title { font-family: var(--font-head); font-weight: 700; font-size: 16px; margin-bottom: 14px; }
  .gp-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; font-size: 13px; }
  .gp-inp { width: 60px; padding: 5px 8px; background: var(--surface2); border: 1px solid var(--border); border-radius: 6px; color: var(--text); font-size: 13px; text-align: center; outline: none; }
  .gp-inp:focus { border-color: var(--accent); }
  .gp-grade-badge {
    display: inline-block; padding: 4px 12px; border-radius: 20px; font-family: var(--font-head);
    font-size: 20px; font-weight: 800; margin-top: 12px;
  }
  .progress-bar { height: 6px; background: var(--surface2); border-radius: 3px; overflow: hidden; margin-top: 4px; }
  .progress-fill { height: 100%; border-radius: 3px; transition: width .4s; }

  /* ── CALENDAR ── */
  .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
  .cal-day-name { text-align: center; font-size: 11px; font-weight: 700; color: var(--muted); padding: 8px 0; letter-spacing: .05em; }
  .cal-cell {
    min-height: 80px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
    padding: 6px; cursor: pointer; transition: border-color .15s;
  }
  .cal-cell:hover { border-color: var(--accent); }
  .cal-cell.today { border-color: var(--accent); }
  .cal-cell.other-month { opacity: .35; }
  .cal-num { font-size: 12px; font-weight: 600; margin-bottom: 4px; }
  .cal-event { font-size: 10px; padding: 2px 5px; border-radius: 4px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cal-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .cal-nav-btn { background: var(--surface); border: 1px solid var(--border); color: var(--text); padding: 6px 14px; border-radius: 8px; cursor: pointer; font-size: 18px; }
  .event-type-hw { background: #1e3a8a40; color: var(--accent); }
  .event-type-exam { background: #7c3aed30; color: var(--accent2); }
  .event-type-sport { background: #065f4630; color: var(--accent3); }
  .event-type-extra { background: #9f1e1e30; color: var(--accent4); }
  .event-type-other { background: #78350f30; color: var(--accent5); }

  /* ── AI TOOLS ── */
  .ai-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
  .ai-tab-btn {
    padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer;
    border: 1px solid var(--border); background: var(--surface); color: var(--muted); transition: all .15s;
  }
  .ai-tab-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }
  .result-box { background: var(--surface2); border-radius: 10px; padding: 16px; font-size: 14px; line-height: 1.7; margin-top: 16px; white-space: pre-wrap; }
  .quiz-options { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
  .quiz-option {
    padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px;
    cursor: pointer; font-size: 14px; transition: border-color .15s, background .15s;
  }
  .quiz-option:hover { border-color: var(--accent); background: var(--surface2); }
  .quiz-option.correct { border-color: var(--accent3); background: #06501e30; color: var(--accent3); }
  .quiz-option.wrong { border-color: var(--danger); background: #4c0d0d30; color: var(--danger); }
  .match-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .match-item {
    padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px;
    cursor: pointer; font-size: 13px; transition: all .15s; text-align: center;
  }
  .match-item.selected { border-color: var(--accent); background: #1a2240; }
  .match-item.matched { border-color: var(--accent3); background: #06501e30; color: var(--accent3); }

  /* ── WRITING HELPER ── */
  .write-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .write-area { min-height: 300px; resize: vertical; }

  /* ── TUTORIAL ── */
  .tutorial-overlay {
    position: fixed; inset: 0; background: #000a; z-index: 999;
    display: flex; align-items: center; justify-content: center; padding: 24px;
  }
  .tutorial-card {
    background: var(--surface); border: 1px solid var(--accent); border-radius: 20px;
    padding: 36px; max-width: 520px; width: 100%;
    box-shadow: 0 0 60px #4f8ef720;
  }
  .tutorial-step { font-size: 12px; color: var(--accent); font-weight: 700; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 8px; }
  .tutorial-title { font-family: var(--font-head); font-size: 22px; font-weight: 800; margin-bottom: 12px; }
  .tutorial-body { font-size: 14px; line-height: 1.7; color: var(--muted); margin-bottom: 24px; }
  .tutorial-dots { display: flex; gap: 6px; margin-bottom: 20px; }
  .tutorial-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border); }
  .tutorial-dot.active { background: var(--accent); }
  .tutorial-nav { display: flex; gap: 10px; justify-content: flex-end; }

  /* ── MODAL ── */
  .modal-overlay { position: fixed; inset: 0; background: #000b; z-index: 200; display: flex; align-items: center; justify-content: center; padding: 24px; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 28px; width: 100%; max-width: 480px; }
  .modal-title { font-family: var(--font-head); font-size: 18px; font-weight: 700; margin-bottom: 20px; }
  .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
  .btn-ghost { padding: 9px 18px; background: transparent; border: 1px solid var(--border); color: var(--text); border-radius: 8px; cursor: pointer; font-size: 13px; }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }

  /* ── MISC ── */
  .chip {
    display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px;
    border-radius: 20px; font-size: 12px; font-weight: 600;
  }
  .spinner { display: inline-block; width: 18px; height: 18px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin .6s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .select { background: var(--surface2); border: 1px solid var(--border); color: var(--text); border-radius: 8px; padding: 8px 12px; font-size: 13px; outline: none; font-family: var(--font-body); }
  .select:focus { border-color: var(--accent); }
  .flex { display: flex; }
  .flex-col { flex-direction: column; }
  .gap-2 { gap: 8px; }
  .gap-3 { gap: 12px; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .mb-2 { margin-bottom: 8px; }
  .mb-3 { margin-bottom: 12px; }
  .mb-4 { margin-bottom: 16px; }
  .mt-2 { margin-top: 8px; }
  .mt-3 { margin-top: 12px; }
  .text-sm { font-size: 13px; }
  .text-xs { font-size: 11px; }
  .text-muted { color: var(--muted); }
  .text-accent { color: var(--accent); }
  .text-danger { color: var(--danger); }
  .fw-bold { font-weight: 700; font-family: var(--font-head); }
  textarea.inp { resize: vertical; min-height: 100px; line-height: 1.6; }
  .w-full { width: 100%; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .notification { position: fixed; bottom: 24px; right: 24px; background: var(--surface); border: 1px solid var(--accent); border-radius: 12px; padding: 12px 18px; font-size: 13px; z-index: 300; animation: slideUp .3s ease; box-shadow: 0 8px 32px #0006; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`;

// ─── SAMPLE DATA ──────────────────────────────────────────────────────────────
const SAMPLE_ROOMS = [
  { id: 1, name: "# calculus-ii", subject: "Math" },
  { id: 2, name: "# world-history", subject: "History" },
  { id: 3, name: "# organic-chem", subject: "Chemistry" },
  { id: 4, name: "# cs-algorithms", subject: "CS" },
  { id: 5, name: "# english-lit", subject: "English" },
  { id: 6, name: "# physics-101", subject: "Physics" },
];

const SAMPLE_MESSAGES = {
  1: [
    { id: 1, user: "Alex K.", text: "Does anyone understand implicit differentiation?", time: "2:15 PM", me: false },
    { id: 2, user: "You", text: "Yes! It's when y is a function of x but not explicit. You just differentiate both sides.", time: "2:17 PM", me: true },
    { id: 3, user: "Maria L.", text: "The chain rule is key here 🙌", time: "2:18 PM", me: false },
  ],
  2: [
    { id: 1, user: "Jordan T.", text: "Anyone taking notes on the French Revolution chapter?", time: "1:00 PM", me: false },
    { id: 2, user: "You", text: "Yeah, I've got Robespierre and the Reign of Terror covered.", time: "1:05 PM", me: true },
  ],
  3: [
    { id: 1, user: "Sam W.", text: "Nucleophilic substitution is destroying me 😭", time: "10:30 AM", me: false },
    { id: 2, user: "Priya M.", text: "SN1 vs SN2 — just memorize which substrates favor each", time: "10:32 AM", me: false },
  ],
  4: [], 5: [], 6: [],
};

const SAMPLE_TASKS = [
  { id: 1, text: "Read Chapter 7 — Calculus", done: false, priority: "high", due: "Today", course: "Math" },
  { id: 2, text: "Submit History essay draft", done: false, priority: "high", due: "Tomorrow", course: "History" },
  { id: 3, text: "Finish Chem problem set", done: true, priority: "medium", due: "Wed", course: "Chemistry" },
  { id: 4, text: "Code binary search tree", done: false, priority: "medium", due: "Thu", course: "CS" },
  { id: 5, text: "Read Hamlet Act III", done: false, priority: "low", due: "Fri", course: "English" },
];

const SAMPLE_FLASHCARD_DECKS = [
  {
    id: 1, name: "Calculus Derivatives", count: 3,
    cards: [
      { q: "What is the derivative of sin(x)?", a: "cos(x)" },
      { q: "Power rule for x^n?", a: "n·x^(n-1)" },
      { q: "Chain rule formula?", a: "f'(g(x))·g'(x)" },
    ]
  },
  {
    id: 2, name: "French Revolution", count: 3,
    cards: [
      { q: "Year the French Revolution began?", a: "1789" },
      { q: "What was the Reign of Terror?", a: "Period of radical political violence from 1793-1794, led by Robespierre" },
      { q: "What document was inspired by Enlightenment ideas?", a: "Declaration of the Rights of Man" },
    ]
  },
  {
    id: 3, name: "Organic Chemistry", count: 3,
    cards: [
      { q: "SN2 favors which substrates?", a: "Primary (less steric hindrance)" },
      { q: "What is a nucleophile?", a: "Electron-rich species that attacks electrophiles" },
      { q: "What is aromaticity?", a: "Cyclic, planar, conjugated system with 4n+2 π electrons (Hückel's rule)" },
    ]
  },
];

const SAMPLE_COURSES = [
  { id: 1, name: "Calculus II", categories: [{ name: "Homework", weight: 20, score: 88 }, { name: "Quizzes", weight: 30, score: 76 }, { name: "Midterm", weight: 25, score: 82 }, { name: "Final", weight: 25, score: 0 }] },
  { id: 2, name: "World History", categories: [{ name: "Essays", weight: 40, score: 91 }, { name: "Participation", weight: 20, score: 95 }, { name: "Midterm", weight: 20, score: 84 }, { name: "Final", weight: 20, score: 0 }] },
  { id: 3, name: "Organic Chemistry", categories: [{ name: "Lab", weight: 25, score: 78 }, { name: "Homework", weight: 25, score: 80 }, { name: "Midterm", weight: 25, score: 69 }, { name: "Final", weight: 25, score: 0 }] },
];

const PRIORITY_COLORS = { high: "#f87171", medium: "#fb923c", low: "#34d399" };
const GRADE_COLORS = { A: "#34d399", B: "#4f8ef7", C: "#fb923c", D: "#f87171", F: "#f87171" };

function getLetterGrade(pct) {
  if (pct >= 90) return "A";
  if (pct >= 80) return "B";
  if (pct >= 70) return "C";
  if (pct >= 60) return "D";
  return "F";
}

// ─── TUTORIAL STEPS ────────────────────────────────────────────────────────────
const TUTORIAL_STEPS = [
  { title: "Welcome to StudyHub 🎓", body: "Your all-in-one academic platform. In this quick tour, we'll walk you through every feature so you can hit the ground running." },
  { title: "Study Rooms 💬", body: "Join global course-specific chat rooms. Ask questions, share notes, and collaborate with students from around the world in real time." },
  { title: "Flashcards 🃏", body: "Create decks and click any card to flip it. Use the AI tool to generate flashcards automatically from any text or video link." },
  { title: "Planner & Calendar 📅", body: "Add assignments, exams, and events to your planner. Switch to Calendar view to see everything laid out by date. Create custom event types like sports or extracurriculars." },
  { title: "Grade Predictor 📊", body: "Enter your scores for each category and see your predicted grade update in real time. Plan what you need on the final exam to hit your goal." },
  { title: "AI Content Tools 🤖", body: "Paste a video link or text — AI will summarize it and let you convert it into a practice test, flashcards, or matching game. Customize question count and types." },
  { title: "Writing Helper ✍️", body: "Paste your essay or paragraph and AI will improve grammar, structure, and clarity. See a side-by-side comparison of before and after." },
  { title: "You're all set! 🚀", body: "Explore StudyHub at your own pace. Click the tutorial button anytime in the sidebar to revisit this guide. Good luck!" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
async function callClaude(prompt, systemPrompt = "") {
  const messages = [{ role: "user", content: prompt }];
  const body = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages,
  };
  if (systemPrompt) body.system = systemPrompt;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return data.content?.map(b => b.text || "").join("") || "";
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Notification({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return <div className="notification">✅ {msg}</div>;
}

function Modal({ title, children, onClose }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="flex items-center justify-between mb-4">
          <div className="modal-title" style={{ marginBottom: 0 }}>{title}</div>
          <span style={{ cursor: "pointer", color: "var(--muted)", fontSize: 20 }} onClick={onClose}>×</span>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [step, setStep] = useState("method"); // method | password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");

  function handleGmail() {
    onLogin({ email: "user@gmail.com", name: "Google User" });
  }

  function handleEmailNext() {
    if (!email.includes("@")) { setErr("Please enter a valid email."); return; }
    setErr("");
    if (mode === "signup") setStep("password");
    else onLogin({ email, name: email.split("@")[0] });
  }

  function handleSignup() {
    if (password.length < 6) { setErr("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setErr("Passwords don't match."); return; }
    onLogin({ email, name: email.split("@")[0] });
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">StudyHub</div>
        <div className="auth-sub">The global student learning platform</div>

        {step === "method" && (
          <>
            <div className="auth-step-title">{mode === "login" ? "Welcome back" : "Create your account"}</div>
            <div className="auth-step-sub">{mode === "login" ? "Sign in to continue" : "Start learning smarter today"}</div>

            <button className="btn-google" onClick={handleGmail}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>

            <div className="auth-divider">or</div>

            <div className="input-wrap">
              <label className="input-label">Email address</label>
              <input className="inp" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleEmailNext()} />
            </div>
            {err && <div className="text-danger text-sm mb-2">{err}</div>}
            <button className="btn-primary" onClick={handleEmailNext}>Continue with Email</button>

            <div className="auth-toggle">
              {mode === "login" ? <>Don't have an account? <span onClick={() => { setMode("signup"); setErr(""); }}>Sign up</span></> : <>Already have an account? <span onClick={() => { setMode("login"); setErr(""); }}>Log in</span></>}
            </div>
          </>
        )}

        {step === "password" && (
          <>
            <div className="auth-step-title">Set your password</div>
            <div className="auth-step-sub">For {email}</div>
            <div className="input-wrap">
              <label className="input-label">Password</label>
              <input className="inp" type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="input-wrap">
              <label className="input-label">Confirm Password</label>
              <input className="inp" type="password" placeholder="Repeat password" value={confirm} onChange={e => setConfirm(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSignup()} />
            </div>
            {err && <div className="text-danger text-sm mb-2">{err}</div>}
            <button className="btn-primary" onClick={handleSignup}>Create Account</button>
            <div className="auth-toggle"><span onClick={() => setStep("method")}>← Back</span></div>
          </>
        )}
      </div>
    </div>
  );
}

// ── TUTORIAL ─────────────────────────────────────────────────────────────────
function Tutorial({ onClose }) {
  const [step, setStep] = useState(0);
  const s = TUTORIAL_STEPS[step];
  return (
    <div className="tutorial-overlay">
      <div className="tutorial-card">
        <div className="tutorial-step">Step {step + 1} of {TUTORIAL_STEPS.length}</div>
        <div className="tutorial-title">{s.title}</div>
        <div className="tutorial-body">{s.body}</div>
        <div className="tutorial-dots">
          {TUTORIAL_STEPS.map((_, i) => <div key={i} className={`tutorial-dot${i === step ? " active" : ""}`} />)}
        </div>
        <div className="tutorial-nav">
          {step > 0 && <button className="btn-ghost" onClick={() => setStep(p => p - 1)}>Back</button>}
          {step < TUTORIAL_STEPS.length - 1
            ? <button className="btn-primary" style={{ width: "auto", padding: "9px 22px" }} onClick={() => setStep(p => p + 1)}>Next</button>
            : <button className="btn-primary" style={{ width: "auto", padding: "9px 22px" }} onClick={onClose}>Get Started 🚀</button>
          }
        </div>
      </div>
    </div>
  );
}

// ── STUDY ROOMS ───────────────────────────────────────────────────────────────
function StudyRooms({ user }) {
  const [activeRoom, setActiveRoom] = useState(1);
  const [msgs, setMsgs] = useState(SAMPLE_MESSAGES);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, activeRoom]);

  function send() {
    if (!input.trim()) return;
    const newMsg = { id: Date.now(), user: "You", text: input, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), me: true };
    setMsgs(prev => ({ ...prev, [activeRoom]: [...(prev[activeRoom] || []), newMsg] }));
    setInput("");
  }

  const room = SAMPLE_ROOMS.find(r => r.id === activeRoom);

  return (
    <div>
      <div className="page-title">Study Rooms</div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="chat-layout">
          <div className="room-list">
            <div className="section-label" style={{ padding: "0 16px 8px" }}>Channels</div>
            {SAMPLE_ROOMS.map(r => (
              <div key={r.id} className={`room-item${activeRoom === r.id ? " active" : ""}`} onClick={() => setActiveRoom(r.id)}>
                {r.name}
                <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{r.subject}</div>
              </div>
            ))}
          </div>
          <div className="chat-panel">
            <div className="chat-header">{room?.name} <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-body)", fontWeight: 400 }}>— {room?.subject}</span></div>
            <div className="messages">
              {(msgs[activeRoom] || []).map(m => (
                <div key={m.id} className={`msg${m.me ? " me" : ""}`}>
                  <div className="msg-avatar">{m.user[0]}</div>
                  <div>
                    {!m.me && <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 3 }}>{m.user}</div>}
                    <div className="msg-bubble">{m.text}</div>
                    <div className="msg-time">{m.time}</div>
                  </div>
                </div>
              ))}
              {(msgs[activeRoom] || []).length === 0 && <div className="text-muted text-sm" style={{ textAlign: "center", marginTop: 40 }}>No messages yet. Start the conversation!</div>}
              <div ref={endRef} />
            </div>
            <div className="chat-input-row">
              <input className="inp chat-inp" placeholder={`Message ${room?.name}`} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
              <button className="btn-primary" style={{ width: "auto", padding: "10px 18px" }} onClick={send}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── FLASHCARDS ────────────────────────────────────────────────────────────────
function Flashcards({ notify }) {
  const [decks, setDecks] = useState(SAMPLE_FLASHCARD_DECKS);
  const [activeDeck, setActiveDeck] = useState(null);
  const [flipped, setFlipped] = useState({});
  const [showNew, setShowNew] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [editDeckId, setEditDeckId] = useState(null);

  function addCard() {
    if (!newQ.trim() || !newA.trim()) return;
    setDecks(prev => prev.map(d => d.id === editDeckId
      ? { ...d, cards: [...d.cards, { q: newQ, a: newA }], count: d.count + 1 }
      : d));
    setNewQ(""); setNewA("");
    notify("Card added!");
  }

  function createDeck() {
    if (!newDeckName.trim()) return;
    const nd = { id: Date.now(), name: newDeckName, count: 0, cards: [] };
    setDecks(prev => [...prev, nd]);
    setNewDeckName("");
    setShowNew(false);
    notify("Deck created!");
  }

  if (activeDeck) {
    const deck = decks.find(d => d.id === activeDeck);
    return (
      <div>
        <div className="flex items-center gap-3 mb-4">
          <button className="btn-ghost btn-sm" onClick={() => setActiveDeck(null)}>← Back</button>
          <div className="page-title" style={{ margin: 0 }}>{deck.name}</div>
          <button className="btn-sm" style={{ background: "var(--surface2)", color: "var(--muted)", marginLeft: "auto" }} onClick={() => { setEditDeckId(activeDeck); }}>+ Add Card</button>
        </div>
        {editDeckId === activeDeck && (
          <div className="card mb-4">
            <div className="fw-bold mb-3" style={{ fontSize: 15 }}>Add New Card</div>
            <div className="grid-2">
              <div><label className="input-label">Question</label><textarea className="inp" style={{ minHeight: 60 }} value={newQ} onChange={e => setNewQ(e.target.value)} /></div>
              <div><label className="input-label">Answer</label><textarea className="inp" style={{ minHeight: 60 }} value={newA} onChange={e => setNewA(e.target.value)} /></div>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="btn-primary" style={{ width: "auto", padding: "9px 20px" }} onClick={addCard}>Add Card</button>
              <button className="btn-ghost btn-sm" onClick={() => setEditDeckId(null)}>Cancel</button>
            </div>
          </div>
        )}
        <div className="text-sm text-muted mb-3">Click a card to reveal the answer</div>
        <div className="fc-grid">
          {deck.cards.map((c, i) => (
            <div key={i} className={`fc-card${flipped[`${activeDeck}-${i}`] ? " flipped" : ""}`} onClick={() => setFlipped(p => ({ ...p, [`${activeDeck}-${i}`]: !p[`${activeDeck}-${i}`] }))}>
              <div className="fc-q">{c.q}</div>
              <div className="fc-a">{c.a}</div>
              <div className="fc-hint">{flipped[`${activeDeck}-${i}`] ? "Click to show question" : "Click to reveal answer"}</div>
            </div>
          ))}
          {deck.cards.length === 0 && <div className="text-muted text-sm">No cards yet. Add your first one above.</div>}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="page-title" style={{ margin: 0 }}>Flashcards</div>
        <button className="btn-primary" style={{ width: "auto", padding: "9px 18px" }} onClick={() => setShowNew(true)}>+ New Deck</button>
      </div>
      {showNew && (
        <div className="card mb-4">
          <div className="fw-bold mb-3">New Deck</div>
          <input className="inp mb-3" placeholder="Deck name (e.g. Biology Chapter 4)" value={newDeckName} onChange={e => setNewDeckName(e.target.value)} />
          <div className="flex gap-2">
            <button className="btn-primary" style={{ width: "auto", padding: "9px 20px" }} onClick={createDeck}>Create</button>
            <button className="btn-ghost btn-sm" onClick={() => setShowNew(false)}>Cancel</button>
          </div>
        </div>
      )}
      <div className="fc-grid">
        {decks.map(d => (
          <div key={d.id} className="fc-card" onClick={() => setActiveDeck(d.id)} style={{ minHeight: 110 }}>
            <div>
              <div className="fw-bold" style={{ fontSize: 16, marginBottom: 6 }}>{d.name}</div>
              <div className="text-sm text-muted">{d.count} cards</div>
            </div>
            <div className="text-xs text-accent mt-2">Open deck →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PLANNER + CALENDAR ────────────────────────────────────────────────────────
function Planner({ notify }) {
  const [view, setView] = useState("list"); // list | calendar
  const [tasks, setTasks] = useState(SAMPLE_TASKS);
  const [calDate, setCalDate] = useState(new Date());
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newTask, setNewTask] = useState({ text: "", priority: "medium", due: "", course: "" });
  const [calEvents, setCalEvents] = useState([
    { id: 1, title: "Calculus Midterm", date: "2026-03-15", type: "exam" },
    { id: 2, title: "Soccer Practice", date: "2026-03-18", type: "sport" },
    { id: 3, title: "Essay Due", date: "2026-03-20", type: "hw" },
    { id: 4, title: "Orchestra Rehearsal", date: "2026-03-22", type: "extra" },
    { id: 5, title: "Study Group", date: "2026-03-25", type: "other" },
    { id: 6, title: "Chem Lab", date: "2026-03-28", type: "hw" },
  ]);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", type: "hw" });
  const [selectedDay, setSelectedDay] = useState(null);

  function toggleTask(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  function addTask() {
    if (!newTask.text.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), ...newTask, done: false }]);
    setNewTask({ text: "", priority: "medium", due: "", course: "" });
    setShowAddTask(false);
    notify("Task added!");
  }

  function addCalEvent() {
    if (!newEvent.title.trim() || !newEvent.date) return;
    setCalEvents(prev => [...prev, { id: Date.now(), ...newEvent }]);
    setNewEvent({ title: "", date: "", type: "hw" });
    setShowAddEvent(false);
    notify("Event added to calendar!");
  }

  function renderCalendar() {
    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const cells = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // prev month padding
    const prevDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ day: prevDays - i, current: false, date: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ day: d, current: true, date: dateStr });
    }
    while (cells.length % 7 !== 0) cells.push({ day: cells.length - daysInMonth - firstDay + 1, current: false, date: null });

    const evTypeClasses = { hw: "event-type-hw", exam: "event-type-exam", sport: "event-type-sport", extra: "event-type-extra", other: "event-type-other" };

    return (
      <div>
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={() => setCalDate(new Date(year, month - 1))}>‹</button>
          <div className="fw-bold" style={{ fontSize: 18 }}>{calDate.toLocaleString("default", { month: "long" })} {year}</div>
          <button className="cal-nav-btn" onClick={() => setCalDate(new Date(year, month + 1))}>›</button>
        </div>
        <div className="cal-grid">
          {dayNames.map(n => <div key={n} className="cal-day-name">{n}</div>)}
          {cells.map((cell, i) => {
            const isToday = cell.current && cell.day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const events = cell.date ? calEvents.filter(e => e.date === cell.date) : [];
            return (
              <div key={i} className={`cal-cell${isToday ? " today" : ""}${!cell.current ? " other-month" : ""}`}
                onClick={() => cell.date && setSelectedDay(cell.date)}>
                <div className="cal-num">{cell.day}</div>
                {events.slice(0, 2).map(e => (
                  <div key={e.id} className={`cal-event ${evTypeClasses[e.type] || "event-type-other"}`}>{e.title}</div>
                ))}
                {events.length > 2 && <div className="text-xs text-muted">+{events.length - 2} more</div>}
              </div>
            );
          })}
        </div>
        {selectedDay && (
          <div className="card mt-4">
            <div className="fw-bold mb-2">{new Date(selectedDay + "T12:00").toLocaleDateString("default", { weekday: "long", month: "long", day: "numeric" })}</div>
            {calEvents.filter(e => e.date === selectedDay).map(e => (
              <div key={e.id} className="task-item" style={{ marginBottom: 6 }}>
                <span className={`chip ${evTypeClasses[e.type]}`}>{e.type}</span>
                <span>{e.title}</span>
              </div>
            ))}
            {calEvents.filter(e => e.date === selectedDay).length === 0 && <div className="text-muted text-sm">No events this day.</div>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="page-title" style={{ margin: 0 }}>Planner</div>
        <div className="flex gap-2">
          <button className="btn-ghost btn-sm" onClick={() => { setShowAddEvent(true); setShowAddTask(false); }}>+ Event</button>
          <button className="btn-primary btn-sm" style={{ background: "var(--accent)" }} onClick={() => { setShowAddTask(true); setShowAddEvent(false); }}>+ Task</button>
        </div>
      </div>

      <div className="tabs">
        <div className={`tab${view === "list" ? " active" : ""}`} onClick={() => setView("list")}>📋 List</div>
        <div className={`tab${view === "calendar" ? " active" : ""}`} onClick={() => setView("calendar")}>📅 Calendar</div>
      </div>

      {showAddTask && (
        <div className="card mb-4">
          <div className="fw-bold mb-3">New Task</div>
          <div className="grid-2">
            <div className="input-wrap"><label className="input-label">Task</label><input className="inp" value={newTask.text} onChange={e => setNewTask(p => ({ ...p, text: e.target.value }))} /></div>
            <div className="input-wrap"><label className="input-label">Course</label><input className="inp" value={newTask.course} onChange={e => setNewTask(p => ({ ...p, course: e.target.value }))} /></div>
            <div className="input-wrap"><label className="input-label">Due</label><input className="inp" value={newTask.due} onChange={e => setNewTask(p => ({ ...p, due: e.target.value }))} /></div>
            <div className="input-wrap"><label className="input-label">Priority</label>
              <select className="select w-full" value={newTask.priority} onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))}>
                <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2"><button className="btn-primary" style={{ width: "auto", padding: "9px 20px" }} onClick={addTask}>Add Task</button><button className="btn-ghost btn-sm" onClick={() => setShowAddTask(false)}>Cancel</button></div>
        </div>
      )}

      {showAddEvent && (
        <div className="card mb-4">
          <div className="fw-bold mb-3">New Calendar Event</div>
          <div className="grid-2">
            <div className="input-wrap"><label className="input-label">Title</label><input className="inp" value={newEvent.title} onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))} /></div>
            <div className="input-wrap"><label className="input-label">Date</label><input className="inp" type="date" value={newEvent.date} onChange={e => setNewEvent(p => ({ ...p, date: e.target.value }))} /></div>
            <div className="input-wrap"><label className="input-label">Type</label>
              <select className="select w-full" value={newEvent.type} onChange={e => setNewEvent(p => ({ ...p, type: e.target.value }))}>
                <option value="hw">Homework/Assignment</option><option value="exam">Exam/Quiz</option>
                <option value="sport">Sports</option><option value="extra">Extracurricular</option><option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2"><button className="btn-primary" style={{ width: "auto", padding: "9px 20px" }} onClick={addCalEvent}>Add Event</button><button className="btn-ghost btn-sm" onClick={() => setShowAddEvent(false)}>Cancel</button></div>
        </div>
      )}

      {view === "list" && (
        <div className="planner-cols">
          <div>
            <div className="section-label">Pending</div>
            {tasks.filter(t => !t.done).map(t => (
              <div key={t.id} className="task-item">
                <div className={`task-check${t.done ? " done" : ""}`} onClick={() => toggleTask(t.id)}>{t.done && "✓"}</div>
                <div className="priority-dot" style={{ background: PRIORITY_COLORS[t.priority] }} />
                <div style={{ flex: 1 }}>
                  <div className={`task-text${t.done ? " done" : ""}`}>{t.text}</div>
                  <div className="text-xs text-muted">{t.course} · Due {t.due}</div>
                </div>
              </div>
            ))}
            {tasks.filter(t => !t.done).length === 0 && <div className="text-muted text-sm">All done! 🎉</div>}
          </div>
          <div>
            <div className="section-label">Completed</div>
            {tasks.filter(t => t.done).map(t => (
              <div key={t.id} className="task-item">
                <div className="task-check done" onClick={() => toggleTask(t.id)}>✓</div>
                <div className="priority-dot" style={{ background: PRIORITY_COLORS[t.priority] }} />
                <div style={{ flex: 1 }}>
                  <div className="task-text done">{t.text}</div>
                  <div className="text-xs text-muted">{t.course}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "calendar" && renderCalendar()}
    </div>
  );
}

// ── GRADE PREDICTOR ───────────────────────────────────────────────────────────
function GradePredictor({ notify }) {
  const [courses, setCourses] = useState(SAMPLE_COURSES);
  const [showAdd, setShowAdd] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", categories: [{ name: "", weight: 100, score: 0 }] });

  function updateScore(cId, catIdx, val) {
    setCourses(prev => prev.map(c => c.id === cId ? {
      ...c, categories: c.categories.map((cat, i) => i === catIdx ? { ...cat, score: Number(val) } : cat)
    } : c));
  }

  function calcGrade(course) {
    const cats = course.categories.filter(c => c.score > 0);
    if (!cats.length) return null;
    const totalWeight = cats.reduce((a, c) => a + c.weight, 0);
    const weighted = cats.reduce((a, c) => a + (c.score * c.weight), 0);
    return totalWeight ? (weighted / totalWeight).toFixed(1) : null;
  }

  function addCourse() {
    if (!newCourse.name.trim()) return;
    setCourses(prev => [...prev, { id: Date.now(), ...newCourse }]);
    setNewCourse({ name: "", categories: [{ name: "", weight: 100, score: 0 }] });
    setShowAdd(false);
    notify("Course added!");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="page-title" style={{ margin: 0 }}>Grade Predictor</div>
        <button className="btn-primary" style={{ width: "auto", padding: "9px 18px" }} onClick={() => setShowAdd(true)}>+ Add Course</button>
      </div>
      {showAdd && (
        <div className="card mb-4">
          <div className="fw-bold mb-3">New Course</div>
          <input className="inp mb-3" placeholder="Course name" value={newCourse.name} onChange={e => setNewCourse(p => ({ ...p, name: e.target.value }))} />
          {newCourse.categories.map((cat, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <input className="inp" style={{ flex: 2 }} placeholder="Category (e.g. Homework)" value={cat.name} onChange={e => setNewCourse(p => ({ ...p, categories: p.categories.map((c, j) => j === i ? { ...c, name: e.target.value } : c) }))} />
              <input className="inp" style={{ width: 70 }} placeholder="Weight%" type="number" value={cat.weight} onChange={e => setNewCourse(p => ({ ...p, categories: p.categories.map((c, j) => j === i ? { ...c, weight: Number(e.target.value) } : c) }))} />
            </div>
          ))}
          <button className="btn-ghost btn-sm" style={{ marginBottom: 12 }} onClick={() => setNewCourse(p => ({ ...p, categories: [...p.categories, { name: "", weight: 0, score: 0 }] }))}>+ Add Category</button>
          <div className="flex gap-2"><button className="btn-primary" style={{ width: "auto", padding: "9px 20px" }} onClick={addCourse}>Create</button><button className="btn-ghost btn-sm" onClick={() => setShowAdd(false)}>Cancel</button></div>
        </div>
      )}
      <div className="gp-grid">
        {courses.map(course => {
          const grade = calcGrade(course);
          const letter = grade ? getLetterGrade(Number(grade)) : "—";
          const color = GRADE_COLORS[letter] || "var(--muted)";
          return (
            <div key={course.id} className="gp-course">
              <div className="gp-title">{course.name}</div>
              {course.categories.map((cat, i) => (
                <div key={i}>
                  <div className="gp-row">
                    <span style={{ flex: 1 }}>{cat.name}</span>
                    <span className="text-muted text-xs">{cat.weight}%</span>
                    <input className="gp-inp" type="number" min="0" max="100" value={cat.score || ""} placeholder="—" onChange={e => updateScore(course.id, i, e.target.value)} />
                  </div>
                  {cat.score > 0 && (
                    <div className="progress-bar mb-2">
                      <div className="progress-fill" style={{ width: `${cat.score}%`, background: cat.score >= 80 ? "var(--accent3)" : cat.score >= 60 ? "var(--accent)" : "var(--danger)" }} />
                    </div>
                  )}
                </div>
              ))}
              <div className="gp-grade-badge" style={{ background: `${color}20`, color }}>{letter}{grade ? ` · ${grade}%` : ""}</div>
              {grade && (
                <div className="text-xs text-muted mt-2">
                  {Number(grade) < 90 ? `Need ${(90 - Number(grade)).toFixed(1)}% more for an A` : "You're at an A! Keep it up 🎉"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── AI CONTENT TOOLS ──────────────────────────────────────────────────────────
function AITools({ notify }) {
  const [aiMode, setAiMode] = useState("summarize"); // summarize | practice | flashcards | matching | writing
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [quizData, setQuizData] = useState(null);
  const [flashData, setFlashData] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [qCount, setQCount] = useState(5);
  const [qTypes, setQTypes] = useState(["multiple_choice"]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [matchSelected, setMatchSelected] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [matchItems, setMatchItems] = useState([]);
  const [writingInput, setWritingInput] = useState("");
  const [writingResult, setWritingResult] = useState("");
  const [writingMode, setWritingMode] = useState("grammar"); // grammar | structure | clarity | all

  async function handleSummarize() {
    if (!input.trim()) return;
    setLoading(true); setSummary("");
    try {
      const res = await callClaude(
        `Summarize the following content. Extract the key points, main ideas, and important details. Format as a clear overview:\n\n${input}`,
        "You are an expert educational content summarizer. Be concise but comprehensive. Use plain text paragraphs, no markdown."
      );
      setSummary(res);
    } catch { setSummary("Unable to summarize. Please try again."); }
    setLoading(false);
  }

  async function handlePracticeTest() {
    if (!summary && !input.trim()) return;
    setLoading(true); setQuizData(null); setQuizAnswers({});
    const content = summary || input;
    const typeInstructions = qTypes.includes("open_ended") ? "Include open-ended questions." : "";
    const mcInstructions = qTypes.includes("multiple_choice") ? "Include multiple choice questions with 4 options." : "";
    const matchInstructions = qTypes.includes("matching") ? "Include matching questions." : "";
    try {
      const res = await callClaude(
        `Create a practice test with exactly ${qCount} questions based on this content. ${mcInstructions} ${typeInstructions} ${matchInstructions}
Content: ${content}

Return ONLY valid JSON in this format (no markdown, no extra text):
{
  "questions": [
    {
      "type": "multiple_choice",
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "answer": "A",
      "explanation": "Brief explanation"
    }
  ]
}
For open_ended questions, omit "options" and set answer to a model answer.`,
        "You are an educational assessment creator. Return ONLY valid JSON."
      );
      const clean = res.replace(/```json|```/g, "").trim();
      setQuizData(JSON.parse(clean));
    } catch { setQuizData(null); notify("Couldn't generate quiz. Try again."); }
    setLoading(false);
  }

  async function handleFlashcards() {
    if (!summary && !input.trim()) return;
    setLoading(true); setFlashData(null);
    const content = summary || input;
    try {
      const res = await callClaude(
        `Create ${qCount} flashcard pairs from this content. Return ONLY valid JSON:
{"cards": [{"q": "Question", "a": "Answer"}]}
Content: ${content}`,
        "You are a flashcard creator. Return ONLY valid JSON, no markdown."
      );
      const clean = res.replace(/```json|```/g, "").trim();
      setFlashData(JSON.parse(clean));
    } catch { notify("Couldn't generate flashcards. Try again."); }
    setLoading(false);
  }

  async function handleMatching() {
    if (!summary && !input.trim()) return;
    setLoading(true); setMatchData(null); setMatchSelected(null); setMatchedPairs([]);
    const content = summary || input;
    try {
      const res = await callClaude(
        `Create ${Math.min(qCount, 8)} term-definition matching pairs from this content. Return ONLY valid JSON:
{"pairs": [{"term": "Term", "definition": "Definition"}]}
Content: ${content}`,
        "You are an educational game creator. Return ONLY valid JSON, no markdown."
      );
      const clean = res.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setMatchData(parsed);
      const terms = parsed.pairs.map((p, i) => ({ id: `t${i}`, text: p.term, type: "term", pairId: i }));
      const defs = parsed.pairs.map((p, i) => ({ id: `d${i}`, text: p.definition, type: "def", pairId: i })).sort(() => Math.random() - .5);
      setMatchItems([...terms, ...defs]);
    } catch { notify("Couldn't generate matching game. Try again."); }
    setLoading(false);
  }

  function handleMatchClick(item) {
    if (matchedPairs.includes(item.pairId)) return;
    if (!matchSelected) { setMatchSelected(item); return; }
    if (matchSelected.id === item.id) { setMatchSelected(null); return; }
    if (matchSelected.type !== item.type && matchSelected.pairId === item.pairId) {
      setMatchedPairs(prev => [...prev, item.pairId]);
      setMatchSelected(null);
      if (matchedPairs.length + 1 === matchData.pairs.length) notify("🎉 All pairs matched!");
    } else {
      setMatchSelected(item);
    }
  }

  async function handleImproveWriting() {
    if (!writingInput.trim()) return;
    setLoading(true); setWritingResult("");
    const instructions = {
      grammar: "Fix all grammar, spelling, and punctuation errors.",
      structure: "Improve the sentence structure and paragraph flow.",
      clarity: "Improve clarity and conciseness. Remove redundancy.",
      all: "Fix grammar, improve sentence structure, enhance clarity, and make it more professional overall.",
    };
    try {
      const res = await callClaude(
        `${instructions[writingMode]} Return only the improved text, no commentary:\n\n${writingInput}`,
        "You are an expert writing editor and academic writing coach."
      );
      setWritingResult(res);
    } catch { setWritingResult("Unable to improve text. Please try again."); }
    setLoading(false);
  }

  const toggleQType = (t) => setQTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  return (
    <div>
      <div className="page-title">AI Learning Tools</div>
      <div className="ai-tabs">
        {[["summarize", "📝 Summarize"], ["practice", "📋 Practice Test"], ["flashcards", "🃏 AI Flashcards"], ["matching", "🔗 Matching Game"], ["writing", "✍️ Writing Helper"]].map(([k, l]) => (
          <button key={k} className={`ai-tab-btn${aiMode === k ? " active" : ""}`} onClick={() => setAiMode(k)}>{l}</button>
        ))}
      </div>

      {/* WRITING HELPER */}
      {aiMode === "writing" && (
        <div>
          <div className="card mb-4">
            <div className="fw-bold mb-3" style={{ fontSize: 15 }}>✍️ Writing Helper</div>
            <div className="text-sm text-muted mb-3">Paste your text and let AI improve it.</div>
            <div className="flex gap-2 mb-3 flex-wrap">
              {[["grammar", "Fix Grammar"], ["structure", "Improve Structure"], ["clarity", "Enhance Clarity"], ["all", "Full Polish"]].map(([k, l]) => (
                <button key={k} className={`ai-tab-btn${writingMode === k ? " active" : ""}`} onClick={() => setWritingMode(k)}>{l}</button>
              ))}
            </div>
            <textarea className="inp write-area w-full mb-3" placeholder="Paste your essay, paragraph, or any text here..." value={writingInput} onChange={e => setWritingInput(e.target.value)} />
            <button className="btn-primary" style={{ width: "auto", padding: "10px 24px" }} onClick={handleImproveWriting} disabled={loading}>
              {loading ? <span className="spinner" /> : "✨ Improve My Writing"}
            </button>
          </div>
          {writingResult && (
            <div className="grid-2">
              <div>
                <div className="section-label">Original</div>
                <div className="result-box" style={{ minHeight: 200 }}>{writingInput}</div>
              </div>
              <div>
                <div className="section-label">Improved ✨</div>
                <div className="result-box" style={{ minHeight: 200, borderColor: "var(--accent3)" }}>{writingResult}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUMMARIZE + QUIZ/FC/MATCH */}
      {aiMode !== "writing" && (
        <div className="card mb-4">
          <div className="fw-bold mb-2" style={{ fontSize: 15 }}>Content Input</div>
          <div className="text-sm text-muted mb-3">Paste a video URL, article link, or text to analyze.</div>
          <textarea className="inp w-full mb-3" style={{ minHeight: 120 }} placeholder="Paste a YouTube link, article URL, or any text content..." value={input} onChange={e => setInput(e.target.value)} />

          {aiMode !== "summarize" && (
            <div className="flex gap-3 items-center mb-3 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="input-label" style={{ marginBottom: 0 }}>Questions:</label>
                <input type="number" min="3" max="20" value={qCount} onChange={e => setQCount(Number(e.target.value))} className="gp-inp" />
              </div>
              {aiMode === "practice" && (
                <div className="flex gap-2 items-center flex-wrap">
                  <label className="input-label" style={{ marginBottom: 0 }}>Types:</label>
                  {[["multiple_choice", "Multiple Choice"], ["open_ended", "Open-Ended"], ["matching", "Matching"]].map(([k, l]) => (
                    <button key={k} className={`ai-tab-btn${qTypes.includes(k) ? " active" : ""}`} style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => toggleQType(k)}>{l}</button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            {aiMode === "summarize" && <button className="btn-primary" style={{ width: "auto", padding: "9px 20px" }} onClick={handleSummarize} disabled={loading}>{loading ? <span className="spinner" /> : "📝 Summarize"}</button>}
            {aiMode === "practice" && (
              <>
                {!summary && <button className="btn-ghost btn-sm" onClick={handleSummarize} disabled={loading}>Summarize First</button>}
                <button className="btn-primary" style={{ width: "auto", padding: "9px 20px" }} onClick={handlePracticeTest} disabled={loading}>{loading ? <span className="spinner" /> : "Generate Practice Test"}</button>
              </>
            )}
            {aiMode === "flashcards" && (
              <>
                {!summary && <button className="btn-ghost btn-sm" onClick={handleSummarize} disabled={loading}>Summarize First</button>}
                <button className="btn-primary" style={{ width: "auto", padding: "9px 20px" }} onClick={handleFlashcards} disabled={loading}>{loading ? <span className="spinner" /> : "Generate Flashcards"}</button>
              </>
            )}
            {aiMode === "matching" && (
              <>
                {!summary && <button className="btn-ghost btn-sm" onClick={handleSummarize} disabled={loading}>Summarize First</button>}
                <button className="btn-primary" style={{ width: "auto", padding: "9px 20px" }} onClick={handleMatching} disabled={loading}>{loading ? <span className="spinner" /> : "Start Matching Game"}</button>
              </>
            )}
          </div>
        </div>
      )}

      {summary && aiMode !== "writing" && (
        <div className="card mb-4">
          <div className="section-label">AI Summary</div>
          <div className="result-box" style={{ marginTop: 8 }}>{summary}</div>
        </div>
      )}

      {/* Practice Test */}
      {quizData && aiMode === "practice" && (
        <div>
          <div className="fw-bold mb-3" style={{ fontSize: 16 }}>Practice Test — {quizData.questions.length} Questions</div>
          {quizData.questions.map((q, qi) => (
            <div key={qi} className="card mb-3">
              <div className="fw-bold mb-2" style={{ fontSize: 14 }}>Q{qi + 1}: {q.question}</div>
              {q.type === "multiple_choice" && q.options && (
                <div className="quiz-options">
                  {q.options.map((opt, oi) => {
                    const answered = quizAnswers[qi] !== undefined;
                    const isSelected = quizAnswers[qi] === oi;
                    const isCorrect = opt === q.answer || opt.startsWith(q.answer + ".");
                    return (
                      <div key={oi}
                        className={`quiz-option${isSelected ? (isCorrect ? " correct" : " wrong") : ""}${answered && isCorrect ? " correct" : ""}`}
                        onClick={() => !answered && setQuizAnswers(p => ({ ...p, [qi]: oi }))}>
                        {opt}
                      </div>
                    );
                  })}
                  {quizAnswers[qi] !== undefined && <div className="text-xs text-muted mt-2">{q.explanation}</div>}
                </div>
              )}
              {q.type === "open_ended" && (
                <div>
                  <textarea className="inp w-full" style={{ minHeight: 70 }} placeholder="Write your answer..." onChange={() => {}} />
                  <div className="text-xs text-muted mt-2">Model answer: {q.answer}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* AI Flashcards */}
      {flashData && aiMode === "flashcards" && (
        <div>
          <div className="fw-bold mb-3" style={{ fontSize: 16 }}>AI-Generated Flashcards</div>
          <div className="fc-grid">
            {flashData.cards.map((c, i) => {
              const [fl, setFl] = useState(false);
              return (
                <div key={i} className={`fc-card${fl ? " flipped" : ""}`} onClick={() => setFl(p => !p)}>
                  <div className="fc-q">{c.q}</div>
                  <div className="fc-a">{c.a}</div>
                  <div className="fc-hint">{fl ? "Click for question" : "Click to reveal"}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Matching Game */}
      {matchData && aiMode === "matching" && (
        <div>
          <div className="fw-bold mb-2" style={{ fontSize: 16 }}>Matching Game — {matchedPairs.length}/{matchData.pairs.length} matched</div>
          <div className="text-sm text-muted mb-3">Click a term then its matching definition.</div>
          <div className="match-grid">
            {matchItems.map(item => (
              <div key={item.id}
                className={`match-item${matchedPairs.includes(item.pairId) ? " matched" : matchSelected?.id === item.id ? " selected" : ""}`}
                onClick={() => handleMatchClick(item)}>
                {item.text}
              </div>
            ))}
          </div>
          {matchedPairs.length === matchData.pairs.length && <div className="text-accent fw-bold mt-3" style={{ fontSize: 18 }}>🎉 Perfect score! All matched!</div>}
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
const NAV = [
  { id: "rooms", label: "Study Rooms", icon: "💬" },
  { id: "flashcards", label: "Flashcards", icon: "🃏" },
  { id: "planner", label: "Planner", icon: "📅" },
  { id: "grades", label: "Grades", icon: "📊" },
  { id: "ai", label: "AI Tools", icon: "🤖" },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("rooms");
  const [showTutorial, setShowTutorial] = useState(false);
  const [notification, setNotification] = useState(null);

  function notify(msg) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3200);
  }

  function handleLogin(u) {
    setUser(u);
    setShowTutorial(true);
  }

  if (!user) return (
    <>
      <style>{STYLES}</style>
      <AuthPage onLogin={handleLogin} />
    </>
  );

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}
        {notification && <Notification msg={notification} onClose={() => setNotification(null)} />}
        <div className="layout">
          <div className="sidebar">
            <div className="sidebar-logo">StudyHub</div>
            {NAV.map(n => (
              <div key={n.id} className={`nav-item${page === n.id ? " active" : ""}`} onClick={() => setPage(n.id)}>
                <span className="nav-icon">{n.icon}</span> {n.label}
              </div>
            ))}
            <div className="nav-item" style={{ marginTop: 8 }} onClick={() => setShowTutorial(true)}>
              <span className="nav-icon">❓</span> Tutorial
            </div>
            <div className="sidebar-footer">
              <div className="user-chip">
                <div className="avatar">{user.name[0].toUpperCase()}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{user.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{user.email}</div>
                </div>
              </div>
              <div className="logout-btn" onClick={() => setUser(null)}>Sign out</div>
            </div>
          </div>
          <div className="main">
            {page === "rooms" && <StudyRooms user={user} />}
            {page === "flashcards" && <Flashcards notify={notify} />}
            {page === "planner" && <Planner notify={notify} />}
            {page === "grades" && <GradePredictor notify={notify} />}
            {page === "ai" && <AITools notify={notify} />}
          </div>
        </div>
      </div>
    </>
  );
}
