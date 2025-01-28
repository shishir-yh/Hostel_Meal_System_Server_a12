import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";

const AllReviews = () => {
    // Fetch all reviews
    const { data: reviews = [], refetch, isLoading } = useQuery({
        queryKey: ["reviews"],
        queryFn: async () => {
            const res = await axios.get("https://hostel-meal-system-server-a12.vercel.app/reviewsAdmin"); // Fetch all reviews
            return res.data;
        },
    });

    // Display a loading spinner while fetching data
    if (isLoading) {
        return <div className="text-center mt-20">Loading reviews...</div>;
    }

    // Handle "View Meal" action
    // const handleViewMeal = (review) => {
    //     Swal.fire({
    //         title: "Meal Details",
    //         text: `Meal Title: ${review.mealTitle}`,
    //         icon: "info",
    //     });
    // };

    // Handle "Delete" action
    const handleDeleteReview = (review) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This review will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`https://hostel-meal-system-server-a12.vercel.app/reviewsAdmin/${review._id}`).then((res) => {
                    if (res.data.success) {
                        refetch(); // Re-fetch reviews after deletion
                        Swal.fire("Deleted!", "The review has been deleted.", "success");
                    }
                });
            }
        });
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">All Reviews</h2>

            {/* Reviews Table */}
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
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
                            <tr key={review._id}>
                                <td>{index + 1}</td>
                                <td>{review.title || "N/A"}</td>
                                <td>{review.likeCount || 0}</td>
                                <td>{review.reviewCount || 0}</td>
                                <td>

                                    <a
                                        href={`/meal/${review.mealId}`}
                                        className="btn btn-primary btn-xs md:btn-sm"
                                    >
                                        View Meal
                                    </a>




                                    <button
                                        onClick={() => handleDeleteReview(review)}
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
        </div>
    );
};

export default AllReviews;
