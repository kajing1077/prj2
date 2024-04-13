import { jest } from "@jest/globals";
// @ts-ignore
import request from 'supertest';

import { app } from '../app';
import { Note, MOCK_NOTES } from '../models/__mocks__/note';

jest.mock('../models/note', () => jest.requireActual("../models/__mocks__/note.ts"));

// jest.mock('jsonwebtoken', () => ({
//   sign: jest.fn(({ email }: { email: string }) => "mock_jwt_" + email),
//   verify: jest.fn((token: string, secret: string) => {
//     if (!token.startsWith("mock_jwt_")) {
//       throw new Error("Invalid token");
//     }
//     return {
//       header: { alg: "HS256", typ: "JWT" },
//       payload: { id: 1, email: "test@example.com" },
//       signature: "mock_signature"
//     };
//   }),
//   decode: jest.fn((token: string) => {
//     if (!token.startsWith("mock_jwt_")) {
//       throw new Error("Invalid token");
//     }
//     return { id: 1, email: token.replace("mock_jwt_", "") };
//   }),
// }));


afterEach(() => {
  MOCK_NOTES.splice(0, MOCK_NOTES.length);
});


afterEach(() => {
  MOCK_NOTES.splice(0, MOCK_NOTES.length);
});

describe('GET /notes', () => {
  test('모든 노트를 가져오는 요청을 보내면 200 응답과 함께 노트 목록을 받는다.', async () => {
    MOCK_NOTES.push(new Note(1, "Test Note", "This is a test note", 1));

    const response = await request(app).get('/notes');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        title: "Test Note",
        content: "This is a test note",
        userId: 1
      }
    ]);
  });
});

describe('GET /notes/:id', () => {
  test('존재하는 노트의 ID로 요청을 보내면 200 응답과 함께 노트를 받는다.', async () => {
    MOCK_NOTES.push(new Note(1, "Test Note", "This is a test note", 1));

    const response = await request(app).get('/notes/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      title: "Test Note",
      content: "This is a test note",
      userId: 1
    });
  });

  test('존재하지 않는 노트의 ID로 요청을 보내면 404 응답을 받는다.', async () => {
    const response = await request(app).get('/notes/1');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Note not found" });
  });
});

describe('POST /notes', () => {
  test('새 노트를 생성하는 요청을 보내면 201 응답과 함께 생성된 노트의 ID를 받는다.', async () => {
    const newNote = { title: "New Note", content: "This is a new note", userId: 1 };

    const response = await request(app)
        .post('/notes')
        .set('Cookie', 'access-token=mock_jwt_apple@example.com')
        .send(newNote);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});

describe('PUT /notes/:id', () => {
  test('기존 노트를 업데이트하는 요청을 보내면 200 응답과 함께 업데이트된 노트의 정보를 받는다.', async () => {
    const originalNote = new Note(1, "Original Note", "This is the original note", 1);
    MOCK_NOTES.push(originalNote);

    const updatedNote = { title: "Updated Note", content: "This is the updated note" };

    const response = await request(app)
        .put('/notes/1')
        .set('Cookie', 'access-token=mock_jwt_apple@example.com')
        .send(updatedNote);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      title: "Updated Note",
      content: "This is the updated note",
      userId: 1
    });
  });

  test('존재하지 않는 노트의 ID로 업데이트 요청을 보내면 404 응답을 받는다.', async () => {
    const updatedNote = { title: "Updated Note", content: "This is the updated note" };

    const response = await request(app)
        .put('/notes/999')
        .set('Cookie', 'access-token=mock_jwt_apple@example.com')
        .send(updatedNote);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Note not found" });
  });
});

describe('DELETE /notes/:id', () => {
  test('기존 노트를 삭제하는 요청을 보내면 200 응답과 함께 삭제된 노트의 정보를 받는다.', async () => {
    const originalNote = new Note(1, "Original Note", "This is the original note", 1);
    MOCK_NOTES.push(originalNote);

    const response = await request(app)
        .delete('/notes/1')
        .set('Cookie', 'access-token=mock_jwt_apple@example.com');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Note deleted successfully" });
  });

  test('존재하지 않는 노트의 ID로 삭제 요청을 보내면 404 응답을 받는다.', async () => {
    const response = await request(app)
        .delete('/notes/999')
        .set('Cookie', 'access-token=mock_jwt_apple@example.com');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Note not found" });
  });
});

describe('DELETE /notes/:id', () => {
  test('기존 노트를 삭제하는 요청을 보내고, 삭제된 노트를 다시 조회하면 404 응답을 받는다.', async () => {
    const originalNote = new Note(1, "Original Note", "This is the original note", 1);
    MOCK_NOTES.push(originalNote);

    let response = await request(app)
        .delete('/notes/1')
        .set('Cookie', 'access-token=mock_jwt_apple@example.com');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Note deleted successfully" });

    // 삭제된 노트를 다시 조회
    response = await request(app).get('/notes/1');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Note not found" });
  });
});

