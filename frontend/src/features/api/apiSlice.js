import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


//Assumptions im making about backend data : 
//Three main pieces of data - User, Chat, and Messages
//A User is associated with Chats and every chat has a list of messages in it (similar to a competitor, if u get what i mean)
//So we will fetch from backend all the chats belonging to user (or we can fetch all chats and filter on frontend also)
//Each chat will be available for user to click on and view chat history and add more messages (handled by websocket)

export const apiSlice = createApi({
    reducerPath: "api",
    //replace BASE_API_URL with the url for the backend api (dekh lena prod ya local wali url)
    baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api" }),
    tagTypes: ['User', 'Chat'],
    endpoints: (builder) => ({
        getChats: builder.query({
            query: (token) => {
                return {
                    url: '/chats',
                    headers: { Authorization: `Bearer ${token}` }
                }

            },//assuming chats karke k url se chats bheje jaate hai
            providesTags: (result = [], error, arg) =>
            {
                console.log(result.chats)
                // const resultCopy = [...(result.chats)]
                return ['Chat'] 
                // resultCopy.map(({ _id }) => [{ type: 'Chat', _id }])]
            },
        }),
        getChat: builder.query({
            query: ({ chatID, token }) =>
            ({
                url: `/chats/${chatID}`,
                headers: { Authorization: `Bearer ${token}` }
            }),
            providesTags : ['Chat']
            //  (result, error, arg) => [{type : 'Chat', _id : arg}]
        }),
        addNewChat: builder.mutation({
            query: ({ chat, token }) => ({
                url: '/chats/',
                method: "POST",
                body: chat,
                headers: { Authorization: `Bearer ${token}` }
            }),
            invalidatesTags: ['Chat']
        }),
        editChat: builder.mutation({
            query: ({ chat, token }) => {
                return {
                    url: `/chats/${chat._id}`,
                    method: 'PATCH',
                    body: chat,
                    headers: { Authorization: `Bearer ${token}` }
                }
            },
            invalidatesTags: ['Chat']
            // (result, error, arg) => ['Chat', 'Message', {type : 'Chat', _id : arg._id}]
        }),
        deleteChat: builder.mutation({
            query: ({ chatID, token }) => ({
                url: `/chats/${chatID}`,
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            }),
            invalidatesTags: ['Chat']
        }),
        getUsers: builder.query({
            query: () => '/users', //assuming users karke k url se chats bheje jaate hai
            providesTags: ['User'],
        }),
        getUser: builder.query({
            query: (username) => `/users/${username}`
        }),
        addNewUser: builder.mutation({
            query: (user) => ({
                url: '/auth/register/',
                method: "POST",
                body: user,
            }),
            invalidatesTags: ['User']
        }),
        addNewFeedback : builder.mutation({
            query : ({feedback, token}) => ({
                url : '/feedback/',
                method : "POST",
                body : feedback,
                headers : {Authorization : `Bearer ${token}`},
            })
        })

    })
})


export const {
    useAddNewChatMutation,
    useGetChatQuery,
    useGetChatsQuery,
    useGetUserQuery,
    useGetUsersQuery,
    useAddNewUserMutation,
    useDeleteChatMutation,
    useEditChatMutation,
    useAddNewFeedbackMutation
} = apiSlice;