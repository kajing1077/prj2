export class User {
  constructor(
      public readonly id: number,
      public email: string,
      public encryptedPassword: string
  ) {}

  static async findOne(params: { email: string }) {
    return MOCK_USERS.find((user) => user.email === params.email) || null;
  }
}
export const MOCK_USERS: User[] = [];