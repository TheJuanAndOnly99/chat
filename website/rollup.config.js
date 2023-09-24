import dotenv from 'dotenv';
import replace from '@rollup/plugin-replace';

// Load environment variables from .env file
dotenv.config();

export default {
  // ...
  plugins: [
    // ...
    replace({
      process: JSON.stringify({
        env: {
          SERVER_URL: process.env.SERVER_URL,
        },
      }),
    }),
  ],
};