import express, { Request, Response, Router } from 'express';

import { UserCreator } from '../../Users/application/UserCreator';
import { UserRepository } from '../../Users/domain/UserRepository';
import { UserCreatorRequest } from '../../Users/application/requests/UserCreatorRequest';

const userRouter: Router = express.Router();

const userRepository: UserRepository = new YourUserRepositoryImplementation(); // Replace with your UserRepository implementation
const userCreator: UserCreator = new UserCreator(userRepository);

userRouter.post('/register', async (req: Request, res: Response) => {
  const { id, username, email, password } = req.body;

  try {
    // Check if the user with the same email already exists
    const existingUser = await UserModel.findOne({ email }).exec();
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Create a new user using the UserCreator class
    await userCreator.create({
      id,
      username,
      email,
      password,
    });

    // Respond with success message
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default userRouter;




