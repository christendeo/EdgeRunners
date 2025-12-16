import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { AuthContext } from '@/lib/userAuthContext';
import { GET_MEALS_BY_USER, GET_ALL_PUBLIC_MEALS, DELETE_MEAL } from '@/queries/mealQueries';
import MealCard from '@/components/meals/MealCard';
import AddMealModal from '@/components/meals/AddMealModal';
import EditMealModal from '@/components/meals/EditMealModal';
import localFont from 'next/font/local';

const NimbusFont = localFont({
	src: '../../public/NimbuDemo-Regular.otf',
	variable: '--font-nimbus'
});

export default function Meals() {
	const router = useRouter();
	const [view, setView] = useState('user'); // Either 'user' or 'public'
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [editingMeal, setEditingMeal] = useState(null);
	const userAuth = useContext(AuthContext);

	useEffect(() => {
		if (userAuth.authLoaded && !userAuth.user) {
			router.push('/login');
		}
	}, [userAuth.authLoaded, userAuth.user, router]);

	const currentUser = userAuth.user;

	const { data: userMealsData, loading: userMealsLoading, refetch: refetchUserMeals } = useQuery(GET_MEALS_BY_USER, {
		variables: { userId: currentUser?._id },
		skip: !currentUser?._id
	});

	const { data: publicMealsData, loading: publicMealsLoading, refetch: refetchPublicMeals } = useQuery(GET_ALL_PUBLIC_MEALS, {
		skip: view !== 'public'
	});

	const [deleteMeal] = useMutation(DELETE_MEAL);

	const refetchMeals = () => {
		refetchUserMeals();
		refetchPublicMeals();
	};

	const handleDelete = async (meal) => {
		if (!confirm(`Are you sure you want to delete ${meal.name}?`)) {
			return;
		}

		try {
			await deleteMeal({ variables: { mealId: meal._id } });
			refetchMeals();
		} catch (e) {
			alert("Failed to delete meal: " + e.message);
		}
	};

	if (!userAuth.authLoaded) {
		return <p>Loading...</p>;
	}

	if (!currentUser) {
		return <p>Redirecting to login...</p>;
	}

	const meals = view === 'user' ? userMealsData?.getMealsByUser || [] : publicMealsData?.getAllPublicMeals || [];
	const isLoading = view === 'user' ? userMealsLoading : publicMealsLoading;

	return (
		<div>
			<div className="mx-4 mt-8">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-4 -mb-3">
						<h1 className={`text-4xl ${NimbusFont.className}`}>
							{view === 'user' ? 'My Meals' : 'Public Meals'}
						</h1>

						<div className="flex gap-2">
							<button
								onClick={() => setView('user')}
								className={`px-3 py-1.5 rounded-full text-sm ${view === 'user' ? 'bg-gradient-to-b from-[#73AF6F] to-[#007E6E] text-white' : 'border hover:opacity-80'}`}>
								My Meals
							</button>
							<button
								onClick={() => setView('public')}
								className={`px-3 py-1.5 rounded-full text-sm ${view === 'public' ? 'bg-gradient-to-b from-[#73AF6F] to-[#007E6E] text-white' : 'border hover:opacity-80'}`}>
								Public Meals
							</button>
						</div>
					</div>

					{view === 'user' && (
						<button
							onClick={() => setIsAddModalOpen(true)}
							className="px-4 py-2 bg-gradient-to-b from-[#73AF6F] to-[#007E6E] text-white rounded-lg hover:opacity-90 transition-all">
							Create Meal +
						</button>
					)}
				</div>

				<hr className="mb-4" />

				{isLoading ? (
					<p>Loading meals...</p>
				) : meals.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-gray-600 mb-3">
							{view === 'user'
							? "No meals yet. Create your first meal to get started."
							: "No public meals available yet."}
						</p>

						{view === 'user' && (
							<button
								onClick={() => setIsAddModalOpen(true)}
								className="px-4 py-2 bg-gradient-to-b from-[#73AF6F] to-[#007E6E] text-white rounded-lg hover:opacity-90">
								Create Your First Meal
							</button>
						)}
					</div>
				) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{meals.map(meal => {
						console.log(`Meal ${meal.name}, user_id ${meal.user_id}, currentUser._id ${currentUser._id}`);
						return <MealCard key={meal._id} meal={meal} onEdit={() => setEditingMeal(meal)} onDelete={handleDelete} showActions={meal.user_id === currentUser._id.toString()} />;	
					})}
				</div>
			)}
			</div>

			{isAddModalOpen && (
				<AddMealModal userId={currentUser._id} onClose={() => setIsAddModalOpen(false)} refetch={refetchMeals} />
			)}

			{editingMeal && (
				<EditMealModal meal={editingMeal} onClose={() => setEditingMeal(null)} refetch={refetchMeals} />
			)}
		</div>
	);
}