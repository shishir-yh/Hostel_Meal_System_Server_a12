
import Banner from "../Banner/Banner";
import MealsByCategory from "../Meals_by_Category/MealsByCategory";
import PackagePayment from "../PackagePayment/PackagePayment";
import Partner from "../Partner/Partner";

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <MealsByCategory></MealsByCategory>
            <PackagePayment></PackagePayment>
            <Partner></Partner>

        </div>
    );
};

export default Home;