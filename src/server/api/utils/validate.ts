import { VerificationCode } from "@prisma/client"

export const isVerificationCodeValid = (verificationData: VerificationCode): boolean => {
  if ( !verificationData || new Date(verificationData.expiresAt).getTime() < Date.now()) {
    return false
  }
  return true;
}