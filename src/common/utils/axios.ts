import axios from 'axios';
// config
import { HOST_API } from '../../config';
import { store } from '../redux/store';
import { PATH_AUTH } from '../routes/paths';
import { toQueryString } from './common.util';
import { setAccessToken } from 'src/auth/login/auth.slice';
import { setIsExpired } from 'src/auth/login/login.slice';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: HOST_API,
  paramsSerializer: (param) => toQueryString(param),
});
export const axiosInstance2 = axios.create({
  baseURL: HOST_API,
});

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error;
    const refreshToken = store.getState()?.authLogin.refreshToken;
    if (response?.status === 4001) {
      axiosInstance2
        .post<any, { accessToken: string }>('/refresh-token', {
          refreshToken: refreshToken,
        })
        .then((res: any) => {
          store.dispatch(setAccessToken('Bearer ' + res?.data?.accessToken));
        })
        .catch((e) => {
          store.dispatch(setIsExpired(true));
          window.location.href = PATH_AUTH.login;
        });
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(async (config) => {
  const token = store.getState()?.authLogin.accessToken;
  const userId = store.getState()?.authLogin.userId;
  if (token) {
    try {
      // @ts-ignore
      config.headers = {
        ...config.headers,
        authorization: token,
        'x-user-code': userId,
      };
    } catch (e) {
      console.log(e);
    }
  }

  return {
    ...config,
  };
});

export default axiosInstance;
