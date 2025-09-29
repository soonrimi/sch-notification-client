import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import DescriptionIcon from '@mui/icons-material/Description';

export function getFileIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':
      return <PictureAsPdfIcon sx={{ color: 'red' }} />;
    case 'hwp':
    case 'hwpx':
      return <DescriptionIcon sx={{ color: '#1C7ED6' }} />;
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
      return <InsertPhotoIcon sx={{ color: '#afafafff' }} />;
    case 'txt':
      return <DescriptionIcon sx={{ color: '#afafafff'}} />;
    default:
      return <InsertDriveFileIcon />;
  }
}
