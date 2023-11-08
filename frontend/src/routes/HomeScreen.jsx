import React, {useState} from 'react'
import { Container, Grid, Avatar, CssBaseline, Typography, Divider, List, ListItemButton, ListItem, ListItemText, Button, ListItemIcon, Dialog, DialogContent, DialogContentText, Snackbar, Alert } from '@mui/material'
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userAdded } from '../features/user/userSlice';
import { useAddNewChatMutation, useGetChatsQuery, useDeleteChatMutation } from '../features/api/apiSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import { CreateChatDialog } from '../components';
import { Fade } from 'react-awesome-reveal';
import Person2Icon from '@mui/icons-material/Person2';

const avatarify = (name) => {
    let finalName = "";
    const words = name.split(" ");
    words.forEach(word => {
        finalName.concat(word);
    });
    return finalName;
}
const HomeScreen = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.user);

    const [createFailed, setCreateFailed] = useState(false)
    const [deleteFailed, setDeleteFailed] = useState(false)

    const [addNewChat, { isLoading: isCreating, isError: createErrored, error: createError }] = useAddNewChatMutation()
    const [deleteChat, { isLoading: isDeleting, isError: deleteErrored, error: deleteError }] = useDeleteChatMutation()
    const {
        data: chats = [],
        isLoading: ChatLoading,
        isSuccess: ChatSuccess,
        isError: ChatErrored,
        error: fetchError
    } = useGetChatsQuery(currentUser.token)
    const handleDelete = async (chatID) => {
        try {
            await deleteChat({ chatID: chatID, token: currentUser.token }).unwrap().then(
                response => {
                    console.log(response)
                    setDeleteFailed(false)
                }
            )
            navigate('/home')
        }
        catch (error) {
            console.log(error)
            setDeleteFailed(true)
        }
    }
    const handleLogout = () => {
        //logout logic here
        dispatch(
            userAdded({
                username: '',
                token: ''
            })
        )
        currentUser.token = ''
        currentUser.username = ''
        navigate('/');
    }

    const chatList = ChatSuccess && chats.chats.map((chat) => {
        return (
            <Fade>
                <ListItem key={chat._id} sx={{
                    display : 'flex',
                    justifyContent : 'space-between',
                    width : '100%',
                    alignItems : 'center'
                }}>
                    <ListItemButton component={Link} to={`/home/${chat._id}`} sx={{
                        width : '90%',
                    }}>
                        <ListItemText primary={chat.title} 
                        sx={{ color: "white", width : '100%'}} 
                        primaryTypographyProps={{
                            noWrap : true
                        }}
                        />
                    </ListItemButton>
                    <ListItemButton>
                        <ListItemIcon disabled={isDeleting} onClick={() => handleDelete(chat._id)}>
                            <DeleteIcon color='primary' />
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
            </Fade>
        )
    })
    return (
            <div style={{height : '100%', width : '100%',  display : 'flex'}}>
            <CssBaseline />
                    <div style={{
                        backgroundColor: "black",
                        height: "100%",
                        display: 'flex',
                        width : '25%',
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: 'space-between'
                    }}>
                        <Container>
                            <Grid container sx={{
                                display : 'flex',
                                alignItems : 'center',
                            }}>
                                <Grid item md={3} sx={{ padding: "1rem" }}>
                                    <Person2Icon color='secondary'/>
                                </Grid>
                                <Grid item md={5} sx={{ padding: "1rem" }}>
                                    <Typography variant="h6" sx={{ fontWeight: "bolder", color: "white" }}>{currentUser.username}</Typography>
                                </Grid>
                            </Grid>
                            <List>
                                <Divider sx={{ backgroundColor: "white" }} />
                                {chatList}
                            </List>
                        </Container>
                        <Container sx={{
                            display: "flex",
                            justifyContent: "space-evenly"
                        }}>
                            <CreateChatDialog creator={addNewChat} token={currentUser.token} setFailure={setCreateFailed} />
                            <Button variant='contained' onClick={handleLogout} sx={{
                                color: 'white',
                                backgroundColor: "#a28d8d",
                            }}>Logout</Button>
                        </Container>
                    <Dialog open={ChatErrored}>
                        <DialogContent>
                            <DialogContentText>Your chats were not fetched. Refresh the page to try again.</DialogContentText>
                        </DialogContent>
                    </Dialog>
                    <Snackbar open={createFailed} onClose={() => setCreateFailed(false)}>
                        <Alert severity="error">
                            There was an creating the chat. Please try again!
                        </Alert>
                    </Snackbar>
                    <Snackbar open={deleteFailed} onClose={() => setDeleteFailed(false)}>
                        <Alert severity="error">
                            There was an deleting the chat. Please try again!
                        </Alert>
                    </Snackbar>
                    </div>
                    <Outlet />
        </div>
    )
}

export default HomeScreen;
