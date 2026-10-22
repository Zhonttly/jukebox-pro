import express from "express";
const tracksRouter = express.Router();
export default tracksRouter;

import { getTracks, getTrackById } from "#db/queries/tracks";
import { getPlaylistsFromTracks } from "#db/queries/playlists_tracks";

import requireUser from "#middleware/requireUser";

tracksRouter.get("/", async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

tracksRouter.get("/:id", async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");
  res.send(track);
});

tracksRouter.get("/:id/playlists", requireUser, async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");

  const tracks = await getPlaylistsFromTracks(req.params.id, req.user.id);
  if (!tracks)
    return res
      .status(404)
      .send("No playlists found with this track for the user");

  res.send(tracks);
});
