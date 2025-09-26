import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
  AuthCredential
} from 'firebase/auth';
import { auth } from '../config/firebase';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

// Google OAuth configuration
const GOOGLE_OAUTH_CONFIG = {
  expoClientId: 'your-expo-client-id',
  iosClientId: 'your-ios-client-id', 
  androidClientId: 'your-android-client-id',
  webClientId: 'your-web-client-id',
};

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class AuthService {
  // Sign up with email and password
  async signUpWithEmail(data: SignUpData): Promise<{ user: AuthUser; error?: string }> {
    try {
      const { email, password, firstName, lastName } = data;
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile with name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });
      
      const authUser: AuthUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      
      return { user: authUser };
    } catch (error: any) {
      return { 
        user: {} as AuthUser, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  // Sign in with email and password
  async signInWithEmail(data: LoginData): Promise<{ user: AuthUser; error?: string }> {
    try {
      const { email, password } = data;
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const authUser: AuthUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      
      return { user: authUser };
    } catch (error: any) {
      return { 
        user: {} as AuthUser, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  // Google Sign In - Simplified version for now
  async signInWithGoogle(): Promise<{ user: AuthUser; error?: string }> {
    try {
      // For now, return error to indicate Google Sign-In needs proper setup
      return { 
        user: {} as AuthUser, 
        error: 'Google Sign-In requires Firebase configuration. Please check FIREBASE_SETUP.md for setup instructions.' 
      };
      
      // TODO: Implement Google Sign-In after Firebase is properly configured
      // const [request, response, promptAsync] = Google.useAuthRequest(GOOGLE_OAUTH_CONFIG);
      // const result = await promptAsync();
      // ... rest of implementation
      
    } catch (error: any) {
      return { 
        user: {} as AuthUser, 
        error: 'Google Sign-In is not configured yet. Please use email/password login.' 
      };
    }
  }

  // Sign out
  async signOutUser(): Promise<{ error?: string }> {
    try {
      await signOut(auth);
      return {};
    } catch (error: any) {
      return { error: this.getErrorMessage(error.code) };
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Convert Firebase auth user to our AuthUser type
  convertFirebaseUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  }

  // Error message helper
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
}

export const authService = new AuthService();