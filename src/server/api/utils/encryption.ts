import bcryptjs from 'bcryptjs';

export const encryptPassword = (password: string): string => {
  const SALT = bcryptjs.genSaltSync(10);
  const hash = bcryptjs.hashSync(password, SALT);
  return hash;
}

export const ValidatePassword = (password: string, hash: string): boolean => {
  return bcryptjs.compareSync(password, hash);
}

export const encryptVerificationCode = (code: string): string => {
  const SALT = bcryptjs.genSaltSync(10);
  const hash = bcryptjs.hashSync(code, SALT);
  return hash;
}

export const ValidateVerificationCode = (code: string, hash: string): boolean => {
  return bcryptjs.compareSync(code, hash);
}