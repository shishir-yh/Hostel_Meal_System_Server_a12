import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Provider/AuthProvider";

const RequestedMeal = () => {
    const { user } = useContext(AuthContext); // Get the logged-in user
    // console.log(user)
    // Fetch meal requests for the logged-in user
    const { data: mealRequests = [], isLoading, refetch } = useQuery({
        queryKey: ["mealRequests", user?.email],
        queryFn: async () => {
            const response = await axios.get(`https://hostel-meal-system-server-a12.vercel.app/meal-requests?userId=${user?.email}`);
            return response.data;
        },
        enabled: !!user?.email, // Run query only if user ID exists
    });

    // Handle meal request cancellation
    const handleCancel = (requestId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, cancel it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`https://hostel-meal-system-server-a12.vercel.app/meal-requests/${requestId}`);
                    Swal.fire("Success", response.data.message, "success");
                    refetch(); // Refresh the meal requests
                } catch (error) {
                    Swal.fire(
                        "Error",
                        error.response?.data?.message || "Failed to cancel the request.",
                        "error"
                    );
                }
            }
        });
    };

    if (isLoading) {
        return <div className="text-center my-8">Loading requested meals...</div>;
    }

    return (
        <div className="container mx-auto my-8 p-4">
            <h1 className="text-2xl font-bold mb-4">Requested Meals</h1>
            {mealRequests.length === 0 ? (
                <p className="text-gray-600">You have not requested any meals yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full border border-gray-200">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Meal Title</th>
                                <th>Likes</th>
                                <th>Reviews Count</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mealRequests.map((request, index) => (
                                <tr key={request._id} className="hover">
                                    <td>{index + 1}</td>
                                    <td>{request.mealTitle}</td>
                                    <td>{request.likeCount}</td>
                                    <td>{request.reviewCount}</td>
                                    <td>{request.status}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-error"
                                            onClick={() => handleCancel(request._id)}
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RequestedMeal;
