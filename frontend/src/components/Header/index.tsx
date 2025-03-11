import React from 'react';
import { AppBar, Toolbar, Link, Button, Typography } from '@mui/material';
import useAuth from '../../hooks/useAuth';

const Header: React.FC = () => {

  const { auth, setAuth } = useAuth();

  const handleLogout = () => {
    setAuth({ accessToken: null, user: null });
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Link href="/" color="inherit" variant="h6" underline="none" sx={{ flexGrow: 1 }}>
          FormLab
        </Link>
        {auth?.user?.username ? (
          <>
            <Typography variant="body1" sx={{ marginRight: 2 }}>
              {auth?.user?.username}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} href="/auth/login">
              Login
            </Button>
            <Button color="inherit" component={Link} href="/auth/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
