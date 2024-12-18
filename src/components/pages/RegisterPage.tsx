import { TextField, Button, Box } from '@mui/material';
import {useState} from "react";
import {useAuth} from "../../hooks/useAuth.tsx";
import {Log} from "../../utils/Logging.ts";

interface formProp {
  uname: string,
  email: string,
  password: string,
  conPassword: string,
}

const RegisterPage = ({onSuccess}: {onSuccess?: () => void}) => {
  const User = useAuth()
  const [form, setForm] = useState<formProp>({uname: '', email: '', password: '', conPassword: ''})

  const handleRegister = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (form.password !== form.conPassword) {
      Log.info("Passwords do not match!")
      return
    }
    User.register(form.uname, form.email, form.password).then(onSuccess)
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ width: 400 }}
    >
      <form onSubmit={handleRegister} style={{ width: '100%' }}>
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          margin="normal"
          required
          value={form.uname}
          onChange={e => setForm(p => ({...p, uname: e.target.value}))}
        />
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          required
          value={form.email}
          onChange={e => setForm(p => ({...p, email: e.target.value}))}
        />
        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          margin="normal"
          type="password"
          required
          value={form.password}
          onChange={e => setForm(p => ({...p, password: e.target.value}))}
        />
        <TextField
          fullWidth
          label="Confirm Password"
          variant="outlined"
          margin="normal"
          type="password"
          required
          value={form.conPassword}
          onChange={e => setForm(p => ({...p, conPassword: e.target.value}))}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Register
        </Button>
      </form>
    </Box>
  );
};

export default RegisterPage;
