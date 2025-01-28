import { Link } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";


const Meals_Category_Card = ({ items }) => {
    const { _id, title, category, image, rating, price, details } = items;
    const { user } = useAuth();

    const handleAddToCart = () => {
        if (user && user.email) {
            //send cart item to the database
            const cartItem = {
                email: user.email,
                title,
                image,
                price,
                category,
                rating
            }
        }
    }
    return (
        <div className="w-full sm:w-[300px] md:w-[350px] bg-white shadow-md rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-lg overflow-hidden">
            <img
                src={image}
                alt={title}
                className="w-full h-[200px] object-cover"
            />
            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                <p className="text-sm text-gray-500 mb-2">{category}</p>
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-blue-500">${price || 0}</span>
                    <span className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-yellow-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M9.049 2.927a1 1 0 011.902 0l1.518 4.675a1 1 0 00.95.69h4.917a1 1 0 01.592 1.81l-3.973 2.89a1 1 0 00-.364 1.118l1.518 4.676a1 1 0 01-1.54 1.118L10 14.347l-3.974 2.89a1 1 0 01-1.54-1.118l1.518-4.676a1 1 0 00-.364-1.118l-3.973-2.89a1 1 0 01.592-1.81h4.917a1 1 0 00.95-.69L9.049 2.927z" />
                        </svg>
                        <span className="text-sm text-gray-700 ml-1">{rating}</span>
                    </span>
                </div>
                {/* <Link to={`/service/${_id}`}><button className="btn btn-primary btn-sm">See Details</button></Link> */}

                <Link to={`/meal/${_id}`}><button onClick={handleAddToCart} className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">
                    View Details
                </button></Link>
            </div>
        </div>
    );
};
export default Meals_Category_Card;
