  export default function FileButton({
    file,
  }: {
    file: { fileUrl?: string; fileName?: string };
  }) {
    return (
      <Button
        variant="outlined"
        sx={{ justifyContent: 'flex-start', gap: 1 }}
        onClick={() => {
          if (!file.fileUrl || !file.fileName) return;
          const link = document.createElement('a');
          link.href = file.fileUrl;
          link.download = file.fileName;
          link.click();
        }}
      >
        {getFileIcon(file.fileName ?? '')}
        {file.fileName}
      </Button>
    );
  }