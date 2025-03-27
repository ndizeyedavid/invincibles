import bcrypt from 'bcryptjs';

export const encryptPassword = async (password: string) => {
  if (!password) {
    throw new Error('Password is required');
  }
  const encryptedPassword = await bcrypt.hash(password, 10);
  return encryptedPassword;
};

export const isPasswordMatch = async (password: string, userPassword: string) => {
  return bcrypt.compare(password, userPassword);
};
