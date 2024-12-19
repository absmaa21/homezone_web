import {Grid2} from "@mui/material";
import CreateHousehold from "../CreateHousehold.tsx";
import {useAuth} from "../../hooks/useAuth.tsx";
import JoinHousehold from "../JoinHousehold.tsx";
import Households from "../Households.tsx";

function Overview() {
  const User = useAuth()

  return (
    <Grid2>
      <h2>{'Username: ' + User.user?.username}</h2>
      <h3>{'Created at: ' + (new Date(User.user?.created_at ?? 0)).toLocaleString()}</h3>

      <hr/>

      <CreateHousehold/>
      <JoinHousehold/>

      <hr/>

      <Households/>
    </Grid2>
  );
}

export default Overview;