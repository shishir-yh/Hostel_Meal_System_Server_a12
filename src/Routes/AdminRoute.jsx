import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Fetch user data to check for admin role
    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ["userRole", user?.email],
        queryFn: async () => {
            const response = await axios.get(`https://hostel-meal-system-server-a12.vercel.app/user?distributorEmail=${user?.email}`);
            return response.data; // Returns user data, including role information
        },
        enabled: !!user?.email, // Ensure the query only runs when email exists
    });

    if (loading || userLoading) {
        return <progress className="progress w-56"></progress>;
    }

    // Check if the user has admin privileges
    if (user && userData?.role === "admin") {
        return children;
    }

    return <Navigate to="/" state={{ from: location }} replace></Navigate>;
};

export default AdminRoute;
