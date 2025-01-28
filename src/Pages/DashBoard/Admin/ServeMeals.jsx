import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";

// Fetch Meal Requests Function
const fetchMealRequests = async (search) => {
    const { data } = await axios.get("https://hostel-meal-system-server-a12.vercel.app/admin-meal-requests", {
        params: { search },
    });
    return data.data; // Extract meal requests from the response
};

const ServeMeals = () => {
    const [search, setSearch] = useState(""); // Search term state

    // Tanstack Query for fetching meal requests
    const { data: mealRequests = [], refetch, isLoading, isError } = useQuery({
        queryKey: ["mealRequests", search],
        queryFn: () => fetchMealRequests(search),
        keepPreviousData: true,
    });

    // Handle Update Status to Delivered
    const handleServe = async (id) => {
        Swal.fire({
            title: "Mark as Delivered?",
            text: "Are you sure you want to serve this meal?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, serve it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.put(`https://hostel-meal-system-server-a12.vercel.app/admin-meal-requests/${id}`);
                    Swal.fire("Served!", "The meal has been marked as delivered.", "success");
                    refetch(); // Refresh the list after updating
                } catch (error) {
                    Swal.fire("Error!", "Failed to update meal request status.", "error");
                }
            }
        });
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching meal requests.</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Meal Requests</h1>

            {/* Search Input */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by email or meal title"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input input-bordered w-full"
                />
            </div>

            {/* Meal Requests Table */}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">Meal Title</th>
                        <th className="border border-gray-300 p-2">User Email</th>
                        <th className="border border-gray-300 p-2">Requested By</th>
                        <th className="border border-gray-300 p-2">Status</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {mealRequests.map((request) => (
                        <tr key={request._id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2">{request.mealTitle}</td>
                            <td className="border border-gray-300 p-2">{request.userId}</td>
                            <td className="border border-gray-300 p-2">{request.userId.split("@")[0]}</td>
                            <td className="border border-gray-300 p-2">{request.status}</td>
                            <td className="border border-gray-300 p-2">
                                {request.status !== "delivered" && (
                                    <button
                                        className="bg-green-500 text-white px-2 py-1 rounded"
                                        onClick={() => handleServe(request._id)}
                                    >
                                        Serve
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ServeMeals;
