  export function getFileIcon(fileName: string) {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return <PictureAsPdfIcon sx={{ color: 'red' }} />;
      case 'hwp':
      case 'hwpx':
        return <DescriptionIcon sx={{ color: '#1C7ED6' }} />; // 한글 전용 아이콘 없어서 일반 문서 아이콘
      case 'doc':
      case 'docx':
        return <DescriptionIcon sx={{ color: '#2B579A' }} />;
      case 'xls':
      case 'xlsx':
        return <DescriptionIcon sx={{ color: 'green' }} />;
      case 'ppt':
      case 'pptx':
        return <DescriptionIcon sx={{ color: 'orange' }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <DescriptionIcon sx={{ color: '#7950F2' }} />;
      default:
        return <InsertDriveFileIcon />;
    }
  }