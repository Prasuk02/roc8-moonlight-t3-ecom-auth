import bcryptjs from 'bcryptjs';

export const encryptPassword = (password: string): string => {
  const SALT = bcryptjs.genSaltSync(10);
  const hash = bcryptjs.hashSync(password, SALT);
  return hash;
}

export const ValidatePassword = (password: string, hash: string): boolean => {
  return bcryptjs.compareSync(password, hash);
}
