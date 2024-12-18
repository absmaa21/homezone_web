import {useAuth} from "../hooks/useAuth.tsx";
import {useQuery} from "@tanstack/react-query";
import {base_url} from "../../env.ts";
import {AllHouseholdsResponse} from "../models/Household";
import {List, ListItem} from "@mui/material";
import {useEffect} from "react";
import {useHousehold} from "../hooks/useHousehold.tsx";
import {Log} from "../utils/Logging.ts";


function Households() {
  const Household = useHousehold()
  const User = useAuth()

  const Houses = useQuery<AllHouseholdsResponse>({
    queryKey: ['houses', User.user?.id],
    queryFn: async () => {
      await User.checkTokenValidation()
      const r = await fetch(`${base_url}/user/homes`, {headers: User.getHeadersWithTokens()})
      if (!r.ok) throw new Error('Something went wrong fetching homes: ' + r.status)
      return await r.json()
    },
  })

  useEffect(() => {
    Houses.refetch().then(() => Log.debug('Fetched all households'))
  }, [Household.households]);


  return (
    <List>
      {Houses.isSuccess && Houses.data.length <= 0 && <h3>You are not in any household.</h3>}
      {Houses.isSuccess && Houses.data.map(h => <ListItem key={h.id}>{h.name}</ListItem>)}
    </List>
  );
}

export default Households;