
import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../Provider/AuthProvider"; // Assuming this is where your AuthContext is located

const fetchUpcomingMeals = async () => {
    const { data } = await axios.get("https://hostel-meal-system-server-a12.vercel.app/upcoming-meals");
    return data;
};

const handleLike = async (mealId, userId, refetch) => {
    try {
        const response = await axios.post("https://hostel-meal-system-server-a12.vercel.app/like-upcomingMeals", { mealId, userId });

        if (response.data.success) {
            Swal.fire("Liked!", response.data.message, "success");
            refetch(); // Refetch meals to update like count
        } else {
            Swal.fire("Info", response.data.message, "info");
        }
    } catch (error) {
        Swal.fire("Error!", error.response?.data?.message || "Something went wrong.", "error");
    }
};

const UpcomingMeals = () => {
    const { user } = useContext(AuthContext); // Get user data from AuthContext
    const { email } = user || {}; // Extract user email

    // Fetch user details (like badge) based on email
    const { data: userDetails, isLoading: userLoading } = useQuery({
        queryKey: ["userDetails", email],
        queryFn: async () => {
            const response = await axios.get(`https://hostel-meal-system-server-a12.vercel.app/user-details?email=${email}`);
            return response.data.data;
        },
        enabled: !!email, // Only run the query if email is defined
    });

    const { badge, _id: userId } = userDetails || {}; // Extract badge and userId

    // Fetch upcoming meals
    const { data: meals, isLoading: mealsLoading, isError, refetch } = useQuery({
        queryKey: ["upcomingMeals"],
        queryFn: fetchUpcomingMeals,
    });

    if (userLoading || mealsLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading meals!</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Upcoming Meals</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {meals.map((meal) => (
                    <div key={meal._id} className="card shadow-lg border rounded-lg">
                        <figure>
                            <img
                                src={meal.image}
                                alt={meal.title}
                                className="rounded-t-lg w-full h-48 object-cover"
                            />
                        </figure>
                        <div className="p-4">
                            <h2 className="text-lg font-semibold">{meal.title}</h2>
                            <p className="text-sm text-gray-500">{meal.category}</p>
                            <p className="mt-2 text-gray-700">{meal.description}</p>
                            <p className="mt-2 text-gray-800 font-bold">Price: ${meal.price}</p>
                            <p className="text-sm text-gray-500">Likes: {meal.likeCount}</p>

                            {/* Check if the user has the right badge */}
                            {["Platinum", "Gold", "Silver"].includes(badge) ? (
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full"
                                    onClick={() => handleLike(meal._id, userId, refetch)}
                                >
                                    Like
                                </button>
                            ) : (
                                <p className="text-red-500 mt-4 text-sm">
                                    Only Platinum, Gold, or Silver members can like.
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpcomingMeals;
