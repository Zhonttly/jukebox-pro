import express from "express";
const usersRouter = express.Router();
export default usersRouter;

import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";
import { createUser, getUserByUsernameAndPassword } from "#db/queries/users";

usersRouter
  .route("/register")
  .post(requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;

    const user = await createUser(username, password);
    const token = createToken({ id: user.id, username: user.username });

    res.status(201).send(token);
  });

usersRouter
  .route("/login")
  .post(requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;

    const user = await getUserByUsernameAndPassword(username, password);
    if (!user) {
      return res.status(401).send("Invalid email or password.");
    }

    const token = createToken({ id: user.id, username: user.username });
    res.send(token);
  });
