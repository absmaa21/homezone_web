import React, {useState} from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@mui/material";
import {useToast} from "../hooks/useToast.tsx";
import {useHousehold} from "../hooks/useHousehold.tsx";

function JoinHousehold() {
  const Toast = useToast()
  const Household = useHousehold()

  const [open, setOpen] = useState(false)

  function joinHousehold(name: string) {
    Household.join(name).then(() => Toast.push(`Household with code ${name} joined!`))
    // TODO
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Join Household
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          component: 'form',
          onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            joinHousehold(formJson.code as string)
            setOpen(false);
          },
        }}
      >
        <DialogTitle>Join a household</DialogTitle>
        <DialogContent>
          <TextField
            required
            margin="dense"
            id="code"
            name="code"
            label="Code"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit">Join</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default JoinHousehold;