import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent, DialogTitle,
  IconButton,
  Menu,
  MenuItem, Snackbar,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useUser} from "../contexts/UserContext.tsx";
import LoginIcon from '@mui/icons-material/Login';
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";

function UserAvatar() {
  const User = useUser()
  const Theme = useTheme()

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [showRegDialog, setShowRegDialog] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu()
    User.logout()
    setSuccessMessage('Successfully logged out!')
  }

  const handleOpenRegister = () => {
    handleCloseUserMenu()
    setShowRegDialog(true)
  }

  const handleCloseRegister = () => {
    setShowRegDialog(false)
  }

  const handleRegisterSuccessful = () => {
    handleCloseRegister()
    setSuccessMessage('Successfully registered!')
  }

  useEffect(() => {
    handleCloseUserMenu()
  }, [User.user]);

  // Show this if the user is not logged in
  if (!User.user) {
    return (
      <Box sx={{flexGrow: 0}}>
        <Snackbar
          open={successMessage.length > 0}
          autoHideDuration={5000}
          onClose={() => setSuccessMessage('')}
          onClick={() => setSuccessMessage('')}
          message={successMessage}
        />

        <Dialog
          open={showRegDialog}
          onClose={handleCloseRegister}
        >
          <DialogTitle>Register</DialogTitle>
          <DialogContent>
            <RegisterPage onSuccess={handleRegisterSuccessful}/>
          </DialogContent>
        </Dialog>

        <Tooltip title="Click to login">
          <Button onClick={handleOpenUserMenu} sx={{p: 1}}>
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: {xs: 'none', md: 'flex'},
                flexGrow: 1,
                fontFamily: 'monospace',
                color: Theme.palette.primary.contrastText,
                textDecoration: 'none',
              }}
            >Login</Typography>
            <LoginIcon sx={{color: Theme.palette.primary.contrastText}}/>
          </Button>
        </Tooltip>
        <Menu
          sx={{mt: '45px'}}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <LoginPage onSuccess={() => setSuccessMessage('Successfully logged in!')} />
          <Button sx={{ml: 1}} onClick={handleOpenRegister}>
            Create an account
          </Button>
        </Menu>
      </Box>
    );
  }

  return (
    <Box sx={{flexGrow: 0}}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
          <Avatar alt={User.user.username} src="/static/images/avatar/2.jpg"/>
        </IconButton>
      </Tooltip>
      <Menu
        sx={{mt: '45px'}}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem key={'settings'} onClick={handleCloseUserMenu}>
          <Typography sx={{textAlign: 'center'}}>Settings</Typography>
        </MenuItem>
        <MenuItem key={'logout'} onClick={handleLogout}>
          <Typography sx={{textAlign: 'center'}}>Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default UserAvatar;