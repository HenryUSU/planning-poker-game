import Stack from "@mui/material/Stack";

export function Votes({ user, voteResult }) {
  return (
    <Stack
      sx={{
        padding: "5px",
      }}
      direction="row"
      spacing={5}
    >
      <p>{user}</p>
      <p>{voteResult}</p>
    </Stack>
  );
}
