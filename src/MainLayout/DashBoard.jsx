import React from "react";
import { FaBook, FaCalendar, FaHome, FaList, FaAmazonPay, FaUserEdit, FaUsers } from "react-icons/fa";
import { MdRateReview } from "react-icons/md";
import { NavLink, Outlet } from "react-router-dom";
import { GiSuspicious } from "react-icons/gi";
import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import { useQuery } from "@tanstack/react-query";

const fetchUserRole = async (email) => {
    const response = await fetch(`https://hostel-meal-system-server-a12.vercel.app/api/users/${email}`);
    if (!response.ok) {
        throw new Error("Failed to fetch user role");
    }
    return response.json();
};

const DashBoard = () => {
    const { user } = useContext(AuthContext); // Get the logged-in user from AuthContext

    // Use TanStack Query to fetch the user role
    const { data: userData, isLoading, isError, refetch } = useQuery({
        queryKey: ["userRole", user?.email],
        queryFn: () => fetchUserRole(user.email),
        enabled: !!user?.email, // Only fetch if the user email exists
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading user data. Please try again later.</div>;
    }

    const isAdmin = userData?.role === "admin"; // Determine if the user is an admin

    return (
        <div className="flex flex-col lg:flex-row">
            {/* Dashboard Sidebar */}
            <div className="w-full lg:w-64 bg-orange-400">
                <div className="lg:hidden">
                    <details className="dropdown dropdown-open">
                        <summary className="btn m-4">Menu</summary>
                        <ul className="menu p-4 shadow bg-orange-400 rounded-box w-full">
                            {isAdmin ? (
                                <>
                                    <li>
                                        <NavLink to="/dashboard/adminProfile">
                                            <GiSuspicious />
                                            Admin Profile
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/ManageUsers">
                                            <FaUserEdit />
                                            Manage Users
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/AddMeal">
                                            <FaList />
                                            Add Meal
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/AllMeals">
                                            <FaBook />
                                            All Meals
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/AllReviews">
                                            <FaBook />
                                            All Reviews
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/ServeMeals">
                                            <FaUsers />
                                            Serve Meals
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/UpcomingMeals">
                                            <FaUsers />
                                            Upcoming Meals
                                        </NavLink>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <NavLink to="/dashboard/userHome">
                                            <GiSuspicious />
                                            My Profile
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/requestedMeals">
                                            <FaCalendar />
                                            Requested Meals
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/myReviews">
                                            <MdRateReview />
                                            My Reviews
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/paymentHistory">
                                            <FaAmazonPay />
                                            Payment History
                                        </NavLink>
                                    </li>
                                </>
                            )}
                            {/* Shared Navigation Links */}
                            <div className="divider"></div>
                            <li>
                                <NavLink to="/">
                                    <FaHome />
                                    Home
                                </NavLink>
                            </li>
                        </ul>
                    </details>
                </div>
                <ul className="menu p-4 hidden lg:block">
                    {isAdmin ? (
                        <>
                            <li>
                                <NavLink to="/dashboard/adminProfile">
                                    <GiSuspicious />
                                    Admin Profile
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/ManageUsers">
                                    <FaUserEdit />
                                    Manage Users
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/AddMeal">
                                    <FaList />
                                    Add Meal
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/AllMeals">
                                    <FaBook />
                                    All Meals
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/AllReviews">
                                    <FaBook />
                                    All Reviews
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/ServeMeals">
                                    <FaUsers />
                                    Serve Meals
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/UpcomingMeals">
                                    <FaUsers />
                                    Upcoming Meals
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <NavLink to="/dashboard/userHome">
                                    <GiSuspicious />
                                    My Profile
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/requestedMeals">
                                    <FaCalendar />
                                    Requested Meals
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/myReviews">
                                    <MdRateReview />
                                    My Reviews
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/paymentHistory">
                                    <FaAmazonPay />
                                    Payment History
                                </NavLink>
                            </li>
                        </>
                    )}
                    {/* Shared Navigation Links */}
                    <div className="divider"></div>
                    <li>
                        <NavLink to="/">
                            <FaHome />
                            Home
                        </NavLink>
                    </li>
                </ul>
            </div>
            {/* Dashboard Content */}
            <div className="flex-1 p-8">
                <Outlet />
            </div>
        </div>
    );
};

export default DashBoard;












// import React from "react";
// import { FaBook, FaCalendar, FaHome, FaList, FaAmazonPay, FaUserEdit, FaUsers } from "react-icons/fa";
// import { MdRateReview } from "react-icons/md";
// import { NavLink, Outlet } from "react-router-dom";
// import { GiSuspicious } from "react-icons/gi";
// import { useContext } from "react";
// import { AuthContext } from "../Provider/AuthProvider";
// import { useQuery } from "@tanstack/react-query";

// const fetchUserRole = async (email) => {
//     const response = await fetch(`https://hostel-meal-system-server-a12.vercel.app/api/users/${email}`);
//     if (!response.ok) {
//         throw new Error("Failed to fetch user role");
//     }
//     return response.json();
// };

// const DashBoard = () => {
//     const { user } = useContext(AuthContext); // Get the logged-in user from AuthContext

//     // Use TanStack Query to fetch the user role
//     const { data: userData, isLoading, isError, refetch } = useQuery({
//         queryKey: ["userRole", user?.email],
//         queryFn: () => fetchUserRole(user.email),
//         enabled: !!user?.email, // Only fetch if the user email exists
//     });

//     if (isLoading) {
//         return <div>Loading...</div>;
//     }

//     if (isError) {
//         return <div>Error loading user data. Please try again later.</div>;
//     }

//     const isAdmin = userData?.role === "admin"; // Determine if the user is an admin

//     return (
//         <div className="flex flex-col lg:flex-row">
//             {/* Dashboard Sidebar */}
//             <div className="w-full lg:w-64 min-h-screen bg-orange-400 lg:block">
//                 <div className="lg:hidden dropdown dropdown-hover">
//                     <label tabIndex={0} className="btn m-4">Menu</label>
//                     <ul tabIndex={0} className="dropdown-content menu p-4 shadow bg-orange-400 rounded-box w-64">
//                         {isAdmin ? (
//                             <>
//                                 <li>
//                                     <NavLink to="/dashboard/adminProfile">
//                                         <GiSuspicious />
//                                         Admin Profile
//                                     </NavLink>
//                                 </li>
//                                 <li>
//                                     <NavLink to="/dashboard/ManageUsers">
//                                         <FaUserEdit />
//                                         Manage Users
//                                     </NavLink>
//                                 </li>
//                                 <li>
//                                     <NavLink to="/dashboard/AddMeal">
//                                         <FaList />
//                                         Add Meal
//                                     </NavLink>
//                                 </li>
//                                 <li>
//                                     <NavLink to="/dashboard/AllMeals">
//                                         <FaBook />
//                                         All Meals
//                                     </NavLink>
//                                 </li>
//                                 <li>
//                                     <NavLink to="/dashboard/AllReviews">
//                                         <FaBook />
//                                         All Reviews
//                                     </NavLink>
//                                 </li>
//                                 <li>
//                                     <NavLink to="/dashboard/ServeMeals">
//                                         <FaUsers />
//                                         Serve Meals
//                                     </NavLink>
//                                 </li>
//                                 <li>
//                                     <NavLink to="/dashboard/UpcomingMeals">
//                                         <FaUsers />
//                                         Upcoming Meals
//                                     </NavLink>
//                                 </li>
//                             </>
//                         ) : (
//                             <>
//                                 <li>
//                                     <NavLink to="/dashboard/userHome">
//                                         <GiSuspicious />
//                                         My Profile
//                                     </NavLink>
//                                 </li>
//                                 <li>
//                                     <NavLink to="/dashboard/requestedMeals">
//                                         <FaCalendar />
//                                         Requested Meals
//                                     </NavLink>
//                                 </li>
//                                 <li>
//                                     <NavLink to="/dashboard/myReviews">
//                                         <MdRateReview />
//                                         My Reviews
//                                     </NavLink>
//                                 </li>
//                                 <li>
//                                     <NavLink to="/dashboard/paymentHistory">
//                                         <FaAmazonPay />
//                                         Payment History
//                                     </NavLink>
//                                 </li>
//                             </>
//                         )}
//                         {/* Shared Navigation Links */}
//                         <div className="divider"></div>
//                         <li>
//                             <NavLink to="/">
//                                 <FaHome />
//                                 Home
//                             </NavLink>
//                         </li>
//                     </ul>
//                 </div>
//                 <ul className="menu p-4 hidden lg:block">
//                     {isAdmin ? (
//                         <>
//                             <li>
//                                 <NavLink to="/dashboard/adminProfile">
//                                     <GiSuspicious />
//                                     Admin Profile
//                                 </NavLink>
//                             </li>
//                             <li>
//                                 <NavLink to="/dashboard/ManageUsers">
//                                     <FaUserEdit />
//                                     Manage Users
//                                 </NavLink>
//                             </li>
//                             <li>
//                                 <NavLink to="/dashboard/AddMeal">
//                                     <FaList />
//                                     Add Meal
//                                 </NavLink>
//                             </li>
//                             <li>
//                                 <NavLink to="/dashboard/AllMeals">
//                                     <FaBook />
//                                     All Meals
//                                 </NavLink>
//                             </li>
//                             <li>
//                                 <NavLink to="/dashboard/AllReviews">
//                                     <FaBook />
//                                     All Reviews
//                                 </NavLink>
//                             </li>
//                             <li>
//                                 <NavLink to="/dashboard/ServeMeals">
//                                     <FaUsers />
//                                     Serve Meals
//                                 </NavLink>
//                             </li>
//                             <li>
//                                 <NavLink to="/dashboard/UpcomingMeals">
//                                     <FaUsers />
//                                     Upcoming Meals
//                                 </NavLink>
//                             </li>
//                         </>
//                     ) : (
//                         <>
//                             <li>
//                                 <NavLink to="/dashboard/userHome">
//                                     <GiSuspicious />
//                                     My Profile
//                                 </NavLink>
//                             </li>
//                             <li>
//                                 <NavLink to="/dashboard/requestedMeals">
//                                     <FaCalendar />
//                                     Requested Meals
//                                 </NavLink>
//                             </li>
//                             <li>
//                                 <NavLink to="/dashboard/myReviews">
//                                     <MdRateReview />
//                                     My Reviews
//                                 </NavLink>
//                             </li>
//                             <li>
//                                 <NavLink to="/dashboard/paymentHistory">
//                                     <FaAmazonPay />
//                                     Payment History
//                                 </NavLink>
//                             </li>
//                         </>
//                     )}
//                     {/* Shared Navigation Links */}
//                     <div className="divider"></div>
//                     <li>
//                         <NavLink to="/">
//                             <FaHome />
//                             Home
//                         </NavLink>
//                     </li>
//                 </ul>
//             </div>
//             {/* Dashboard Content */}
//             <div className="flex-1 p-8">
//                 <Outlet />
//             </div>
//         </div>
//     );
// };

// export default DashBoard;








// import React from "react";
// import { FaBook, FaCalendar, FaHome, FaList, FaAmazonPay, FaUserEdit, FaUsers } from "react-icons/fa";
// import { MdRateReview } from "react-icons/md";
// import { NavLink, Outlet } from "react-router-dom";
// import { GiSuspicious } from "react-icons/gi";
// import { useContext } from "react";
// import { AuthContext } from "../Provider/AuthProvider";
// import { useQuery } from "@tanstack/react-query";

// const fetchUserRole = async (email) => {
//     const response = await fetch(`https://hostel-meal-system-server-a12.vercel.app/api/users/${email}`);
//     if (!response.ok) {
//         throw new Error("Failed to fetch user role");
//     }
//     return response.json();
// };

// const DashBoard = () => {
//     const { user } = useContext(AuthContext); // Get the logged-in user from AuthContext

//     // Use TanStack Query to fetch the user role
//     const { data: userData, isLoading, isError, refetch } = useQuery({
//         queryKey: ["userRole", user?.email],
//         queryFn: () => fetchUserRole(user.email),
//         enabled: !!user?.email, // Only fetch if the user email exists
//     });

//     if (isLoading) {
//         return <div>Loading...</div>;
//     }

//     if (isError) {
//         return <div>Error loading user data. Please try again later.</div>;
//     }

//     const isAdmin = userData?.role === "admin"; // Determine if the user is an admin

//     return (
//         <div className="flex">
//             {/* Dashboard Sidebar */}
//             <div className="w-64 min-h-screen bg-orange-400">
//                 <ul className="menu p-4">
//                     {isAdmin ? (
//                         <>
//                             <li>
//                                 <NavLink to="/dashboard/adminProfile">
//                                     <GiSuspicious />
//                                     Admin Profile
//                                 </NavLink>
//                             </li>
//                             <li>
//                                 <NavLink to="/dashboard/ManageUsers">
//                                     <FaUserEdit />
//                                     Manage Users
//                                 </NavLink>
//                             </li>
//                             <li>
//                                 <NavLink to="/dashboard/AddMeal">
//                                     <FaList />
//                                     Add Meal
//                                 </NavLink>
//                             </li>
//                             <li>
//                                 <NavLink to="/dashboard/AllMeals">
//                                     <FaBook />
//                                     All Meals
//                                 </NavLink>
//                             </li>
//                             <li>
//                                 <NavLink to="/dashboard/AllReviews">
//                                     <FaBook />
//                                     All Reviews
//                                 </NavLink>
//                             </li>
//                             <li>
//                                 <NavLink to="/dashboard/ServeMeals">
//                                     <FaUsers />
//                                     Serve Meals
//                                 </NavLink>
//                             </li>
//                             <li>
//                                 <NavLink to="/dashboard/UpcomingMeals">
//                                     <FaUsers />
//                                     Upcoming Meals
//                                 </NavLink>
//                             </li>
//                         </>
//                     ) : (
//                         <>
//                             <li>
//                                 <NavLink to="/dashboard/userHome">
//                                     <GiSuspicious />
//                                     My Profile
//                                 </NavLink>
//                             </li>
//                             <li>
//                                 <NavLink to="/dashboard/requestedMeals">
//                                     <FaCalendar />
//                                     Requested Meals
//                                 </NavLink>
//                             </li>
//                             <li>
//                                 <NavLink to="/dashboard/myReviews">
//                                     <MdRateReview />
//                                     My Reviews
//                                 </NavLink>
//                             </li>
//                             <li>
//                                 <NavLink to="/dashboard/paymentHistory">
//                                     <FaAmazonPay />
//                                     Payment History
//                                 </NavLink>
//                             </li>
//                         </>
//                     )}
//                     {/* Shared Navigation Links */}
//                     <div className="divider"></div>
//                     <li>
//                         <NavLink to="/">
//                             <FaHome />
//                             Home
//                         </NavLink>
//                     </li>
//                 </ul>
//             </div>
//             {/* Dashboard Content */}
//             <div className="flex-1 p-8">
//                 <Outlet />
//             </div>
//         </div>
//     );
// };

// export default DashBoard;





// // import React, { useEffect, useState } from "react";
// // import { FaBook, FaCalendar, FaHome, FaList, FaAmazonPay, FaUserEdit, FaUsers } from "react-icons/fa";
// // import { MdRateReview } from "react-icons/md";
// // import { NavLink, Outlet } from "react-router-dom";
// // import { GiSuspicious } from "react-icons/gi";
// // import { useContext } from "react";
// // import { AuthContext } from "../Provider/AuthProvider";

// // const DashBoard = () => {
// //     const { user } = useContext(AuthContext); // Get the logged-in user from AuthContext
// //     const [isAdmin, setIsAdmin] = useState(false); // State to track if user is admin
// //     const [loading, setLoading] = useState(true); // Loading state while fetching data

// //     useEffect(() => {
// //         const fetchUserRole = async () => {
// //             if (user && user.email) {
// //                 try {
// //                     console.log("Fetching user role for:", user.email); // Debug log

// //                     const response = await fetch(`https://hostel-meal-system-server-a12.vercel.app/api/users/${user.email}`);
// //                     if (!response.ok) {
// //                         throw new Error("Failed to fetch user role");
// //                     }

// //                     const userData = await response.json();
// //                     console.log("User data received:", userData); // Debug log

// //                     if (userData.role === "admin") {
// //                         console.log("User is admin");
// //                         setIsAdmin(true);
// //                     } else {
// //                         console.log("User is not admin");
// //                         setIsAdmin(false);
// //                     }
// //                 } catch (error) {
// //                     console.error("Error fetching user role:", error);
// //                 } finally {
// //                     setLoading(false);
// //                 }
// //             } else {
// //                 console.log("No user or user email found");
// //                 setLoading(false);
// //             }
// //         };

// //         fetchUserRole();
// //     }, [user]);

// //     if (loading) {
// //         return <div>Loading...</div>;
// //     }

// //     return (
// //         <div className="flex">
// //             {/* Dashboard Sidebar */}
// //             <div className="w-64 min-h-screen bg-orange-400">
// //                 <ul className="menu p-4">
// //                     {isAdmin ? (
// //                         <>
// //                             <li>
// //                                 <NavLink to="/dashboard/adminProfile">
// //                                     <GiSuspicious />
// //                                     Admin Profile
// //                                 </NavLink>
// //                             </li>
// //                             <li>
// //                                 <NavLink to="/dashboard/ManageUsers">
// //                                     <FaUserEdit />
// //                                     Manage Users
// //                                 </NavLink>
// //                             </li>
// //                             <li>
// //                                 <NavLink to="/dashboard/AddMeal">
// //                                     <FaList />
// //                                     Add Meal
// //                                 </NavLink>
// //                             </li>
// //                             <li>
// //                                 <NavLink to="/dashboard/AllMeals">
// //                                     <FaBook />
// //                                     All Meals
// //                                 </NavLink>
// //                             </li>
// //                             <li>
// //                                 <NavLink to="/dashboard/AllReviews">
// //                                     <FaBook />
// //                                     All Reviews
// //                                 </NavLink>
// //                             </li>
// //                             <li>
// //                                 <NavLink to="/dashboard/ServeMeals">
// //                                     <FaUsers />
// //                                     Serve Meals
// //                                 </NavLink>
// //                             </li>
// //                             <li>
// //                                 <NavLink to="/dashboard/UpcomingMeals">
// //                                     <FaUsers />
// //                                     Upcoming Meals
// //                                 </NavLink>
// //                             </li>
// //                         </>
// //                     ) : (
// //                         <>
// //                             <li>
// //                                 <NavLink to="/dashboard/userHome">
// //                                     <GiSuspicious />
// //                                     My Profile
// //                                 </NavLink>
// //                             </li>
// //                             <li>
// //                                 <NavLink to="/dashboard/requestedMeals">
// //                                     <FaCalendar />
// //                                     Requested Meals
// //                                 </NavLink>
// //                             </li>
// //                             <li>
// //                                 <NavLink to="/dashboard/myReviews">
// //                                     <MdRateReview />
// //                                     My Reviews
// //                                 </NavLink>
// //                             </li>
// //                             <li>
// //                                 <NavLink to="/dashboard/paymentHistory">
// //                                     <FaAmazonPay />
// //                                     Payment History
// //                                 </NavLink>
// //                             </li>
// //                         </>
// //                     )}
// //                     {/* Shared Navigation Links */}
// //                     <div className="divider"></div>
// //                     <li>
// //                         <NavLink to="/">
// //                             <FaHome />
// //                             Home
// //                         </NavLink>
// //                     </li>
// //                 </ul>
// //             </div>
// //             {/* Dashboard Content */}
// //             <div className="flex-1 p-8">
// //                 <Outlet />
// //             </div>
// //         </div>
// //     );
// // };

// // export default DashBoard;


