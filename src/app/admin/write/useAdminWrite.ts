import useAdminInfo from '../useAdminInfo';
import { useRouter } from 'next/navigation';
import {
  AdminControllerService,
  CreateInternalNoticeRequest,
  Department,
  InternalNoticeListResponse,
} from '@/api';
import { useEffect, useMemo, useRef, useState } from 'react';
import { atom, useAtom } from 'jotai';

export type FileItem = { id: string; file: File };

const titleAtom = atom('');
const contentAtom = atom('');
const filesAtom = atom<FileItem[]>([]);
const submittingAtom = atom(false);
const targetDepartmentAtom = atom<Department | null>(null);
const targetYearAtom = atom<InternalNoticeListResponse.targetYear>(
  InternalNoticeListResponse.targetYear.ALL_YEARS
);

export function useAdminWrite() {
  const { push } = useRouter();
  const { adminToken } = useAdminInfo();

  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useAtom(titleAtom);
  const [content, setContent] = useAtom(contentAtom);
  const [files, setFiles] = useAtom(filesAtom);
  const [submitting, setSubmitting] = useAtom(submittingAtom);
  const [dragOver, setDragOver] = useState(false);
  const [targetDepartment, setTargetDepartment] = useAtom(targetDepartmentAtom);
  const [targetYear, setTargetYear] = useAtom(targetYearAtom);
  const [departmentList, setDepartmentList] = useState<Department[]>([]);

  useEffect(() => {
    AdminControllerService.getAllDepartment().then((res) => {
      setDepartmentList(res);
      setTargetDepartment(res[0] || null);
    });
  }, []);

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

  async function handleSubmit() {
    if (!isValid) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    setSubmitting(true);
    try {
      await AdminControllerService.createInternalNotice(adminToken, {
        internalNotice: {
          targetYear: targetYear,
          title: title.trim(),
          content: content.trim(),
          targetDept: targetDepartment?.id,
        },
        file: files.map((f) => f.file),
      });
      push('/admin');
    } finally {
      setSubmitting(false);
    }
  }

  return {
    inputRef,
    title,
    setTitle,
    content,
    setContent,
    targetDepartment,
    setTargetDepartment,
    departmentList,
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
    targetYear,
    setTargetYear,
  };
}
