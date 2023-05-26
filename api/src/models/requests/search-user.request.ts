export interface SearchUserRequest {
    id: number;
    fullName: string;
    displayName: string;
    cartId: number;
    email: string;
    phoneNumber: string;
    type: string;
    status: number;
    pageSize: number;
    pageIndex: number;
  }