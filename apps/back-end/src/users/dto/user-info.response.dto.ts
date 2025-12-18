export class UserInfoResponseDTO {
  id: string;
  mail: string;
  username: string | null;
  avatarUrl: string | null;
  name: string;
  lastName: string;
  isVerified: boolean;
  isPremium: boolean;
  role: string;
}
