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

export function Login({
  isDeveloper,
  setDeveloper,
  user,
  setUser,
  sessionIdVar,
  setSessionIdVar,
}) {
  const formRef = useRef();
  const navigator = useNavigate();
  const [inputErrorUsername, setInputErrorUsername] = useState(false);
  const [inputErrorSessionId, setInputErrorSessionId] = useState(false);

  //get session id from URL param
  const { id } = useParams();

  //Depending on selected radiogroup, show different controls in form
  const handleDeveloperToggle = (e) => {
    e.preventDefault();
    if (formRef.current.radiogroup.value === "developer") {
      setDeveloper(true);
    } else {
      setDeveloper(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = formRef.current;

    //form validation for role productmanager
    if (form.radiogroup.value === "productmanager") {
      if (!form.username.value.trim()) {
        toast.error(`Username is required!`);
        setInputErrorUsername(true);
        return;
      }
    }

    //form validation for developer
    if (form.radiogroup.value === "developer") {
      if (!form.username.value.trim()) {
        toast.error(`Username is required!`);
        setInputErrorUsername(true);
        return;
      }
      if (!form.session.value.trim()) {
        toast.error(`Session Id is required!`);
        setInputErrorSessionId(true);
        return;
      }
    }

    // console.log(`username: ${form.username.value}`);
    // console.log(`role: ${form.radiogroup.value}`);

    //generate userId, get username and role from Textinput
    setUser([
      {
        userId: uuidv4(),
        username: form.username.value,
        role: form.radiogroup.value,
      },
    ]);

    // set session Id from input field
    if (formRef.current.radiogroup.value === "developer") {
      setSessionIdVar(form.session.value.trim());
    }

    navigator("/session");
  };

  //reset error state from form validation
  const handleResetForm = (e) => {
    e.preventDefault();
    setInputErrorSessionId(false);
    setInputErrorUsername(false);
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
              }}>
              <TextField
                id="username"
                label="Username"
                name="username"
                placeholder="Enter username"
                variant="outlined"
                type="text"
                required
                error={inputErrorUsername}></TextField>
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">
                  Set role
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="developer"
                  name="radiogroup"
                  onChange={handleDeveloperToggle}>
                  <FormControlLabel
                    value="developer"
                    control={<Radio />}
                    label="Developer"
                  />
                  <FormControlLabel
                    value="productmanager"
                    control={<Radio />}
                    label="Product Manager"
                  />
                </RadioGroup>
              </FormControl>

              {/* Depending in isDeveloper state, show different form input fields */}

              {isDeveloper ? (
                <TextField
                  id="session"
                  label="Session"
                  name="session"
                  placeholder="Enter Session ID"
                  variant="outlined"
                  type="text"
                  required
                  defaultValue={id}
                  error={inputErrorSessionId}></TextField>
              ) : null}

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "5px",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Button
                  variant="contained"
                  type="reset"
                  onClick={handleResetForm}>
                  Reset
                </Button>
                {isDeveloper ? (
                  <Button variant="contained" type="submit">
                    Join Session
                  </Button>
                ) : (
                  <Button variant="contained" type="submit">
                    Create new session
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
