// User account creation
import React, {useContext, useState} from "react";
import {gql} from "@apollo/client";
import {useMutation} from "@apollo/client/react";
import {useRouter} from "next/router";
import {AuthContext} from "../lib/userAuthContext";

// Create user using user mutations
const ADD_USER = gql`
    mutation AddUser(
        $first_name: String!,
        $last_name: String!,
        $email: String!,
        $password: String!,
        $sex: String!,
        $date_of_birth: String!,
        $height: Float!,
        $weight: Float!,
        $activity_level: String!,
        $diet_goal: String!
    ) {
        addUser(
            first_name: $first_name,
            last_name: $last_name,
            email: $email,
            password: $password,
            sex: $sex,
            date_of_birth: $date_of_birth,
            height: $height,
            weight: $weight,
            activity_level: $activity_level,
            diet_goal: $diet_goal
        ) {
            _id
            first_name
            last_name
            email
            sex
            date_of_birth
            height
            weight
            activity_level
            diet_goal
            target_calories
        }
    }
`;

const SignupPage = () => {

    const userAuth = useContext(AuthContext);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        sex: "female",
        date_of_birth: "",
        height: "",
        weight: "",
        activity_level: "light",
        diet_goal: "maintain"
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [addUser, {loading}] = useMutation(ADD_USER);
    const router = useRouter();

    // For handling user changes
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((previousValues) => {
            return {
                ...previousValues,
                [name]: value
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        // Convert height and weight to numbers
        let userHeight = parseFloat(formData.height);
        let userWeight = parseFloat(formData.weight);

        // Validate if each is a valid number
        if (isNaN(userHeight) || isNaN(userWeight)) {
            setErrorMessage("Height and weight must be valid numbers :(");
            return;
        }

        try {
            const {data} = await addUser({
                variables: {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    password: formData.password,
                    sex: formData.sex,
                    date_of_birth: formData.date_of_birth,
                    height: userHeight,
                    weight: userWeight,
                    activity_level: formData.activity_level,
                    diet_goal: formData.diet_goal
                }
            });

            // If successful, redirect to login
            if (data && data.addUser) {
                userAuth.login(data.addUser);
                router.push("/dashboard");
            }

        } catch (e) {

            // Signup failed
            console.error(e);
            setErrorMessage(e.message || "Oh no! Something went wrong :(");
        }
    };

    // For displaying the page
    return (
        <div className="page-container">
            <h1>Create an Account Today!</h1>

            {/*For displaying success or error messages*/}
            {errorMessage && <p className="error-text">{errorMessage}</p>}
            {successMessage && <p className="success-text">{successMessage}</p>}

            <form onSubmit={handleSubmit} className="form-card">
                <div className="form-row">
                    <label>First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>Sex</label>
                    <select
                        name="sex"
                        value={formData.sex}
                        onChange={handleChange}
                    >
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                    </select>
                </div>

                <div className="form-row">
                    <label>Date of Birth (MM/DD/YYYY)</label>
                    <input
                        type="text"
                        name="date_of_birth"
                        placeholder="01/01/1995"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>Height (cm)</label>
                    <input
                        type="number"
                        step="0.1"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>Weight (kg)</label>
                    <input
                        type="number"
                        step="0.1"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>Activity Level</label>
                    <select
                        name="activity_level"
                        value={formData.activity_level}
                        onChange={handleChange}
                    >
                        <option value="sedentary">Sedentary</option>
                        <option value="light">Light</option>
                        <option value="moderate">Moderate</option>
                        <option value="active">Active</option>
                        <option value="very_active">Very Active</option>
                    </select>
                </div>

                <div className="form-row">
                    <label>Goal</label>
                    <select
                        name="diet_goal"
                        value={formData.diet_goal}
                        onChange={handleChange}
                    >
                        <option value="lose">Lose</option>
                        <option value="maintain">Maintain</option>
                        <option value="gain">Gain</option>
                    </select>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                </button>
            </form>
        </div>
    );
};

export default SignupPage;