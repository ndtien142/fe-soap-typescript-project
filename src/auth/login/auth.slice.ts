import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from 'src/common/@types/user/user.interface';
import { RootState } from 'src/common/redux/store';

type AuthLoginProps = {
  isAuthenticated: boolean;
  accessToken: string;
  refreshToken: string;
  user: IUser | null;
};
const AuthLoginState: AuthLoginProps = {
  isAuthenticated: false,
  accessToken: '',
  refreshToken: '',
  user: null,
};
export const authLoginSlice = createSlice({
  name: 'authLogin',
  initialState: AuthLoginState,
  reducers: {
    setLogin: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },
    setLogout: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { setLogin, setLogout, setAccessToken, setRefreshToken } = authLoginSlice.actions;
export const loginSelector = (state: RootState) => state.auth.isAuthenticated;
export const logoutSelector = (state: RootState) => state.auth.isAuthenticated;
export const accessTokenSelector = (state: RootState) => state.auth.accessToken;
export const refreshTokenSelector = (state: RootState) => state.auth.refreshToken;

export default authLoginSlice.reducer;
