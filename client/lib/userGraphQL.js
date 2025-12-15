// For the front-end user mutations
import {gql} from "@apollo/client";

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