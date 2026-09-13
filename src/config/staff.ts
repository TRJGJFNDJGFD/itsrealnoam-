export type StaffMember = {
  name: string;
  role: string;
  discord?: string;
};

// Fill this in with the real team — nothing here is invented. Order is the
// display order on /staff (highest rank first is the usual convention).
export const STAFF: StaffMember[] = [
  // { name: "YourName", role: "Owner", discord: "https://discord.com/users/..." },
];
