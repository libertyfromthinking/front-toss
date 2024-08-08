import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CheckoutPage from './Checkout.tsx';
import SuccessPage from './Success.tsx';
import FailPage from './Fail.tsx';
import LoadingPage from './Loading.tsx';
import PayList from './PayList.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <CheckoutPage />,
  },
  { path: '/loading', element: <LoadingPage /> },
  { path: '/success', element: <SuccessPage /> },
  { path: '/fail', element: <FailPage /> },
  { path: '/paylist', element: <PayList /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);
