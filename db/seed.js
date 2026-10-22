import db from "#db/client";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import { createUser } from "./queries/users.js";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const user1 = await createUser("user_1", "abc123");
  const user2 = await createUser("user_2", "xyz321");
  let user;

  for (let i = 1; i <= 20; i++) {
    i % 2 === 0 ? (user = user2) : (user = user1);
    await createPlaylist(
      "Playlist " + i,
      "lorem ipsum playlist description",
      user.id,
    );
    await createTrack("Track " + i, i * 50000);
  }
  for (let i = 1; i <= 15; i++) {
    const playlistId = 1 + Math.floor(i / 2);
    await createPlaylistTrack(playlistId, i);
  }
}
