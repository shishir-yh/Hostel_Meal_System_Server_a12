import banner1 from "../../../assets/Banner/5.jpg";
import banner2 from "../../../assets/Banner/1.jpg";
import banner3 from "../../../assets/Banner/2.jpg";
import banner4 from "../../../assets/Banner/3.jpg";
import banner5 from "../../../assets/Banner/4.jpg";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./styles.css";

// Import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

export default function App() {
    // Slides data
    const slides = [
        {
            image: banner1,
            text: "Enjoy delicious, home-style meals every day at your hostel!",
        },
        {
            image: banner2,
            text: "Healthy and affordable meals designed for hostel life.",
        },
        {
            image: banner3,
            text: "From breakfast to dinner, we've got your cravings covered.",
        },
        {
            image: banner4,
            text: "Fresh ingredients, tasty recipes, and a touch of care.",
        },
        {
            image: banner5,
            text: "A meal system built to make hostel living easier and better.",
        },
    ];

    return (
        <div className="w-full">
            {/* Static Heading */}
            <div className="text-center bg-yellow-400 text-white py-4">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                    Welcome to Our Hostel Meal System
                </h1>
                <p className="text-lg md:text-xl mt-2">
                    Explore meal plans and timings with ease
                </p>
            </div>

            {/* Swiper Slider */}
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative">
                            <img
                                src={slide.image}
                                alt={`Slide ${index + 1}`}
                                className="w-full h-[400px] md:h-[500px] lg:h-[600px]"
                            />
                            {/* Short Description and Search Bar inside Slider */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4">
                                <p className="text-yellow-400 bg-black bg-opacity-30 text-xl md:text-xl lg:text-2xl font-bold rounded-lg px-4 py-2">
                                    {slide.text}
                                </p>
                                {/* Search Bar */}
                                <div className="relative w-full max-w-lg">
                                    <input
                                        type="text"
                                        placeholder="Search for meal plans or timings..."
                                        className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    />
                                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500">
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}




// import banner1 from "../../../assets/Banner/5.jpg";
// import banner2 from "../../../assets/Banner/1.jpg";
// import banner3 from "../../../assets/Banner/2.jpg";
// import banner4 from "../../../assets/Banner/3.jpg";
// import banner5 from "../../../assets/Banner/4.jpg";
// // Import Swiper React components
// import { Swiper, SwiperSlide } from "swiper/react";

// // Import Swiper styles
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "./styles.css";

// // Import required modules
// import { Autoplay, Pagination, Navigation } from "swiper/modules";

// export default function App() {
//     // Slides data
//     const slides = [
//         {
//             image: banner1,
//             text: "Enjoy delicious, home-style meals every day at your hostel!",
//         },
//         {
//             image: banner2,
//             text: "Healthy and affordable meals designed for hostel life.",
//         },
//         {
//             image: banner3,
//             text: "From breakfast to dinner, we've got your cravings covered.",
//         },
//         {
//             image: banner4,
//             text: "Fresh ingredients, tasty recipes, and a touch of care.",
//         },
//         {
//             image: banner5,
//             text: "A meal system built to make hostel living easier and better.",
//         },
//     ];

//     return (
//         <div className="w-full">
//             {/* Swiper Slider */}
//             <Swiper
//                 spaceBetween={30}
//                 centeredSlides={true}
//                 autoplay={{
//                     delay: 3000,
//                     disableOnInteraction: false,
//                 }}
//                 pagination={{
//                     clickable: true,
//                 }}
//                 navigation={true}
//                 modules={[Autoplay, Pagination, Navigation]}
//                 className="mySwiper"
//             >
//                 {slides.map((slide, index) => (
//                     <SwiperSlide key={index}>
//                         <div className="relative">
//                             <img
//                                 src={slide.image}
//                                 alt={`Slide ${index + 1}`}
//                                 className="w-full h-[400px] md:h-[500px] lg:h-[600px]"
//                             />
//                             {/* Short Description and Search Bar inside Slider */}
//                             <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4">
//                                 <p className="text-yellow-400 bg-black bg-opacity-30 text-xl md:text-xl lg:text-2xl font-bold rounded-lg px-4 py-2">
//                                     {slide.text}
//                                 </p>
//                                 {/* Search Bar */}
//                                 <div className="relative w-full max-w-lg">
//                                     <input
//                                         type="text"
//                                         placeholder="Search for meal plans or timings..."
//                                         className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//                                     />
//                                     <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500">
//                                         Search
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </SwiperSlide>
//                 ))}
//             </Swiper>
//         </div>
//     );
// }
