require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// App setup
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://hostel-meal-auth.web.app",
        "https://hostel-meal-auth.firebaseapp.com"
    ],
    credentials: true
}));
app.use(express.json());
// app.use(bodyParser.json());

// MongoDB client setup
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.364im.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

// Function to run the server
async function run() {
    try {
        // Connect the client to MongoDB
        // await client.connect();
        console.log("Connected to MongoDB successfully!");

        // Database and collections
        const db = client.db("HostelMealSystem");
        const mealCollection = db.collection("MealMenu");
        const likeCollection = db.collection("Likes");
        const reviewCollection = db.collection("Review");
        const ratingCollection = db.collection("Rating");
        const userCollection = db.collection("users");
        const paymentCollection = db.collection("Payment");
        const mealRequestsCollection = db.collection("MealRequests");
        const UpcomingMealsCollection = db.collection("UpcomingMeals");





        // Routes
        //-----------admin profile-------------------//



        app.get("/api/users/:email", async (req, res) => {
            const email = req.params.email; // Get email from the request

            try {
                // Query the database for the user by email
                const user = await userCollection.findOne({ email });

                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                // Return the user object (or just the role if you prefer)
                res.json({ role: user.role });
            } catch (error) {
                console.error("Error fetching user role:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });


        //-------------Get all users .....................//
        app.get('/users', async (req, res) => {
            const search = req.query.search || "";
            const query = {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ],
            };
            const users = await userCollection.find(query).toArray();
            res.send(users);
        });

        // Make a user admin
        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = { $set: { role: "admin" } };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        // Delete a user
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });

        // Add a new user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email };
            const existingUser = await userCollection.findOne(query);

            if (existingUser) {
                return res.send({ message: 'User already exists', insertedId: null });
            }

            user.badge = "Bronze Badge";
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        //-------------------upcoming meal request-------------------//

        // Fetch upcoming meals
        app.get('/upcoming-meals', async (req, res) => {
            try {
                const upcomingMeals = await UpcomingMealsCollection.find().toArray();
                res.send(upcomingMeals);
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: "Failed to fetch upcoming meals.",
                    error: error.message,
                });
            }
        });
        // only premium user can request meal
        app.post('/request-upcoming-meal', async (req, res) => {
            const { mealId, userId } = req.body;

            try {
                // Check if the user has already requested the meal
                const existingRequest = await mealRequestsCollection.findOne({ mealId, userId });

                if (existingRequest) {
                    return res.status(400).send({
                        success: false,
                        message: "You have already requested this meal.",
                    });
                }

                // Check the user's badge (Platinum, Gold, Silver)
                const user = await userCollection.findOne({ _id: new ObjectId(userId) });
                if (!user || !["Platinum", "Gold", "Silver"].includes(user.badge)) {
                    return res.status(403).send({
                        success: false,
                        message: "You are not allowed to request this meal.",
                    });
                }

                // Add the meal request
                const result = await mealRequestsCollection.insertOne({
                    mealId,
                    userId,
                    requestedAt: new Date(),
                });

                res.send({
                    success: true,
                    message: "Meal request submitted successfully!",
                    data: result,
                });
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: "Failed to submit meal request.",
                    error: error.message,
                });
            }
        });
        // admin upcoming meal request







        // Fetch all upcoming meals for admin--> OK
        app.get('/upcoming-meals-admin', async (req, res) => {
            try {
                const upcomingMeals = await UpcomingMealsCollection.find().sort({ likeCount: -1 }).toArray();
                res.send(upcomingMeals);
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: "Failed to fetch upcoming meals.",
                    error: error.message,
                });
            }
        });

        // Publish a specific upcoming meal

        // Publish a meal: Move it from UpcomingMealsCollection to MealMenu
        app.post('/publish-meal', async (req, res) => {
            const { mealId } = req.body;

            try {
                const meal = await UpcomingMealsCollection.findOne({ _id: new ObjectId(mealId) });

                if (!meal) {
                    return res.status(404).send({
                        success: false,
                        message: "Meal not found in Upcoming Meals Collection.",
                    });
                }

                const insertResult = await mealCollection.insertOne(meal);

                if (insertResult.insertedId) {
                    await UpcomingMealsCollection.deleteOne({ _id: new ObjectId(mealId) });

                    return res.send({
                        success: true,
                        message: "Meal published successfully!",
                    });
                } else {
                    return res.status(500).send({
                        success: false,
                        message: "Failed to publish meal.",
                    });
                }
            } catch (error) {
                console.error("Error publishing meal:", error);
                return res.status(500).send({
                    success: false,
                    message: "Server error while publishing meal.",
                    error: error.message,
                });
            }
        });


        // Add a new upcoming meal---ok
        app.post('/add-upcoming-meal', async (req, res) => {
            const { title, category, image, ingredients, description, price, distributorName, distributorEmail } = req.body;

            try {
                const newMeal = {
                    title,
                    category,
                    image,
                    ingredients,
                    description,
                    price,
                    distributorName,
                    distributorEmail,
                    likeCount: 0, // Initialize like count to 0
                    createdAt: new Date(),
                };

                const result = await UpcomingMealsCollection.insertOne(newMeal);
                res.send({
                    success: true,
                    message: "Upcoming meal added successfully.",
                    data: result,
                });
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: "Failed to add upcoming meal.",
                    error: error.message,
                });
            }
        });















        //----------------finished upcoming meal request-------------------//
        // POST /like
        app.post('/like-upcomingMeals', async (req, res) => {
            const { mealId, userId } = req.body;

            try {
                // Check if the user has already liked the meal
                const existingLike = await likeCollection.findOne({ mealId, userId });

                if (existingLike) {
                    return res.status(400).send({
                        success: false,
                        message: "You have already liked this meal.",
                    });
                }

                // Check the user's badge (Platinum, Gold, Silver)
                const user = await userCollection.findOne({ _id: userId });
                // if (!user || !["Platinum", "Gold", "Silver"].includes(user.badge)) {
                //     return res.status(403).send({
                //         success: false,
                //         message: "You are not allowed to like this meal.",
                //     });
                // }

                // Increment the meal's like count
                const updateResult = await UpcomingMealsCollection.updateOne(
                    { _id: new ObjectId(mealId) },
                    { $inc: { likeCount: 1 } }
                );

                if (updateResult.matchedCount === 0) {
                    return res.status(404).send({
                        success: false,
                        message: "Meal not found.",
                    });
                }

                // Add the like record
                await likeCollection.insertOne({ mealId, userId, likedAt: new Date() });

                res.send({
                    success: true,
                    message: "You liked this meal!",
                });
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: "Failed to like the meal.",
                    error: error.message,
                });
            }
        });


        //------------------------------------------ Meals-------------------------------------//
        // Get all meals
        app.get('/allmeal', async (req, res) => {
            try {
                const result = await mealCollection.find().toArray();
                res.send(result);
            } catch (error) {
                res.status(500).send({ error: "Failed to fetch meals" });
            }
        });

        // Search meals with filters
        app.get('/allmealSearch', async (req, res) => {
            const { search, category, minPrice, maxPrice } = req.query;

            let query = {};
            if (search) {
                query.title = { $regex: search, $options: 'i' };
            }
            if (category) {
                query.category = category;
            }
            if (minPrice || maxPrice) {
                query.price = {};
                if (minPrice) query.price.$gte = parseFloat(minPrice);
                if (maxPrice) query.price.$lte = parseFloat(maxPrice);
            }

            try {
                const result = await mealCollection.find(query).toArray();
                res.send(result);
            } catch (error) {
                res.status(500).send({ error: "Failed to search meals" });
            }
        });

        // Get a single meal by ID
        app.get('/allMeal/:id', async (req, res) => {
            const { id } = req.params;
            try {
                const result = await mealCollection.findOne({ _id: new ObjectId(id) });
                if (!result) {
                    return res.status(404).send({ error: "Meal not found" });
                }
                res.send(result);
            } catch (error) {
                res.status(500).send({ error: "Failed to fetch meal details" });
            }
        });
        // admin post the meal here
        app.post("/meals", async (req, res) => {
            const meal = req.body;

            // Generate a random mealId (e.g., a number between 100000 and 999999)
            const mealId = Math.floor(100000 + Math.random() * 900000);
            meal.mealId = mealId; // Add the mealId to the meal object

            try {
                const result = await mealCollection.insertOne(meal); // Save to your database
                res.status(201).send({
                    success: true,
                    message: "Meal added successfully!",
                    data: result,
                });
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: "Failed to add meal.",
                    error: error.message,
                });
            }
        });
        //-----------admin all meal.............//
        //importan 
        app.get('/meals', async (req, res) => {
            const { sortBy } = req.query; // Retrieve the sorting field from query params

            let sortCriteria = {};
            if (sortBy === 'likes') {
                sortCriteria = { likeCount: -1 }; // Sort by likes (descending)
            } else if (sortBy === 'reviews_count') {
                sortCriteria = { reviewCount: -1 }; // Sort by reviews_count (descending)
            }

            try {
                const meals = await mealCollection.find({}).sort(sortCriteria).toArray(); // Apply sorting
                res.send(meals);
            } catch (error) {
                res.status(500).send({ message: "Failed to fetch meals", error: error.message });
            }
        });


        // Delete a meal by ID now use it
        app.delete('/meals/:id', async (req, res) => {
            const { id } = req.params;

            try {
                const result = await mealCollection.deleteOne({ _id: new ObjectId(id) });

                if (result.deletedCount === 0) {
                    return res.status(404).send({ message: "Meal not found." });
                }

                res.send({ message: "Meal deleted successfully!" });
            } catch (error) {
                res.status(500).send({ message: "Failed to delete meal", error: error.message });
            }
        });


        // finished here



        app.put("/meals/:id", async (req, res) => {
            const { id } = req.params;
            const { title, category, ingredients, description, price, distributorName } = req.body;
            console.log(title, category, ingredients, description, price, distributorName)
            // Input validation
            if (!title || !category || !ingredients || !description || !price) {
                return res.status(400).json({ error: "All fields are required" });
            }

            try {
                // Convert `id` to ObjectId
                const mealId = new ObjectId(id);

                // Update the meal in the database
                const result = await db.collection("MealMenu").updateOne(
                    { _id: mealId },
                    {
                        $set: {
                            title,
                            category,
                            ingredients,
                            description,
                            price: parseFloat(price), // Ensure price is stored as a number
                            distributorName: distributorName || "Unknown Admin",
                        },
                    }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).json({ error: "Meal not found" });
                }

                res.status(200).json({ message: "Meal updated successfully" });
            } catch (error) {
                console.error("Error updating meal:", error);
                res.status(500).json({ error: "Failed to update meal" });
            }
        });

        // --------------Users Profile -----------------------------//

        // Fetch user details by email
        app.get('/user-details', async (req, res) => {
            const { email } = req.query;

            if (!email) {
                return res.status(400).send({
                    success: false,
                    message: "Email is required to fetch user details.",
                });
            }

            try {
                const user = await userCollection.findOne({ email });

                if (!user) {
                    return res.status(404).send({
                        success: false,
                        message: "User not found.",
                    });
                }

                res.send({
                    success: true,
                    message: "User details fetched successfully.",
                    data: user,
                });
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: "Failed to fetch user details.",
                    error: error.message,
                });
            }
        });

        //workin here
        // --------------Request meal -----------------------------//
        app.post('/meal-request', async (req, res) => {
            const { mealId, userId, mealTitle, likeCount, reviewCount } = req.body;

            try {
                const existingRequest = await mealRequestsCollection.findOne({ mealId, userId });

                if (existingRequest) {
                    return res.status(400).send({
                        success: false,
                        message: "You have already requested this meal.",
                    });
                }

                const result = await mealRequestsCollection.insertOne({
                    mealId,
                    userId,
                    mealTitle,
                    likeCount,
                    reviewCount,
                    status: 'pending',
                    requestedAt: new Date(),
                });

                res.send({
                    success: true,
                    message: "Meal request added successfully!",
                    data: result,
                });
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: "Failed to add meal request.",
                    error: error.message,
                });
            }
        });

        //---------------admin meal request-------------------//

        app.get("/admin-meal-requests", async (req, res) => {
            const { search = "" } = req.query; // Optional search parameter

            try {
                const query = {
                    $or: [
                        { userId: { $regex: search, $options: "i" } }, // Search by email (userId)
                        { mealTitle: { $regex: search, $options: "i" } }, // Search by meal title
                    ],
                };

                const mealRequests = await mealRequestsCollection.find(query).toArray();

                res.send({
                    success: true,
                    message: "Meal requests fetched successfully!",
                    data: mealRequests,
                });
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: "Failed to fetch meal requests.",
                    error: error.message,
                });
            }
        });
        app.put("/admin-meal-requests/:id", async (req, res) => {
            const { id } = req.params;

            try {
                const result = await mealRequestsCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { status: "delivered" } }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).send({
                        success: false,
                        message: "Meal request not found.",
                    });
                }

                res.send({
                    success: true,
                    message: "Meal request updated to delivered successfully!",
                });
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: "Failed to update meal request status.",
                    error: error.message,
                });
            }
        });


        // Fetch all requested meals for a specific user
        app.get("/meal-requests", async (req, res) => {
            const { userId } = req.query;

            try {
                const mealRequests = await mealRequestsCollection.find({ userId }).toArray();
                res.send(mealRequests);
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: "Failed to fetch meal requests.",
                    error: error.message,
                });
            }
        });


        // Cancel a specific meal request
        app.delete("/meal-requests/:id", async (req, res) => {
            const { id } = req.params;

            try {
                const result = await mealRequestsCollection.deleteOne({ _id: new ObjectId(id) });

                if (result.deletedCount === 0) {
                    return res.status(404).send({
                        success: false,
                        message: "Meal request not found.",
                    });
                }

                res.send({
                    success: true,
                    message: "Meal request canceled successfully!",
                });
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: "Failed to cancel meal request.",
                    error: error.message,
                });
            }
        });
        // Finished


        //like meal start
        // --------------------------------------------------------------//
        app.post('/like', async (req, res) => {
            const { mealId, userId } = req.body;

            try {
                const existingLike = await likeCollection.findOne({ mealId, userId });

                if (existingLike) {
                    return res.status(400).send({
                        success: false,
                        message: "You have already liked this meal.",
                    });
                }

                const updateResult = await mealCollection.updateOne(
                    { _id: new ObjectId(mealId) },
                    { $inc: { likeCount: 1 } }
                );

                if (updateResult.matchedCount === 0) {
                    return res.status(404).send({
                        success: false,
                        message: "Meal not found.",
                    });
                }

                await likeCollection.insertOne({ mealId, userId, likedAt: new Date() });

                res.send({
                    success: true,
                    message: "You liked this meal!",
                });
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: "Failed to like the meal.",
                    error: error.message,
                });
            }
        });

        // start review//
        //-----------------------------------------------------------------------------------//

        // Submit a review

        // app.get("/reviews", async (req, res) => {
        //     const { mealId } = req.query;

        //     if (!mealId) {
        //         return res.status(400).send({
        //             success: false,
        //             message: "Missing mealId in query parameters.",
        //         });
        //     }

        //     try {
        //         const reviews = await reviewCollection.find({ mealId }).toArray();
        //         res.send(reviews);
        //     } catch (error) {
        //         res.status(500).send({
        //             success: false,
        //             message: "Failed to fetch reviews.",
        //             error: error.message,
        //         });
        //     }
        // });




        // Get reviews for a specific meal
        // / Add a new review
        // app.post("/review", async (req, res) => {
        //     const { mealId, userId, reviewText } = req.body;

        //     if (!mealId || !userId || !reviewText) {
        //         return res.status(400).send({
        //             success: false,
        //             message: "Missing required fields: mealId, userId, or reviewText.",
        //         });
        //     }

        //     try {
        //         const result = await reviewCollection.insertOne({
        //             mealId,
        //             userId,
        //             reviewText,
        //             createdAt: new Date(),
        //         });
        //         res.send({ success: true, message: "Review added successfully!", result });
        //     } catch (error) {
        //         res.status(500).send({
        //             success: false,
        //             message: "Failed to add review.",
        //             error: error.message,
        //         });
        //     }
        // });


        // app.post("/review", async (req, res) => {
        //     const { mealId, userId, reviewText } = req.body;

        //     if (!mealId || !userId || !reviewText) {
        //         return res.status(400).send({
        //             success: false,
        //             message: "Missing required fields: mealId, userId, or reviewText.",
        //         });
        //     }

        //     try {
        //         const result = await reviewCollection.insertOne({
        //             mealId,
        //             userId,
        //             reviewText,
        //             createdAt: new Date(),
        //         });
        //         res.send({ success: true, message: "Review added successfully!", result });
        //     } catch (error) {
        //         res.status(500).send({
        //             success: false,
        //             message: "Failed to add review.",
        //             error: error.message,
        //         });
        //     }
        // });




        // admin review------------------------------------//

        // Fetch all reviews for an admin
        // app.get("/reviewsAdmin", async (req, res) => {
        //     const { userId } = req.query;

        //     if (!userId) {
        //         return res.status(400).send({
        //             success: false,
        //             message: "Missing userId in query parameters.",
        //         });
        //     }

        //     try {
        //         const reviews = await reviewCollection.find({ userId }).toArray();
        //         res.send(reviews);
        //     } catch (error) {
        //         res.status(500).send({
        //             success: false,
        //             message: "Failed to fetch reviews.",
        //             error: error.message,
        //         });
        //     }
        // });

        // // Delete a review
        // app.delete("/reviewsAdmin/:id", async (req, res) => {
        //     const { id } = req.params;

        //     try {
        //         const result = await reviewCollection.deleteOne({ _id: new ObjectId(id) });

        //         if (result.deletedCount === 1) {
        //             res.send({
        //                 success: true,
        //                 message: "Review deleted successfully.",
        //             });
        //         } else {
        //             res.status(404).send({
        //                 success: false,
        //                 message: "Review not found.",
        //             });
        //         }
        //     } catch (error) {
        //         res.status(500).send({
        //             success: false,
        //             message: "Failed to delete review.",
        //             error: error.message,
        //         });
        //     }
        // });

        // Get reviews by user
        app.get("/reviewsAdmin", async (req, res) => {
            try {
                const reviews = await reviewCollection.find({}).toArray(); // Fetch all reviews
                res.send(reviews);
            } catch (error) {
                res.status(500).send({ message: "Error fetching reviews", error: error.message });
            }
        });


        // Delete a review by ID
        app.delete("/reviewsAdmin/:id", async (req, res) => {
            const { id } = req.params;

            try {
                const result = await reviewCollection.deleteOne({ _id: new ObjectId(id) });
                if (result.deletedCount === 1) {
                    res.send({ success: true, message: "Review deleted successfully." });
                } else {
                    res.status(404).send({ success: false, message: "Review not found." });
                }
            } catch (error) {
                res.status(500).send({ success: false, message: "Error deleting review", error: error.message });
            }
        });


        //admin review-------------finshed-----------------------//
        app.post('/review', async (req, res) => {
            const { mealId, userId, reviewText, title, likeCount, reviewCount } = req.body;

            if (!mealId || !userId || !reviewText || !title) {
                return res.status(400).send({
                    success: false,
                    message: "Missing required fields. Ensure mealId, userId, reviewText, and title are provided."
                });
            }

            try {
                // Insert the review into the reviewCollection
                const result = await reviewCollection.insertOne({
                    mealId,
                    userId,
                    reviewText,
                    title,
                    likeCount: likeCount || 0, // Default values if not provided
                    reviewCount: reviewCount || 0,
                    reviewedAt: new Date(),
                });
                console.log(mealId, userId, likeCount, reviewCount)

                // Update the review count in the mealCollection
                const updateResult = await mealCollection.updateOne(
                    { _id: new ObjectId(mealId) },
                    { $inc: { reviewCount: 1 } } // Increment the review count by 1
                );

                if (updateResult.matchedCount === 0) {
                    return res.status(404).send({
                        success: false,
                        message: "Meal not found. Ensure the mealId is correct.",
                    });
                }

                res.send({
                    success: true,
                    message: "Your review has been submitted and review count updated!",
                    data: result,
                });
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: "Failed to submit your review.",
                    error: error.message,
                });
            }
        });





        app.get("/reviews", async (req, res) => {
            const { userId } = req.query;

            if (!userId) {
                return res.status(400).send({
                    success: false,
                    message: "Missing userId in query parameters.",
                });
            }

            try {
                const reviews = await reviewCollection.find({ userId }).toArray();
                res.send(reviews);
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: "Failed to fetch reviews.",
                    error: error.message,
                });
            }
        });

        // Delete a review by ID
        app.delete("/reviews/:id", async (req, res) => {
            const reviewId = req.params.id;

            try {
                // Find the review to get mealId
                const review = await reviewCollection.findOne({ _id: new ObjectId(reviewId) });
                if (!review) {
                    return res.status(404).send({
                        success: false,
                        message: "Review not found.",
                    });
                }

                // Delete the review
                const deleteResult = await reviewCollection.deleteOne({ _id: new ObjectId(reviewId) });
                if (deleteResult.deletedCount === 0) {
                    return res.status(404).send({
                        success: false,
                        message: "Failed to delete review.",
                    });
                }

                // Decrement review count in the meal collection
                await mealCollection.updateOne(
                    { _id: new ObjectId(review.mealId) },
                    { $inc: { reviewCount: -1 } }
                );

                res.send({
                    success: true,
                    message: "Review deleted successfully!",
                });
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: "Failed to delete review.",
                    error: error.message,
                });
            }
        });

        // Update a review by ID
        app.put("/reviews/:id", async (req, res) => {
            const reviewId = req.params.id;
            const { reviewText, title, likeCount } = req.body;

            if (!reviewText && !title && likeCount === undefined) {
                return res.status(400).send({
                    success: false,
                    message: "No fields provided for update. Please include reviewText, title, or likeCount.",
                });
            }

            try {
                // Build the update object
                const updateFields = {};
                if (reviewText) updateFields.reviewText = reviewText;
                if (title) updateFields.title = title;
                if (likeCount !== undefined) updateFields.likeCount = likeCount;

                // Update the review in the database
                const updateResult = await reviewCollection.updateOne(
                    { _id: new ObjectId(reviewId) },
                    { $set: updateFields }
                );

                if (updateResult.matchedCount === 0) {
                    return res.status(404).send({
                        success: false,
                        message: "Review not found. Ensure the reviewId is correct.",
                    });
                }

                res.send({
                    success: true,
                    message: "Review updated successfully!",
                });
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: "Failed to update review.",
                    error: error.message,
                });
            }
        });


        //  finished the my review--------------------------------- 




        app.post('/like', async (req, res) => {
            const { mealId, userId } = req.body;

            try {
                const existingLike = await likeCollection.findOne({ mealId, userId });

                if (existingLike) {
                    return res.status(400).send({
                        success: false,
                        message: "You have already liked this meal.",
                    });
                }

                const updateResult = await mealCollection.updateOne(
                    { _id: new ObjectId(mealId) },
                    { $inc: { likeCount: 1 } }
                );

                if (updateResult.matchedCount === 0) {
                    return res.status(404).send({
                        success: false,
                        message: "Meal not found.",
                    });
                }

                await likeCollection.insertOne({ mealId, userId, likedAt: new Date() });

                res.send({
                    success: true,
                    message: "You liked this meal!",
                });
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: "Failed to like the meal.",
                    error: error.message,
                });
            }
        });


        // finished the review system

        // Stripe payment methods
        //----------------------------------------------------------------------//
        app.post('/create-payment-intent', async (req, res) => {
            const { price } = req.body;

            if (!price) {
                return res.status(400).send({ error: 'Price is required.' });
            }

            try {
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: Math.round(price * 100), // Convert to cents
                    currency: 'usd',
                    payment_method_types: ['card'],
                });

                res.send({
                    clientSecret: paymentIntent.client_secret,
                });
            } catch (err) {
                console.error('Error creating payment intent:', err);
                res.status(500).send({ error: 'Failed to create payment intent.' });
            }
        });


        /**  here we showing the payment history of the user */
        app.get('/payments', async (req, res) => {
            const email = req.query.email;

            if (!email) {
                return res.status(400).send({ error: "Email query parameter is required" });
            }

            try {
                const payments = await paymentCollection.find({ email }).toArray();

                if (payments.length === 0) {
                    return res.status(404).send({ message: "No payment history found for this user" });
                }

                res.status(200).send(payments);
            } catch (error) {
                console.error("Error fetching payment history:", error);
                res.status(500).send({ error: "Failed to fetch payment history" });
            }
        });

        app.post('/payments', async (req, res) => {
            const { email, packageName, price, transactionId } = req.body;

            // Validate the request body
            if (!email || !packageName || !price || !transactionId) {
                return res.status(400).send({ error: "Invalid payment data. Email, packageName, price, and transactionId are required." });
            }

            try {
                // Step 1: Insert payment data into the `paymentCollection`
                const paymentData = { email, packageName, price, transactionId, date: new Date() }; // Added `date` for payment tracking
                const paymentResult = await paymentCollection.insertOne(paymentData);

                // Step 2: Update the user's badge in the `userCollection`
                const filter = { email: email }; // Find user by email
                const updateDoc = { $set: { badge: packageName } }; // Update the badge with the packageName
                const userUpdateResult = await userCollection.updateOne(filter, updateDoc);

                // Check if user update was successful
                if (userUpdateResult.matchedCount === 0) {
                    return res.status(404).send({
                        error: "User not found. Payment data was saved, but the badge update failed.",
                    });
                }

                // Respond with success if both operations succeed
                res.status(200).send({
                    success: true,
                    message: `Payment processed successfully, and user badge updated to '${packageName}'.`,
                    paymentInsertedId: paymentResult.insertedId,
                });
            } catch (error) {
                console.error("Error processing payment and updating badge:", error.message);
                res.status(500).send({ error: "Failed to process payment and update user badge." });
            }
        });

        //-----------------------finished stripe payment............................//


        // Default Route
        app.get('/', (req, res) => {
            res.send("Hostel meal server is running!");
        });

        // Server listen
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`Port ${port} is already in use. Please use a different port.`);
                process.exit(1);
            } else {
                console.error('Server error:', err);
            }
        });

    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
}

run().catch(console.dir);
