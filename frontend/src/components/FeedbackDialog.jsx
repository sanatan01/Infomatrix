import React, { useState } from 'react'
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, TextField, Snackbar, Alert } from '@mui/material';
import { useAddNewFeedbackMutation } from '../features/api/apiSlice';
import { useSelector } from 'react-redux';

const FeedbackDialog = () => {
    const currentUser = useSelector(state => state.user)

    const [submitErrored, setSubmitErrored] = useState(false)
    const [feedback, setFeedback] = useState('')
    const [submitted, setSubmitted ] = useState(false)
    const [open, setOpen] = useState(false)

    const [addNewFeedback, {isLoading : feedbackLoading, isError : feedbackErrored}] = useAddNewFeedbackMutation()
    const canSave = [feedback].every(Boolean) && !feedbackLoading
    const handleOpen = (e) => {
        setOpen(true)
    }
    const handleCloseCancel = (e) => {
        setFeedback('')
        setOpen(false)
    }
    const handleFeedbackChange = (e) => {
        setFeedback(e.target.value)
    }
    const handleCloseSubmit = async (e) => {
        if(canSave)
        {
            try {
                await addNewFeedback({feedback : {content : feedback}, token : currentUser.token}).unwrap().then(
                    response => {
                        console.log(response)
                        setFeedback('')
                        setSubmitted(true)
                        setSubmitErrored(false)
                    }
                ).catch(error => {
                    console.log(error)
                    setSubmitted(false)
                    setSubmitErrored(true)
                })
            } catch (error) {
                console.log(error)
                setSubmitted(false)
                setSubmitErrored(true)
            }
            setOpen(false)
        }
    }

    return (
        <div>
            <Button variant='contained' onClick={handleOpen}>Go</Button>
            <Dialog open={open} onClose={handleCloseCancel} sx={{
                display : 'flex',
                flexDirection : 'column',
                alignItems : "center",
            }}>
                <DialogTitle>Give us your valuable feedback</DialogTitle>
                <DialogContent>
                    <TextField
                        margin='dense'
                        id='feedback'
                        label='Feedback...'
                        value={feedback}
                        multiline
                        minRows={6}
                        fullWidth
                        variant='standard'
                        onChange={handleFeedbackChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' onClick={handleCloseSubmit}>Submit</Button>
                    <Button variant='contained' onClick={handleCloseCancel}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={submitted} onClose={() => setSubmitted(false)}>
                <Alert severity="success">
                    Your feedback was received. Thank you!
                </Alert>
            </Snackbar>
            <Snackbar open={submitErrored} onClose={() => setSubmitErrored(false)}>
                <Alert severity="error">
                    Your feedback was not able to be processed. Try again.
                </Alert>
            </Snackbar>
        </div>
    )
}

export default FeedbackDialog
