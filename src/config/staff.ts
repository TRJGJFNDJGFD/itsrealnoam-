export type StaffCategory = {
  role: string;
  members: string[];
  // Actively hiring for this rank — shown with a link to the Discord
  // instead of names, since there's no one to list yet.
  recruiting?: boolean;
};

// The real rank structure, in display order. Ranks with an empty
// `members` array are shown as vacant — no invented names or avatars.
export const STAFF_CATEGORIES: StaffCategory[] = [
  { role: "Founder", members: ["itsrealnoam", "OlgaM7"] },
  { role: "Owner", members: ["korino2"] },
  { role: "Co-Owner", members: [] },
  { role: "Server Admin", members: ["crylenn"] },
  { role: "Staff Manager", members: [] },
  { role: "Managers", members: [] },
  { role: "Admins Managers", members: [] },
  { role: "High Admin", members: [] },
  { role: "Admin", members: [] },
  { role: "Senior Developer", members: ["fishlex"] },
  { role: "Senior Programmer", members: [] },
  { role: "Senior Builder", members: [], recruiting: true },
  { role: "Developer", members: ["Mamtak_"] },
  { role: "Programmer", members: [] },
  { role: "Builder", members: [], recruiting: true },
  { role: "Mod", members: ["rolexnoam"] },
  { role: "Helper", members: ["Gedem43"] },
  { role: "Medlar", members: [] },
];
