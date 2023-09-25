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

  describe('GET /user/:Username', () => {
    it('should return a user', async () => {
      const res = await request(server)
        .get('/user/testuser')
        .expect(200);

      expect(res.body).toBeInstanceOf(Object);
    });
  });

  describe('GET /users/:Uid', () => {
    it('should return a user', async () => {
      const res = await request(server)
        .get('/users/user_id_123')
        .expect(200);

      expect(res.body).toBeInstanceOf(Object);
    });
  });

  describe('DELETE /users/:Uid', () => {
    it('should delete a user', async () => {
      const res = await request(server)
        .delete('/users/user_id_123')
        .expect(200);

      expect(res.body).toEqual({});
    });
  });

  describe('POST /rooms', () => {
    it('should create a new room', async () => {
      const roomData = {
        Uid: 'room_id_123',
      };

      const res = await request(server)
        .post('/rooms')
        .send(roomData)
        .expect(201);

      expect(res.body).toEqual({});
    });
  });

  describe('GET /rooms', () => {
    it('should retrieve all rooms', async () => {
      const res = await request(server)
        .get('/rooms')
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /room/:Name', () => {
    it('should return a room', async () => {
      const res = await request(server)
        .get('/room/testroom')
        .expect(200);

      expect(res.body).toBeInstanceOf(Object);
    });
  });

  describe('GET /rooms/:Uid', () => {
    it('should return a room', async () => {
      const res = await request(server)
        .get('/rooms/room_id_123')
        .expect(200);

      expect(res.body).toBeInstanceOf(Object);
    });
  });

  describe('POST /rooms/:roomId/user/:userId', () => {
    it('should add a user to a room', async () => {
      const res = await request(server)
        .post('/rooms/room_id_123/user/user_id_123')
        .expect(200);

      expect(res.body).toEqual({});
    });
  });

  describe('DELETE /rooms/:roomId/:userId', () => {
    it('should remove a user from a room', async () => {
      const res = await request(server)
        .delete('/rooms/room_id_123/user/user_id_123')
        .expect(200);

      expect(res.body).toEqual({});
    });
  });

  describe('POST /messages', () => {
    it('should create a new message', async () => {
      const messageData = {
        Uid: 'message_id_123',
        text: 'test message',
      };

      const res = await request(server)
        .post('/messages')
        .send(messageData)
        .expect(201);

      expect(res.body).toEqual({});
    });
  });

  describe('GET /messages', () => {
    it('should retrieve all messages', async () => {
      const res = await request(server)
        .get('/messages')
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /messages/:Uid', () => {
    it('should return a message', async () => {
      const res = await request(server)
        .get('/messages/message_id_123')
        .expect(200);

      expect(res.body).toBeInstanceOf(Object);
    });
  });

  describe('DELETE /messages/:Uid', () => {
    it('should delete a message', async () => {
      const res = await request(server)
        .delete('/messages/message_id_123')
        .expect(200);

      expect(res.body).toEqual({});
    });
  });
});
