declare global {
  interface Window {
    Kakao?: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: any) => void;
      };
    };
  }
}

let loadingPromise: Promise<typeof window.Kakao | null> | null = null;

export async function ensureKakao(appKey: string) {
  if (typeof window === 'undefined') return null;

  if (window.Kakao) {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(appKey);
    }
    return window.Kakao;
  }

  if (!loadingPromise) {
    loadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://developers.kakao.com/sdk/js/kakao.min.js';
      script.async = true;
      script.onload = () => {
        if (!window.Kakao) {
          reject(new Error('Kakao SDK failed to load'));
          return;
        }
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(appKey);
        }
        resolve(window.Kakao);
      };
      script.onerror = () => reject(new Error('Failed to load Kakao SDK'));
      document.head.appendChild(script);
    });
  }

  return loadingPromise;
}
