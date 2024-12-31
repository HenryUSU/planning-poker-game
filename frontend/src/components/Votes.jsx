import Stack from "@mui/material/Stack";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import IconButton from "@mui/material/IconButton";
import { Box } from "@mui/material";
import { toast } from "react-toastify";
import { socket } from "../components/socket";

export function Votes({
  user,
  voteResult,
  userId,
  sessionIdVar,
  socketId,
  isPM,
}) {
  const handleRemoveUser = () => {
    // Remove user from list
    //  console.log(`username: ${user} userID: ${userId}`);
    socket.emit("kickUser", {
      userId: userId,
      sessionId: sessionIdVar,
      socketId: socketId,
    });
    toast.success(`User ${user} removed from session!`);
  };
  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "start",
        alignItems: "center",
        padding: "5px",
      }}
      direction="row"
      spacing={5}>
      <p>{user}</p>
      <p>{voteResult}</p>
      {isPM && (
        <IconButton
          onClick={handleRemoveUser}
          aria-label="remove user"
          color="error">
          <PersonRemoveIcon />
        </IconButton>
      )}
    </Stack>
  );
}
