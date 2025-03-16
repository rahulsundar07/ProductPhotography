// Environment variable validation
export function validateEnvVariables(): void {
  const requiredVars = [
    { key: 'VITE_API_BASE_URL', value: import.meta.env.VITE_API_BASE_URL },
    { key: 'VITE_API_KEY', value: import.meta.env.VITE_API_KEY },
    { key: 'VITE_WORKFLOW_ID', value: import.meta.env.VITE_WORKFLOW_ID }
  ];

  const missingVars = requiredVars
    .filter(v => !v.value)
    .map(v => v.key);

  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}. Please check your .env file.`);
  }
}