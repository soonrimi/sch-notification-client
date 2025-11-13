'use client';

import localFont from 'next/font/local';
import './globals.css';
import { CategoryColorProvider } from '@/contexts/CategoryColorContext';
import { CategoryProvider } from '@/contexts/CategoryContext';
import { NoticesProvider } from '@/contexts/NoticesContext';
import { BookmarkNoticesProvider } from '@/contexts/BookmarkNoticesContext';
import Notification from '@/Components/notification';
import { useNotification } from '@/Components/notification/useNotification';
import { useEffect } from 'react';
import { setAxiosNotificationHandler } from '@/axiosInstance';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { setNotificationMessage } = useNotification();
  useEffect(() => {
    setAxiosNotificationHandler(setNotificationMessage);
  }, [setNotificationMessage]);

  return (
    <html lang="ko">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="순리미" />
        <meta property="og:description" content="순천향대학교 공지사항을 확인하세요" />
        {/* <meta property="og:image" content="/.png" /> */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Notification />
        <NoticesProvider>
          <BookmarkNoticesProvider>
            <CategoryColorProvider>
              <CategoryProvider>{children}</CategoryProvider>
            </CategoryColorProvider>
          </BookmarkNoticesProvider>
        </NoticesProvider>
      </body>
    </html>
  );
}
