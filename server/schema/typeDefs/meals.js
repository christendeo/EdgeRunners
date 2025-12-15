export const mealTypeDefs = `#graphql
	type Meal {
		_id: ID!
		name: String!
		user_id: ID!
		foods: [MealFood!]!
		total_calories: Float!
		total_protein: Float!
		total_carbs: Float!
		total_fat: Float!
		total_fiber: Float!
		is_public: Boolean!
		created_at: String!
	}

	type MealFood {
		food_id: ID!
		quantity: Float!
		serving_unit: String!
	}
	
	extend type Query {
		getAllPublicMeals: [Meal!]!
		getMealById(mealId: ID!): Meal
		getMealsByUser(userId: ID!): [Meal!]!
	}

	extend type Mutation {
		addMeal(
			userId: ID!
			name: String!
			foods: [MealFoodInput!]!
			is_public: Boolean
		): Meal

		updateMeal(
			mealId: ID!
			name: String
			foods: [MealFoodInput!]
			is_public: Boolean
		): Meal

		deleteMeal(mealId: ID!): Meal
	}

	input MealFoodInput {
		food_id: ID!
		quantity: Float!
		serving_unit: String
	}
`;

export default mealTypeDefs;