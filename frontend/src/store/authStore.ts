import { create } from 'zustand';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import api from '@/lib/api';

interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  groups: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,

  login: async (username, password) => {
    const response = await api.post('/api/token/', { username, password });
    const { access, refresh } = response.data;

    Cookies.set('access_token', access, { expires: 1/24 });
    Cookies.set('refresh_token', refresh, { expires: 7 });

    const decodedToken: any = jwtDecode(access);
    const user: User = {
      id: decodedToken.user_id,
      username: decodedToken.username,
      email: decodedToken.email,
      is_staff: decodedToken.is_staff || false,
      groups: decodedToken.groups || [],
    };
    
    try {
      const userDetailsResponse = await api.get(`/api/auth/users/me/`);

      const fullUser: User = {
        id: userDetailsResponse.data.id,
        username: userDetailsResponse.data.username,
        email: userDetailsResponse.data.email,
        is_staff: userDetailsResponse.data.is_staff,
        groups: userDetailsResponse.data.groups,
      };
        Cookies.set('user', fullUser.username);
        Cookies.set('is_staff', String(fullUser.is_staff));
      set({ isAuthenticated: true, user: fullUser });
    } catch (error) {
      console.error("Could not retrieve user details:", error);
      set({ isAuthenticated: true, user: user });
    }
  },

  logout: () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    set({ isAuthenticated: false, user: null });
  },

  checkAuth: () => {
    const token = Cookies.get('access_token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          //refresh token
          set({ isAuthenticated: false, user: null });
        } else {
          const user: User = {
            id: decodedToken.user_id,
            username: decodedToken.username,
            email: decodedToken.email,
            is_staff: decodedToken.is_staff || false,
            groups: decodedToken.groups || [],
          };
          set({ isAuthenticated: true, user: user });
        }
      } catch (error) {
        console.error("Token decoding error:", error);
        set({ isAuthenticated: false, user: null });
      }
    } else {
      set({ isAuthenticated: false, user: null });
    }
  },
}));

export default useAuthStore;