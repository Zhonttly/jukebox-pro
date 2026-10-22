import db from "#db/client";

export async function createPlaylist(name, description, user_id) {
  const sql = `
  INSERT INTO playlists
    (name, description, owner_id)
  VALUES
    ($1, $2, $3)
  RETURNING *
  `;
  const {
    rows: [playlist],
  } = await db.query(sql, [name, description, user_id]);
  return playlist;
}

export async function getPlaylists(owner_id) {
  const sql = `
  SELECT *
  FROM playlists
  WHERE owner_id = $1
  `;
  const { rows: playlists } = await db.query(sql, [owner_id]);
  return playlists;
}

export async function getPlaylistById(id) {
  const sql = `
  SELECT *
  FROM playlists
  WHERE id = $1
  `;
  const {
    rows: [playlist],
  } = await db.query(sql, [id]);
  return playlist;
}
