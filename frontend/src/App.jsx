import { Fragment, useState } from "react"; // Added useState import
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { theme } from "./components/theme";
import { Login } from "./pages/Login";
import { VotingRoom } from "./pages/VotingRoom";

// MUI fonts
// import "@fontsource/roboto/300.css";
// import "@fontsource/roboto/400.css";
// import "@fontsource/roboto/500.css";
// import "@fontsource/roboto/700.css";
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
/>;

const TOAST_CONFIG = {
  position: "top-left",
  autoClose: 4000,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: false,
  pauseOnHover: false,
  theme: "light",
  transition: Bounce,
};

function App() {
  const [userState, setUserState] = useState({
    isPM: false,
    isDeveloper: true,
    isObserver: false,
    user: [],
    sessionIdVar: "",
    userMustVote: false,
  });

  const updateUserState = (updates) => {
    setUserState((prev) => ({ ...prev, ...updates }));
  };

  const commonProps = {
    ...userState,
    setPM: (value) => updateUserState({ isPM: value }),
    setDeveloper: (value) => updateUserState({ isDeveloper: value }),
    setObserver: (value) => updateUserState({ isObserver: value }),
    setUser: (value) => updateUserState({ user: value }),
    setSessionIdVar: (value) => updateUserState({ sessionIdVar: value }),
    setUserMustVote: (value) => updateUserState({ userMustVote: value }),
  };

  return (
    <Fragment>
      <CssBaseline>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <ToastContainer {...TOAST_CONFIG} />
            <Routes>
              <Route path="/app/login" element={<Login {...commonProps} />} />
              <Route
                path="/app/login/:id"
                element={<Login {...commonProps} />}
              />
              <Route path="/app/" element={<Login {...commonProps} />} />
              <Route
                path="/app/session"
                element={<VotingRoom {...commonProps} />}
              />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </CssBaseline>
    </Fragment>
  );
}

export default App;
