export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

export async function validateUpload(formData: FormData): Promise<string | null> {
  const entries = [...formData.entries()];
  if (entries.length !== 1 || entries[0][0] !== 'file' || !(entries[0][1] instanceof File)) return 'یک فایل معتبر انتخاب کنید.';
  const file = entries[0][1];
  if (!file.size) return 'فایل خالی است.';
  if (file.size > MAX_UPLOAD_BYTES) return 'حجم فایل نباید بیشتر از ۲۰ مگابایت باشد.';
  const bytes = new Uint8Array(await file.slice(0, 32).arrayBuffer());
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  const starts = (...signature: number[]) => signature.every((value, index) => bytes[index] === value);
  const matches: Record<string, boolean> = {
    'image/jpeg': starts(0xff, 0xd8, 0xff),
    'image/png': starts(137, 80, 78, 71, 13, 10, 26, 10),
    'image/gif': ['GIF87a','GIF89a'].includes(ascii(0,6)),
    'image/webp': ascii(0,4) === 'RIFF' && ascii(8,12) === 'WEBP',
    'image/bmp': ascii(0,2) === 'BM',
    'image/avif': ascii(4,8) === 'ftyp' && ['avif','avis'].includes(ascii(8,12)),
    'video/mp4': ascii(4,8) === 'ftyp' && ['isom','iso2','mp41','mp42','avc1','M4V '].includes(ascii(8,12)),
    'video/quicktime': ascii(4,8) === 'ftyp' && ascii(8,12) === 'qt  ',
    'video/webm': starts(0x1a,0x45,0xdf,0xa3),
  };
  return matches[file.type] ? null : 'نوع یا محتوای فایل پشتیبانی نمی‌شود. تصویر معتبر یا ویدیوی MP4، WebM یا MOV انتخاب کنید.';
}
