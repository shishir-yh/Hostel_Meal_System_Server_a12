import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../../Provider/AuthProvider";

const MyProfile = () => {
    const { user } = useContext(AuthContext); // Access user data
    console.log("Auth User:", user);

    // Fetch user details
    const { data: userDetails, isLoading, error } = useQuery({
        queryKey: ["userDetails", user?.email],
        queryFn: async () => {
            const response = await axios.get(`https://hostel-meal-system-server-a12.vercel.app/user-details?email=${user?.email}`);
            return response.data.data; // Fetch the user details
        },
        enabled: !!user?.email, // Ensure query only runs if email exists
    });

    if (isLoading) {
        return <div className="text-center my-8">Loading user details...</div>;
    }

    if (error || !userDetails) {
        return (
            <div className="text-center my-8 text-red-500">
                Failed to load user details. Please try again.
            </div>
        );
    }

    // Destructure details
    const { name, photo, email, badge } = userDetails;

    return (
        <div className="container mx-auto p-4 max-w-md">
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                <img
                    src={user?.photoURL || photo} // Use `user.photoURL` or fallback to `photo` from userDetails
                    alt={`${name}'s Profile`}
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-200"
                />
                <h1 className="text-2xl font-bold mb-2">{name}</h1>
                <p className="text-gray-600 mb-4">{email}</p>
                <div className="badge badge-primary badge-lg text-white">{badge}</div>
            </div>
        </div>
    );
};

export default MyProfile;

