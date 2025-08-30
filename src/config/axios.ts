import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

// Axios 인스턴스 생성
const axiosInstance = axios;

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // 에러 응답 처리
    if (error.response) {
      const { status, data } = error.response;

      // 401 에러 처리 (인증 실패)
      if (status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          // 로그인 페이지로 리다이렉트
          window.location.href = '/login';
        }
      }

      // 에러 로깅
      console.error('❌ Response Error:', {
        status,
        message: data?.message || error.message,
        url: error.config?.url,
      });

      // 사용자 친화적 에러 메시지
      const errorMessage = data?.message || getErrorMessage(status);
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // 네트워크 에러
      console.error('❌ Network Error:', error.request);
      return Promise.reject(new Error('네트워크 연결을 확인해주세요.'));
    } else {
      // 기타 에러
      console.error('❌ Error:', error.message);
      return Promise.reject(error);
    }
  }
);

// HTTP 상태 코드별 에러 메시지
const getErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return '잘못된 요청입니다.';
    case 401:
      return '인증이 필요합니다.';
    case 403:
      return '접근 권한이 없습니다.';
    case 404:
      return '요청한 리소스를 찾을 수 없습니다.';
    case 409:
      return '데이터 충돌이 발생했습니다.';
    case 422:
      return '입력 데이터를 확인해주세요.';
    case 500:
      return '서버에 오류가 발생했습니다.';
    case 502:
      return '서버 연결에 문제가 있습니다.';
    case 503:
      return '서비스를 일시적으로 사용할 수 없습니다.';
    default:
      return '알 수 없는 오류가 발생했습니다.';
  }
};

// API 함수들
export const api = {
  // GET 요청
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.get(url, config).then((response) => response.data),

  // POST 요청
  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> =>
    axiosInstance.post(url, data, config).then((response) => response.data),

  // PUT 요청
  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> =>
    axiosInstance.put(url, data, config).then((response) => response.data),

  // PATCH 요청
  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> =>
    axiosInstance.patch(url, data, config).then((response) => response.data),

  // DELETE 요청
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.delete(url, config).then((response) => response.data),
};

// 기본 axios 인스턴스 내보내기
export default axiosInstance;

// 토큰 관리 함수들
export const tokenManager = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  setRefreshToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refreshToken', token);
    }
  },

  getRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  },
};
