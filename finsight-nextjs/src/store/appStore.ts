// FinSight Phase 3 Global State Store
// Zustand store for application-wide state management

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// User state interface
interface UserState {
  id: string | null;
  email: string | null;
  name: string | null;
  image: string | null;
  isAuthenticated: boolean;
}

// Financial profile state interface
interface FinancialProfile {
  healthScore: number;
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  totalDebt: number;
  emergencyFund: number;
  savingsRate: number;
  currency: string;
}

// Notification interface
interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

// App state interface
interface AppState {
  // User & Authentication
  user: UserState;
  profile: FinancialProfile | null;
  
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  notifications: Notification[];
  
  // Real-time connection
  isConnected: boolean;
  lastSyncTime: Date | null;
  
  // Loading states
  isLoading: {
    profile: boolean;
    accounts: boolean;
    transactions: boolean;
    goals: boolean;
    insights: boolean;
  };
  
  // Actions
  setUser: (user: Partial<UserState>) => void;
  setProfile: (profile: Partial<FinancialProfile>) => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  setConnected: (connected: boolean) => void;
  setSyncTime: (time: Date) => void;
  setLoading: (key: keyof AppState['isLoading'], loading: boolean) => void;
  reset: () => void;
}

// Initial state
const initialState = {
  user: {
    id: null,
    email: null,
    name: null,
    image: null,
    isAuthenticated: false,
  },
  profile: null,
  sidebarOpen: false,
  theme: 'light' as const,
  notifications: [],
  isConnected: false,
  lastSyncTime: null,
  isLoading: {
    profile: false,
    accounts: false,
    transactions: false,
    goals: false,
    insights: false,
  },
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // User actions
        setUser: (userData) =>
          set(
            (state) => ({
              user: { ...state.user, ...userData },
            }),
            false,
            'setUser'
          ),

        setProfile: (profileData) =>
          set(
            (state) => ({
              profile: state.profile 
                ? { ...state.profile, ...profileData }
                : { ...defaultProfile, ...profileData },
            }),
            false,
            'setProfile'
          ),

        // UI actions
        setSidebarOpen: (open) =>
          set({ sidebarOpen: open }, false, 'setSidebarOpen'),

        setTheme: (theme) =>
          set({ theme }, false, 'setTheme'),

        // Notification actions
        addNotification: (notificationData) => {
          const notification: Notification = {
            ...notificationData,
            id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            isRead: false,
          };

          set(
            (state) => ({
              notifications: [notification, ...state.notifications].slice(0, 50), // Keep only last 50
            }),
            false,
            'addNotification'
          );
        },

        markNotificationRead: (id) =>
          set(
            (state) => ({
              notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, isRead: true } : n
              ),
            }),
            false,
            'markNotificationRead'
          ),

        clearNotifications: () =>
          set({ notifications: [] }, false, 'clearNotifications'),

        // Real-time connection actions
        setConnected: (connected) =>
          set({ isConnected: connected }, false, 'setConnected'),

        setSyncTime: (time) =>
          set({ lastSyncTime: time }, false, 'setSyncTime'),

        // Loading state actions
        setLoading: (key, loading) =>
          set(
            (state) => ({
              isLoading: { ...state.isLoading, [key]: loading },
            }),
            false,
            `setLoading:${key}`
          ),

        // Reset all state
        reset: () =>
          set(initialState, false, 'reset'),
      }),
      {
        name: 'finsight-app-store',
        partialize: (state) => ({
          user: state.user,
          profile: state.profile,
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    {
      name: 'FinSight App Store',
    }
  )
);

// Default financial profile
const defaultProfile: FinancialProfile = {
  healthScore: 0,
  netWorth: 0,
  monthlyIncome: 0,
  monthlyExpenses: 0,
  totalDebt: 0,
  emergencyFund: 0,
  savingsRate: 0,
  currency: 'USD',
};

// Selector hooks for better performance
export const useUser = () => useAppStore((state) => state.user);
export const useProfile = () => useAppStore((state) => state.profile);
export const useNotifications = () => useAppStore((state) => state.notifications);
export const useUnreadNotifications = () => 
  useAppStore((state) => state.notifications.filter(n => !n.isRead));
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useConnectionStatus = () => ({
  isConnected: useAppStore((state) => state.isConnected),
  lastSyncTime: useAppStore((state) => state.lastSyncTime),
});

// Action hooks
export const useAppActions = () => ({
  setUser: useAppStore((state) => state.setUser),
  setProfile: useAppStore((state) => state.setProfile),
  setSidebarOpen: useAppStore((state) => state.setSidebarOpen),
  setTheme: useAppStore((state) => state.setTheme),
  addNotification: useAppStore((state) => state.addNotification),
  markNotificationRead: useAppStore((state) => state.markNotificationRead),
  clearNotifications: useAppStore((state) => state.clearNotifications),
  setConnected: useAppStore((state) => state.setConnected),
  setSyncTime: useAppStore((state) => state.setSyncTime),
  setLoading: useAppStore((state) => state.setLoading),
  reset: useAppStore((state) => state.reset),
});
