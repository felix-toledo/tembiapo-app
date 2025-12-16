export class VerificationResponseConfidence {
  approved_models: string[];
  arcface_approved: boolean;
  models_approved: number;
  total_models: number;
}

export class VerificationResponseDto {
  confidence: VerificationResponseConfidence;
  match: boolean;
  success: boolean;
}
