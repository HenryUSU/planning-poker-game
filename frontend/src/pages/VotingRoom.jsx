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
  const sessionId = "session123";
  useEffect(() => {
    socket.connect();

    console.log(`User from frontend: ${user[0].username}`);
    localStorage.setItem("userId", `${user[0].userId}`);

    socket.emit("join-room", {
      sessionId: sessionId,
      userId: user[0].userId,
      username: user[0].username,
      role: user[0].role,
      voteResult: 0,
    });

    socket.on("room-joined", ({ users }) => {
      console.log(`Users from backend: ${JSON.stringify(users)}`);
      setvotes(users);
    });

    socket.on("votesShown", () => {
      setVotesShow(true);
    });
    socket.on("votesResetted", () => {
      setVotesShow(false);
    });

    return () => {
      socket.off("room-joined");
      socket.off("votesResetted");
      socket.off("votesShown");
    };
  }, []);

  const [sessionIdVar, setSessionIdVar] = useState("session123");
  const [votes, setvotes] = useState([]);
  const [votesShow, setVotesShow] = useState(false);

  const displayVotes = votes.map((vote) => {
    return !votesShow ? (
      <Votes key={vote.userId} user={vote.username} voteResult="?"></Votes>
    ) : (
      <Votes
        key={vote.userId}
        user={vote.username}
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
          <Grid size={4}></Grid>
          <Grid size={5}>
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
                  <VoteButton
                    value={1}
                    imgSource={"./svg/1_card.svg"}></VoteButton>
                  <VoteButton
                    value={2}
                    imgSource={"./svg/2_card.svg"}></VoteButton>
                  <VoteButton
                    value={3}
                    imgSource={"./svg/3_card.svg"}></VoteButton>
                  <VoteButton
                    value={5}
                    imgSource={"./svg/5_card.svg"}></VoteButton>
                  <VoteButton
                    value={8}
                    imgSource={"./svg/8_card.svg"}></VoteButton>
                  <VoteButton
                    value={13}
                    imgSource={"./svg/13_card.svg"}></VoteButton>
                  <VoteButton
                    value={"?"}
                    imgSource={"./svg/question_card.svg"}></VoteButton>
                  <VoteButton
                    value={"Coffee break"}
                    imgSource={"./svg/coffee_card.svg"}></VoteButton>
                </Fragment>
              ) : (
                <AdminButtons
                  votesShow={votesShow}
                  setVotesShow={setVotesShow}
                  sessionIdVar={sessionIdVar}></AdminButtons>
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
