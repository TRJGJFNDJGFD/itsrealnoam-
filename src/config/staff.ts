export type StaffMemberRef = {
  // Their Minecraft username right now — used to show a skin head and as
  // a fallback identity lookup.
  username: string;
  // Their Java UUID (with or without dashes), e.g. from namemc.com. Optional,
  // but worth filling in: a Minecraft account's UUID never changes even
  // when the player renames, so once this is set the site keeps showing
  // their correct name and skin forever. Without it, a rename means the
  // stored `username` above stops resolving and needs a manual update.
  uuid?: string;
};

export type StaffCategory = {
  role: string;
  members: StaffMemberRef[];
  // Actively hiring for this rank — shown with a link to the Discord
  // instead of names, since there's no one to list yet.
  recruiting?: boolean;
};

// The real rank structure, in display order. Ranks with an empty
// `members` array are shown as vacant — no invented names or avatars.
export const STAFF_CATEGORIES: StaffCategory[] = [
  { role: "Founder", members: [{ username: "itsrealnoam" }, { username: "OlgaM7" }] },
  { role: "Owner", members: [{ username: "korino2" }] },
  { role: "Co-Owner", members: [] },
  { role: "Server Admin", members: [{ username: "crylenn" }] },
  { role: "Staff Manager", members: [] },
  { role: "Managers", members: [] },
  { role: "Admins Managers", members: [] },
  { role: "High Admin", members: [] },
  { role: "Admin", members: [] },
  { role: "Senior Developer", members: [{ username: "fishlex" }] },
  { role: "Senior Programmer", members: [] },
  { role: "Senior Builder", members: [], recruiting: true },
  { role: "Developer", members: [{ username: "Mamtak_" }] },
  { role: "Programmer", members: [] },
  { role: "Builder", members: [], recruiting: true },
  { role: "Mod", members: [{ username: "rolexnoam" }] },
  { role: "Helper", members: [{ username: "Gedem43" }] },
  { role: "Medlar", members: [] },
];
