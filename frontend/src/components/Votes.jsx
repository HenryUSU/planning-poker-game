import Stack from "@mui/material/Stack";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import IconButton from "@mui/material/IconButton";
import { Box } from "@mui/material";

export function Votes({ user, voteResult }) {
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
      spacing={5}
    >
      <p>{user}</p>
      <p>{voteResult}</p>
      {/* <IconButton aria-label="remove user">
        <PersonRemoveIcon />
      </IconButton> */}
    </Stack>
  );
}
