import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaTrashAlt, FaUsers } from "react-icons/fa";
import Swal from "sweetalert2";

const ManageUsers = () => {
    // Fetch all users
    const { data: users = [], refetch, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axios.get("https://hostel-meal-system-server-a12.vercel.app/users"); // Update with your actual endpoint
            return res.data;
        },
    });

    // Display a loading spinner while fetching data
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    const handleMakeAdmin = (user) => {
        axios.patch(`https://hostel-meal-system-server-a12.vercel.app/users/admin/${user._id}`).then((res) => {
            if (res.data.modifiedCount > 0) {
                refetch(); // Re-fetch users after updating a role
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `${user.name} is now an Admin!`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        });
    };

    const handleDeleteUser = (user) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`https://hostel-meal-system-server-a12.vercel.app/users/${user._id}`).then((res) => {
                    if (res.data.deletedCount > 0) {
                        refetch(); // Re-fetch users after deletion
                        Swal.fire({
                            title: "Deleted!",
                            text: "The user has been removed.",
                            icon: "success",
                        });
                    }
                });
            }
        });
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">All Users</h2>

            {/* User Table */}
            <div className="overflow-x-auto hidden lg:block">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>{user.name || "N/A"}</td>
                                <td>{user.email || "N/A"}</td>
                                <td>
                                    {user.role === "admin" ? (
                                        <span className="text-green-500 font-semibold">Admin</span>
                                    ) : (
                                        <button
                                            onClick={() => handleMakeAdmin(user)}
                                            className="btn btn-sm bg-orange-500 text-white"
                                        >
                                            <FaUsers className="text-2xl" />
                                        </button>
                                    )}
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleDeleteUser(user)}
                                        className="btn btn-sm btn-error text-white"
                                    >
                                        <FaTrashAlt className="text-lg" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View - Buttons Below */}
            <div className="block lg:hidden">
                {users.map((user, index) => (
                    <div
                        key={user._id}
                        className="bg-gray-100 p-4 rounded-lg shadow-md mb-4"
                    >
                        <p className="font-bold text-lg mb-2">
                            {index + 1}. {user.name || "N/A"}
                        </p>
                        <p className="text-gray-600 mb-2">Email: {user.email || "N/A"}</p>
                        <p className="text-gray-600 mb-4">
                            Role:{" "}
                            {user.role === "admin" ? (
                                <span className="text-green-500 font-semibold">Admin</span>
                            ) : (
                                "User"
                            )}
                        </p>
                        <div className="flex flex-col gap-2">
                            {user.role !== "admin" && (
                                <button
                                    onClick={() => handleMakeAdmin(user)}
                                    className="btn bg-orange-500 text-white w-full"
                                >
                                    Make Admin
                                </button>
                            )}
                            <button
                                onClick={() => handleDeleteUser(user)}
                                className="btn btn-error text-white w-full"
                            >
                                Delete User
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageUsers;
