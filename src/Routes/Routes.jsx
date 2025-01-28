// copy from the react route
import {
    createBrowserRouter,
} from "react-router-dom";
import Home from "../Pages/Home/Home/Home";
import MainLayout from "../MainLayout/MainLayout"
import Meals from "../Pages/Meals/Meals";
import UpcomingMeals from "../Pages/UpcomingMeals/UpcomingMeals";
import MealsDetailsPage from "../Pages/Meals-Details-Page/MealsDetailsPage";
import Login from "../Pages/Login/Login";
import Signup from "../Pages/Signup/Signup";
import PrivateRoute from "./PrivateRoute";
import DashBoard from "../MainLayout/DashBoard";
import Cart from "../Pages/DashBoard/Cart/Cart";
import MangeUsers from "../Pages/DashBoard/Admin/MangeUsers";
import AddMeal from "../Pages/DashBoard/Admin/AddMeal";
import AllReviews from "../Pages/DashBoard/Admin/AllReviews";
import ServeMeals from "../Pages/DashBoard/Admin/ServeMeals";
import UpcomingMealsadmin from "../Pages/DashBoard/Admin/UpcomingMealsadmin";
import AdminProfile from "../Pages/DashBoard/Admin/AdminProfile";
import Payment from "../Pages/DashBoard/Users/Payment";
import CheckoutForm from "../Pages/DashBoard/Users/CheckoutForm";
import PaymentHistory from "../Pages/DashBoard/Users/PaymentHistory";
import RequestedMeal from "../Pages/DashBoard/Users/RequestedMeal";
import MyReview from "../Pages/DashBoard/Users/MyReview";
import MyProfile from "../Pages/DashBoard/Users/MyProfile";
import AllMeals from "../Pages/DashBoard/Admin/AllMeals";
import AdminRoute from "./AdminRoute";

// must export the 
export const router = createBrowserRouter([
    {

        path: "/",
        element: <MainLayout></MainLayout>,
        children: [
            {
                path: "/",
                element: <Home></Home>
            },
            {
                path: "/meals",
                element: <Meals></Meals>
            },

            {
                path: "/upcomingMeals",
                element: <UpcomingMeals></UpcomingMeals>
            },
            {
                // ToDo
                path: "/meal/:id",
                element: <MealsDetailsPage></MealsDetailsPage>

                // loader: ({ params }) => fetch(`https://hostel-meal-system-server-a12.vercel.app/allMeal/${params.id}`)
            },
            {
                path: "/login",
                element: <Login></Login>
            },
            {
                path: "/signup",
                element: <Signup></Signup>
            },
            {
                path: "/checkout/:package_name",
                element: <PrivateRoute><CheckoutForm></CheckoutForm></PrivateRoute>
            }
        ]
    },
    {
        path: '/dashboard',
        element: <DashBoard></DashBoard>,
        children: [
            {
                path: '/dashboard',
                element: <Cart></Cart>
            },
            {
                path: '/dashboard/ManageUsers',
                element: <MangeUsers></MangeUsers>
            },
            {
                path: '/dashboard/AddMeal',
                element: <AddMeal></AddMeal>
            },
            {
                path: '/dashboard/AllReviews',
                element: <AllReviews></AllReviews>
            },
            {
                path: "/dashboard/ServeMeals",
                element: <ServeMeals></ServeMeals>
            },
            {
                path: "/dashboard/UpcomingMeals",
                element: <UpcomingMealsadmin></UpcomingMealsadmin>

            },
            {
                path: "/dashboard/adminProfile",
                element: <AdminProfile></AdminProfile>
            },
            {
                path: "/dashboard/payment",
                element: <Payment></Payment>
            },
            {
                path: "/dashboard/checkout/:packageId",
                element: <CheckoutForm></CheckoutForm>
            },
            {
                path: "/dashboard/paymentHistory",
                element: <PaymentHistory></PaymentHistory>
            },
            {
                path: "/dashboard/requestedMeals",
                element: <RequestedMeal></RequestedMeal>
            },
            {
                path: "/dashboard/myReviews",
                element: <MyReview></MyReview>
            },
            {
                path: "/dashboard/userHome",
                element: <MyProfile></MyProfile>
            },
            {
                path: "/dashboard/AllMeals",
                element: <AllMeals></AllMeals>
            }

        ]
    }
]);
