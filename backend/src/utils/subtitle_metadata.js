import fs from 'fs';
import parser from 'subtitles-parser-vtt';

export function getSubtitleMetadata(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const data = parser.fromVtt(fileContent);

  if (!data || data.length === 0) {
    return { duration: 0 };
  }

  // Obtener duración total del subtítulo
  const lastCue = data[data.length - 1];
  const duration = convertToSeconds(lastCue.endTime);

  return { duration };
}

function convertToSeconds(timeStr) {
  const [hh, mm, ss] = timeStr.split(':');
  return parseFloat(hh) * 3600 + parseFloat(mm) * 60 + parseFloat(ss.replace(',', '.'));
}
