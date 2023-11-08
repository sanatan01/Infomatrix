import React, { useState } from 'react'
import { Grid, Button, TextField, Typography, Container, CssBaseline } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { userAdded } from '../features/user/userSlice';
import { red } from '@mui/material/colors';



const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isError, setIsError] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async () => {
        //handle log in logic here. if successful,
        console.log(username)
        console.log(password)
        if (username === '' || password === '') {
            setIsError(true)
            setErrorMessage("Please fill out all the fields")
            return;
        }
        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
                method: "POST",
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                })
            })
            const data = await response.json()
            if (!data.token) {

                setIsError(true)
                setErrorMessage("The password may be incorrect, or too short")
                return;
            }
            dispatch(
                userAdded({
                    username: data.user.username,
                    token: data.token,
                })
            )
            setIsError(false)
            navigate('/home')
        } catch (error) {
            console.log(error)

        }
    }
    return (
        <div>
            <CssBaseline />
            <Grid container sx={{ height: '100vh' }}>
            <Grid
            item
            xs={0}
            md={7}
            sx={{
              background: `rgba(0, 0, 0, 0.6) url('/LoginRobo.jpeg')`, // URL to your background image
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'top',
              color: 'black', // Text color
            }}
          >
            
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-around",
                marginBottom: "2rem",
                backgroundColor: "black", // Black background color
                color: "white", // White text color
            }}
            >
            <Typography variant="h3" sx={{ fontWeight: "bold" }}>
            Infomatrix
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Crafting Conversations With Insight
            </Typography>
            
        </Container>
        
          </Grid>

                <Grid item xs={12} md={5} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: "100%",
                    justifyContent: "center",
                    marginBottom: "4rem",
                }}>
                    <Container sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: "center",
                        justifyContent: "space-evenly",
                        height: "60%",
                    }}>
                        <Typography variant='h5' sx={{ fontWeight: "bolder" }}>Get started</Typography>
                        <TextField
                            margin='dense'
                            id='username'
                            label='Enter your username'
                            value={username}
                            fullWidth
                            variant='outlined'
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            margin='dense'
                            type='password'
                            id='password'
                            label='Enter your password'
                            value={password}
                            fullWidth
                            variant='outlined'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button onClick={handleLogin} variant='contained'>Login</Button>
                        <Button component={Link} to='/register' variant='outlined'>New? Register Here</Button>
                        <Typography color='red' display={isError ? 'block' : 'none'}>{errorMessage}</Typography>
                    </Container>
                </Grid>
            </Grid>
        </div>
    )
}

export default LoginScreen;