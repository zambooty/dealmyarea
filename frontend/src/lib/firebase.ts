import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  connectAuthEmulator,
  browserLocalPersistence,
  setPersistence,
  type Auth,
  type AuthProvider,
  indexedDBLocalPersistence,
  inMemoryPersistence
} from 'firebase/auth';
import { checkFirebaseConfig } from './utils/checkFirebaseConfig';

// Only check config in production
if (process.env.NODE_ENV === 'production') {
  checkFirebaseConfig();
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Test connection to Firebase
const testFirebaseConnection = async () => {
  try {
    const response = await fetch(`https://${firebaseConfig.projectId}.firebaseio.com/.json`);
    return response.ok;
  } catch (error) {
    console.warn('Firebase connection test failed:', error);
    return false;
  }
};

// Initialize Firebase with retry logic
const initializeFirebase = async (retries = 3, delay = 1000): Promise<{ app: FirebaseApp; auth: Auth }> => {
  let lastError: Error | null = null;
  
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempt ${i + 1} to initialize Firebase...`);
      
      // Test connection first
      const isConnected = await testFirebaseConnection();
      if (!isConnected) {
        throw new Error('Unable to connect to Firebase');
      }

      let app: FirebaseApp;
      if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
      } else {
        app = getApps()[0];
      }

      const auth = getAuth(app);

      // Try different persistence methods
      const persistenceMethods = [
        browserLocalPersistence,
        indexedDBLocalPersistence,
        inMemoryPersistence
      ];

      let persistenceError: Error | null = null;
      for (const persistence of persistenceMethods) {
        try {
          await setPersistence(auth, persistence);
          console.log(`Successfully set persistence to ${persistence.type}`);
          persistenceError = null;
          break;
        } catch (error) {
          persistenceError = error as Error;
          console.warn(`Failed to set persistence ${persistence.type}:`, error);
        }
      }

      if (persistenceError) {
        throw persistenceError;
      }

      // Use Auth emulator in development
      if (process.env.NODE_ENV === 'development') {
        try {
          connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
          console.log('Connected to Firebase Auth emulator');
        } catch (error) {
          console.warn('Could not connect to Auth emulator:', error);
        }
      }

      // Test auth is working
      await auth.updateCurrentUser(null);
      console.log('Firebase initialization successful');

      return { app, auth };
    } catch (error) {
      lastError = error as Error;
      console.warn(`Firebase initialization attempt ${i + 1} failed:`, error);
      
      if (i < retries - 1) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Failed to initialize Firebase after multiple attempts');
};

// Initialize providers
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ 
  prompt: 'select_account',
  // Add additional OAuth 2.0 scopes if needed
  // scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
});

const facebookProvider = new FacebookAuthProvider();
facebookProvider.setCustomParameters({ 
  display: 'popup',
  // Add additional permissions if needed
  // auth_type: 'rerequest',
  // scope: 'email,public_profile'
});

const githubProvider = new GithubAuthProvider();
githubProvider.setCustomParameters({ 
  allow_signup: 'true',
  // Add additional scopes if needed
  // scope: 'user:email'
});

const twitterProvider = new TwitterAuthProvider();
twitterProvider.setCustomParameters({ 
  lang: 'en'
});

// Initialize Firebase and export
let app: FirebaseApp;
let auth: Auth;

const initialize = async () => {
  try {
    const result = await initializeFirebase();
    app = result.app;
    auth = result.auth;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    // Try to provide more helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('network')) {
        console.error('Network error detected. Please check your internet connection and firewall settings.');
      } else if (error.message.includes('configuration')) {
        console.error('Firebase configuration error. Please check your environment variables and Firebase Console settings.');
      }
    }
    throw error;
  }
};

// Initialize immediately but don't block module loading
initialize().catch(console.error);

export { 
  app, 
  auth, 
  googleProvider, 
  facebookProvider, 
  githubProvider, 
  twitterProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  initialize // Export initialize function for manual initialization if needed
}; 