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
