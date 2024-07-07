// src/components/VideoCall.js
import React, { useState, useEffect, useRef } from "react";
import {
  joinChannel,
  leaveChannel,
  subscribeUser,
  client,
  toggleTrack,
} from "../AgoraRTC";
import CallControls from "./CallControls";
import { Box, TextField, Typography, Button } from "@mui/material";

const VideoCall = () => {
  const [joined, setJoined] = useState(false);
  const [localTracks, setLocalTracks] = useState([]);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [channel, setChannel] = useState("");
  const [error, setError] = useState("");
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  const localVideoRef = useRef(null);

  const handleJoin = async () => {
    if (!channel.trim()) {
      setError("El nombre de la sala es obligatorio.");
      return;
    }
    setError("");
    const [audioTrack, videoTrack] = await joinChannel(
      channel,
      null,
      null,
      handleUserPublished
    );
    setLocalTracks([audioTrack, videoTrack]);
    setJoined(true);
  };

  const handleLeave = async () => {
    localTracks.forEach((track) => track.close());
    await leaveChannel();
    setLocalTracks([]);
    setRemoteUsers([]);
    setJoined(false);
  };

  const handleUserPublished = async (user, mediaType) => {
    await subscribeUser(user, handleTrackSubscribed);
  };

  const handleTrackSubscribed = (user) => {
    setRemoteUsers((prevUsers) => [...prevUsers, user]);
  };

  const handleToggleCamera = () => {
    const videoTrack = localTracks.find(
      (track) => track.trackMediaType === "video"
    );
    if (videoTrack) {
      toggleTrack(videoTrack);
      setIsCameraOn(!isCameraOn);
    }
  };

  const handleToggleMic = () => {
    const audioTrack = localTracks.find(
      (track) => track.trackMediaType === "audio"
    );
    if (audioTrack) {
      toggleTrack(audioTrack);
      setIsMicOn(!isMicOn);
    }
  };

  useEffect(() => {
    if (localVideoRef.current && localTracks[1]) {
      localTracks[1].play(localVideoRef.current);
    }
    return () => {
      localTracks.forEach((track) => track.close());
      remoteUsers.forEach((user) => user.videoTrack && user.videoTrack.stop());
    };
  }, [localTracks, remoteUsers]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      {!joined && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <TextField
            label="Nombre de la Sala"
            variant="outlined"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            error={Boolean(error)}
            helperText={error}
            sx={{ width: 300 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleJoin}
            sx={{ width: 200 }}
          >
            Crear llamada
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleJoin}
            sx={{ width: 200 }}
          >
            Unirse a la llamada
          </Button>
        </Box>
      )}
      {joined && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            ref={localVideoRef}
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: "60vh",
              backgroundColor: "black",
              marginBottom: 2,
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "center",
            }}
          >
            {remoteUsers.map((user, index) => (
              <Box
                key={index}
                ref={(ref) => {
                  if (ref && user.videoTrack) {
                    user.videoTrack.play(ref);
                  }
                }}
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "60vh",
                  backgroundColor: "black",
                }}
              />
            ))}
          </Box>
          <CallControls
            onJoin={handleJoin}
            onLeave={handleLeave}
            joined={joined}
            onToggleCamera={handleToggleCamera}
            onToggleMic={handleToggleMic}
            isCameraOn={isCameraOn}
            isMicOn={isMicOn}
          />
        </Box>
      )}
    </Box>
  );
};

export default VideoCall;
