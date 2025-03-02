import React from 'react';
import { AppBar, Toolbar, Link,Button } from '@mui/material';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
    <Toolbar>
      <Link href="/" color="inherit" variant="h6" underline="none" sx={{ flexGrow: 1 }}>
        FormLab
      </Link>
      <Button color="inherit" component={Link} href="/auth/login">
      Login
      </Button>
      <Button color="inherit" component={Link} href="/auth/register">
      Register
      </Button>
    </Toolbar>
  </AppBar>
  );
};

export default Header;
