import { Box } from "@mui/material";

export const VoteCounter = ({ votes, votesShow }) => {
  //create object to store vote counts
  const getVoteCounts = () => {
    const voteCounts = {};

    //count occurences for each vote value
    votes.forEach((vote) => {
      if (vote.voteResult > 0 && vote.role === "developer") {
        voteCounts[vote.voteResult] = (voteCounts[vote.voteResult] || 0) + 1;
      }
    });
    //console.log(voteCounts);
    return voteCounts;
  };

  // Convert vote counts to array for easier rendering
  const renderVoteCounts = () => {
    const voteCounts = getVoteCounts();

    if (votes && votes.length > 0 && votesShow) {
      return Object.entries(voteCounts).map(([value, count]) => (
        <div key={value}>
          {count} x {value} SP
        </div>
      ));
    }
  };

  return (
    <Box>
      <b>Vote distribution:</b>
      {renderVoteCounts()}
    </Box>
  );
};
