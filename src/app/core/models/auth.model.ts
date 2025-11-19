import { AUTH_STORAGE } from '../constants/storage.constants';

export interface AuthStorage {
  [AUTH_STORAGE.AUTHENTICATED]: boolean;
  [AUTH_STORAGE.USER_ID]: string;
  [AUTH_STORAGE.FULL_NAME]: string;
  [AUTH_STORAGE.PROFILE_PICTURE]: string | null;
  [AUTH_STORAGE.EMAIL]: string;
  [AUTH_STORAGE.ROLE]: string;
  [AUTH_STORAGE.REFRESHED_AT]: Date;
}
