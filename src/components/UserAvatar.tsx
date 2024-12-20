import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent, DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography, useTheme,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import LoginIcon from '@mui/icons-material/Login';
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import {useAuth} from "../hooks/useAuth.tsx";

function UserAvatar() {
  const User = useAuth()
  const Theme = useTheme()

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [showRegDialog, setShowRegDialog] = useState(false)

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu()
    User.logout()
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
  }

  useEffect(() => {
    handleCloseUserMenu()
  }, [User.user]);

  const textColor = Theme.palette.mode === 'light' ? Theme.palette.primary.contrastText : Theme.palette.primary.light

  // Show this if the user is not logged in
  if (!User.user) {
    return (
      <Box sx={{flexGrow: 0}}>
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
                textDecoration: 'none',
                color: textColor,
              }}
            >Login</Typography>
            <LoginIcon sx={{ color: textColor }} />
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
          <LoginPage />
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