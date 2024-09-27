import { Box, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export function AdminButtons({ votesShow, setVotesShow }) {
  const handleShowVotes = () => {
    setVotesShow(true);
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
      <Button variant="outlined" startIcon={<RestartAltIcon />}>
        Reset Votes
      </Button>
    </Box>
  );
}
