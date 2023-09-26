import 'dotenv/config'

const secret = process.env.JWT_SECRET as string;

export default {
  jwtSecret: secret, // Replace with your actual secret key
  jwtExpiration: '1h', // Token expiration time (e.g., 1 hour)
};