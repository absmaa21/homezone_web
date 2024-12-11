import {TextField, Button, Box, Typography} from '@mui/material';
import {useUser} from "../../contexts/UserContext.tsx";
import {useState} from "react";

interface formProps {
  email: string,
  password: string,
}

const LoginPage = ({onSuccess}: {onSuccess?: () => void}) => {
  const User = useUser()

  const [form, setForm] = useState<formProps>({email: '', password: ''})

  const handleLogin = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    User.login(form.email, form.password).then(r => {
      if (r.length > 0) {
        // TODO handle Error
      } else if (onSuccess) onSuccess()
    })
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{width: 400, margin: 'auto'}}
      padding={1}
    >
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleLogin} style={{width: '100%'}}>
        <TextField
          fullWidth
          label="Email"
          variant="filled"
          margin="normal"
          required
          value={form.email}
          onChange={e => setForm(p => ({...p, email: e.target.value}))}
        />
        <TextField
          fullWidth
          label="Password"
          variant="filled"
          margin="normal"
          type="password"
          required
          value={form.password}
          onChange={e => setForm(p => ({...p, password: e.target.value}))}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{mt: 2}}
        >
          Login
        </Button>
      </form>
    </Box>
  );
};

export default LoginPage;
