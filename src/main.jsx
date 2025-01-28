// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'

// import {
//   RouterProvider,
// } from "react-router-dom";
// import { router } from './Routes/Routes';
// import AuthProvider from './Provider/AuthProvider';

// import {
//   QueryClient,
//   QueryClientProvider,
// } from '@tanstack/react-query'
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
// const queryClient = new QueryClient();

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <AuthProvider>
//       <QueryClientProvider client={queryClient}>
//         <Elements stripe={stripePromise}>
//           <div className="max-w-screen-xl mx-auto">
//             <RouterProvider router={router} />
//           </div>
//         </Elements>
//       </QueryClientProvider>
//     </AuthProvider>
//   </StrictMode>,
// )

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { RouterProvider } from "react-router-dom";
import { router } from './Routes/Routes';
import AuthProvider from './Provider/AuthProvider';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js'; // Import loadStripe

// Initialize Query Client
const queryClient = new QueryClient();

// Load Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51Qjz4tAKfTPLb64lfpt0j2GDwqfB4JE00pAt7eeZwT5VIoVdKWeEAt1T4YXE04kJeYAEwLQV2eSRehfou3Ev48RC00ShkCk7II'); // Replace with your actual Stripe publishable key

// Render the application
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Elements stripe={stripePromise}>
          <div className="max-w-screen-xl mx-auto">
            <RouterProvider router={router} />
          </div>
        </Elements>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
