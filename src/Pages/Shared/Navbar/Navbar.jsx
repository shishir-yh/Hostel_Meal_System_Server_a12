import { IoIosNotifications } from "react-icons/io";
import { NavLink, Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import logo from "../../../assets/icon/Web_Logo.png";
import { AuthContext } from "../../../Provider/AuthProvider";
import Swal from "sweetalert2";

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext); // Get user and logout function from AuthContext
    const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu visibility

    const NavgationLink = [
        { to: "/", label: "Home" },
        { to: "/meals", label: "Meals" },
        { to: "/upcomingMeals", label: "Upcoming Meals" },
    ];

    const handleLogout = async () => {
        try {
            await logOut();
            // Show a success message
            Swal.fire({
                icon: "success",
                title: "Logged Out",
                text: "You have successfully logged out.",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
            });
            Navigate("/"); // Redirect to home or another page after logout
        } catch (error) {
            console.error("Logout failed:", error);

            // Show an error message
            // Swal.fire({
            //     icon: "error",
            //     title: "Oops...",
            //     text: "Something went wrong during logout. Please try again.",
            // });
        }
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 flex items-center justify-between h-16">
                {/* Logo and Website Name */}
                <div className="flex items-center">
                    <img src={logo} className="w-10 h-10 lg:w-12 lg:h-12" alt="logo" />
                    <Link to="/" className="text-xl font-bold text-orange-500 ml-2">
                        Daily Grub
                    </Link>
                </div>

                {/* Navigation Links (Hidden on mobile) */}
                <div className="hidden lg:flex space-x-6">
                    {NavgationLink.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            className={({ isActive }) =>
                                `font-bold ${isActive ? "text-orange-600 underline" : "text-gray-700"
                                }`
                            }
                            to={to}
                        >
                            {label}
                        </NavLink>
                    ))}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="lg:hidden">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-gray-700 focus:outline-none"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    </button>
                </div>

                {/* Right Section: Notification and Profile */}
                <div className="flex items-center space-x-4">
                    {/* Notification Icon */}
                    <Link to="/">
                        <IoIosNotifications size={24} className="text-gray-700" />
                    </Link>

                    {user ? (
                        // Profile Picture and Dropdown
                        <div className="relative">
                            <img
                                src={user.photoURL || "https://via.placeholder.com/40"}
                                alt="Profile"
                                className="w-10 h-10 rounded-full cursor-pointer border border-gray-300"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            />
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                                    <div className="px-4 py-2 text-gray-700 font-bold">
                                        {user.displayName || "User"}
                                    </div>
                                    <div className="border-t border-gray-200"></div>
                                    <NavLink
                                        to="/dashboard"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Dashboard
                                    </NavLink>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Join Us Button for Non-Logged-In Users
                        <Link to="/login" className="btn btn-primary">
                            Join Us
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white shadow-md">
                    <ul className="flex flex-col space-y-2 p-4">
                        {NavgationLink.map(({ to, label }) => (
                            <NavLink
                                key={to}
                                className={({ isActive }) =>
                                    `font-bold ${isActive ? "text-orange-600 underline" : "text-gray-700"
                                    }`
                                }
                                to={to}
                                onClick={() => setMobileMenuOpen(false)} // Close menu on click
                            >
                                {label}
                            </NavLink>
                        ))}
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
























// import { IoIosNotifications } from "react-icons/io";
// import { NavLink, Link } from "react-router-dom";
// import logo from "../../../assets/icon/Web_Logo.png"
// const Navbar = () => {
//     // we declared ta array where we give the navlink

//     const NavgationLink = [
//         { to: "/", label: "Home" },
//         { to: "/meals", label: "Meals" },
//         { to: "/upcomingMeals", label: "Upcoming Meals" },
//         { to: "/login", label: "Login" }

//     ]


//     return (
//         <div>
//             <div className="navbar bg-base-100 ">
//                 <div className="navbar-start">
//                     <div className="dropdown">
//                         <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 className="h-5 w-5"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                                 stroke="currentColor">
//                                 <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth="2"
//                                     d="M4 6h16M4 12h8m-8 6h16" />
//                             </svg>
//                         </div>
//                         <ul
//                             tabIndex={0}
//                             className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
//                             {/* <li><a>Item 1</a></li>
//                             <li><a>Item 3</a></li> */}
//                         </ul>
//                     </div>
//                     <img src={logo} className="lg:w-20 w-10" alt="logo" />
//                     <a className="btn btn-ghost text-xl ">Daily Grub</a>
//                 </div>

//                 {/* this is center of the navbar  */}

//                 <div className="navbar-center hidden lg:flex">
//                     <ul className="menu menu-horizontal px-1 gap-4">
//                         {/* <li><a>Item 1</a></li>
//                         <li><a>Item 3</a></li> */}
//                         {
//                             NavgationLink.map(({ to, label }) => (
//                                 <NavLink
//                                     key={to}
//                                     className={({ isActive }) =>
//                                         `font-bold ${isActive ? "text-purple-600 underline" : ""}`
//                                     }
//                                     to={to}
//                                 >
//                                     {label}
//                                 </NavLink>
//                             ))
//                         }

//                     </ul>
//                 </div>

//                 {/* Nav bar end  */}
//                 <div className="navbar-end lg:gap-6 gap-2">
//                     <Link to="/dashboard">
//                         <IoIosNotifications size={20}> <button className="btn"></button></IoIosNotifications>
//                     </Link>

//                     <a className="btn">Join us</a>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Navbar;