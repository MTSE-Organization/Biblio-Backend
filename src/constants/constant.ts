export const Constant = {
  // Account
  ACCOUNT_KIND_ADMIN: 1,
  ACCOUNT_KIND_EMPLOYEE: 2,
  ACCOUNT_KIND_USER: 3,

  // Status
  STATUS_PENDING: 0,
  STATUS_ACTIVE: 1,
  STATUS_LOCK: -1,
  STATUS_DELETED: -2,

  // Group
  GROUP_KIND_ADMIN: 1,
  GROUP_KIND_USER: 2,
  GROUP_NAME_USER: 'Role User'
} as const;

export const fileFolders = {
  ['1']: 'systems',
  ['2']: 'avatars'
};
