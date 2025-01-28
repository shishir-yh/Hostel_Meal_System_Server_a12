import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Provider/AuthProvider";
const CheckoutForm = () => {
    const { package_name } = useParams(); // Receive package name from dynamic route
    const [clientSecret, setClientSecret] = useState("");
    const [error, setError] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // Access user from AuthContext

    const packages = {
        Silver: 10,
        Gold: 20,
        Platinum: 30,
    };

    const packageDetails = packages[package_name];

    useEffect(() => {
        if (packageDetails) {
            // Create Payment Intent
            axios
                .post("https://hostel-meal-system-server-a12.vercel.app/create-payment-intent", { price: packageDetails })
                .then((res) => {
                    setClientSecret(res.data.clientSecret);
                })
                .catch((err) => {
                    console.error("Error creating payment intent:", err);
                });
        }
    }, [packageDetails]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);

        if (!card) {
            return;
        }

        // Create Payment Method
        const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card,
        });

        if (paymentMethodError) {
            setError(paymentMethodError.message);
            return;
        }

        // Confirm Payment
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card,
                billing_details: {
                    email: user?.email || "anonymous@example.com", // Use dynamic user email
                    name: user?.displayName || "Anonymous", // Use dynamic user name
                },
            },
        });

        if (confirmError) {
            console.error("Error confirming payment:", confirmError);
            setError(confirmError.message);
            return;
        }

        if (paymentIntent.status === "succeeded") {
            setTransactionId(paymentIntent.id);

            // Save Payment Data
            const paymentData = {
                email: user?.email || "anonymous@example.com", // Use dynamic user email
                price: packageDetails,
                packageName: package_name,
                transactionId: paymentIntent.id,
                date: new Date(),
            };

            axios
                .post("https://hostel-meal-system-server-a12.vercel.app/payments", paymentData)
                .then((res) => {
                    Swal.fire({
                        icon: "success",
                        title: "Payment Successful!",
                        text: `Transaction ID: ${paymentIntent.id}`,
                    });
                    navigate("/");
                })
                .catch((err) => {
                    console.error("Error saving payment data:", err);
                });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold text-center mb-4">Pay for {package_name} Package</h2>
            <p className="text-center mb-6">Price: ${packageDetails}</p>
            <CardElement
                options={{
                    style: {
                        base: {
                            fontSize: "16px",
                            color: "#424770",
                            "::placeholder": {
                                color: "#aab7c4",
                            },
                        },
                        invalid: {
                            color: "#9e2146",
                        },
                    },
                }}
            />
            <button
                type="submit"
                disabled={!stripe || !clientSecret}
                className="btn btn-primary w-full mt-4"
            >
                Pay Now
            </button>
            {error && <p className="text-red-600 mt-2">{error}</p>}
            {transactionId && <p className="text-green-600 mt-2">Transaction ID: {transactionId}</p>}
        </form>
    );
};

export default CheckoutForm;
