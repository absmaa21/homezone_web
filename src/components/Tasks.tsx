import {useAuth} from "../hooks/useAuth.tsx";
import {useQuery} from "@tanstack/react-query";
import {base_url} from "../../env.ts";
import {List, ListItem} from "@mui/material";
import {Task} from "../models/Tasks.ts";

interface Props {
  homeId?: string,
}

function Tasks({homeId}: Props) {
  const Auth = useAuth()

  const Tasks = useQuery<Task[]>({
    queryKey: ['tasks', Auth.user?.id, homeId ?? ''],
    queryFn: async () => {
      await Auth.checkTokenValidation()
      const r = await fetch(`${base_url}` + (!homeId ? `/user` : `/home/${homeId}`) + '/tasks', {headers: Auth.getHeadersWithTokens()})
      if (!r.ok) throw new Error('Something went wrong fetching homes: ' + r.status)
      return await r.json()
    },
  })

  return (
    <List>
      {Tasks.isSuccess && Tasks.data.map(t => <ListItem key={t.id}>{t.name}</ListItem>)}
    </List>
  );
}

export default Tasks;