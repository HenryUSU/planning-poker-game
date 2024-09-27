import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

export const VoteButton = ({ value }) => {
  const handleClick = () => {
    console.log(`Vote: ${value}`);
  };
  return (
    <Box onClick={handleClick}>
      <Paper
        elevation={2}
        sx={{
          "&:hover": {
            boxShadow: 15,
            cursor: "pointer",
          },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 128,
          height: 256,
          m: 1,
          backgroundColor: "#2196f3",
        }}>
        {value}{" "}
      </Paper>
    </Box>
  );
};
