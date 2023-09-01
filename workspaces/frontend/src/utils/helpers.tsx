export const hasPermission = (
  userRole: string | undefined,
  allowedRoles: string[],
) => {
  if (!userRole) {
    return false;
  }
  return allowedRoles.includes(userRole);
};
