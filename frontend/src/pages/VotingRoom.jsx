import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { Votes } from "../components/Votes";
import { Fragment, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { VoteButton } from "../components/VoteButton";
import { AdminButtons } from "../components/AdminButtons";
import { socket } from "../components/socket";
import { useEffect } from "react";

export function VotingRoom({ isDeveloper, user, setUser }) {
  useEffect(() => {
    socket.connect();
    //socket.emit("testEvent", "Hello from frontend");
    console.log(`User from frontend: ${user[0].username}`);
    socket.emit("user_joined", {
      userId: user[0].userId,
      username: user[0].username,
      role: user[0].role,
    });
    socket.on("user_joined", (msg) => {
      console.log(`User from backend: ${msg.user}`);
      setvotes((prevVotes) => [...prevVotes, msg]);
    });
  }, []);

  const [votes, setvotes] = useState([
    {
      id: uuidv4(),
      user: "Max",
      voteResult: 2,
    },
    {
      id: uuidv4(),
      user: "Tom",
      voteResult: 3,
    },
  ]);
  const [votesShow, setVotesShow] = useState(false);

  const displayVotes = votes.map((vote) => {
    return !votesShow ? (
      <Votes key={vote.id} user={vote.user} voteResult="?"></Votes>
    ) : (
      <Votes
        key={vote.id}
        user={vote.user}
        voteResult={vote.voteResult}></Votes>
    );
  });

  const calculateAverage = () => {
    let averageVote = 0;
    votes.forEach((vote) => {
      if (vote.voteResult >= 0 && vote.voteResult <= 13) {
        averageVote += vote.voteResult;
      }
    });
    if (votesShow) {
      return averageVote / votes.length;
    } else {
      return null;
    }
  };

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
                {/* <Votes user={"Max"} voteResult={"5"}></Votes> */}
                {displayVotes}
              </Box>
            </Box>
            Average: {calculateAverage()}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}>
              {" "}
              {isDeveloper ? (
                <Fragment>
                  <VoteButton value={1}></VoteButton>
                  <VoteButton value={2}></VoteButton>
                  <VoteButton value={3}></VoteButton>
                  <VoteButton value={5}></VoteButton>
                  <VoteButton value={7}></VoteButton>
                  <VoteButton value={13}></VoteButton>
                </Fragment>
              ) : (
                <AdminButtons
                  votesShow={votesShow}
                  setVotesShow={setVotesShow}></AdminButtons>
              )}
            </Box>
          </Grid>
          <Grid size={3}></Grid>
          {/* Footer */}
          <Grid size={12}></Grid>
        </Grid>
      </Box>
    </Box>
  );
}
