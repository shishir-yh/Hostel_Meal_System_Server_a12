import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { useContext } from "react";
import { AuthContext } from "../../../Provider/AuthProvider";
import { Link } from "react-router-dom";

const MyReview = () => {
    // Access user data from AuthContext
    const { user } = useContext(AuthContext);

    // Fetch user reviews using TanStack Query
    const { data: reviews = [], isLoading, refetch } = useQuery({
        queryKey: ["myReviews", user?.email], // The key for caching and refetching
        queryFn: async () => {
            const response = await axios.get(`https://hostel-meal-system-server-a12.vercel.app/reviews?userId=${user?.email}`);
            return response.data; // Return fetched data
        },
        enabled: !!user?.email, // Ensure the query runs only when user email exists
    });
    console.log(reviews)

    // Handle review deletion
    const handleDelete = async (reviewId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`https://hostel-meal-system-server-a12.vercel.app/reviews/${reviewId}`);
                    Swal.fire("Success", response.data.message, "success");
                    refetch(); // Refresh the reviews
                } catch (error) {
                    Swal.fire(
                        "Error",
                        error.response?.data?.message || "Failed to delete the review",
                        "error"
                    );
                }
            }
        });
    };

    // Handle review update
    const handleUpdate = async (review) => {
        Swal.fire({
            title: "Edit Your Review",
            input: "textarea",
            inputLabel: "Review Text",
            inputValue: review.reviewText,
            showCancelButton: true,
            confirmButtonText: "Update",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const updatedReview = { ...review, reviewText: result.value };
                try {
                    const response = await axios.put(
                        `https://hostel-meal-system-server-a12.vercel.app/reviews/${review._id}`,
                        updatedReview
                    );
                    Swal.fire("Success", response.data.message, "success");
                    refetch(); // Refresh the reviews
                } catch (error) {
                    Swal.fire(
                        "Error",
                        error.response?.data?.message || "Failed to update the review",
                        "error"
                    );
                }
            }
        });
    };

    if (isLoading) {
        return <div className="text-center my-8">Loading reviews...</div>;
    }

    return (
        <div className="container mx-auto my-8 p-4">
            <h1 className="text-2xl font-bold mb-4">My Reviews</h1>
            {reviews.length === 0 ? (
                <p className="text-gray-600">You have not submitted any reviews yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full border border-gray-200">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Meal Title</th>
                                <th>Likes</th>
                                <th>Reviews Count</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((review, index) => (
                                <tr key={review._id} className="hover">
                                    <td>{index + 1}</td>
                                    <td>{review.title}</td>
                                    <td>{review.likeCount}</td>
                                    <td>{review.
                                        reviewText}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning mr-2"
                                            onClick={() => handleUpdate(review)}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="btn btn-sm btn-error mr-2"
                                            onClick={() => handleDelete(review._id)}
                                        >
                                            Delete
                                        </button>
                                        {/* <a
                                            href={`/meals/${review.mealId}`}
                                            className="btn btn-sm btn-primary"
                                        >
                                            View Meal
                                        </a> */}

                                        <Link to={`/meal/${review.mealId}`}>
                                            <button className="btn btn-sm btn-primary">
                                                View Meal
                                            </button>
                                        </Link>
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

export default MyReview;

