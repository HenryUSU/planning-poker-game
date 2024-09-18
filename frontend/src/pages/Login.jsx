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

export function Login() {
  const formRef = useRef();

  const [isDeveloper, setDeveloper] = useState(true);

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
    console.log(`username: ${form.username.value}`);
    console.log(`role: ${form.radiogroup.value}`);
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
          <Grid size={3}></Grid>
          <Grid size={6}>
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
                required></TextField>
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
              {isDeveloper ? (
                <TextField
                  id="session"
                  label="Session"
                  name="session"
                  placeholder="Enter Session ID"
                  variant="outlined"
                  type="text"
                  required></TextField>
              ) : null}

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "5px",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Button variant="contained" type="reset">
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
          <Grid size={3}></Grid>
          {/* Footer */}
          <Grid size={12}></Grid>
        </Grid>
      </Box>
    </Box>
  );
}
