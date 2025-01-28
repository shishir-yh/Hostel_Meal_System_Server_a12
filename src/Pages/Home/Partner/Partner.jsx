;
import Marquee from "react-fast-marquee";

const Partner = () => {
    const logos = [
        "https://i.ibb.co.com/GT9nmTm/0d70200090b21d6e0d3fde7eb894b303.webp",
        "https://i.ibb.co.com/2cQkVZT/4a14e7b2de7f6eaf5a6c98cb8c00b8de.webp",
        "https://i.ibb.co.com/YTZg0M6/7e55eb3d6a1a096058955ae7d64ee9d5.webp",
        "https://i.ibb.co.com/FqStbd4/45cf387098ad46bd9ea51bc56d1eb166.webp",
        "https://i.ibb.co.com/BVNkSfQ/525858954db2db7a24eb0d1070d316de.webp",
        "https://i.ibb.co.com/8MC9ZmJ/aff2c7c41798a9e8d510293d676b1308.png",
        "https://i.ibb.co.com/Vqt2wpV/b251bccd4dd602b7f894cea11547f1fb.webp",
        "https://i.ibb.co.com/64NJMZF/d4bd2adab19561c4303698d516577b7c.webp",
        "https://i.ibb.co.com/g61VnNj/ef27eb63d05f168ce948e3d43c9ba9d0.webp",
        "https://i.ibb.co.com/dmgpJQh/fcbdd3a228648ac062e4977b0eda8c76.png",
    ];

    return (
        <div className="py-10 bg-base-100">
            <h2 className="text-3xl font-bold text-center mb-6">Our Partners</h2>
            <Marquee speed={50} pauseOnHover={true} gradient={false}>
                {logos.map((logo, index) => (
                    <img
                        key={index}
                        src={logo}
                        className="h-24 mx-4"
                    />
                ))}
            </Marquee>
        </div>
    );
};

export default Partner;