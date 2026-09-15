export function isFileTooLarge(file: File, maxMB: number): boolean {
  return file.size > maxMB * 1024 * 1024;
}