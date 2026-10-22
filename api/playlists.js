import express from "express";
const playlistsRouter = express.Router();
export default playlistsRouter;

import {
  createPlaylist,
  getPlaylistById,
  getPlaylists,
} from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId } from "#db/queries/tracks";
import requireUser from "#middleware/requireUser";

playlistsRouter.use(requireUser);

playlistsRouter.get("/", async (req, res) => {
  const playlists = await getPlaylists(req.user.id);
  res.send(playlists);
});

playlistsRouter.post("/", async (req, res) => {
  if (!req.body) return res.status(400).send("Request body is required.");

  const { name, description } = req.body;
  if (!name || !description)
    return res.status(400).send("Request body requires: name, description");

  const playlist = await createPlaylist(name, description, req.user.id);
  res.status(201).send(playlist);
});

playlistsRouter.param("id", async (req, res, next, id) => {
  const playlist = await getPlaylistById(id);
  if (!playlist) return res.status(404).send("Playlist not found.");
  req.playlist = playlist;
  next();
});

playlistsRouter.get("/:id", (req, res) => {
  if (req.playlist.owner_id !== req.user.id) {
    return res.status(403).send("You are unauthorized to view this playlist");
  }

  res.send(req.playlist);
});

playlistsRouter.get("/:id/tracks", async (req, res) => {
  if (req.playlist.owner_id !== req.user.id) {
    return res.status(403).send("You are unauthorized to view this playlist");
  }

  const tracks = await getTracksByPlaylistId(req.playlist.id);
  res.send(tracks);
});

playlistsRouter.post("/:id/tracks", async (req, res) => {
  if (req.playlist.owner_id !== req.user.id) {
    return res.status(403).send("You are unauthorized to view this playlist");
  }

  if (!req.body) return res.status(400).send("Request body is required.");

  const { trackId } = req.body;
  if (!trackId) return res.status(400).send("Request body requires: trackId");

  const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
  res.status(201).send(playlistTrack);
});
