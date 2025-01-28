import { useContext } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

const Signup = () => {
    const { createUser } = useContext(AuthContext); // Using createUser from AuthContext
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const { name, email, password, photo } = data;

        try {
            // Step 1: Prepare FormData for the image upload
            const formData = new FormData();
            formData.append("image", photo[0]); // Get the first file from the file input

            // Step 2: Upload Image to ImageBB
            const response = await axios.post(
                `https://api.imgbb.com/1/upload?key=84e44e36521247338cc9908804304bef`,
                formData
            );

            // Step 3: Get the uploaded image URL
            const imageUrl = response.data.data.url;
            console.log("Image URL:", imageUrl);

            // Step 4: Create user with email, password, name, and uploaded photo
            await createUser(email, password, name, imageUrl);

            Swal.fire({
                icon: "success",
                title: "Signup Successful",
            });

            navigate("/"); // Redirect user after signup
        } catch (error) {
            console.error("Signup failed:", error);

            Swal.fire({
                icon: "error",
                title: "Signup Failed",
                text: error.message,
            });
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row w-full max-w-6xl">
                {/* Left Section */}
                <div className="text-center lg:text-left lg:w-1/2 px-5">
                    <h1 className="text-5xl font-bold mb-6">Sign Up now!</h1>
                    <p className="text-lg">
                        Create an account to access our exclusive features and services.
                    </p>
                </div>

                {/* Right Section */}
                <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="card-body space-y-4"
                    >
                        {/* Name Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                className={`input input-bordered ${errors.name ? "input-error" : ""}`}
                                {...register("name", {
                                    required: "Name is required",
                                })}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={`input input-bordered ${errors.email ? "input-error" : ""}`}
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Enter a valid email address",
                                    },
                                })}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className={`input input-bordered ${errors.password ? "input-error" : ""}`}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters long",
                                    },
                                })}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Photo Upload Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Profile Photo</span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                className={`file-input file-input-bordered ${errors.photo ? "file-input-error" : ""}`}
                                {...register("photo", {
                                    required: "Profile photo is required",
                                })}
                            />
                            {errors.photo && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.photo.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary text-lg">
                                Sign Up
                            </button>
                        </div>
                    </form>

                    {/* Login Link */}
                    <p className="text-center py-4">
                        <small>
                            Already have an account?{" "}
                            <Link to="/login" className="link link-primary">
                                Login
                            </Link>
                        </small>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;





// import { useContext } from "react";
// import { AuthContext } from "../../Provider/AuthProvider";
// import { Link, useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import Swal from "sweetalert2";

// const Signup = () => {
//     const { createUser, signInWithGoogle, updateUserProfile } = useContext(AuthContext);
//     const navigate = useNavigate();

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm();



//     const onSubmit = async ({ name, email, password }) => {
//         try {
//             // createUser
//             await createUser(email, password, name);


//             Swal.fire({
//                 icon: "success",
//                 title: "Signup Successful",
//             });


//             navigate("/");
//         } catch (error) {

//             Swal.fire({
//                 icon: "error",
//                 title: "Signup Failed",
//                 text: error.message,
//             });
//         }
//     };

//     // Google Signup/Login handler
//     const handleGoogleSignup = () => {
//         signInWithGoogle()
//             .then((result) => {
//                 Swal.fire({
//                     icon: "success",
//                     title: "Google Signup Successful",
//                 });
//                 navigate("/");
//             })
//             .catch((error) => {
//                 Swal.fire({
//                     icon: "error",
//                     title: "Google Signup Failed",
//                     text: error.message,
//                 });
//             });
//     };

//     return (
//         <div className="hero min-h-screen bg-base-200">
//             <div className="hero-content flex-col lg:flex-row w-full max-w-6xl">
//                 {/* Left Section */}
//                 <div className="text-center lg:text-left lg:w-1/2 px-5">
//                     <h1 className="text-5xl font-bold mb-6">Sign Up now!</h1>
//                     <p className="text-lg">
//                         Create an account to access our exclusive features and services.
//                     </p>
//                 </div>

//                 {/* Right Section */}
//                 <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
//                     <form
//                         onSubmit={handleSubmit(onSubmit)}
//                         className="card-body space-y-4"
//                     >
//                         {/* Name Field */}
//                         <div className="form-control">
//                             <label className="label">
//                                 <span className="label-text">Name</span>
//                             </label>
//                             <input
//                                 type="text"
//                                 placeholder="Enter your name"
//                                 className={`input input-bordered ${errors.name ? "input-error" : ""
//                                     }`}
//                                 {...register("name", {
//                                     required: "Name is required",
//                                 })}
//                             />
//                             {errors.name && (
//                                 <p className="text-red-500 text-sm mt-1">
//                                     {errors.name.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Email Field */}
//                         <div className="form-control">
//                             <label className="label">
//                                 <span className="label-text">Email</span>
//                             </label>
//                             <input
//                                 type="email"
//                                 placeholder="Enter your email"
//                                 className={`input input-bordered ${errors.email ? "input-error" : ""
//                                     }`}
//                                 {...register("email", {
//                                     required: "Email is required",
//                                     pattern: {
//                                         value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//                                         message: "Enter a valid email address",
//                                     },
//                                 })}
//                             />
//                             {errors.email && (
//                                 <p className="text-red-500 text-sm mt-1">
//                                     {errors.email.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Password Field */}
//                         <div className="form-control">
//                             <label className="label">
//                                 <span className="label-text">Password</span>
//                             </label>
//                             <input
//                                 type="password"
//                                 placeholder="Enter your password"
//                                 className={`input input-bordered ${errors.password ? "input-error" : ""
//                                     }`}
//                                 {...register("password", {
//                                     required: "Password is required",
//                                     minLength: {
//                                         value: 6,
//                                         message: "Password must be at least 6 characters long",
//                                     },
//                                 })}
//                             />
//                             {errors.password && (
//                                 <p className="text-red-500 text-sm mt-1">
//                                     {errors.password.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Submit Button */}
//                         <div className="form-control mt-6">
//                             <button type="submit" className="btn btn-primary text-lg">
//                                 Sign Up
//                             </button>
//                         </div>

//                         {/* Google Signup */}
//                         <div className="divider">OR</div>
//                         <button
//                             type="button"
//                             onClick={handleGoogleSignup}
//                             className="btn btn-outline btn-secondary text-lg"
//                         >
//                             Continue with Google
//                         </button>
//                     </form>

//                     {/* Login Link */}
//                     <p className="text-center py-4">
//                         <small>
//                             Already have an account?{" "}
//                             <Link to="/login" className="link link-primary">
//                                 Login
//                             </Link>
//                         </small>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Signup;
