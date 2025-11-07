import { AUTH_STORAGE } from "../constants/storage.constants";


export interface AuthStorage {
    [AUTH_STORAGE.AUTHENTICATED]: boolean,
    [AUTH_STORAGE.USER_ID]: string
}