import { Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { socket } from "../components/socket";
import Switch from "@mui/material/Switch";

export function Login({
  isPM,
  setPM,
  isDeveloper,
  setDeveloper,
  setObserver,
  isObserver,
  setUser,
  setSessionIdVar,
  userMustVote,
  setUserMustVote,
}) {
  const formRef = useRef();
  const navigator = useNavigate();
  const [inputErrorUsername, setInputErrorUsername] = useState(false);
  const [inputErrorSessionId, setInputErrorSessionId] = useState(false);
  const [helperTextUsername, setHelperTextUsername] = useState("");
  const [helperTextSession, setHelperTextSession] = useState("");
  const [switchState, setSwitchState] = useState(false);

  //get session id from URL param
  const { id } = useParams();

  //check if username is already in use for desired session
  const handleUserNameCheck = (e) => {
    e.preventDefault();

    if (
      formRef?.current?.username?.value.trim() &&
      formRef?.current?.session?.value.trim()
    ) {
      const usernameRef = formRef.current.username.value.trim();
      const sessionIdRef = formRef.current.session.value.trim();
      socket.emit("checkUsername", {
        sessionId: sessionIdRef,
        username: usernameRef,
      });
      socket.on("UsernameChecked", ({ foundDuplicateUser }) => {
        //console.log(`Found duplicate username: ${foundDuplicateUser}`);
        if (foundDuplicateUser) {
          // toast.error("Username already in use in active session!");
          setHelperTextUsername("Username already in use in active session!");
          setInputErrorUsername(true);
          return;
        } else {
          setHelperTextUsername("");
          setInputErrorUsername(false);
        }
      });
    }
  };

  //check if sessionId exists in backend
  const handleSessionIdCheck = (e) => {
    e.preventDefault();

    if (formRef.current.session.value.trim()) {
      const sessionIdRef = formRef.current.session.value.trim();
      socket.emit("checkSessionId", {
        sessionId: sessionIdRef,
      });
      socket.on("SessionIdChecked", ({ foundValidSessionId }) => {
        //  console.log(`Valid session ID: ${foundValidSessionId}`);
        if (!foundValidSessionId) {
          setHelperTextSession("Session ID must be valid!");
          setInputErrorSessionId(true);
        } else {
          setHelperTextSession("");
          setInputErrorSessionId(false);
        }
      });
    }
  };

  //Depending on selected radiogroup, show different controls in form
  const handleDeveloperToggle = (e) => {
    e.preventDefault();
    if (formRef.current.radiogroup.value === "developer") {
      setPM(false);
      setDeveloper(true);
      setObserver(false);
    }
    if (formRef.current.radiogroup.value === "observer") {
      setPM(false);
      setObserver(true);
      setDeveloper(false);
    }
    if (formRef.current.radiogroup.value === "productmanager") {
      setPM(true);
      setObserver(false);
      setDeveloper(false);
    }
  };

  //set value of switch if users must vote to enable show votes button
  const handleSwitch = (e) => {
    setSwitchState(e.target.checked);
    //  console.log(`Switch value: ${e.target.checked}`);
    setUserMustVote(e.target.checked);
  };

  //checks for submitting the form and proceding to VotingRoom page
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = formRef.current;

    //form validation for role productmanager
    if (form.radiogroup.value === "productmanager") {
      if (!form.username.value.trim()) {
        //  toast.error(`Username is required!`);
        setHelperTextUsername("Username is required!");
        setInputErrorUsername(true);
        return;
      }
    }

    //form validation for developer
    if (
      form.radiogroup.value === "developer" ||
      form.radiogroup.value === "observer"
    ) {
      if (!form.username.value.trim()) {
        //  toast.error(`Username is required!`);
        setHelperTextUsername("Username is required!");
        setInputErrorUsername(true);
        return;
      }
      if (!form.session.value.trim()) {
        // toast.error(`Session Id is required!`);
        setHelperTextSession("A session ID is required!");
        setInputErrorSessionId(true);
        return;
      }
    }

    // console.log(`username: ${form.username.value}`);
    // console.log(`role: ${form.radiogroup.value}`);

    //generate userId, get username and role from Textinput
    if (inputErrorUsername || inputErrorSessionId) {
      return;
    }
    setUser([
      {
        userId: uuidv4(),
        username: form.username.value,
        role: form.radiogroup.value,
      },
    ]);

    // set session Id from input field
    if (
      formRef.current.radiogroup.value === "developer" ||
      formRef.current.radiogroup.value === "observer"
    ) {
      setSessionIdVar(form.session.value.trim());
    }

    navigator("/app/session");
  };

  //reset error state from form validation
  const handleResetForm = (e) => {
    e.preventDefault();
    setInputErrorSessionId(false);
    setInputErrorUsername(false);
    setHelperTextUsername("");
    setHelperTextSession("");
    setSwitchState(false);
    formRef.current.username.value = "";
    if (formRef.current.session) {
      formRef.current.session.value = "";
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
            >
              Planning Poker Game
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
              }}
              variant="subtitle1"
              gutterBottom
            >
              v1.2 - © Henry Michel
            </Typography>
          </Grid>
          <Grid size={{ xs: 0, md: 4 }}></Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              component="form"
              ref={formRef}
              onSubmit={(e) => {
                handleSubmit(e);
              }}
              noValidate
              autoComplete="off"
              sx={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                border: "1px solid black",
                padding: "15px",
              }}
            >
              <TextField
                sx={{
                  width: "100%",
                  maxWidth: "350px",
                }}
                id="username"
                label="Username"
                name="username"
                placeholder="Enter username"
                variant="outlined"
                type="text"
                required
                error={inputErrorUsername}
                onChange={handleUserNameCheck}
                helperText={helperTextUsername}
              ></TextField>
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">
                  Set role
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="developer"
                  name="radiogroup"
                  onChange={handleDeveloperToggle}
                >
                  <FormControlLabel
                    value="developer"
                    control={<Radio />}
                    label="Developer"
                  />
                  <FormControlLabel
                    value="observer"
                    control={<Radio />}
                    label="Observer"
                  />
                  <FormControlLabel
                    value="productmanager"
                    control={<Radio />}
                    label="Product Manager"
                  />
                </RadioGroup>
              </FormControl>

              {/* Depending in isDeveloper state, show different form input fields */}

              {(isDeveloper || isObserver) && (
                <TextField
                  sx={{
                    width: "100%",
                    maxWidth: "350px",
                  }}
                  id="session"
                  label="Session"
                  name="session"
                  placeholder="Enter Session ID"
                  onChange={handleSessionIdCheck}
                  variant="outlined"
                  type="text"
                  required
                  defaultValue={id}
                  error={inputErrorSessionId}
                  helperText={helperTextSession}
                ></TextField>
              )}
              {isPM && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={switchState}
                      name="switch"
                      onChange={handleSwitch}
                    />
                  }
                  label="Users must vote to show score"
                />
              )}

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "5px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="outlined"
                  type="reset"
                  onClick={handleResetForm}
                >
                  Reset
                </Button>

                {isDeveloper && (
                  <Button variant="contained" type="submit">
                    Join Session
                  </Button>
                )}
                {isObserver && (
                  <Button variant="contained" type="submit">
                    Join Session
                  </Button>
                )}
                {isPM && (
                  <Button variant="contained" type="submit">
                    Create Session
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 0, md: 4 }}></Grid>
          {/* Footer */}
          <Grid size={12}></Grid>
        </Grid>
      </Box>
    </Box>
  );
}
