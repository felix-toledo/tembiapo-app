import { UserProfileData } from "@/types";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileInfo } from "./ProfileInfo";
import { WhatsAppButton } from "./WhatsAppButton";
import { PortfolioContainer } from "./PortfolioContainer"; // <--- IMPORTANTE

interface Props {
  isOwner: boolean;
  data: UserProfileData;
}

export const VerifiedProfileLayout = ({ data, isOwner }: Props) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl p-6 sm:p-10 border-2 border-blue-50 relative overflow-hidden max-w-5xl mx-auto">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <ProfileHeader isOwner={isOwner} data={data} />
      <ProfileInfo data={data} />
      <PortfolioContainer username={data.username} />
      <WhatsAppButton phoneNumber={data.whatsappContact} />
    </div>
  );
};
