import axios from "axios";

const axiosSecure = axios.create({
    baseURL: 'https://hostel-meal-system-server-a12.vercel.app'
})
const useAxiosSecure = () => {

    return axiosSecure;
};

export default useAxiosSecure;

// app.post('/carts', async (req, res) => {
//     const cartItem = req.body;
//     const result = await cartCollection.insertOne(cartItem);
//     res.send(result);
// })