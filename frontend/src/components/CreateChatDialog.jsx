import React, { useState } from 'react'
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, TextField, Select, MenuItem, DialogContentText, SelectChangeEvent } from '@mui/material';

const CreateChatDialog = ({ creator, token, setFailure }) => {
    const [title, setTitle] = useState('')
    const [open, setOpen] = useState(false)
    const [canSave, setCanSave] = useState(true)
    const handleOpen = (e) => {
        setOpen(true)
    }
    const handleCloseCancel = (e) => {
        setTitle('')
        setOpen(false)
    }
    const handleCloseSubmit = async (e) => {
        if(title.length < 6) {
            setCanSave(false)
            return;
        }
        setCanSave(true)
        try { 
            await creator({chat : {title : title, messages : []}, token : token}).unwrap().then(response => {
                console.log(response)
                setFailure(false)
            })
        } catch(error) {
            console.log(error)
            setFailure(true)
        }
        setOpen(false)
    }
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }
    return (
        <>
            <Button variant='contained' onClick={handleOpen} sx={{
                color: 'white',
                backgroundColor: "#a28d8d",
            }}>Create Chat</Button>
            <Dialog open={open} onClose={handleCloseCancel}>
                <DialogTitle>
                    Name your chat history
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Give your conversation a name. 6 characters or above.
                    </DialogContentText>
                    <TextField
                        margin='dense'
                        id='title'
                        label='Title...'
                        value={title}
                        fullWidth
                        variant='standard'
                        onChange={handleTitleChange}
                    />
                    <DialogContentText display={canSave ? 'none' : 'block'} color='red'>
                        The title must be more than 6 characters.
                    </DialogContentText>
                </DialogContent>
                    <DialogActions>
                        <Button variant='contained' onClick={handleCloseCancel}>Cancel</Button>
                        <Button variant='contained' onClick={handleCloseSubmit}>Create</Button>
                    </DialogActions>
            </Dialog>
        </>
    )
}

export default CreateChatDialog
