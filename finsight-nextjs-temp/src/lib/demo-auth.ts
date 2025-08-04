// Demo Authentication Utility
// Provides temporary authentication for demonstration purposes

import axios from 'axios';
import { getPlatformApiUrl } from './platform-utils';

// Get the platform-specific API URL
const DEFAULT_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_BASE_URL = getPlatformApiUrl(DEFAULT_API_URL);

interface DemoAuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

// Get or create a demo authentication token
export async function getDemoAuthToken(): Promise<string | null> {
  try {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      console.log('getDemoAuthToken: Not in browser environment');
      return null;
    }

    console.log('getDemoAuthToken: Starting authentication process...');

    // Check if we already have a token
    const existingToken = localStorage.getItem('auth_token');
    if (existingToken) {
      console.log('getDemoAuthToken: Found existing token, validating...');
      // Try to validate the token
      try {
        const response = await axios.get(`${API_BASE_URL}/auth/me/`, {
          headers: { Authorization: `Token ${existingToken}` }
        });
        if (response.status === 200) {
          console.log('getDemoAuthToken: Existing token is valid');
          return existingToken;
        }
      } catch (error) {
        // Token is invalid, remove it
        console.log('getDemoAuthToken: Existing token is invalid, removing...', error);
        localStorage.removeItem('auth_token');
      }
    }

    // Get a demo token from our demo endpoint
    try {
      console.log('getDemoAuthToken: Getting new demo token from:', `${API_BASE_URL}/auth/demo-token/`);
      const response = await axios.get(`${API_BASE_URL}/auth/demo-token/`);
      
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        console.log('getDemoAuthToken: Demo token obtained successfully');
        return response.data.token;
      } else {
        console.error('getDemoAuthToken: No token in response:', response.data);
      }
    } catch (error) {
      console.error('getDemoAuthToken: Failed to get demo token:', error);
    }

    return null;
  } catch (error) {
    console.error('Failed to get demo auth token:', error);
    return null;
  }
}

// Initialize demo authentication
export async function initializeDemoAuth(): Promise<void> {
  try {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    const token = await getDemoAuthToken();
    if (token) {
      console.log('Demo authentication initialized successfully');
    } else {
      console.warn('Failed to initialize demo authentication');
    }
  } catch (error) {
    console.error('Error initializing demo auth:', error);
  }
}
