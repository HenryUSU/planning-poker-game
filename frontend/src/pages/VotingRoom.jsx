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
  const [sessionIdVar, setSessionIdVar] = useState("session123");
  const [votes, setvotes] = useState([]);
  // const [hasVoted, setHasVoted] = useState([false]);
  const [votesShow, setVotesShow] = useState(false);

  const filteredVotes = votes.filter((vote) => vote.role === "developer");

  const displayVotes = filteredVotes.map((vote) => {
    if (!votesShow) {
      if (vote.hasVoted) {
        return (
          <Votes key={vote.userId} user={vote.username} voteResult="✔️"></Votes>
        );
      } else {
        return (
          <Votes key={vote.userId} user={vote.username} voteResult="?"></Votes>
        );
      }
    } else {
      return (
        <Votes
          key={vote.userId}
          user={vote.username}
          voteResult={vote.voteResult}></Votes>
      );
    }

    // if (vote.role === "developer") {
    //   return !votesShow ? (
    //     <Votes key={vote.userId} user={vote.username} voteResult="?"></Votes>
    //   ) : (
    //     <Votes
    //       key={vote.userId}
    //       user={vote.username}
    //       voteResult={vote.voteResult}></Votes>
    //   );
    // }
  });

  const calculateAverage = () => {
    let averageVote = 0;
    const filteredVotes = votes.filter((vote) => vote.role === "developer");
    filteredVotes.forEach((vote) => {
      if (vote.voteResult >= 0 && vote.voteResult <= 13) {
        averageVote += vote.voteResult;
      }
    });
    if (votesShow) {
      return averageVote / filteredVotes.length;
    } else {
      return null;
    }
  };
  const sessionId = "session123";
  socket.emit("join-room", {
    sessionId: sessionId,
    userId: user[0].userId,
    username: user[0].username,
    role: user[0].role,
    voteResult: 0,
  });

  useEffect(() => {
    socket.connect();

    console.log(`User from frontend: ${user[0].username}`);
    localStorage.setItem("userId", `${user[0].userId}`);

    socket.on("updateData", ({ users }) => {
      console.log(`Users from backend: ${JSON.stringify(users)}`);
      setvotes(users);
    });

    socket.on("hasVoted", () => {
      //  setHasVoted(true);
    });
    socket.on("votesShown", () => {
      setVotesShow(true);
    });
    socket.on("votesResetted", () => {
      setVotesShow(false);
      // setHasVoted(false);
    });

    return () => {
      socket.off("updateData");
      socket.off("hasVoted");
      socket.off("votesResetted");
      socket.off("votesShown");
    };
  }, []);

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
          <Grid size={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
              }}>
              <Box>Organizer: {!isDeveloper && ` ${user[0].username}`}</Box>
              <Box>Current User: {user[0].username}</Box>
            </Box>
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
                    imgSource={"./svg/1_card.svg"}
                    sessionIdVar={sessionIdVar}></VoteButton>
                  <VoteButton
                    value={2}
                    imgSource={"./svg/2_card.svg"}
                    sessionIdVar={sessionIdVar}></VoteButton>
                  <VoteButton
                    value={3}
                    imgSource={"./svg/3_card.svg"}
                    sessionIdVar={sessionIdVar}></VoteButton>
                  <VoteButton
                    value={5}
                    imgSource={"./svg/5_card.svg"}
                    sessionIdVar={sessionIdVar}></VoteButton>
                  <VoteButton
                    value={8}
                    imgSource={"./svg/8_card.svg"}
                    sessionIdVar={sessionIdVar}></VoteButton>
                  <VoteButton
                    value={13}
                    imgSource={"./svg/13_card.svg"}
                    sessionIdVar={sessionIdVar}></VoteButton>
                  <VoteButton
                    value={"?"}
                    imgSource={"./svg/question_card.svg"}
                    sessionIdVar={sessionIdVar}></VoteButton>
                  <VoteButton
                    value={"Coffee break"}
                    imgSource={"./svg/coffee_card.svg"}
                    sessionIdVar={sessionIdVar}></VoteButton>
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
