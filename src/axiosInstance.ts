import axios from 'axios';
import { useNotification } from './Components/notification/useNotification';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

let notify: ReturnType<typeof useNotification>['setNotificationMessage'] = (
  ..._args
) => {};

export function setAxiosNotificationHandler(
  fn: ReturnType<typeof useNotification>['setNotificationMessage']
) {
  notify = fn;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage =
      error.response?.data?.message || 'API 요청 중 오류가 발생했습니다.';
    if (errorMessage) {
      notify?.(errorMessage, 'error');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
