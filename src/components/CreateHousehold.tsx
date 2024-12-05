import React, {useState} from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, IconButton,
  Snackbar,
  TextField
} from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

function CreateHousehold() {
  const [open, setOpen] = useState(false)
  const [household, setHousehold] = useState<Household>({name: ''})
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  function createHousehold(name: string) {
    setHousehold({name})
    setSnackbarOpen(true)
    // TODO
  }

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={`Household ${household.name} created!`}
        action={
          <IconButton onClick={() => setSnackbarOpen(false)}>
            <CloseRoundedIcon color={'error'} />
          </IconButton>
        }
      />

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