// src/components/CallControls.js
import React from "react";
import { Button, Box, IconButton } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

const CallControls = ({
  onJoin,
  onLeave,
  joined,
  onToggleCamera,
  onToggleMic,
  isCameraOn,
  isMicOn,
}) => {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 2 }}
    >
      {!joined && (
        <Button
          variant="contained"
          color="primary"
          onClick={onJoin}
          sx={{ width: 200 }}
        >
          Unirse a la llamada
        </Button>
      )}
      {joined && (
        <>
          <IconButton onClick={onToggleCamera} color="primary">
            {isCameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
          </IconButton>
          <IconButton onClick={onToggleMic} color="primary">
            {isMicOn ? <MicIcon /> : <MicOffIcon />}
          </IconButton>
          <Button
            variant="contained"
            color="secondary"
            onClick={onLeave}
            sx={{ width: 200 }}
          >
            Salir de la llamada
          </Button>
        </>
      )}
    </Box>
  );
};

export default CallControls;
