
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../Provider/AuthProvider";

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext); // Get logged-in user's info

    useEffect(() => {
        // Fetch payment history
        const fetchPayments = async () => {
            try {
                const response = await fetch(`https://hostel-meal-system-server-a12.vercel.app/payments?email=${user.email}`);
                const data = await response.json();
                if (data.length > 0) {
                    setPayments(data);
                } else {
                    setPayments([]);
                }
            } catch (error) {
                console.error("Error fetching payment history:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) {
            fetchPayments();
        }
    }, [user?.email]);

    return (
        <div className="p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Payment History</h2>
            {loading ? (
                <p>Loading...</p>
            ) : payments.length === 0 ? (
                <p>No payment history found.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2">Date</th>
                            <th className="border border-gray-300 px-4 py-2">Package</th>
                            <th className="border border-gray-300 px-4 py-2">Price</th>
                            <th className="border border-gray-300 px-4 py-2">Transaction ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment, index) => (
                            <tr key={index} className="text-center">
                                <td className="border border-gray-300 px-4 py-2">
                                    {new Date(payment.date).toLocaleDateString()}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">{payment.packageName}</td>
                                <td className="border border-gray-300 px-4 py-2">${payment.price}</td>
                                <td className="border border-gray-300 px-4 py-2">{payment.transactionId}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PaymentHistory;
