import db from "#db/client";

export async function createPlaylistTrack(playlistId, trackId) {
  const sql = `
  INSERT INTO playlists_tracks
    (playlist_id, track_id)
  VALUES
    ($1, $2)
  RETURNING *
  `;
  const {
    rows: [playlistTrack],
  } = await db.query(sql, [playlistId, trackId]);
  return playlistTrack;
}

export async function getPlaylistsFromTracks(trackId, userId) {
  const sql = `
    SELECT pl.*
    FROM playlists_tracks AS plt
    JOIN playlists AS pl ON plt.playlist_id = pl.id
    WHERE plt.track_id = $1
      AND pl.owner_id = $2; 
  `;

  const { rows: playlists } = await db.query(sql, [trackId, userId]);
  return playlists;
}
