import { Box, TextField, Container, Grid, Button, Typography, CssBaseline } from '@mui/material'
import React, { useState } from 'react'
import { useAddNewUserMutation } from '../features/api/apiSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userAdded } from '../features/user/userSlice';
const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isError, setIsError] = useState(false)
    const navigate = useNavigate();
    const [addNewUser, { isLoading }] = useAddNewUserMutation()
    const dispatch = useDispatch()
    const handleRegister = async () => {
        //handle logic for posting user data to server.
        if (username === '' || password === '' || rePassword === '') {
            setIsError(true)
            setErrorMessage("Please fill out all the fields")
            return;
        }
        if (password !== rePassword) {
            setIsError(true)
            setErrorMessage("Please reenter the password correctly")
            return;
        }
        try {
            await addNewUser({ username: username, password: password }).unwrap().then(
                response => {
                    console.log(response)
                    dispatch(
                        userAdded({
                            username: response.user.username,
                            token: response.token,
                        })
                    )
                }
            )
            setIsError(false)
            navigate('/home')
        }
        catch (error) {
            setIsError(true)
            setErrorMessage(error.data.msg)
        }

    }
    return (
        <>
            <CssBaseline />
            <Grid container>
                <Grid item md={12} sx={{
                    backgroundColor: "black",
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Container sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: 'space-evenly',
                        height: '80%',
                        width: '60%',
                        backgroundColor: "white",
                    }}>
                        <Typography variant="h5">Register here</Typography>
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
                            id='password'
                            label='Enter your password'
                            value={password}
                            type='password'
                            fullWidth
                            variant='outlined'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                            margin='dense'
                            id='password'
                            label='Enter your password'
                            value={rePassword}
                            type='password'
                            fullWidth
                            variant='outlined'
                            onChange={(e) => setRePassword(e.target.value)}
                        />
                        <Typography color='red' display={isError ? 'block' : 'none'}>{errorMessage}</Typography>
                        <Button variant='contained' onClick={handleRegister}>Register</Button>
                    </Container>
                </Grid>
            </Grid>
        </>
    )
}

export default RegisterScreen
