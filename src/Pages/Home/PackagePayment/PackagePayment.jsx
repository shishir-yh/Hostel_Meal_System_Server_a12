import { useNavigate } from 'react-router-dom';

const PackagePayment = () => {
    const navigate = useNavigate();

    const packages = [
        { name: 'Silver', price: 10 },
        { name: 'Gold', price: 20 },
        { name: 'Platinum', price: 30 },
    ];

    const handleCheckout = (packageName) => {
        navigate(`/checkout/${packageName}`);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                    <div
                        key={pkg.name}
                        className="card bg-base-100 shadow-xl border hover:scale-105 transition-transform"
                    >
                        <div className="card-body text-center">
                            <h2 className="card-title text-2xl font-bold">{pkg.name} Package</h2>
                            <p className="text-lg">Price: ${pkg.price}</p>
                            <button
                                className="btn btn-primary mt-4"
                                onClick={() => handleCheckout(pkg.name)}
                            >
                                Upgrade to {pkg.name}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PackagePayment;
