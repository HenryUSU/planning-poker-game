import { Fragment, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { Login } from "./pages/Login";
import { VotingRoom } from "./pages/VotingRoom";
import { CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//MUI components
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function App() {
  const [isDeveloper, setDeveloper] = useState(true);
  const [user, setUser] = useState([]);
  const [sessionIdVar, setSessionIdVar] = useState("");
  return (
    <Fragment>
      <CssBaseline>
        <BrowserRouter>
          <ToastContainer
            position="top-left"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover={false}
            theme="light"
            transition:Bounce
          />
          <Routes>
            <Route
              path="/login"
              element={
                <Login
                  isDeveloper={isDeveloper}
                  setDeveloper={setDeveloper}
                  setUser={setUser}
                  sessionIdVar={sessionIdVar}
                  setSessionIdVar={setSessionIdVar}></Login>
              }></Route>
            <Route
              path="/login/:id"
              element={
                <Login
                  isDeveloper={isDeveloper}
                  setDeveloper={setDeveloper}
                  setUser={setUser}
                  sessionIdVar={sessionIdVar}
                  setSessionIdVar={setSessionIdVar}></Login>
              }></Route>

            <Route
              path="/"
              element={
                <Login
                  isDeveloper={isDeveloper}
                  setDeveloper={setDeveloper}
                  user={user}
                  setUser={setUser}
                  sessionIdVar={sessionIdVar}
                  setSessionIdVar={setSessionIdVar}></Login>
              }></Route>
            <Route
              path="/session"
              element={
                <VotingRoom
                  isDeveloper={isDeveloper}
                  user={user}
                  setUser={setUser}
                  sessionIdVar={sessionIdVar}
                  setSessionIdVar={setSessionIdVar}></VotingRoom>
              }></Route>
          </Routes>
        </BrowserRouter>
      </CssBaseline>
    </Fragment>
  );
}

export default App;
