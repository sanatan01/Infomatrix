import React from 'react'
import { Typography, Container, Grid, Button } from '@mui/material'

const WelcomeSplash = () => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            height : '100%',
            alignItems: "center",
            flexGrow : 1,
        }}>
            <Typography textAlign='center' variant="h3" sx={{ marginTop: "2rem", marginBottom: "1.5rem" }}>
                Welcome!
            </Typography>
            <Typography textAlign='center' variant="h5" sx={{ marginTop: "1.5rem" }}>To get started, create a new chat or click on reopen an existing one</Typography>
        </div>
    )
}

export default WelcomeSplash
