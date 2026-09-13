import { useState } from "react";
import type { StaffMemberRef } from "../../config/staff";
import { useMinecraftProfile } from "../../lib/useMinecraftProfile";

export default function StaffMemberRow({ member }: { member: StaffMemberRef }) {
  const { profile } = useMinecraftProfile(member);
  const [imgFailed, setImgFailed] = useState(false);
  const displayName = profile?.name ?? member.username;
  const showHead = profile?.avatarUrl && !imgFailed;

  return (
    <li className="flex items-center gap-2.5">
      {showHead ? (
        <img
          src={profile.avatarUrl}
          alt=""
          width={20}
          height={20}
          className="shrink-0"
          style={{ imageRendering: "pixelated" }}
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className="h-5 w-5 shrink-0 bg-border" style={{ imageRendering: "pixelated" }} aria-hidden="true" />
      )}
      <span className="text-base text-text-primary">{displayName}</span>
    </li>
  );
}
