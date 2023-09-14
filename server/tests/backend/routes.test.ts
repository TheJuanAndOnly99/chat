import request from 'supertest';
import { App } from '../../src/backend/App';

let server: any; 

beforeAll(async () => {
  const app = new App();
  await app.start();
  server = app.httpServer;
});

afterAll(async () => {
  await server.close();
});

describe('MongoUserController', () => {
  describe('POST /users', () => {
    it('should create a new user', async () => {
      const userData = {
        Uid: 'user_id_123',
        username: 'testuser',
        email: 'testuser@example.com',
        password: '1testPassword!',
      };

      const res = await request(server)
        .post('/users')
        .send(userData)
        .expect(201);

      expect(res.body).toEqual({});
    });
  });

  describe('GET /users', () => {
    it('should retrieve all users', async () => {
      const res = await request(server)
        .get('/users')
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
    });
  });
});
