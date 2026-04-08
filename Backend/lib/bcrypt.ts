import bcrypt from 'bcrypt'

export async function hash(password: string): Promise<string> {
  const result = await bcrypt.hash(password, 12)
  return result
}

export async function compare(current: string, original: string): Promise<boolean> {
  const result = await bcrypt.compare(current, original)
  return result
}
