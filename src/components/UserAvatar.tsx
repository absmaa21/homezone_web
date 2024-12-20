import {
  Avatar,
  Box,
  Button,
  Dialog, DialogActions,
  DialogContent,
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
  const [showDialog, setShowDialog] = useState<'register' | 'login' | null>(null)

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu()
    setShowDialog(null)
    User.logout()
  }

  const handleOpenLogin = () => {
    setShowDialog('login')
  }

  const handleCloseDialog = () => {
    setShowDialog(null)
  }

  const handleOpenRegister = () => {
    setShowDialog('register')
  }

  useEffect(() => {
    handleCloseUserMenu()
    setShowDialog(null)
  }, [User.user]);

  const textColor = Theme.palette.mode === 'light' ? Theme.palette.primary.contrastText : Theme.palette.primary.light

  // Show this if the user is not logged in
  if (!User.user) {
    return (
      <Box sx={{flexGrow: 0}}>
        <Dialog
          open={!!showDialog}
          onClose={handleCloseDialog}
        >
          <DialogContent>
            {showDialog === 'register' && <RegisterPage onSuccess={handleOpenLogin}/>}
            {showDialog === 'login' && <LoginPage onSuccess={handleCloseDialog}/>}
          </DialogContent>
          {showDialog === 'login' && <DialogActions>
              <Button sx={{ml: 1}} onClick={handleOpenRegister}>
                  Create an account
              </Button>
          </DialogActions>}
        </Dialog>

        <Tooltip title="Click to login">
          <Button onClick={handleOpenLogin} sx={{p: 1}}>
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
            <LoginIcon sx={{color: textColor}}/>
          </Button>
        </Tooltip>
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