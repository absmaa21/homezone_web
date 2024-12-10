import {Avatar, Box, Button, IconButton, Menu, MenuItem, Tooltip, Typography} from "@mui/material";
import React, {useState} from "react";
import {useUser} from "../contexts/UserContext.tsx";
import LoginIcon from '@mui/icons-material/Login';
import LoginPage from "./pages/LoginPage.tsx";

function UserAvatar() {
  const User = useUser()

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    User.logout()
    handleCloseUserMenu()
  }

  // Show this if the user is not logged in
  if (!User.user) {
    return (
      <Box sx={{flexGrow: 0}}>
        <Tooltip title="Click to login">
          <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
            <Avatar alt={"Login"}>
              <LoginIcon/>
            </Avatar>
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
          <LoginPage/>
          <Button>
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
          <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg"/>
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