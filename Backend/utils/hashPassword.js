import bcrypt from 'bcrypt';

/**
 * Genera un hash bcrypt con 12 salt rounds.
 * @param {string} plainText - El texto plano a hashear (por ejemplo, una contraseña).
 * @returns {Promise<string>} - El hash generado.
 */
export const hashPassword = async (plainText) => {
  const saltRounds = 12;
  const hash = await bcrypt.hash(plainText, saltRounds);
  return hash;
};

export const comparePassword = async (plainText, hash) => {
  return await bcrypt.compare(plainText, hash);
}
