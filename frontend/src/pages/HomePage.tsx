// src/pages/HomePage.tsx
import React from 'react';
import { Container, Typography, Card, CardContent, Grid } from '@mui/material';
import Header from '../components/Header';

const HomePage: React.FC = () => {

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  Templates
                </Typography>
                <Typography variant="body2">
                  Create and manage your form templates with ease.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  Fill Forms
                </Typography>
                <Typography variant="body2">
                  Fill out and submit forms securely.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  Analytics
                </Typography>
                <Typography variant="body2">
                  Analyze results and view aggregated data.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default HomePage;
