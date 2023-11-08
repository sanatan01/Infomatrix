import React, { useEffect, useRef, useState } from 'react'
import { Grid, List, ListItem, ListItemText, TextField, Button, Box, Container, CircularProgress, Typography, Snackbar, Alert } from '@mui/material'
import { FeedbackDialog } from '../components'
import { useEditChatMutation, useGetChatQuery } from '../features/api/apiSlice'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { OpenAI } from 'openai'
import { Slide } from 'react-awesome-reveal'
const ChatScreen = () => {
    const params = useParams()
    const ref = useRef(0)
    const currentUser = useSelector(state => state.user)
    const chatID = params.chatID
    const [chatBar, setChatBar] = useState('')
    const [messageState, setMessageState] = useState([])
    const [messageFailed, setMessageFailed] = useState(false)
    const [updateChat, { isLoading }] = useEditChatMutation()
    const {
        data,
        isFetching,
        isSuccess,
        isError: ChatErrored,
        error: ChatError,
    } = useGetChatQuery({ chatID: chatID, token: currentUser.token })
    isSuccess && console.log(`The fetched chat is ${data.chat.title} and ${data.chat.messages[0]} and ${data.chat.owner}`)

    const canSave = [chatBar].every(Boolean) && !isLoading

    const handleChatChange = (e) => {
        setChatBar(e.target.value)
    }
    const handleMessageSend = async (e) => {

        if (canSave) {
            console.log(chatBar)
            const newMsg = { content: chatBar, role: 'user' }
            const newMessages = [...data.chat.messages, newMsg]

            try {
                await updateChat({ chat: { latestMessage: newMsg, _id: chatID }, token: currentUser.token }).unwrap().then(response => console.log(response))
                setChatBar('')
                setMessageFailed(false)
            } catch (error) {
                console.log(error)
                setMessageFailed(true)
            }
        }
    }

    useEffect(() => {
        isSuccess && setMessageState(data.chat.messages)
    }, [isSuccess, data])

    useEffect(() => {
        console.log("Runnin!")
        ref.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [data, isSuccess])


    const messageList = isSuccess && messageState.map(message => {
        if (message.role === "user") {
            return (
                <Slide triggerOnce direction='left' style={{ alignSelf: 'flex-end', width: '40%' }}>
                    <ListItem key={message._id} sx={{
                        backgroundColor: '#f2f2f2',
                        borderRadius: '0.5rem',
                        width: '100%',
                        alignSelf: "flex-end",
                        marginTop: '0.5rem',
                        marginBottom: '0.5rem',
                    }}>
                        <ListItemText>
                            {message.content}
                        </ListItemText>
                    </ListItem>
                </Slide>
            )
        }
        else if (message.role === "assistant") {
            return (
                <Slide triggerOnce direction='right' style={{ alignSelf: 'flex-start', width: '40%', }}>
                    <ListItem key={message._id} sx={{
                        backgroundColor: '#e9c3c3',
                        borderRadius: '0.5rem',
                        width: '100%',
                        alignSelf: "flex-start",
                        marginTop: '0.5rem',
                        marginBottom: '0.5rem',
                    }}>
                        <ListItemText>
                            {message.content}
                        </ListItemText>
                    </ListItem>
                </Slide>
            )
        }
    })

    let content
    if (ChatErrored) {
        content = (
            <Typography variant='h3'>The chat failed to fetch, try again</Typography>
        )
    }
    else {
        content = (
            <Container sx={{
                height: '100%',
                width: '100%',
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}>
                <List sx={{
                    maxHeight: "80vh",
                    overflow: "auto",
                    display: "flex",
                    flexDirection: 'column',
                }}>
                    {/* <Slide cascade> */}
                    {messageList}
                    <ListItem
                        ref={ref}></ListItem>
                </List>
                <Box>
                    <Box sx={{
                        display: "flex",
                        alignItems: 'center',
                    }}>
                        <Typography sx={{
                            marginRight: '1rem',
                        }}>Click here to give us feedback</Typography>
                        <FeedbackDialog />
                    </Box>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",

                    }}>
                        <TextField
                            margin='dense'
                            id='chat'
                            label='Chat...'
                            value={chatBar}
                            fullWidth
                            variant='outlined'
                            onChange={handleChatChange}
                            sx={{
                                width: "90%"
                            }}
                        />
                        <Button variant="contained" size="small" onClick={handleMessageSend}>Send</Button>
                    </Box>
                </Box>
            </Container>
        )
    }
    return (
        <div style={{
            height: '100%',
            flexGrow: 1,
        }}>
            {content}

            <Snackbar open={messageFailed} onClose={() => setMessageFailed(false)}>
                <Alert severity="error">
                    There was an error sending the message. Please try again!
                </Alert>
            </Snackbar>
        </div>
    )
}

export default ChatScreen
