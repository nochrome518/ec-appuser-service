import { User } from "src/protos/users/users.service";

export class UserResponse {
    users: User[];
    total: number;
    count: number;
    page: number;
    pageCount?: number;
  }