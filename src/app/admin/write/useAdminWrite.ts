import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addNotice, Category, LocalNotice } from '../localNotice';

export type FileItem = { id: string; file: File };

export const CATEGORIES: Category[] = [
  '대학',
  '학교',
  '학년',
  '채용',
  '활동',
  '홍보',
  '전체',
];

export function useAdminWrite() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('전체');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const numberedFiles = useMemo(
    () => files.map((f, i) => ({ no: i + 1, name: f.file.name, id: f.id })),
    [files]
  );

  const appendFiles = (list: FileList | null) => {
    if (!list) return;
    const next: FileItem[] = Array.from(list).map((f) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      file: f,
    }));
    setFiles((prev) => [...prev, ...next]);
  };

  const onAddFiles: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    appendFiles(e.target.files);
    e.currentTarget.value = '';
  };

  const onRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setDragOver(false);
    appendFiles(e.dataTransfer.files);
  };
  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (!dragOver) setDragOver(true);
  };
  const onDragLeave = () => setDragOver(false);

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    setSubmitting(true);
    try {
      const newItem: LocalNotice = {
        id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: title.trim(),
        content: content.trim(),
        category,
        createdAt: new Date().toISOString(),
        attachments: files.map((f) => ({ name: f.file.name })),
      };
      addNotice(newItem);
      router.push('/admin');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    router,
    inputRef,
    title,
    setTitle,
    content,
    setContent,
    category,
    setCategory,
    files,
    setFiles,
    submitting,
    setSubmitting,
    dragOver,
    setDragOver,
    numberedFiles,
    appendFiles,
    onAddFiles,
    onRemoveFile,
    onDrop,
    onDragOver,
    onDragLeave,
    isValid,
    handleSubmit,
    CATEGORIES,
  };
}
