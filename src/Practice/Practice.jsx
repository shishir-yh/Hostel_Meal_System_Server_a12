Assignment 12 : - all of it:

Navbar:
logo + website name + home + meals + upcoming meals
Notification icon + and join US(NOT LOGIN)

IF LOGIN PROFILE PIC: -
    1) USERNAME 2) dASHBOARD 3) LOGOUT BUTTON

BANNER SECTION:
1) SLIDER  2) HEADING TITLE 3)SHORT DESCRIOTION 4) SERACH INPUTFIELD WITH BUTTON

MEALS BY CATEGORY:
ALL OF THINGS ARE IN TAB SYSTEM
1)bREAKFAST 2)Lunch 3)Dinne 4) all meals

title, image, rating price and dtails

what i will now: -

    1) just work on the daisy ui interface i think its better to work with the that thing 
ok done
h


// Import dependencies
// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.364im.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });

// async function run() {
//     try {
//         // Connect to MongoDB
//         await client.connect();
//         await client.db("admin").command({ ping: 1 });
//         console.log("Connected to MongoDB successfully!");

//         // Database and collections
//         const mealCollection = client.db("HostelMealSystem").collection("MealMenu");
//         const reviewCollection = client.db("HostelMealSystem").collection("Review");
//         const likeCollection = client.db("HostelMealSystem").collection("Like");

//         // ** APIs **

//         // Get all meals
//         app.get('/allmeal', async (req, res) => {
//             try {
//                 const result = await mealCollection.find().toArray();
//                 res.send(result);
//             } catch (error) {
//                 res.status(500).send({ error: "Failed to fetch meals." });
//             }
//         });

//         // Search meals with filters
//         app.get('/allmealSearch', async (req, res) => {
//             const { search, category, minPrice, maxPrice } = req.query;

//             let query = {};

//             if (search) {
//                 query.title = { $regex: search, $options: 'i' }; // Case-insensitive search
//             }
//             if (category) {
//                 query.category = category;
//             }
//             if (minPrice || maxPrice) {
//                 query.price = {};
//                 if (minPrice) query.price.$gte = parseFloat(minPrice);
//                 if (maxPrice) query.price.$lte = parseFloat(maxPrice);
//             }

//             try {
//                 const result = await mealCollection.find(query).toArray();
//                 res.send(result);
//             } catch (error) {
//                 res.status(500).send({ error: "Failed to fetch meals with filters." });
//             }
//         });

//         // Get meal by ID
//         app.get('/meal/:id', async (req, res) => {
//             const { id } = req.params;
//             try {
//                 const result = await mealCollection.findOne({ _id: new ObjectId(id) });
//                 if (!result) return res.status(404).send({ error: "Meal not found." });
                
//                 const reviews = await reviewCollection.find({ mealId: id }).toArray();
//                 res.send({ meal: result, reviews });
//             } catch (error) {
//                 res.status(500).send({ error: "Failed to fetch meal details." });
//             }
//         });

//         // Like a meal
//         app.post('/meal/:id/like', async (req, res) => {
//             const { id } = req.params;
//             try {
//                 const updateResult = await mealCollection.updateOne(
//                     { _id: new ObjectId(id) },
//                     { $inc: { likes: 1 } }
//                 );

//                 if (updateResult.modifiedCount === 0) {
//                     return res.status(404).send({ error: "Meal not found or already liked." });
//                 }
//                 res.send({ message: "Meal liked successfully." });
//             } catch (error) {
//                 res.status(500).send({ error: "Failed to like meal." });
//             }
//         });

//         // Add a review
//         app.post('/meal/:id/reviews', async (req, res) => {
//             const { id } = req.params;
//             const { username, comment } = req.body;

//             if (!username || !comment) {
//                 return res.status(400).send({ error: "Username and comment are required." });
//             }

//             const review = {
//                 mealId: id,
//                 username,
//                 comment,
//                 timestamp: new Date()
//             };

//             try {
//                 const result = await reviewCollection.insertOne(review);
//                 res.send({ message: "Review added successfully.", reviewId: result.insertedId });
//             } catch (error) {
//                 res.status(500).send({ error: "Failed to add review." });
//             }
//         });

//         // Get all reviews
//         app.get('/reviews', async (req, res) => {
//             try {
//                 const result = await reviewCollection.find().toArray();
//                 res.send(result);
//             } catch (error) {
//                 res.status(500).send({ error: "Failed to fetch reviews." });
//             }
//         });

//     } finally {
//         // Keep the MongoDB connection open
//     }
// }
// run().catch(console.dir);

// // Default Route
// app.get('/', (req, res) => {
//     res.send("Hostel meal server is running successfully!");
// });

// // Server Listen
// app.listen(port, () => {
//     console.log(`Hostel Meal server is running on port ${port}`);
// });
