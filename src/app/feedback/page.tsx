"use client";

import { Container, IconButton, TextField, Button } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import styles from "./page.module.css";

export default function FeedbackPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");

  const onPickFile = () => fileRef.current?.click();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFileName(f ? f.name : "");
  };

  const onSave = () => {
    console.log({ title, content, fileName });
    alert("저장되었습니다. (데모)");
    router.back();
  };

  return (
    <Container maxWidth="sm" className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <IconButton size="small" className={styles.backBtn} onClick={() => router.back()}>
          <ArrowBackIosNewRoundedIcon fontSize="small" />
        </IconButton>
        <h1 className={styles.headerTitle}>건의하기</h1>
      </div>

      {/* 제목 */}
      <div className={styles.fieldBlock}>
        <label className={styles.label}>제목</label>
        <TextField
          placeholder="제목을 입력해주세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
      </div>

      {/* 건의내용 */}
      <div className={styles.fieldBlock}>
        <label className={styles.label}>건의내용</label>
        <TextField
          placeholder="건의내용을 입력해주세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          multiline
          minRows={6}
        />
      </div>

      {/* 첨부파일 */}
      <div className={styles.fieldBlock}>
        <label className={styles.label}>첨부파일</label>

        {/* 한 줄: 입력칸 + 버튼 */}
        <div className={styles.fileRow}>
          <TextField
            className={styles.fileInput}
            placeholder="파일을 첨부해주세요."
            value={fileName}
            /* ✅ 최신 방식: InputProps 대신 slotProps 사용 */
            slotProps={{ input: { readOnly: true } }}
            size="small"
            fullWidth
          />
          <input ref={fileRef} type="file" hidden onChange={onFileChange} />
          <Button variant="outlined" onClick={onPickFile} className={styles.fileBtn}>
            <span className={styles.noWrap}>파일 선택</span>
          </Button>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className={styles.footer}>
        <Container maxWidth="sm" className={styles.footerInner}>
          <Button fullWidth variant="outlined" onClick={() => router.back()}>
            취소
          </Button>
          <Button fullWidth variant="contained" onClick={onSave}>
            저장
          </Button>
        </Container>
      </div>
    </Container>
  );
}
