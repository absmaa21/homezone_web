import React, {useState} from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from "@mui/material";
import {useToast} from "../hooks/useToast.tsx";

function CreateHousehold() {
  const Toast = useToast()

  const [open, setOpen] = useState(false)

  function createHousehold(name: string) {
    Toast.push(`Household ${name} created!`)
    // TODO
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Create Household
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
            createHousehold(formJson.name as string)
            setOpen(false);
          },
        }}
      >
        <DialogTitle>Create a household</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can change these informations and add members later.
          </DialogContentText>
          <TextField
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            type="name"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit">Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CreateHousehold;