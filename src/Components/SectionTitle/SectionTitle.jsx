/* eslint-disable no-unused-vars */

const SectionTitle = ({ heading, shortDescription }) => {
    return (
        <div className="text-center space-y-4 my-8">
            <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide lg:mt-12 mt-6">
                {heading}
            </h2>
            <p className="text-gray-600 text-lg lg:w-1/2 mx-auto">
                {shortDescription}
            </p>

        </div>
    );
};

export default SectionTitle;
