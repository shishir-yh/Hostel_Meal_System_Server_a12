import { createContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from "firebase/auth";
import axios from "axios";
import { app } from "../Firebase/firebase.config";

export const AuthContext = createContext(null);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to save user to the database with a default badge
    const saveUserToDatabase = async (user) => {
        try {
            const response = await axios.post('https://hostel-meal-system-server-a12.vercel.app/users', {
                email: user.email,
                name: user.displayName || user.name || 'Anonymous',
                photo: user.photoURL || '',
                badge: "Bronze Badge", // Default badge for new users
            });
            if (response.data.insertedId) {
                console.log('User saved to the database with Bronze Badge.');
            } else {
                console.log('User already exists in the database.');
            }
        } catch (error) {
            console.error('Failed to save user to database:', error);
        }
    };

    // Function to create a new user with email and password
    const createUser = async (email, password, name, photo = '') => {
        setLoading(true);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const createdUser = result.user;

            // Update the user's profile with a name and photo
            await updateUserProfile(name, photo);

            // Save user to the database
            await saveUserToDatabase({
                email,
                name,
                photo,
            });

            return createdUser;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Function to sign in with Google
    const signInWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider)
            .then((result) => {
                const user = result.user;

                // Save user to the database
                saveUserToDatabase(user);
                return user;
            })
            .catch((error) => {
                console.error('Google Sign-In failed:', error);
                throw error;
            })
            .finally(() => setLoading(false));
    };

    // Function to sign in with email and password
    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
            .then((result) => {
                const user = result.user;
                // Save user to the database
                saveUserToDatabase(user);
                return user;
            })
    };

    const logOut = () => {
        setLoading(true);
        return signOut(auth).finally(() => setLoading(false));
    };

    // Function to update user profile
    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo,
        });
    };

    // Monitor authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        loading,
        createUser,
        signIn,
        signInWithGoogle,
        logOut,
        updateUserProfile,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;


