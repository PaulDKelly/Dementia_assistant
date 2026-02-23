export const initialSchedule = [
  { id: "s1", time: "08:00", title: "Breakfast", done: true },
  { id: "s2", time: "10:30", title: "Memory game", done: false },
  { id: "s3", time: "14:00", title: "Nurse check-in", done: false },
  { id: "s4", time: "16:00", title: "Short walk", done: false },
  { id: "s5", time: "20:00", title: "Wind-down routine", done: false },
];

export const initialMedications = [
  { id: "m1", name: "Donepezil 5mg", time: "08:00", taken: true, lastTakenAt: "08:12 AM" },
  { id: "m2", name: "Vitamin D", time: "13:00", taken: false, lastTakenAt: null },
  { id: "m3", name: "Melatonin", time: "20:00", taken: false, lastTakenAt: null },
];

export const initialFamilyUpdates = [
  {
    id: "f1",
    message: "Paul visited this morning and had tea together.",
    author: "Paul",
    timestamp: "09:15 AM",
  },
  {
    id: "f2",
    message: "Nurse check-in completed and vitals were stable.",
    author: "Nurse",
    timestamp: "02:24 PM",
  },
];

export const initialPasswordEntries = [
  {
    id: "p1",
    label: "Email Account",
    username: "elder@example.com",
    secret: "garden-bird-204",
    note: "Primary inbox",
    updatedAt: "09:10 AM",
  },
  {
    id: "p2",
    label: "Online Banking",
    username: "elder.bank.user",
    secret: "safe-river-889",
    note: "Use with caregiver support",
    updatedAt: "09:20 AM",
  },
];

export const initialFamilyMoments = [
  {
    id: "mom-1",
    type: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300",
    caption: "Morning walk with granddad.",
    author: "Paul",
    createdAt: "08:42 AM",
  },
  {
    id: "mom-2",
    type: "video",
    mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    caption: "Birthday song from the family.",
    author: "Emma",
    createdAt: "07:15 PM",
  },
];
