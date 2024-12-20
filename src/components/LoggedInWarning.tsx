import {AppBar, Container, Typography} from "@mui/material";

function LoggedInWarning() {
  return (
    <AppBar position={'relative'} color={'warning'}>
      <Container maxWidth="xl">
        <Typography>You are not logged in! Preview data is shown.</Typography>
      </Container>
    </AppBar>
  );
}

export default LoggedInWarning;