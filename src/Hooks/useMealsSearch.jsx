// // import { useEffect, useState } from "react";
// // import axios from "axios";

// // const useMeals = (search, category, minPrice, maxPrice, page, limit) => {
// //     const [meals, setMeals] = useState([]);
// //     const [totalPages, setTotalPages] = useState(0);

// //     useEffect(() => {
// //         const fetchMeals = async () => {
// //             const response = await axios.get("https://hostel-meal-system-server-a12.vercel.app/allmealSearch", {
// //                 params: {
// //                     search,
// //                     category,
// //                     minPrice,
// //                     maxPrice,
// //                     page,
// //                     limit,
// //                 },
// //             });
// //             setMeals(response.data.meals);
// //             setTotalPages(response.data.totalPages);
// //         };

// //         fetchMeals();
// //     }, [search, category, minPrice, maxPrice, page, limit]);

// //     return [meals, totalPages];
// // };

// // export default useMeals;


// import { useState, useEffect } from "react";

// const useMeals = (search = "", category = "", minPrice = "", maxPrice = "") => {
//     const [meals, setMeals] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchMeals = async () => {
//             setLoading(true);
//             try {
//                 const queryParams = new URLSearchParams();
//                 if (search) queryParams.append("search", search);
//                 if (category) queryParams.append("category", category);
//                 if (minPrice) queryParams.append("minPrice", minPrice);
//                 if (maxPrice) queryParams.append("maxPrice", maxPrice);

//                 const response = await fetch(`https://hostel-meal-system-server-a12.vercel.app/allmealSearch?${queryParams}`);
//                 const data = await response.json();
//                 setMeals(data);
//             } catch (error) {
//                 console.error("Error fetching meals:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchMeals();
//     }, [search, category, minPrice, maxPrice]);

//     return [meals, loading];
// };

// export default useMeals;


import { useState, useEffect } from "react";

const useMeals = (search = "", category = "", minPrice = "", maxPrice = "") => {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMeals = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams();
                if (search) queryParams.append("search", search);
                if (category) queryParams.append("category", category);
                if (minPrice) queryParams.append("minPrice", minPrice);
                if (maxPrice) queryParams.append("maxPrice", maxPrice);

                const response = await fetch(`https://hostel-meal-system-server-a12.vercel.app/allmealSearch?${queryParams}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch meals");
                }

                const data = await response.json();
                setMeals(data);
            } catch (error) {
                console.error("Error fetching meals:", error);
                setMeals([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMeals();
    }, [search, category, minPrice, maxPrice]);

    return [meals, loading];
};

export default useMeals;

