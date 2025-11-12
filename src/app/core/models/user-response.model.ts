import { User } from './user.model';

/** Backend paginated response wrapper */
export interface PageableResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
  };
  first: boolean;
  empty: boolean;
}

/** User management response (matches backend) */
export interface UserManagementResponse {
  description: string | null;
  data: {
    totalUsers: number;
    totalOrganizers: number;
    totalAttendees: number;
    totalDeactivatedUsers: number;
    users: PageableResponse<User>;
  };
}

/** Response for /users/search */
export interface UserSearchResponse {
  description: string | null;
  data: PageableResponse<User>;
}
