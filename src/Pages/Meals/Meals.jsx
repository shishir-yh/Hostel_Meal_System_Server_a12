import { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import useMeals from "../../Hooks/useMealsSearch";
import Meals_Category_Card from "../Home/Meals_Category_Card/Meals_Category_Card";

const Meals = () => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [meals, loading, hasMore, loadMore] = useMeals(search, category, minPrice, maxPrice);

    return (
        <div className="container mx-auto p-4">
            {/* Search and Filter Section */}
            <div>meals page</div>
            <form className="mb-4 space-y-2">
                <input
                    type="text"
                    placeholder="Search meals..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 w-full"
                />
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border px-4 py-2 rounded"
                >
                    <option value="">All Categories</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                </select>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="border p-2 w-full"
                    />
                    <input
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="border p-2 w-full"
                    />
                </div>
            </form>

            {/* Meals Display Section */}
            {loading ? (
                <p>Loading meals...</p>
            ) : (
                <InfiniteScroll
                    pageStart={0}
                    loadMore={loadMore}
                    hasMore={hasMore}
                    loader={<div className="loader" key={0}>Loading ...</div>}
                >
                    <section className="grid lg:grid-cols-3 gap-4">
                        {meals.map((item) => (
                            <Meals_Category_Card key={item.id} items={item} />
                        ))}
                    </section>
                </InfiniteScroll>
            )}
        </div>
    );
};

export default Meals;






// import { useState } from "react";
// import useMeals from "../../Hooks/useMealsSearch";
// import Meals_Category_Card from "../Home/Meals_Category_Card/Meals_Category_Card";

// const Meals = () => {
//     const [search, setSearch] = useState("");
//     const [category, setCategory] = useState("");
//     const [minPrice, setMinPrice] = useState("");
//     const [maxPrice, setMaxPrice] = useState("");
//     const [meals, loading] = useMeals(search, category, minPrice, maxPrice);

//     return (
//         <div className="container mx-auto p-4">
//             {/* Search and Filter Section */}
//             <div>meals page</div>
//             <form className="mb-4 space-y-2">
//                 <input
//                     type="text"
//                     placeholder="Search meals..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className="border p-2 w-full"
//                 />
//                 <select
//                     value={category}
//                     onChange={(e) => setCategory(e.target.value)}
//                     className="border px-4 py-2 rounded"
//                 >
//                     <option value="">All Categories</option>
//                     <option value="Breakfast">Breakfast</option>
//                     <option value="Lunch">Lunch</option>
//                     <option value="Dinner">Dinner</option>
//                 </select>
//                 <div className="flex gap-2">
//                     <input
//                         type="number"
//                         placeholder="Min Price"
//                         value={minPrice}
//                         onChange={(e) => setMinPrice(e.target.value)}
//                         className="border p-2 w-full"
//                     />
//                     <input
//                         type="number"
//                         placeholder="Max Price"
//                         value={maxPrice}
//                         onChange={(e) => setMaxPrice(e.target.value)}
//                         className="border p-2 w-full"
//                     />
//                 </div>
//             </form>

//             {/* Meals Display Section */}
//             {loading ? (
//                 <p>Loading meals...</p>
//             ) : (
//                 <section className="grid lg:grid-cols-3 gap-4">
//                     {meals.map((item) => (
//                         <Meals_Category_Card key={item.id} items={item} />
//                     ))}
//                 </section>
//             )}
//         </div>
//     );
// };

// export default Meals;