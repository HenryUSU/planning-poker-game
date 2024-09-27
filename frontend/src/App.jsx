import { Fragment, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { VotingRoom } from "./pages/VotingRoom";
import { CssBaseline } from "@mui/material";

//MUI components
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function App() {
  const [isDeveloper, setDeveloper] = useState(true);
  return (
    <Fragment>
      <CssBaseline>
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={
                <Login
                  isDeveloper={isDeveloper}
                  setDeveloper={setDeveloper}></Login>
              }></Route>
            <Route
              path="/"
              element={
                <Login
                  isDeveloper={isDeveloper}
                  setDeveloper={setDeveloper}></Login>
              }></Route>
            <Route
              path="/session/123"
              element={
                <VotingRoom isDeveloper={isDeveloper}></VotingRoom>
              }></Route>
          </Routes>
        </BrowserRouter>
        {/* <Login></Login> */}
        {/* <VotingRoom></VotingRoom> */}
      </CssBaseline>
    </Fragment>
  );
}

export default App;
