import { User } from '../../models/user.model';

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  token: typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null,
  loading: false,
  error: null,
};
