import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "react-modal"; // Ensure this is installed via npm install react-modal

// Fetch upcoming meals
const fetchUpcomingMeals = async () => {
    const { data } = await axios.get("https://hostel-meal-system-server-a12.vercel.app/upcoming-meals-admin");
    return data;
};

const UpcomingMealsadmin = () => {
    const { data: meals, isLoading, isError, refetch } = useQuery({
        queryKey: ["upcomingMealsAdmin"], // Pass query key as an object
        queryFn: fetchUpcomingMeals,     // Pass query function as part of the object
    });

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newMeal, setNewMeal] = useState({});

    // Publish Meal Handler
    const handlePublish = async (mealId) => {
        try {
            const response = await axios.post("https://hostel-meal-system-server-a12.vercel.app/publish-meal", { mealId });

            if (response.data.success) {
                Swal.fire("Success!", response.data.message, "success");
                refetch(); // Refetch the data after publishing
            } else {
                Swal.fire("Info", response.data.message, "info");
            }
        } catch (error) {
            console.error("Publish Error:", error.response?.data || error.message); // Log error for debugging
            Swal.fire("Error!", error.response?.data?.message || "Something went wrong.", "error");
        }
    };


    // Add Upcoming Meal Handler
    const handleAddMeal = async () => {
        try {
            const response = await axios.post("https://hostel-meal-system-server-a12.vercel.app/add-upcoming-meal", newMeal);
            if (response.data.success) {
                Swal.fire("Success!", response.data.message, "success");
                setModalIsOpen(false);
                refetch(); // Refetch the data after adding a new meal
            }
        } catch (error) {
            Swal.fire("Error!", error.response?.data?.message || "Something went wrong.", "error");
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading meals!</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Upcoming Meals (Admin)</h1>
            <button
                className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                onClick={() => setModalIsOpen(true)}
            >
                Add Upcoming Meal
            </button>
            <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2">Title</th>
                        <th className="border px-4 py-2">Category</th>
                        <th className="border px-4 py-2">Likes</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {meals.map((meal) => (
                        <tr key={meal._id} className="text-center">
                            <td className="border px-4 py-2">{meal.title}</td>
                            <td className="border px-4 py-2">{meal.category}</td>
                            <td className="border px-4 py-2">{meal.likeCount}</td>
                            <td className="border px-4 py-2">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={() => handlePublish(meal._id)}
                                >
                                    Publish
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for Adding Upcoming Meal */}
            <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Add Upcoming Meal</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAddMeal();
                    }}
                >
                    <input
                        type="text"
                        placeholder="Title"
                        className="border px-4 py-2 w-full mb-2"
                        onChange={(e) => setNewMeal({ ...newMeal, title: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        className="border px-4 py-2 w-full mb-2"
                        onChange={(e) => setNewMeal({ ...newMeal, category: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Image URL"
                        className="border px-4 py-2 w-full mb-2"
                        onChange={(e) => setNewMeal({ ...newMeal, image: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        className="border px-4 py-2 w-full mb-2"
                        onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })}
                        required
                    ></textarea>
                    <input
                        type="number"
                        placeholder="Price"
                        className="border px-4 py-2 w-full mb-2"
                        onChange={(e) => setNewMeal({ ...newMeal, price: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Distributor Name"
                        className="border px-4 py-2 w-full mb-2"
                        onChange={(e) => setNewMeal({ ...newMeal, distributorName: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Distributor Email"
                        className="border px-4 py-2 w-full mb-2"
                        onChange={(e) => setNewMeal({ ...newMeal, distributorEmail: e.target.value })}
                        required
                    />
                    <button className="bg-green-500 text-white px-4 py-2 rounded w-full" type="submit">
                        Add Meal
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default UpcomingMealsadmin;



// import React, { useState, useContext } from "react";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import Swal from "sweetalert2";
// import Modal from "react-modal";
// import { AuthContext } from "../../../Provider/AuthProvider"; // Adjust the path as needed

// const fetchUpcomingMeals = async () => {
//     const { data } = await axios.get("https://hostel-meal-system-server-a12.vercel.app/upcoming-meals-admin");
//     return data;
// };

// const UpcomingMealsadmin = () => {
//     const { data: meals, isLoading, isError, refetch } = useQuery({
//         queryKey: ["upcomingMealsAdmin"],
//         queryFn: fetchUpcomingMeals,
//     });

//     const { user } = useContext(AuthContext);
//     const [modalIsOpen, setModalIsOpen] = useState(false);
//     const [newMeal, setNewMeal] = useState({});

//     const handlePublish = async (mealId) => {
//         try {
//             const response = await axios.post("https://hostel-meal-system-server-a12.vercel.app/publish-meal", { mealId });
//             if (response.data.success) {
//                 Swal.fire("Success!", response.data.message, "success");
//                 refetch();
//             } else {
//                 Swal.fire("Info", response.data.message, "info");
//             }
//         } catch (error) {
//             console.error("Publish Error:", error.response?.data || error.message);
//             Swal.fire("Error!", error.response?.data?.message || "Something went wrong.", "error");
//         }
//     };

//     const handleAddMeal = async () => {
//         try {
//             const response = await axios.post("https://hostel-meal-system-server-a12.vercel.app/add-upcoming-meal", newMeal);
//             if (response.data.success) {
//                 Swal.fire("Success!", response.data.message, "success");
//                 setModalIsOpen(false);
//                 refetch();
//             }
//         } catch (error) {
//             Swal.fire("Error!", error.response?.data?.message || "Something went wrong.", "error");
//         }
//     };

//     const handleLike = async (mealId) => {
//         try {
//             const response = await axios.post("https://hostel-meal-system-server-a12.vercel.app/like-meal", { mealId, userId: user.id });
//             if (response.data.success) {
//                 Swal.fire("Success!", response.data.message, "success");
//                 refetch();
//             } else {
//                 Swal.fire("Info", response.data.message, "info");
//             }
//         } catch (error) {
//             console.error("Like Error:", error.response?.data || error.message);
//             Swal.fire("Error!", error.response?.data?.message || "Something went wrong.", "error");
//         }
//     };

//     if (isLoading) return <div>Loading...</div>;
//     if (isError) return <div>Error loading meals!</div>;

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-2xl font-bold mb-4">Upcoming Meals (Admin)</h1>
//             <button
//                 className="bg-green-500 text-white px-4 py-2 rounded mb-4"
//                 onClick={() => setModalIsOpen(true)}
//             >
//                 Add Upcoming Meal
//             </button>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {meals.map((meal) => (
//                     <div key={meal._id} className="border p-4 rounded shadow">
//                         <h2 className="text-xl font-bold">{meal.title}</h2>
//                         <p>{meal.category}</p>
//                         <p>{meal.description}</p>
//                         <p>Price: ${meal.price}</p>
//                         <p>Distributor: {meal.distributorName}</p>
//                         <p>Likes: {meal.likeCount}</p>
//                         <button
//                             className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
//                             onClick={() => handlePublish(meal._id)}
//                         >
//                             Publish
//                         </button>
//                         {["Silver", "Gold", "Platinum"].includes(user.membership) && (
//                             <button
//                                 className="bg-yellow-500 text-white px-4 py-2 rounded mt-2 ml-2"
//                                 onClick={() => handleLike(meal._id)}
//                             >
//                                 Like
//                             </button>
//                         )}
//                     </div>
//                 ))}
//             </div>

//             <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
//                 <h2 className="text-xl font-bold mb-4">Add Upcoming Meal</h2>
//                 <form
//                     onSubmit={(e) => {
//                         e.preventDefault();
//                         handleAddMeal();
//                     }}
//                 >
//                     <input
//                         type="text"
//                         placeholder="Title"
//                         className="border px-4 py-2 w-full mb-2"
//                         onChange={(e) => setNewMeal({ ...newMeal, title: e.target.value })}
//                         required
//                     />
//                     <input
//                         type="text"
//                         placeholder="Category"
//                         className="border px-4 py-2 w-full mb-2"
//                         onChange={(e) => setNewMeal({ ...newMeal, category: e.target.value })}
//                         required
//                     />
//                     <input
//                         type="text"
//                         placeholder="Image URL"
//                         className="border px-4 py-2 w-full mb-2"
//                         onChange={(e) => setNewMeal({ ...newMeal, image: e.target.value })}
//                         required
//                     />
//                     <textarea
//                         placeholder="Description"
//                         className="border px-4 py-2 w-full mb-2"
//                         onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })}
//                         required
//                     ></textarea>
//                     <input
//                         type="number"
//                         placeholder="Price"
//                         className="border px-4 py-2 w-full mb-2"
//                         onChange={(e) => setNewMeal({ ...newMeal, price: e.target.value })}
//                         required
//                     />
//                     <input
//                         type="text"
//                         placeholder="Distributor Name"
//                         className="border px-4 py-2 w-full mb-2"
//                         onChange={(e) => setNewMeal({ ...newMeal, distributorName: e.target.value })}
//                         required
//                     />
//                     <input
//                         type="email"
//                         placeholder="Distributor Email"
//                         className="border px-4 py-2 w-full mb-2"
//                         onChange={(e) => setNewMeal({ ...newMeal, distributorEmail: e.target.value })}
//                         required
//                     />
//                     <button className="bg-green-500 text-white px-4 py-2 rounded w-full" type="submit">
//                         Add Meal
//                     </button>
//                 </form>
//             </Modal>
//         </div>
//     );
// };

// export default UpcomingMealsadmin;

// const handleRequestMeal = async (mealId) => {
//     try {
//         const response = await axios.post("https://hostel-meal-system-server-a12.vercel.app/request-upcoming-meal", { mealId, userId: user.id });
//         if (response.data.success) {
//             Swal.fire("Success!", response.data.message, "success");
//             refetch();
//         } else {
//             Swal.fire("Info", response.data.message, "info");
//         }
//     } catch (error) {
//         console.error("Request Error:", error.response?.data || error.message);
//         Swal.fire("Error!", error.response?.data?.message || "Something went wrong.", "error");
//     }
// };

// // Add this button inside the meal card
// <button
//     className="bg-purple-500 text-white px-4 py-2 rounded mt-2 ml-2"
//     onClick={() => handleRequestMeal(meal._id)}
// >
//     Request Meal
// </button>
// const handleRequestMeal = async (mealId) => {
//     try {
//         const response = await axios.post("https://hostel-meal-system-server-a12.vercel.app/request-upcoming-meal", { mealId, userId: user.id });
//         if (response.data.success) {
//             Swal.fire("Success!", response.data.message, "success");
//             refetch();
//         } else {
//             Swal.fire("Info", response.data.message, "info");
//         }
//     } catch (error) {
//         console.error("Request Error:", error.response?.data || error.message);
//         Swal.fire("Error!", error.response?.data?.message || "Something went wrong.", "error");
//     }
// };

// // Add this button inside the meal card
// <button
//     className="bg-purple-500 text-white px-4 py-2 rounded mt-2 ml-2"
//     onClick={() => handleRequestMeal(meal._id)}
// >
//     Request Meal
// </button>