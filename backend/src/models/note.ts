import mysql from "mysql2/promise";
import pool from "../utils/mysql";

export class Note {
  constructor(
      public readonly id: number,
      public title: string,
      public content: string,
      public userId: number,
      public createdAt: Date,
      public updatedAt: Date
  ) {}

  static async create(params: { title: string; content: string; userId: number }) {
    const { title, content, userId } = params;
    const [result] = await pool.execute(
        `INSERT INTO notes (title, content, userId) VALUES (?, ?, ?)`,
        [title, content, userId]
    );
    return result;
  }

  static async findAll() {
    const [rows] = await pool.execute(
        `SELECT id, title FROM notes`
    ) as [mysql.RowDataPacket[], mysql.FieldPacket[]];

    return rows.map(row => ({ id: row.id, title: row.title }));
  }

  static async findOne(params: { id: number }) {
    const [rows] = await pool.execute(
        `SELECT * FROM notes WHERE id = ?`,
        [params.id]
    ) as [mysql.RowDataPacket[], mysql.FieldPacket[]];
    if (Array.isArray(rows) && rows.length === 0) {
      return null;
    }

    const { id, title, content, userId, created_at, updated_at } = rows[0];
    return new Note(id, title, content, userId, new Date(created_at), new Date(updated_at));
  }


// Todo : ResultSetHeader 알아보기
  static async update(params: { id: number; title: string; content: string }) {
    const { id, title, content } = params;
    const [result] = await pool.execute(
        `UPDATE notes SET title = ?, content = ? WHERE id = ?`,
        [title, content, id]
    );

    const resultSetHeader = result as mysql.ResultSetHeader;
    if (resultSetHeader.affectedRows > 0) {
      return this.findOne({ id });
    } else {
      return null;
    }
  }

  static async delete(params: { id: number }) {
    const { id } = params;
    const [result] = await pool.execute(
        `DELETE FROM notes WHERE id = ?`,
        [id]
    );

    const resultSetHeader = result as mysql.ResultSetHeader;
    if (resultSetHeader.affectedRows > 0) {
      return { message: "Note deleted successfully" };
    } else {
      return { error: "Note not found" };
    }
  }
}