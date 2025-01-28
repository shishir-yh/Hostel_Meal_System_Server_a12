import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Modal from "react-modal";
import Swal from "sweetalert2";  // Import SweetAlert2

// Fetch Meals Function
const fetchMeals = async (sortBy) => {
    const response = await axios.get("https://hostel-meal-system-server-a12.vercel.app/meals", {
        params: { sortBy },
    });
    return response.data;
};

const AllMeals = () => {
    const [sortBy, setSortBy] = useState("");
    const [selectedMeal, setSelectedMeal] = useState(null); // To store the meal being updated
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [updatedMeal, setUpdatedMeal] = useState(null); // To store the updated meal data

    const { data: meals = [], refetch } = useQuery({
        queryKey: ["meals", sortBy],
        queryFn: () => fetchMeals(sortBy),
        keepPreviousData: true,
    });

    // Handle Delete Meal
    const handleDelete = async (mealId) => {
        try {
            await axios.delete(`https://hostel-meal-system-server-a12.vercel.app/meals/${mealId}`);
            Swal.fire({
                title: "Success",
                text: "Meal deleted successfully!",
                icon: "success",
            });
            refetch(); // Refresh the list
        } catch (error) {
            console.error("Error deleting meal:", error);
            Swal.fire({
                title: "Error",
                text: "Failed to delete meal.",
                icon: "error",
            });
        }
    };

    // Handle Update Meal Modal Open

    const handleUpdate = (meal) => {
        setSelectedMeal(meal);
        setUpdatedMeal(meal); // Set initial values for the modal form
        setIsModalOpen(true);
    };

    // Handle Input Change (Update Meal)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedMeal((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleUpdateSubmit = async () => {
        try {
            const updatedMealData = {
                title: updatedMeal.title,
                category: updatedMeal.category,
                ingredients: updatedMeal.ingredients,
                description: updatedMeal.description,
                price: updatedMeal.price,
                distributorName: updatedMeal.distributorName || "Unknown Admin",
            };

            const response = await fetch(`https://hostel-meal-system-server-a12.vercel.app/meals/${selectedMeal._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedMealData),
            });

            const result = await response.json();
            if (response.ok) {
                Swal.fire({
                    title: "Success",
                    text: "Meal updated successfully!",
                    icon: "success",
                });
                setIsModalOpen(false);
                refetch(); // Refresh meals list
            } else {
                Swal.fire({
                    title: "Error",
                    text: result.error || "Failed to update meal.",
                    icon: "error",
                });
            }
        } catch (error) {
            console.error("Error updating meal:", error);
            Swal.fire({
                title: "Error",
                text: "An error occurred. Please try again.",
                icon: "error",
            });
        }
    };


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Meals</h1>

            {/* Sorting Buttons */}
            <div className="mb-4 flex flex-wrap gap-2">
                <button
                    onClick={() => setSortBy("likes")}
                    className={`btn btn-sm ${sortBy === "likes" ? "btn-primary" : "btn-outline"}`}
                >
                    Sort by Likes
                </button>
                <button
                    onClick={() => setSortBy("reviews_count")}
                    className={`btn btn-sm ${sortBy === "reviews_count" ? "btn-primary" : "btn-outline"}`}
                >
                    Sort by Reviews Count
                </button>
            </div>

            {/* Meals Table */}
            <div className="overflow-x-auto">
                <table className="table-auto w-full border text-sm md:text-base">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Meal Title</th>
                            <th>Likes</th>
                            <th>Reviews Count</th>
                            <th>Rating</th>
                            <th>Distributor</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meals.map((meal, index) => (
                            <tr key={meal._id}>
                                <td>{index + 1}</td>
                                <td>{meal.title}</td>
                                <td>{meal.likeCount}</td>
                                <td>{meal.reviewCount}</td>
                                <td>{meal.rating || "N/A"}</td>
                                <td>{meal.distributorName || "N/A"}</td>
                                <td>
                                    <div className="flex flex-wrap gap-2">

                                        <button
                                            className="btn btn-warning btn-xs md:btn-sm"
                                            onClick={() => handleUpdate(meal)}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="btn btn-error btn-xs md:btn-sm"
                                            onClick={() => handleDelete(meal._id)}
                                        >
                                            Delete
                                        </button>
                                        <a
                                            href={`/meal/${meal._id}`}
                                            className="btn btn-primary btn-xs md:btn-sm"
                                        >
                                            View Meal
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Update Meal Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-xl font-bold mb-4">Update Meal</h2>
                <form className="space-y-4">
                    {/* Meal Title */}
                    <input
                        type="text"
                        name="title"
                        value={updatedMeal?.title || ""}
                        onChange={handleInputChange}
                        placeholder="Meal Title"
                        className="input input-bordered w-full"
                    />

                    {/* Category Dropdown */}
                    <select
                        name="category"
                        value={updatedMeal?.category || ""}
                        onChange={handleInputChange}
                        className="select select-bordered w-full"
                    >
                        <option value="" disabled>
                            Select Category
                        </option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                    </select>

                    {/* Ingredients */}
                    <textarea
                        name="ingredients"
                        value={updatedMeal?.ingredients || ""}
                        onChange={handleInputChange}
                        placeholder="Ingredients"
                        className="textarea textarea-bordered w-full"
                    />

                    {/* Description */}
                    <textarea
                        name="description"
                        value={updatedMeal?.description || ""}
                        onChange={handleInputChange}
                        placeholder="Description"
                        className="textarea textarea-bordered w-full"
                    />

                    {/* Price */}
                    <input
                        type="number"
                        name="price"
                        value={updatedMeal?.price || ""}
                        onChange={handleInputChange}
                        placeholder="Price (e.g., 100)"
                        className="input input-bordered w-full"
                    />

                    {/* Distributor Name */}
                    <input
                        name="distributorName"
                        value={updatedMeal?.distributorName || "Unknown Admin"}
                        className="input input-bordered w-full bg-gray-200"
                        readOnly
                    />

                    {/* Submit Button */}
                    <button
                        type="button"
                        onClick={handleUpdateSubmit}
                        className="btn btn-primary"
                    >
                        Update Meal
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default AllMeals;
