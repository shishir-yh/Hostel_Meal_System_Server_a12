import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../../Provider/AuthProvider";

const AdminProfile = () => {
    const { user } = useContext(AuthContext); // Access logged-in user data
    console.log("Auth User:", user);

    // Fetch admin's meals
    const { data: meals, isLoading: mealsLoading, error: mealsError } = useQuery({
        queryKey: ["adminMeals", user?.email],
        queryFn: async () => {
            const response = await axios.get(`https://hostel-meal-system-server-a12.vercel.app/meals?distributorEmail=${user?.email}`);
            return response.data; // Returns the list of meals added by the admin
        },
        enabled: !!user?.email, // Ensure the query only runs when email exists
    });

    if (mealsLoading) {
        return <div className="text-center my-8">Loading admin profile...</div>;
    }

    if (mealsError || !meals) {
        return (
            <div className="text-center my-8 text-red-500">
                Failed to load admin profile. Please try again.
            </div>
        );
    }

    // Calculate the total number of meals
    const totalMeals = meals.length;

    return (
        <div className="container mx-auto p-4 max-w-md">
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                {/* Profile Image */}
                <img
                    src={user?.photoURL || "https://via.placeholder.com/150"} // Fallback to placeholder if no image
                    alt={`${user?.displayName || "Admin"}'s Profile`}
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-200"
                />

                {/* Admin Info */}
                <h1 className="text-2xl font-bold mb-2">{user?.displayName || "Admin"}</h1>
                <p className="text-gray-600 mb-4">{user?.email}</p>

                {/* Total Meals Count */}
                <div className="badge badge-primary badge-lg text-white">
                    Total Meals Added: {totalMeals}
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
