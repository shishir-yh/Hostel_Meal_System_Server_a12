
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Provider/AuthProvider";

const AddMeal = () => {
    const { user } = useContext(AuthContext); // Retrieve user from AuthContext
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("image", data.image[0]);

        try {
            // Step 4: Upload Image to ImageBB
            const response = await axios.post(
                `https://api.imgbb.com/1/upload?key=84e44e36521247338cc9908804304bef`,
                formData
            );

            const imageUrl = response.data.data.url; // Get the URL of the uploaded image
            console.log("Image URL:", imageUrl);

            // Save Meal Data to the Backend
            const mealData = {
                title: data.title,
                category: data.category,
                image: imageUrl,
                ingredients: data.ingredients,
                description: data.description,
                price: parseInt(data.price), // Convert price to integer
                distributorName: user?.displayName || "Unknown Admin", // Use the admin's name from AuthContext
                distributorEmail: user?.email || "unknown@example.com", // Use the admin's email from AuthContext
                rating: parseInt(data.rating) || 0, // Added rating (default to 0 if not provided)
                likes: 0,
                reviewsCount: 0,
                postTime: new Date(),
            };

            await axios.post("https://hostel-meal-system-server-a12.vercel.app/meals", mealData);

            // SweetAlert success message
            Swal.fire({
                title: "Success!",
                text: "Meal added successfully!",
                icon: "success",
                confirmButtonText: "OK",
            });

            reset(); // Reset the form
        } catch (error) {
            console.error("Error uploading image:", error);

            // SweetAlert error message
            Swal.fire({
                title: "Error!",
                text: "Failed to upload image or add meal.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Meal Title */}
            <input
                {...register("title", { required: true })}
                placeholder="Meal Title"
                className="input input-bordered w-full"
            />

            {/* Category Dropdown */}
            <select
                {...register("category", { required: true })}
                className="select select-bordered w-full"
            >
                <option value="" disabled selected>
                    Select Category
                </option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
            </select>

            {/* Ingredients */}
            <textarea
                {...register("ingredients", { required: true })}
                placeholder="Ingredients"
                className="textarea textarea-bordered w-full"
            />

            {/* Description */}
            <textarea
                {...register("description", { required: true })}
                placeholder="Description"
                className="textarea textarea-bordered w-full"
            />

            {/* Price (Integer Only) */}
            <input
                type="number"
                {...register("price", { required: true, valueAsNumber: true })}
                placeholder="Price (e.g., 100)"
                className="input input-bordered w-full"
            />

            {/* Image Upload */}
            <input
                type="file"
                {...register("image", { required: true })}
                className="file-input file-input-bordered w-full"
            />

            {/* Rating (1 to 5) */}
            <div className="flex items-center space-x-2">
                <label>Rating: </label>
                <select
                    {...register("rating", { required: true })}
                    className="select select-bordered w-20"
                >
                    <option value="" disabled selected>
                        Select Rating
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>

            {/* Readonly Distributor Name and Email */}
            <input
                value={user?.displayName || "Unknown Admin"}
                className="input input-bordered w-full bg-gray-200"
                readOnly
            />
            <input
                value={user?.email || "unknown@example.com"}
                className="input input-bordered w-full bg-gray-200"
                readOnly
            />

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary">
                Add Meal
            </button>
        </form>
    );
};

export default AddMeal;
