import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

export const VoteButton = ({ value, imgSource }) => {
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
            transform: "scale(1.1, 1.1)",
          },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 153,
          height: 228,
          m: 1,
          border: "1px solid black",
          borderRadius: "5%",
          backgroundColor: "#000000",
        }}
      >
        <img
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "5%",
            objectFit: "contain",
          }}
          src={imgSource}
        ></img>
      </Paper>
    </Box>
  );
};
