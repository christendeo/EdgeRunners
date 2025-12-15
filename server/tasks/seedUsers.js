// Seed 5 users for now as a start
import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import {addUser} from '../data/userCollection.js';

// If needed, uncomment to refresh user database
// const db = await dbConnection();
// await db.dropDatabase();

export async function userSeed() {
    try {
        console.log("Woohoo! Seeding users collection now :)");

        console.log("Creating first user!");
        const userA = await addUser(
            "Alex",
            "Johnson",
            "alex.johnson@example.com",
            "StrongPass123!",
            "male",
            "04/12/2000",
            178,
            75,
            "moderate",
            "lose"
        );

        console.log("Created user:", userA.first_name, userA.email);

        console.log("Creating second user!");
        const userB = await addUser(
            "Bianca",
            "Lopez",
            "bianca.lopez@example.com",
            "SecurePass456@",       // password
            "female",
            "08/26/2002",
            165,
            62,
            "light",
            "maintain"
        );

        console.log("Created user:", userB.first_name, userB.email);

        console.log("Creating third user!");
        const userC = await addUser(
            "Chris",
            "Nguyen",
            "chris.nguyen@example.com",
            "Workout789!",
            "male",
            "09/10/1999",
            182,
            82,
            "active",
            "gain"
        );

        console.log("Created user:", userC.first_name, userC.email);

        console.log("Creating fourth user!");
        const userD = await addUser(
            "Diana",
            "Park",
            "diana.park@example.com",
            "HealthyLife321$",
            "female",
            "12/12/1992",
            160,
            55,
            "sedentary",
            "lose"
        );

        console.log("Created user:", userD.first_name, userD.email);

        console.log("Creating fifth user!");
        const userE = await addUser(
            "Ethan",
            "Reed",
            "ethan.reed@example.com",
            "Fitness2024!",
            "male",
            "04/05/2004",
            172,
            68,
            "very_active",
            "maintain"
        );

        console.log("Created user:", userE.first_name, userE.email);

    } catch (e) {
        console.log(e);
    } finally {
        console.log("\nFinished seeding users collection! :)");
    }
}
