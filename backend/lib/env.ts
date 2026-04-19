const REQUIRED_ENV_VARS = [
  'SECRET',
  'DATABASE_URL',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
] as const

type RequiredEnvVar = (typeof REQUIRED_ENV_VARS)[number]

export type ValidatedBackendEnv = {
  [key in RequiredEnvVar]: string
} & {
  PORT?: string
  NODE_ENV?: string
  FRONTEND_URL?: string
}

export function validateBackendEnv(env: NodeJS.ProcessEnv = process.env): ValidatedBackendEnv {
  const missingVars = REQUIRED_ENV_VARS.filter(key => {
    const value = env[key]
    return typeof value !== 'string' || value.trim() === ''
  })

  if (missingVars.length > 0) {
    throw new Error(`Missing required backend environment variables: ${missingVars.join(', ')}`)
  }

  return {
    SECRET: env.SECRET!,
    DATABASE_URL: env.DATABASE_URL!,
    CLOUDINARY_CLOUD_NAME: env.CLOUDINARY_CLOUD_NAME!,
    CLOUDINARY_API_KEY: env.CLOUDINARY_API_KEY!,
    CLOUDINARY_API_SECRET: env.CLOUDINARY_API_SECRET!,
    ...(env.PORT ? { PORT: env.PORT } : {}),
    ...(env.NODE_ENV ? { NODE_ENV: env.NODE_ENV } : {}),
    ...(env.FRONTEND_URL ? { FRONTEND_URL: env.FRONTEND_URL } : {}),
  }
}
