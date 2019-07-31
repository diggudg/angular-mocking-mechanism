import { IUser } from './user.interface';

export class User implements IUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}
export class Users {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: Array<User>
}