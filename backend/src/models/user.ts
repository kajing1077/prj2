// 사용자에 대한 CURD 제공하는 모델 클래스
// bcrypt로 단방향 암호화된 비밀번호를 평문 비밀번호와 대조하는 인스턴스 메서드 제공
import mysql from "mysql2/promise";
import pool from "../utils/mysql";
import bcrypt from "bcryptjs";

export class User {
  constructor(
      public readonly id: number,
      public email: string,
      public encryptedPassword: string
  ) {}

  static async findOne(params: { email: string }) {
    const [rows] = await pool.execute(
        `SELECT * FROM users WHERE email = ?`,
        [params.email]
    ) as [mysql.RowDataPacket[], mysql.FieldPacket[]];
    if (Array.isArray(rows) && rows.length === 0) {
      return null;
    }

    const { id, email, encryptedPassword } = rows[0];
    return new User(id, email, encryptedPassword);
  }

  static async create(params: { email: string; password: string }) {
    const { email, password } = params;
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds
    const [result] = await pool.execute(
        `INSERT INTO users (email, password) VALUES (?, ?)`,
        [email, hashedPassword]
    );

    return result;
  }

  async comparePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.encryptedPassword);
  }
}