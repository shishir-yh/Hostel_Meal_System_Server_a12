import SectionTitle from "../../../Components/SectionTitle/SectionTitle";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import useMeals from "../../../Hooks/useMeals";
import Meals_Category_Card from "../Meals_Category_Card/Meals_Category_Card";


const MealsByCategory = () => {
    const [meals] = useMeals();
    const Breakfast = meals.filter(item => item.category === 'Breakfast');
    const Lunch = meals.filter(item => item.category === 'Lunch');
    const Dinner = meals.filter(item => item.category === 'Dinner');
    const AllMeals = meals;

    return (
        <div className="px-4 md:px-8">
            {/* Section Title */}
            <SectionTitle
                heading={"Meals By Category"}
                shortDescription={"All Meals are Showing by Category Wise"}
            ></SectionTitle>

            {/* Tabs Section */}
            <section>
                <Tabs defaultIndex={0} onSelect={(index) => console.log(index)}>

                    {/* Tab List */}
                    <div className="showingTabWise flex justify-center my-4">
                        <TabList className="flex flex-wrap gap-2 justify-center">
                            <Tab className="text-gray-600 font-medium px-3 py-2 border-b-2 border-transparent hover:text-blue-500 hover:border-blue-500 transition duration-300 cursor-pointer">
                                Breakfast
                            </Tab>
                            <Tab className="text-gray-600 font-medium px-3 py-2 border-b-2 border-transparent hover:text-blue-500 hover:border-blue-500 transition duration-300 cursor-pointer">
                                Lunch
                            </Tab>
                            <Tab className="text-gray-600 font-medium px-3 py-2 border-b-2 border-transparent hover:text-blue-500 hover:border-blue-500 transition duration-300 cursor-pointer">
                                Dinner
                            </Tab>
                            <Tab className="text-gray-600 font-medium px-3 py-2 border-b-2 border-transparent hover:text-blue-500 hover:border-blue-500 transition duration-300 cursor-pointer">
                                All Meals
                            </Tab>
                        </TabList>
                    </div>

                    {/* Tab Panels */}

                    {/* Breakfast Panel */}
                    <TabPanel>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Breakfast.map(items => (
                                <Meals_Category_Card key={items.id} items={items}></Meals_Category_Card>
                            ))}
                        </div>
                    </TabPanel>

                    {/* Lunch Panel */}
                    <TabPanel>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Lunch.map(items => (
                                <Meals_Category_Card key={items.id} items={items}></Meals_Category_Card>
                            ))}
                        </div>
                    </TabPanel>

                    {/* Dinner Panel */}
                    <TabPanel>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Dinner.map(items => (
                                <Meals_Category_Card key={items.id} items={items}></Meals_Category_Card>
                            ))}
                        </div>
                    </TabPanel>

                    {/* All Meals Panel */}
                    <TabPanel>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {AllMeals.map(items => (
                                <Meals_Category_Card key={items.id} items={items}></Meals_Category_Card>
                            ))}
                        </div>
                    </TabPanel>

                </Tabs>
            </section>
        </div>
    );
};

export default MealsByCategory;





// import SectionTitle from "../../../Components/SectionTitle/SectionTitle";
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';
// import useMeals from "../../../Hooks/useMeals";
// import Meals_Category_Card from "../Meals_Category_Card/Meals_Category_Card";

// // {
// //     "id": 11,
// //     "title": "Fried Chicken Breast",
// //     "category": "Dinner",
// //     "image": "https://i.ibb.co.com/5Rd9q77/side-view-fried-chicken-breast-with-vegetables-sauce.jpg",
// //     "rating": 4.7,
// //     "price": 24.99,
// //     "details": "Crispy fried chicken breast served with vegetables and a rich sauce."
// // },

// const MealsByCategory = () => {
//     const [meals] = useMeals();
//     const Breakfast = meals.filter(item => item.category === 'Breakfast');
//     const Lunch = meals.filter(item => item.category === 'Lunch');
//     const Dinner = meals.filter(item => item.category === 'Dinner');
//     const AllMeals = meals;



//     return (
//         <div>
//             <SectionTitle
//                 heading={"Meals By Category"}
//                 shortDescription={"All Meals are Showing by Category Wise"}
//             ></SectionTitle>
//             {/* Breakfast, Lunch, Dinner, and All Meals categories. */}

//             <section >
//                 <Tabs defaultIndex={0} onSelect={(index) => console.log(index)}>

//                     <div className="showingTabWise flex justify-center my-4">

//                         <TabList className="flex">
//                             <Tab className="text-gray-600 font-medium px-6 py-2 border-b-2 border-transparent hover:text-blue-500 hover:border-blue-500 transition duration-300">Breakfast</Tab>
//                             <Tab className="text-gray-600 font-medium px-6 py-2 border-b-2 border-transparent hover:text-blue-500 hover:border-blue-500 transition duration-300">Lunch</Tab>
//                             <Tab className="text-gray-600 font-medium px-6 py-2 border-b-2 border-transparent hover:text-blue-500 hover:border-blue-500 transition duration-300">Dinner</Tab>
//                             <Tab className="text-gray-600 font-medium px-6 py-2 border-b-2 border-transparent hover:text-blue-500 hover:border-blue-500 transition duration-300">All Meals </Tab>
//                         </TabList>

//                     </div>
//                     {/* Breakfast  */}
//                     <TabPanel>
//                         <div className="grid lg:grid-cols-3 gap-4">
//                             {
//                                 Breakfast.map(items => <Meals_Category_Card key={items.id} items={items}></Meals_Category_Card>)
//                             }
//                         </div>

//                     </TabPanel>
//                     {/* lunch  */}
//                     <TabPanel>
//                         <div className="grid lg:grid-cols-3 gap-4">
//                             {
//                                 Lunch.map(items => <Meals_Category_Card key={items.id} items={items}></Meals_Category_Card>)
//                             }
//                         </div>
//                     </TabPanel>
//                     {/* dinner  */}
//                     <TabPanel>
//                         <div className="grid lg:grid-cols-3 gap-4">
//                             {
//                                 Dinner.map(items => <Meals_Category_Card key={items.id} items={items}></Meals_Category_Card>)
//                             }
//                         </div>
//                     </TabPanel>
//                     {/* all meals  */}
//                     <TabPanel>
//                         <div className="grid lg:grid-cols-3 gap-4">
//                             {
//                                 AllMeals.map(items => <Meals_Category_Card key={items.id} items={items}></Meals_Category_Card>)
//                             }
//                         </div>
//                     </TabPanel>
//                 </Tabs>
//             </section>

//         </div>
//     );
// };

// export default MealsByCategory;