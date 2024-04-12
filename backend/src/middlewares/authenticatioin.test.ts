import { authenticateUser } from '../middlewares/authentication';
import { Request, Response, NextFunction } from 'express';
// @ts-ignore
import jwt from "jsonwebtoken";

describe('authenticateUser middleware', () => {
  it('should set req.user if access-token cookie is valid', () => {
    const JWT_SECRET = 'my_secret_key'; // 실제 비밀키로 교체해야 합니다.
    const mockToken = jwt.sign({ email: 'apple@example.com' }, JWT_SECRET);

    console.log("mockToken", mockToken);
    const mockReq = {
      cookies: { 'access-token': mockToken },
      user: undefined,
    } as unknown as Request;

    const mockRes = {
      sendStatus: jest.fn(),
    } as unknown as Response;

    const mockNext: NextFunction = jest.fn();

    authenticateUser(mockReq, mockRes, mockNext);

    expect(mockReq.user).toEqual({ email: 'apple@example.com' });
    expect(mockRes.sendStatus).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });
});

