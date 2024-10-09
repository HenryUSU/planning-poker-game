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
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import { toast } from "react-toastify";
import QRCode from "react-qr-code";

export function VotingRoom({
  isDeveloper,
  user,
  setUser,
  sessionIdVar,
  setSessionIdVar,
}) {
  const [votes, setvotes] = useState([]);
  // const [hasVoted, setHasVoted] = useState([false]);
  const [votesShow, setVotesShow] = useState(false);
  const [organizer, setOrganizer] = useState("");

  const filteredVotes = votes.filter((vote) => vote.role === "developer");

  //display username and vote. If vote is empty, display ?. If dev has voted, display checkmark. Admin show results via voteshow = true
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
          voteResult={vote.voteResult}
        ></Votes>
      );
    }
  });

  //calculates the average of all votes from developers
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

  //when there is no sessionID, send emit to backend to create one
  if (!sessionIdVar) {
    socket.emit("createSessionId", {});
  }

  //new users join a room and emit data to backend
  socket.emit("join-room", {
    sessionId: sessionIdVar,
    userId: user[0].userId,
    username: user[0].username,
    role: user[0].role,
    voteResult: 0,
  });

  //if organizer is not set in frontend, try to get it from backend
  if (!organizer) {
    socket.emit("getOrganizer", {
      sessionId: sessionIdVar,
    });
  }

  //copy session id incl url to clipbboard
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_FRONTEND_URL}/login/${sessionIdVar}`
    );
    toast.success(`Session Id copied successfully!`);
  };

  useEffect(() => {
    socket.connect();

    //console.log(`User from frontend: ${user[0].username}`);

    //save userId in localstorage
    localStorage.setItem("userId", `${user[0].userId}`);

    //receive generate session id from backend
    socket.on("sessionIdGenerated", ({ sessionId }) => {
      // console.log(`generated sessionId from backend: ${sessionId}`);
      setSessionIdVar(sessionId);
    });

    //receive updated data from backend to update frontend for all users
    socket.on("updateData", ({ users }) => {
      // console.log(`Users from backend: ${JSON.stringify(users)}`);
      setvotes(users);
    });

    //show votes for all users
    socket.on("votesShown", () => {
      setVotesShow(true);
    });

    //reset votes for all users
    socket.on("votesResetted", () => {
      setVotesShow(false);
    });

    // receive organizer from backend and update frontend for all users
    socket.on("setOrganizer", ({ username }) => {
      //console.log(`organizer from backend: ${JSON.stringify(username)}`);
      setOrganizer(username);
    });

    //remove event listener for socketrs
    return () => {
      socket.off("sessionIdGenerated");
      socket.off("updateData");
      socket.off("hasVoted");
      socket.off("votesResetted");
      socket.off("votesShown");
      socket.off("setOrganizer");
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
              gutterBottom
            >
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
              }}
            >
              <Box>Organizer: {organizer}</Box>
              <Box>Current User: {user[0].username}</Box>
              <Box>
                Room Id: {sessionIdVar}{" "}
                <IconButton
                  color="primary"
                  aria-label="copy sessionId"
                  onClick={handleCopyToClipboard}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Box>
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
              }}
            >
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
              }}
            >
              {" "}
              {/* Show vote buttons if role is developer or show admin buttons if role is productmanager  */}
              {isDeveloper ? (
                <Fragment>
                  <VoteButton
                    value={1}
                    imgSource={"./svg/1_card.svg"}
                    sessionIdVar={sessionIdVar}
                  ></VoteButton>
                  <VoteButton
                    value={2}
                    imgSource={"./svg/2_card.svg"}
                    sessionIdVar={sessionIdVar}
                  ></VoteButton>
                  <VoteButton
                    value={3}
                    imgSource={"./svg/3_card.svg"}
                    sessionIdVar={sessionIdVar}
                  ></VoteButton>
                  <VoteButton
                    value={5}
                    imgSource={"./svg/5_card.svg"}
                    sessionIdVar={sessionIdVar}
                  ></VoteButton>
                  <VoteButton
                    value={8}
                    imgSource={"./svg/8_card.svg"}
                    sessionIdVar={sessionIdVar}
                  ></VoteButton>
                  <VoteButton
                    value={13}
                    imgSource={"./svg/13_card.svg"}
                    sessionIdVar={sessionIdVar}
                  ></VoteButton>
                  <VoteButton
                    value={"?"}
                    imgSource={"./svg/question_card.svg"}
                    sessionIdVar={sessionIdVar}
                  ></VoteButton>
                  <VoteButton
                    value={"Coffee break"}
                    imgSource={"./svg/coffee_card.svg"}
                    sessionIdVar={sessionIdVar}
                  ></VoteButton>
                </Fragment>
              ) : (
                <AdminButtons
                  votesShow={votesShow}
                  setVotesShow={setVotesShow}
                  sessionIdVar={sessionIdVar}
                ></AdminButtons>
              )}
            </Box>
          </Grid>
          <Grid size={3}></Grid>
          {/* Footer */}
          <Grid size={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                m: 1,
              }}
            >
              {" "}
              Join Session via QR code:
            </Box>
            <Box
              sx={{
                height: "auto",
                margin: "0 auto",
                maxWidth: 64,
                width: "100%",
              }}
            >
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={`${
                  import.meta.env.VITE_FRONTEND_URL
                }/login/${sessionIdVar}`}
                viewBox={`0 0 256 256`}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
