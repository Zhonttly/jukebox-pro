import db from "#db/client";
import bcrypt from "bcrypt";

// Create a new user
export async function createUser(username, password) {
  const sql = `
  INSERT INTO users
    (username, password)
  VALUES
    ($1, $2)
  RETURNING *
  `;

  const hashedPassword = await bcrypt.hash(password, 11);

  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);
  return user;
}

// Get a user by id
export async function getUserById(id) {
  const sql = `
    SELECT *
    FROM users
    WHERE id = $1
  `;

  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}

export async function getUserByUsernameAndPassword(username, password) {
  const sql = `
    SELECT * 
    FROM users
    WHERE username = $1;
  `;

  const {
    rows: [user],
  } = await db.query(sql, [username]);

  // Verify password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return null;
  }

  return user;
}
