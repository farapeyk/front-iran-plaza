export function isAdminUser(userType: string): boolean {
  return userType === "ADMIN" || userType === "SUPER_ADMIN";
}
