import { Box, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { socket } from "../components/socket";

export function AdminButtons({ votesShow, setVotesShow, sessionIdVar }) {
  const handleShowVotes = () => {
    socket.emit("showVotes", { sessionId: sessionIdVar });
    // setVotesShow(true);
  };

  const handleResetVotes = () => {
    socket.emit("resetVote", { sessionId: sessionIdVar });
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
      }}>
      <Button
        onClick={handleShowVotes}
        variant="contained"
        startIcon={<VisibilityIcon />}>
        Show Votes
      </Button>
      <Button
        onClick={handleResetVotes}
        variant="outlined"
        startIcon={<RestartAltIcon />}>
        Reset Votes
      </Button>
    </Box>
  );
}
