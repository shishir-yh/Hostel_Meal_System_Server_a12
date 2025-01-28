import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import axios from "axios";
import useAuth from "../../Hooks/useAuth";

const MealsDetailsPage = () => {
    const { id } = useParams(); // Get the meal ID from the URL
    const { user } = useAuth(); // Get user data from auth context
    const [reviewText, setReviewText] = useState("");

    // Fetch meal details using Axios and React Query
    const { data: meal, isLoading, isError, refetch } = useQuery({
        queryKey: ["mealDetails", id],
        queryFn: async () => {
            const response = await axios.get(`https://hostel-meal-system-server-a12.vercel.app/allMeal/${id}`);
            return response.data;
        },
    });

    // Fetch user details (e.g., badge) based on email
    const { data: userDetails, isLoading: userLoading } = useQuery({
        queryKey: ["userDetails", user?.email],
        queryFn: async () => {
            const response = await axios.get(`https://hostel-meal-system-server-a12.vercel.app/user-details?email=${user?.email}`);
            return response.data.data;
        },
        enabled: !!user?.email,
    });

    const { badge } = userDetails || {};

    // Helper function to check if user has a valid badge
    const hasValidBadge = (badge) => ["Platinum", "Gold", "Silver"].includes(badge);

    // Show loader during data fetching
    if (isLoading || userLoading)
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );

    // Show error message if there's an issue
    if (isError || !meal)
        return <div>Something went wrong while loading the meal details.</div>;

    // Destructure meal details
    const { category, details, distributorName, image, ingredients, postTime, price, title, likeCount, reviewCount } = meal;

    // Handle the Request Meal
    const handleRequestMeal = async () => {
        if (!user) {
            Swal.fire("Error", "Please log in to request this meal", "error");
            return;
        }

        if (!hasValidBadge(badge)) {
            Swal.fire("Error", "Only Platinum, Gold, or Silver members can request meals", "error");
            return;
        }

        try {
            const response = await axios.post("https://hostel-meal-system-server-a12.vercel.app/meal-request", {
                mealId: id,
                userId: user.email,
                mealTitle: title,
                likeCount: likeCount,
                reviewCount: reviewCount,
                requestTime: new Date(),
            });

            if (response.data.success) {
                Swal.fire("Success", "Your meal request has been sent!", "success");
                refetch();
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            Swal.fire("Error", errorMessage, "error");
        }
    };

    // Handle the like
    const handleLikeMeal = async () => {
        if (!user) {
            Swal.fire("Error", "Please log in to like this meal", "error");
            return;
        }

        try {
            const response = await axios.post("https://hostel-meal-system-server-a12.vercel.app/like", {
                mealId: id,
                userId: user.email,
            });

            if (response.data.success) {
                Swal.fire("Success", "You liked this meal!", "success");
                refetch();
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            Swal.fire("Error", errorMessage, "error");
        }
    };

    // Handle review submission
    const handleSubmitReview = async () => {
        if (!user) {
            Swal.fire("Error", "Please log in to submit a review", "error");
            return;
        }

        if (!reviewText.trim()) {
            Swal.fire("Error", "Review cannot be empty", "error");
            return;
        }

        try {
            const response = await axios.post("https://hostel-meal-system-server-a12.vercel.app/review", {
                mealId: id,
                userId: user.email,
                reviewText,
                title,
                likeCount,
                reviewCount,
            });

            if (response.data.success) {
                Swal.fire("Success", "Your review has been submitted!", "success");
                setReviewText("");
                refetch();
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to submit your review.";
            Swal.fire("Error", errorMessage, "error");
        }
    };

    return (
        <div className="p-6 bg-base-100 text-base-content max-w-4xl mx-auto">
            {/* Image and Title Section */}
            <div className="flex flex-col lg:flex-row items-center gap-6">
                <img src={image} alt={title} className="rounded-lg shadow-lg w-full lg:w-1/3" />
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{title}</h1>
                    <p className="text-sm text-gray-500">Category: {category}</p>
                </div>
            </div>

            {/* Details Section */}
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Details</h2>
                <p className="text-base mb-4">{details}</p>

                <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
                <ul className="list-disc pl-6 mb-4">
                    {Array.isArray(ingredients) ? (
                        ingredients.map((ingredient, index) => (
                            <li key={index} className="text-base">
                                {ingredient}
                            </li>
                        ))
                    ) : (
                        <li className="text-base">{ingredients || "No ingredients available"}</li>
                    )}
                </ul>

                <div className="flex justify-between items-center mt-4">
                    <p className="text-lg font-semibold text-primary">Price: ${price}</p>
                    <p className="text-sm text-gray-500">Posted: {new Date(postTime).toLocaleDateString()}</p>
                </div>

                <p className="text-sm text-gray-500 mt-2">Distributor: {distributorName}</p>
            </div>

            {/* User Actions */}
            <div className="mt-4 flex gap-4">
                <button className="btn btn-primary" onClick={handleLikeMeal}>
                    👍 Like ({likeCount || 0})
                </button>
                {hasValidBadge(badge) ? (
                    <button className="btn btn-secondary" onClick={handleRequestMeal}>
                        Request Meal
                    </button>
                ) : (
                    <p className="text-red-500 text-sm mt-4">
                        Only Platinum, Gold, or Silver members can request this meal.
                    </p>
                )}
            </div>

            <br />
            <div>The total reviews: {reviewCount}</div>

            {/* Review Form */}
            <div className="review-form mt-4">
                <textarea
                    placeholder="Write your review here..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="textarea textarea-bordered w-full"
                    rows="5"
                ></textarea>
                <button onClick={handleSubmitReview} className="btn btn-success mt-4">
                    Submit Review
                </button>
            </div>
        </div>
    );
};

export default MealsDetailsPage;






// import { useState } from "react";
// import { useParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import Swal from "sweetalert2";
// import "sweetalert2/src/sweetalert2.scss";
// import axios from "axios";
// import useAuth from "../../Hooks/useAuth";

// const MealsDetailsPage = () => {
//     const { id } = useParams(); // Get the meal ID from the URL
//     const { user } = useAuth(); // Get user data from auth context
//     const [reviewText, setReviewText] = useState("");

//     // Fetch meal details using Axios and React Query
//     const { data: meal, isLoading, isError, refetch } = useQuery({
//         queryKey: ["mealDetails", id],
//         queryFn: async () => {
//             const response = await axios.get(`https://hostel-meal-system-server-a12.vercel.app/allMeal/${id}`);
//             return response.data;
//         },
//     });

//     // Fetch reviews for the meal
//     const { data: reviews = [] } = useQuery({
//         queryKey: ["mealReviews", id],
//         queryFn: async () => {
//             const response = await axios.get(`https://hostel-meal-system-server-a12.vercel.app/reviews?mealId=${id}`);
//             return response.data;
//         },
//     });

//     if (isLoading)
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <span className="loading loading-spinner loading-lg"></span>
//             </div>
//         );

//     if (isError || !meal)
//         return <div>Something went wrong while loading the meal details.</div>;

//     const {
//         category,
//         details,
//         distributorName,
//         image,
//         ingredients,
//         postTime,
//         price,
//         title,
//         likeCount,
//         reviewCount,
//     } = meal;

//     const handleRequestMeal = async () => {
//         if (!user) {
//             Swal.fire("Error", "Please log in to request this meal", "error");
//             return;
//         }

//         try {
//             const response = await axios.post("https://hostel-meal-system-server-a12.vercel.app/meal-request", {
//                 mealId: id,
//                 userId: user.email,
//                 mealTitle: title,
//             });

//             if (response.data.success) {
//                 Swal.fire("Success", "Your meal request has been sent!", "success");
//                 refetch();
//             }
//         } catch (error) {
//             Swal.fire("Error", "Something went wrong. Please try again.", "error");
//         }
//     };

//     const handleLikeMeal = async () => {
//         if (!user) {
//             Swal.fire("Error", "Please log in to like this meal", "error");
//             return;
//         }

//         try {
//             const response = await axios.post("https://hostel-meal-system-server-a12.vercel.app/like", {
//                 mealId: id,
//                 userId: user.email,
//             });

//             if (response.data.success) {
//                 Swal.fire("Success", "You liked this meal!", "success");
//                 refetch();
//             }
//         } catch (error) {
//             Swal.fire("Error", "Something went wrong. Please try again.", "error");
//         }
//     };

//     const handleSubmitReview = async () => {
//         if (!user) {
//             Swal.fire("Error", "Please log in to submit a review", "error");
//             return;
//         }

//         if (!reviewText.trim()) {
//             Swal.fire("Error", "Review cannot be empty", "error");
//             return;
//         }

//         try {
//             const response = await axios.post("https://hostel-meal-system-server-a12.vercel.app/review", {
//                 mealId: id,
//                 userId: user.email,
//                 reviewText,
//             });

//             if (response.data.success) {
//                 Swal.fire("Success", "Your review has been submitted!", "success");
//                 setReviewText("");
//                 refetch();
//             }
//         } catch (error) {
//             Swal.fire("Error", "Failed to submit your review.", "error");
//         }
//     };

//     return (
//         <div className="p-6 bg-base-100 text-base-content max-w-4xl mx-auto">
//             <div className="flex flex-col lg:flex-row items-center gap-6">
//                 <img src={image} alt={title} className="rounded-lg shadow-lg w-full lg:w-1/3" />
//                 <div className="flex-1">
//                     <h1 className="text-3xl font-bold mb-2">{title}</h1>
//                     <p className="text-sm text-gray-500">Category: {category}</p>
//                 </div>
//             </div>

//             <div className="mt-6">
//                 <h2 className="text-xl font-semibold mb-2">Details</h2>
//                 <p className="text-base mb-4">{details}</p>
//                 <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
//                 <ul className="list-disc pl-6 mb-4">
//                     {Array.isArray(ingredients) ? (
//                         ingredients.map((ingredient, index) => (
//                             <li key={index} className="text-base">
//                                 {ingredient}
//                             </li>
//                         ))
//                     ) : (
//                         <li className="text-base">No ingredients available</li>
//                     )}
//                 </ul>

//                 <div className="flex justify-between items-center mt-4">
//                     <p className="text-lg font-semibold text-primary">Price: ${price}</p>
//                     <p className="text-sm text-gray-500">
//                         Posted: {new Date(postTime).toLocaleDateString()}
//                     </p>
//                 </div>
//                 <p className="text-sm text-gray-500 mt-2">Distributor: {distributorName}</p>
//             </div>

//             <div className="mt-4 flex gap-4">
//                 <button className="btn btn-primary" onClick={handleLikeMeal}>
//                     👍 Like ({likeCount || 0})
//                 </button>
//                 <button className="btn btn-secondary" onClick={handleRequestMeal}>
//                     Request Meal
//                 </button>
//             </div>

//             <div className="mt-6">
//                 <h2 className="text-xl font-semibold">Reviews</h2>
//                 {reviews.length > 0 ? (
//                     reviews.map((review) => (
//                         <div key={review._id} className="border rounded-lg p-4 my-2">
//                             <p className="text-sm text-gray-500">{review.userId}</p>
//                             <p className="text-base">{review.reviewText}</p>
//                         </div>
//                     ))
//                 ) : (
//                     <p>No reviews yet. Be the first to review!</p>
//                 )}
//             </div>

//             <div className="review-form mt-4">
//                 <textarea
//                     placeholder="Write your review here..."
//                     value={reviewText}
//                     onChange={(e) => setReviewText(e.target.value)}
//                     className="textarea textarea-bordered w-full"
//                     rows="5"
//                 ></textarea>
//                 <button onClick={handleSubmitReview} className="btn btn-success mt-4">
//                     Submit Review
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default MealsDetailsPage;

// import { useState } from "react";
// import { useParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import Swal from "sweetalert2";
// import "sweetalert2/src/sweetalert2.scss";
// import axios from "axios";
// import useAuth from "../../Hooks/useAuth";

// const MealsDetailsPage = () => {
//     const { id } = useParams(); // Get the meal ID from the URL
//     const { user } = useAuth(); // Get user data from auth context
//     const [reviewText, setReviewText] = useState("");

//     // Fetch meal details using Axios and React Query
//     const {
//         data: meal,
//         isLoading,
//         isError,
//         refetch, // Destructure the refetch function
//     } = useQuery({
//         queryKey: ["mealDetails", id],
//         queryFn: async () => {
//             const response = await axios.get(`https://hostel-meal-system-server-a12.vercel.app/allMeal/${id}`);
//             return response.data; // Return meal data
//         },
//     });

//     // Show loader during data fetching
//     if (isLoading)
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <span className="loading loading-spinner loading-lg"></span>
//             </div>
//         );

//     // Show error message if there's an issue
//     if (isError || !meal)
//         return <div>Something went wrong while loading the meal details.</div>;

//     // Destructure meal details
//     const {
//         category,
//         details,
//         distributorName,
//         image,
//         ingredients,
//         postTime,
//         price,
//         title,
//         likeCount,
//         reviewCount,
//     } = meal;

//     // Handle the Request Meal
//     const handleRequestMeal = async () => {
//         if (!user) {
//             Swal.fire("Error", "Please log in to request this meal", "error");
//             return;
//         }

//         if (user.badge === "Bronze") {
//             Swal.fire(
//                 "Upgrade Required",
//                 "Bronze badge users need to upgrade their subscription to request meals. Please subscribe to access this feature.",
//                 "warning"
//             );
//             return;
//         }

//         try {
//             const response = await axios.post("https://hostel-meal-system-server-a12.vercel.app/meal-request", {
//                 mealId: id,
//                 userId: user.email,
//                 mealTitle: title,
//                 likeCount: likeCount,
//                 reviewCount: reviewCount,
//                 requestTime: new Date(),
//             });

//             if (response.data.success) {
//                 Swal.fire("Success", "Your meal request has been sent!", "success");
//                 refetch(); // Refetch the meal details to update the UI
//             }
//         } catch (error) {
//             const errorMessage =
//                 error.response?.data?.message || "Something went wrong. Please try again.";
//             Swal.fire("Error", errorMessage, "error");
//         }
//     };

//     return (
//         <div className="p-6 bg-base-100 text-base-content max-w-4xl mx-auto">
//             {/* Image and Title Section */}
//             <div className="flex flex-col lg:flex-row items-center gap-6">
//                 <img
//                     src={image}
//                     alt={title}
//                     className="rounded-lg shadow-lg w-full lg:w-1/3"
//                 />
//                 <div className="flex-1">
//                     <h1 className="text-3xl font-bold mb-2">{title}</h1>
//                     <p className="text-sm text-gray-500">Category: {category}</p>
//                 </div>
//             </div>

//             {/* Details Section */}
//             <div className="mt-6">
//                 <h2 className="text-xl font-semibold mb-2">Details</h2>
//                 <p className="text-base mb-4">{details}</p>

//                 <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
//                 <ul className="list-disc pl-6 mb-4">
//                     {Array.isArray(ingredients) ? (
//                         ingredients.map((ingredient, index) => (
//                             <li key={index} className="text-base">
//                                 {ingredient}
//                             </li>
//                         ))
//                     ) : (
//                         <li className="text-base">
//                             {ingredients || "No ingredients available"}
//                         </li>
//                     )}
//                 </ul>

//                 <div className="flex justify-between items-center mt-4">
//                     <p className="text-lg font-semibold text-primary">Price: ${price}</p>
//                     <p className="text-sm text-gray-500">
//                         Posted: {new Date(postTime).toLocaleDateString()}
//                     </p>
//                 </div>

//                 <p className="text-sm text-gray-500 mt-2">
//                     Distributor: {distributorName}
//                 </p>
//             </div>

//             {/* User actions */}
//             <div className="mt-4 flex gap-4">
//                 <button className="btn btn-primary" onClick={handleLikeMeal}>
//                     👍 Like ({likeCount || 0})
//                 </button>

//                 {/* Conditional Button for Meal Request */}
//                 {user?.badge === "Bronze" ? (
//                     <button
//                         className="btn btn-secondary opacity-50 cursor-not-allowed"
//                         onClick={() =>
//                             Swal.fire(
//                                 "Upgrade Required",
//                                 "Bronze badge users need to upgrade their subscription to request meals.",
//                                 "info"
//                             )
//                         }
//                     >
//                         Request Meal (Upgrade Required)
//                     </button>
//                 ) : (
//                     <button className="btn btn-secondary" onClick={handleRequestMeal}>
//                         Request Meal
//                     </button>
//                 )}
//             </div>

//             <br />
//             <div>The total reviews: {reviewCount}</div>

//             {/* Review form */}
//             <div className="review-form mt-4">
//                 <textarea
//                     placeholder="Write your review here..."
//                     value={reviewText}
//                     onChange={(e) => setReviewText(e.target.value)}
//                     className="textarea textarea-bordered w-full"
//                     rows="5"
//                 ></textarea>
//                 <button onClick={handleSubmitReview} className="btn btn-success mt-4">
//                     Submit Review
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default MealsDetailsPage;




// import { useState } from "react";
// import { useParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import Swal from "sweetalert2";
// import "sweetalert2/src/sweetalert2.scss";
// import axios from "axios";
// import useAuth from "../../Hooks/useAuth";

// const MealsDetailsPage = () => {
//     const { id } = useParams(); // Get the meal ID from the URL
//     console.log("The meal ID is", id);
//     const { user } = useAuth(); // Get user data from auth context
//     const [reviewText, setReviewText] = useState("");

//     const {
//         data: reviews = [],
//         isLoading: isLoadingReviews
//     } = useQuery({
//         queryKey: ["mealReviews", id],
//         queryFn: async () => {
//             const response = await axios.get(`https://hostel-meal-system-server-a12.vercel.app/reviews/${id}`);
//             return response.data;
//         },
//     });


//     // Fetch meal details using Axios and React Query
//     const {
//         data: meal,
//         isLoading,
//         isError,
//         refetch, // Destructure the refetch function
//     } = useQuery({
//         queryKey: ["mealDetails", id],
//         queryFn: async () => {
//             const response = await axios.get(`https://hostel-meal-system-server-a12.vercel.app/allMeal/${mealId}`);
//             return response.data; // Return meal data
//         },
//     });

//     // Handle loading and error states
//     if (isLoading) return <div>Loading...</div>;
//     if (isError || !meal) return <div>Something went wrong while loading the meal details.</div>;

//     // Destructure meal details (safe now since meal is guaranteed to exist)
//     const {
//         category,
//         details,
//         distributorName,
//         image,
//         ingredients,
//         mealId,
//         postTime,
//         price,
//         title,
//         likeCount,
//         reviewCount
//     } = meal;

//     // Handle the RequestMeal
//     const handleRequestMeal = async () => {
//         if (!user) {
//             Swal.fire("Error", "Please log in to request this meal", "error");
//             return;
//         }




//         try {
//             const response = await axios.post("https://hostel-meal-system-server-a12.vercel.app/meal-request", {
//                 mealId: id,
//                 userId: user.email,
//                 mealTitle: title,
//                 likeCount: likeCount,
//                 reviewCount: reviewCount,
//                 requestTime: new Date(),
//             });

//             if (response.data.success) {
//                 Swal.fire("Success", "Your meal request has been sent!", "success");
//                 refetch(); // Refetch the meal details to update the UI
//             }
//         } catch (error) {
//             const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
//             Swal.fire("Error", errorMessage, "error");
//         }
//     };

//     // Handle the like
//     const handleLikeMeal = async () => {
//         if (!user) {
//             Swal.fire("Error", "Please log in to like this meal", "error");
//             return;
//         }

//         try {
//             const response = await axios.post("https://hostel-meal-system-server-a12.vercel.app/like", {
//                 mealId: id,
//                 userId: user.email,
//             });

//             if (response.data.success) {
//                 Swal.fire("Success", "You liked this meal!", "success");
//                 refetch(); // Refetch the meal details to reflect the new like count
//             }
//         } catch (error) {
//             const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
//             Swal.fire("Error", errorMessage, "error");
//         }
//     };

//     // Handle review submission
//     const handleSubmitReview = async () => {
//         if (!user) {
//             Swal.fire("Error", "Please log in to submit a review", "error");
//             return;
//         }

//         if (!reviewText.trim()) {
//             Swal.fire("Error", "Review cannot be empty", "error");
//             return;
//         }

//         try {
//             const response = await axios.post("https://hostel-meal-system-server-a12.vercel.app/review", {
//                 mealId: id,
//                 userId: user.email,
//                 reviewText,
//                 title,
//                 likeCount,
//                 reviewCount
//             });

//             if (response.data.success) {
//                 Swal.fire("Success", "Your review has been submitted!", "success");
//                 setReviewText(""); // Clear the textarea
//                 refetch(); // Refetch the meal details to display the updated review
//             }
//         } catch (error) {
//             const errorMessage = error.response?.data?.message || "Failed to submit your review.";
//             Swal.fire("Error", errorMessage, "error");
//         }
//     };

//     return (
//         <div className="p-6 bg-base-100 text-base-content max-w-4xl mx-auto">
//             <div>
//                 the meal id is {id}
//                 <br />
//                 The user is {user ? user.email : "Guest"}
//             </div>
//             {/* Image and Title Section */}
//             <div className="flex flex-col lg:flex-row items-center gap-6">
//                 <img
//                     src={image}
//                     alt={title}
//                     className="rounded-lg shadow-lg w-full lg:w-1/3"
//                 />
//                 <div className="flex-1">
//                     <h1 className="text-3xl font-bold mb-2">{title}</h1>
//                     <p className="text-sm text-gray-500">Category: {category}</p>
//                 </div>
//             </div>

//             {/* Details Section */}
//             <div className="mt-6">
//                 <h2 className="text-xl font-semibold mb-2">Details</h2>
//                 <p className="text-base mb-4">{details}</p>

//                 <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
//                 {/* <ul className="list-disc pl-6 mb-4">
//                     {ingredients.map((ingredient, index) => (
//                         <li key={index} className="text-base">
//                             {ingredient}
//                         </li>
//                     ))}
//                 </ul> */}
//                 <ul className="list-disc pl-6 mb-4">
//                     {Array.isArray(ingredients) ? (
//                         ingredients.map((ingredient, index) => (
//                             <li key={index} className="text-base">
//                                 {ingredient}
//                             </li>
//                         ))
//                     ) : (
//                         <li className="text-base">
//                             {ingredients || "No ingredients available"} {/* Handle non-array or empty values */}
//                         </li>
//                     )}
//                 </ul>


//                 <div className="flex justify-between items-center mt-4">
//                     <p className="text-lg font-semibold text-primary">Price: ${price}</p>
//                     <p className="text-sm text-gray-500">Posted: {new Date(postTime).toLocaleDateString()}</p>
//                 </div>

//                 <p className="text-sm text-gray-500 mt-2">
//                     Distributor: {distributorName}
//                 </p>
//             </div>

//             {/* user like and the review */}
//             <div className="mt-4 flex gap-4">
//                 <button
//                     className="btn btn-primary"
//                     onClick={handleLikeMeal}
//                 >
//                     👍 Like ({likeCount || 0})
//                 </button>
//                 <button
//                     className="btn btn-secondary"
//                     onClick={handleRequestMeal}
//                 >
//                     Request Meal
//                 </button>
//             </div>
//             <br />
//             <br />
//             <div>
//                 the total review is {reviewCount}
//             </div>

//             <div className="review-form">
//                 <textarea
//                     placeholder="Write your review here..."
//                     value={reviewText}
//                     onChange={(e) => setReviewText(e.target.value)}
//                     className="review-textarea"
//                     rows="5"
//                     style={{
//                         width: "100%",
//                         padding: "10px",
//                         borderRadius: "5px",
//                         border: "1px solid #ccc",
//                     }}
//                 ></textarea>
//                 <button
//                     onClick={handleSubmitReview}
//                     className="submit-review-button"
//                     style={{
//                         marginTop: "10px",
//                         padding: "10px 20px",
//                         backgroundColor: "#28a745",
//                         color: "#fff",
//                         border: "none",
//                         borderRadius: "5px",
//                         cursor: "pointer",
//                     }}
//                 >
//                     Submit Review
//                 </button>

//                 <div>
//                     {isLoadingReviews ? (
//                         <div className="flex justify-center items-center h-24">
//                             <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
//                         </div>
//                     ) : (
//                         <div>
//                             {reviews.length > 0 ? (
//                                 <ul className="space-y-4">
//                                     {reviews.map((review, index) => (
//                                         <li key={index} className="p-4 border rounded-lg shadow">
//                                             <h4 className="text-lg font-semibold">{review.userName || "Anonymous"}</h4>
//                                             <p className="text-sm">{review.text}</p>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             ) : (
//                                 <p className="text-center text-gray-500">No reviews available for this meal.</p>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MealsDetailsPage;













