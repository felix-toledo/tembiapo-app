import React from "react";
import { UserProfileData } from "@/types";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileInfo } from "./ProfileInfo";
import { WhatsAppButton } from "./WhatsAppButton";

interface Props {
  data: UserProfileData;
  isOwner: boolean;
}

export const UnverifiedProfileLayout = ({ data, isOwner }: Props) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl p-6 sm:p-10 border-2 border-gray-100 relative overflow-hidden max-w-5xl mx-auto">
      <ProfileHeader isOwner={isOwner} data={data} />
      <ProfileInfo data={data} />
      <WhatsAppButton phoneNumber={data.whatsappContact} />
    </div>
  );
};
