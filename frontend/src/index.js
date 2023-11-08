import React from 'react';
import ReactDOM from 'react-dom/client';
import { LoginScreen, HomeScreen, RegisterScreen, WelcomeSplash, ChatScreen, ErrorPage } from './routes';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './global.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { store, persistor } from './app/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';


const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginScreen />,
    errorElement : <ErrorPage />
  },
  {
    path: '/home',
    element: <HomeScreen />,
    errorElement : <ErrorPage />,
    children: [
      {
        path: '/home/',
        element: <WelcomeSplash />,
        errorElement : <ErrorPage />,
      },
      {
        path : '/home/:chatID',
        element : <ChatScreen />,
        errorElement : <ErrorPage />,
      }
    ],
  },
  {
    path: '/register',
    element: <RegisterScreen />,
    errorElement : <ErrorPage />,
  }
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals