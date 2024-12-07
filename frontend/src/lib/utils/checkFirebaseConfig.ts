const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
] as const;

export function checkFirebaseConfig() {
  console.log('Checking Firebase configuration...');

  const missingVars = requiredEnvVars.filter(
    varName => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.error('Missing required Firebase environment variables:');
    missingVars.forEach(varName => {
      console.error(`- ${varName}`);
    });
    throw new Error('Firebase configuration is incomplete. Check your environment variables.');
  }

  // Log configuration status (without exposing sensitive values)
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      const maskedValue = varName === 'NEXT_PUBLIC_FIREBASE_API_KEY' 
        ? `${value.substring(0, 6)}...${value.substring(value.length - 4)}`
        : '✓ Set';
      console.log(`${varName}: ${maskedValue}`);
    }
  });

  // Validate API key format
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey?.startsWith('AIza')) {
    console.error('Invalid Firebase API key format');
    throw new Error('Invalid Firebase API key format. API key should start with "AIza"');
  }

  // Validate project ID format
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId?.match(/^[a-z0-9-]+$/)) {
    console.error('Invalid Firebase project ID format');
    throw new Error('Invalid Firebase project ID format. Project ID should only contain lowercase letters, numbers, and hyphens');
  }

  // Validate auth domain format
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  if (!authDomain?.endsWith('.firebaseapp.com')) {
    console.warn('Warning: Auth domain does not end with .firebaseapp.com. Make sure this is intentional.');
  }

  console.log('Firebase configuration validation completed successfully');
  return true;
} 