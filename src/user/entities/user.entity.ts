import { Exclude, Transform } from 'class-transformer';

export class User {
  id: string;
  login: string;

  @Exclude({ toPlainOnly: true })
  password: string;
  version: number;
  @Transform(({ value }) => Number(value))
  createdAt: number;

  @Transform(({ value }) => Number(value))
  updatedAt: number;
}
