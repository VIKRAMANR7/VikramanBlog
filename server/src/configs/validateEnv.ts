const requiredEnvs = [
  "MONGODB_URI",
  "JWT_SECRET",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "IMAGEKIT_PUBLIC_KEY",
  "IMAGEKIT_PRIVATE_KEY",
  "IMAGEKIT_URL_ENDPOINT",
  "GROQ_API_KEY",
] as const;

export function validateEnv(): void {
  const missing: string[] = [];

  for (const key of requiredEnvs) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing environment variables:\n  - ${missing.join("\n  - ")}`);
  }
}
