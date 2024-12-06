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
import { ThemeProvider } from "@mui/material";
import { theme } from "./components/theme";

//MUI components
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function App() {
  const [isPM, setPM] = useState(false);
  const [isDeveloper, setDeveloper] = useState(true);
  const [isObserver, setObserver] = useState(false);
  const [user, setUser] = useState([]);
  const [sessionIdVar, setSessionIdVar] = useState("");
  const [userMustVote, setUserMustVote] = useState(false);
  return (
    <Fragment>
      <CssBaseline>
        <ThemeProvider theme={theme}>
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
                path="/app/login"
                element={
                  <Login
                    isPM={isPM}
                    setPM={setPM}
                    isDeveloper={isDeveloper}
                    setDeveloper={setDeveloper}
                    setObserver={setObserver}
                    isObserver={isObserver}
                    user={user}
                    setUser={setUser}
                    sessionIdVar={sessionIdVar}
                    setSessionIdVar={setSessionIdVar}
                    userMustVote={userMustVote}
                    setUserMustVote={setUserMustVote}
                  ></Login>
                }
              ></Route>
              <Route
                path="/app/login/:id"
                element={
                  <Login
                    isPM={isPM}
                    setPM={setPM}
                    isDeveloper={isDeveloper}
                    setDeveloper={setDeveloper}
                    setObserver={setObserver}
                    isObserver={isObserver}
                    setUser={setUser}
                    user={user}
                    sessionIdVar={sessionIdVar}
                    setSessionIdVar={setSessionIdVar}
                    userMustVote={userMustVote}
                    setUserMustVote={setUserMustVote}
                  ></Login>
                }
              ></Route>

              <Route
                path="/app/"
                element={
                  <Login
                    isPM={isPM}
                    setPM={setPM}
                    isDeveloper={isDeveloper}
                    setDeveloper={setDeveloper}
                    setObserver={setObserver}
                    isObserver={isObserver}
                    setUser={setUser}
                    user={user}
                    setSessionIdVar={setSessionIdVar}
                    userMustVote={userMustVote}
                    setUserMustVote={setUserMustVote}
                  ></Login>
                }
              ></Route>
              <Route
                path="/app/session"
                element={
                  <VotingRoom
                    isPM={isPM}
                    setPM={setPM}
                    isDeveloper={isDeveloper}
                    setUser={setUser}
                    user={user}
                    isObserver={isObserver}
                    setObserver={setObserver}
                    sessionIdVar={sessionIdVar}
                    setSessionIdVar={setSessionIdVar}
                    userMustVote={userMustVote}
                    setUserMustVote={setUserMustVote}
                  ></VotingRoom>
                }
              ></Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </CssBaseline>
    </Fragment>
  );
}

export default App;
