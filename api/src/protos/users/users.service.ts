/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "users";

export interface EmptyArgument {
}

export interface Users {
  users: User[];
}

export interface User {
  id: number;
  fullName: string;
  displayName: string;
  cartId: number;
  email: string;
  password: string;
  phoneNumber: string;
  type: string;
  status: number;
  createdBy: number;
  createdDate: string;
  updatedBy: number;
  updatedDate: string;
  deletedBy: number;
  deletedDate: string;
  dob: string;
  country: string;
  addressLine: string;
  city: string;
  uid: string;
}

export interface searchUserBy {
  id: number;
  fullName: string;
  displayName: string;
  cartId: number;
  email: string;
  phoneNumber: string;
  type: string;
  status: number;
}

export const USERS_PACKAGE_NAME = "users";

export interface UsersServiceClient {
  getAll(request: EmptyArgument): Observable<Users>;

  createUser(request: User): Observable<User>;

  searchUser(request: searchUserBy): Observable<Users>;

  updateUser(request: User): Observable<User>;

  deleteUser(request: User): Observable<User>;
}

export interface UsersServiceController {
  getAll(request: EmptyArgument): Promise<Users> | Observable<Users> | Users;

  createUser(request: User): Promise<User> | Observable<User> | User;

  searchUser(request: searchUserBy): Promise<Users> | Observable<Users> | Users;

  updateUser(request: User): Promise<User> | Observable<User> | User;

  deleteUser(request: User): Promise<User> | Observable<User> | User;
}

export function UsersServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getAll", "createUser", "searchUser", "updateUser", "deleteUser"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UsersService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UsersService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USERS_SERVICE_NAME = "UsersService";
