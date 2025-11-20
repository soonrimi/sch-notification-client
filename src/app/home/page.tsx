import { Suspense } from 'react';
import type { Metadata } from 'next';
import { HomeContent } from './components/HomeContent';
import { NoticeDetail } from './components/NoticeDetail';
import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';

interface HomePageSearchParams {
  id?: string;
}

interface HomePageProps {
  searchParams: Promise<HomePageSearchParams>;
}

export const dynamic = 'force-dynamic';

// 서버 사이드에서 메타데이터 생성
export async function generateMetadata(
  { searchParams }: HomePageProps
): Promise<Metadata> {
  const params = await searchParams;   // ✅ 반드시 await
  const id = params?.id;

  // id가 없으면 기본 메타데이터
  if (!id) {
    return {
      title: '순천향대학교 공지사항',
      description: '순천향대학교 공지사항을 확인하세요',
      openGraph: {
        title: '순천향대학교 공지사항',
        description: '순천향대학교 공지사항을 확인하세요',
        type: 'website',
        siteName: '순천향대학교 공지사항',
      },
    };
  }

  try {
    const notice = await CrawlPostControllerService.getNotice(Number(id));

    if (!notice) {
      return {
        title: '순천향대학교 공지사항',
        description: '공지를 찾을 수 없습니다',
      };
    }

    const description = notice.content
      ? notice.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...'
      : '공지를 확인하세요';

    const title = notice.title || '순천향대학교 공지사항';

    const imageExtensions = [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.webp',
      '.bmp',
      '.svg',
    ];

    const imageAttachment = notice.attachments?.find((att) => {
      if (!att.fileName || !att.fileUrl) return false;
      const ext = att.fileName
        .toLowerCase()
        .substring(att.fileName.lastIndexOf('.'));
      return imageExtensions.includes(ext);
    });

    const ogImageUrl = imageAttachment?.fileUrl;

    const contentImageUrl =
      notice.contentImages && notice.contentImages.length > 0
        ? notice.contentImages[0]
        : null;

    const finalImageUrl = ogImageUrl || contentImageUrl;

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || 'https://notification.iubns.net';
    const pageUrl = `${baseUrl}/home?id=${id}`;

    const metadata: Metadata = {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        url: pageUrl,
        siteName: '순천향대학교 공지사항',
        ...(finalImageUrl && { images: [{ url: finalImageUrl }] }),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        ...(finalImageUrl && { images: [finalImageUrl] }),
      },
    };

    return metadata;
  } catch (error) {
    console.error('메타데이터 생성 실패:', error);
    return {
      title: '순천향대학교 공지사항',
      description: '공지를 불러올 수 없습니다',
    };
  }
}

function HomePageInner({ id }: { id?: string }) {
  return id ? <NoticeDetail id={id} /> : <HomeContent />;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;  // ✅ 여기서도 await
  const id = params?.id;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageInner id={id} />
    </Suspense>
  );
}
