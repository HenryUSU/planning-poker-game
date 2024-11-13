import { Box, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { socket } from "../components/socket";
import { toast } from "react-toastify";
import { useState } from "react";

export function AdminButtons({
  votesShow,
  setVotesShow,
  sessionIdVar,
  buttonDisabled,
  setButtonDisabled,
  userMustVote,
}) {
  //emits message to backend with session id to show votes for all users
  const handleShowVotes = () => {
    socket.emit("showVotes", { sessionId: sessionIdVar });
    toast.success(`Votes shown!`);
    // setVotesShow(true);
  };

  //emits message with session id to backend to reset all vote results
  const handleResetVotes = () => {
    socket.emit("resetVote", { sessionId: sessionIdVar });
    toast.success(`Votes resetted!`);
    if (userMustVote) {
      setButtonDisabled(true);
    }

    // setVotesShow(false);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        m: 2,
      }}
    >
      <Button
        onClick={handleShowVotes}
        variant="contained"
        disabled={buttonDisabled}
        startIcon={<VisibilityIcon />}
      >
        Show Votes
      </Button>
      <Button
        onClick={handleResetVotes}
        variant="outlined"
        startIcon={<RestartAltIcon />}
      >
        Reset Votes
      </Button>
    </Box>
  );
}
