import { Fragment, useState } from "react";
import Button from "@mui/material/Button";
import { Login } from "./pages/Login";
import { VotingRoom } from "./pages/VotingRoom";

//MUI components
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function App() {
  return (
    <Fragment>
      {/* <Login></Login> */}
      <VotingRoom></VotingRoom>
    </Fragment>
  );
}

export default App;
