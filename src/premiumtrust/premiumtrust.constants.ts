export const PREMIUMTRUST_RESPONSE_CODES = {
  '00': { status: 'SUCCESS', message: 'Success' },
  '02': { status: 'ACCOUNT_EXISTS', message: 'Account already exists' },
  '03': { status: 'INVALID_BVN', message: 'Invalid BVN' },
  '04': { status: 'BVN_WATCHLISTED', message: 'BVN watchlisted' },
  '08': { status: 'EXCEPTION', message: 'Failure due to exception' },
} as const;

export type PremiumTrustResponseStatus = keyof typeof PREMIUMTRUST_RESPONSE_CODES;

export const FT_STATUS_CODES = {
  SUCCESS: '1',
  INVALID_ACCOUNT: '2',
  INVALID_CREDENTIALS: '3',
  DUPLICATE: '4',
} as const;

export const PREMIUMTRUST_PROVIDER_CODE = 'PREMIUMTRUST';
export const PREMIUMTRUST_CREATE_ACCOUNT_PATH = '/FintechAccountCrea/api/v1/createAccount';
