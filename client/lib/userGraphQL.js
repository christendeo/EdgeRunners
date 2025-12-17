// For the front-end user mutations
import {gql} from "@apollo/client";

// New user creation
export const ADD_USER = gql`
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
        $diet_goal: String!,
        $use_custom_target: Boolean,
        $custom_target_calories: Float
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
            diet_goal: $diet_goal,
            use_custom_target: $use_custom_target,
            custom_target_calories: $custom_target_calories
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
            use_custom_target
            custom_target_calories
            current_target_calories
			token
        }
    }
`;

// User login
export const LOGIN_USER = gql`
    mutation LoginUser($email: String!, $password: String!) {
        loginUser(email: $email, password: $password) {
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
            use_custom_target
            custom_target_calories
            current_target_calories
			token
        }
    }
`;

// Edit profile
export const EDIT_USER = gql`
    mutation EditUser(
        $_id: String!
        $first_name: String
        $last_name: String
        $email: String
        $sex: String
        $date_of_birth: String
        $height: Float
        $weight: Float
        $activity_level: String
        $diet_goal: String
        $password: String
        $use_custom_target: Boolean
        $custom_target_calories: Float
    ) {
        editUser(
            _id: $_id
            first_name: $first_name
            last_name: $last_name
            email: $email
            sex: $sex
            date_of_birth: $date_of_birth
            height: $height
            weight: $weight
            activity_level: $activity_level
            diet_goal: $diet_goal
            password: $password
            use_custom_target: $use_custom_target
            custom_target_calories: $custom_target_calories
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
            createdAt
            updatedAt
            use_custom_target
            custom_target_calories
            current_target_calories
        }
    }
`;

// Changing password when user is logged in only
export const CHANGE_PASSWORD = gql`
    mutation ChangePassword(
        $_id: String!,
        $oldPassword: String!,
        $newPassword: String!
    ) {
        changePassword(
            _id: $_id,
            oldPassword: $oldPassword,
            newPassword: $newPassword
        ) {
            _id
            email
            updatedAt
        }
    }
`;