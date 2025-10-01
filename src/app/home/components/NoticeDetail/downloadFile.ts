import type { Attachment } from './types';

export function downloadFile(file?: Attachment) {
  if (!file?.fileUrl || !file?.fileName) return;
  const link = document.createElement('a');
  link.href = file.fileUrl;
  link.download = file.fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function downloadAll(attachments: Attachment[], delay = 200) {
  attachments
    .filter(
      (f): f is Required<Pick<Attachment, 'fileUrl' | 'fileName'>> =>
        !!f?.fileUrl && !!f?.fileName
    )
    .forEach((file, idx) => {
      setTimeout(() => downloadFile(file), idx * delay);
    });
}
