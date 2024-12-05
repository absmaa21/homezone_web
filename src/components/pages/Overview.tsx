import {useUser} from "../../contexts/UserContext.tsx";
import {Button, Grid2} from "@mui/material";
import CreateHousehold from "../CreateHousehold.tsx";

function Overview() {
  const User = useUser()

  return (
    <Grid2>
      <h2>{'Username: ' + User.user?.username}</h2>
      <h3>{'Created at: ' + (new Date(User.user?.created_at ?? 0)).toLocaleString()}</h3>
      <Button onClick={User.logout}>
        Logout
      </Button>
      <hr/>
      <CreateHousehold/>
    </Grid2>
  );
}

export default Overview;