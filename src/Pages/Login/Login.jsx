import { useContext } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const Login = () => {
    const { signIn, signInWithGoogle } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    // react-hook-form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // Login handler
    const onSubmit = ({ email, password }) => {
        signIn(email, password)
            .then((result) => {
                Swal.fire({
                    icon: "success",
                    title: "Login Successful",
                });
                navigate(from, { replace: true });
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text: error.message,
                });
            });
    };

    // Google login handler
    const handleGoogleLogin = () => {
        signInWithGoogle()
            .then((result) => {
                Swal.fire({
                    icon: "success",
                    title: "Google Login Successful",
                });
                navigate(from, { replace: true });
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text: error.message,
                });
            });
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse w-full max-w-6xl">
                {/* Left Section */}
                <div className="text-center lg:text-left lg:w-1/2 px-5">
                    <h1 className="text-5xl font-bold mb-6">Login now!</h1>
                    <p className="text-lg">
                        Access your account to explore our exclusive features and make the
                        most of our services.
                    </p>
                </div>

                {/* Right Section */}
                <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="card-body space-y-4"
                    >
                        {/* Email Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={`input input-bordered ${errors.email ? "input-error" : ""
                                    }`}
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
                                className={`input input-bordered ${errors.password ? "input-error" : ""
                                    }`}
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

                        {/* Submit Button */}
                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary text-lg">
                                Login
                            </button>
                        </div>

                        {/* Google Login */}
                        <div className="divider">OR</div>
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="btn btn-outline btn-secondary text-lg"
                        >
                            Continue with Google
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="text-center py-4">
                        <small>
                            New here?{" "}
                            <Link to="/signup" className="link link-primary">
                                Create an account
                            </Link>
                        </small>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
