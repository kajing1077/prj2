import { jest } from "@jest/globals";
// @ts-ignore
import request from 'supertest'
import { app } from '../app'
import { User, MOCK_USERS } from '../models/__mocks__/user'

jest.mock('../models/user', () => jest.requireActual("../models/__mocks__/user.ts"))

afterEach(() => {
    MOCK_USERS.splice(0, MOCK_USERS.length);
})

describe('GET /users/me', () => {
    test('올바른 JWT 쿠키가 설정되어있으면 유저 정보와 함께 200 응답을 받는다.', async () => {
        MOCK_USERS.push(new User(1, "apple@example.com", "mock_encrypted_app123"));

        const response = await request(app)
            .get('/users/me')
            .set('Cookie', 'access-token=mock_jwt_apple@example.com');

        console.log(response.body);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ email: "apple@example.com" });
    })
});

