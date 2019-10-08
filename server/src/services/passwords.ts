import bcrypt from 'bcrypt';

const SALT_ROUNDS: number = 10;

export const hashPassword = (plainTextPassword: string): Promise<string> => {
	return bcrypt.hash(plainTextPassword, SALT_ROUNDS);
};
