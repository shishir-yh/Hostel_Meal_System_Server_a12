import { useEffect, useState } from "react";


const useMeals = () => {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('https://hostel-meal-system-server-a12.vercel.app/allMeal')
            .then(res => res.json())
            .then(data => {
                setMeals(data)
                setLoading(false)
            })
    }, [])
    return [meals, loading]
};

export default useMeals;

