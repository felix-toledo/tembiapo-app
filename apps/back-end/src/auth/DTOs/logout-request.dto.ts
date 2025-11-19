import { IsString, IsNotEmpty } from 'class-validator';

export class LogoutRequestDTO {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
