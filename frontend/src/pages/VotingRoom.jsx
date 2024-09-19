import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { Votes } from "../components/Votes";

export function VotingRoom() {
  return (
    <Box>
      <Box sx={{ flexGrow: 1, height: "100vh", width: "100vw" }}>
        <Grid container spacing={2}>
          {/* Header */}
          <Grid size={12}>
            <Typography
              sx={{
                textAlign: "center",
              }}
              variant="h2"
              gutterBottom>
              Planning Poker Game
            </Typography>
          </Grid>
          <Grid size={3}></Grid>
          <Grid size={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                alignItems: "start",
                gap: "10px",
                border: "1px solid black",
                padding: "15px",
              }}>
              <Typography variant="h4">Votes</Typography>
              <Box>
                <Votes user={"Max"} voteResult={"5"}></Votes>
              </Box>
            </Box>
            Average: 15
          </Grid>
          <Grid size={3}></Grid>
          {/* Footer */}
          <Grid size={12}></Grid>
        </Grid>
      </Box>
    </Box>
  );
}
