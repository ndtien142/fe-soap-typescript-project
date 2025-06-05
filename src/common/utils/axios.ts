import axios from 'axios';
// import { setAccessToken } from '../../auth/login/auth.slice';
// import { setIsExpired } from '../../auth/login/login.slice';
// config
import { HOST_API } from '../../config';
import { store } from '../redux/store';
import { PATH_AUTH } from '../routes/paths';
import { toQueryString } from './common.util';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: HOST_API,
  paramsSerializer: (param) => toQueryString(param),
});
const axiosInstance2 = axios.create({
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
