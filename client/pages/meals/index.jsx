import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { AuthContext } from '@/lib/userAuthContext';
import { GET_MEALS_BY_USER, GET_ALL_PUBLIC_MEALS } from '@/queries/mealQueries';
import MealCard from '@/components/meals/MealCard';
import AddMealModal from '@/components/meals/AddMealModal';
import EditMealModal from '@/components/meals/EditMealModal';

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

	const handleDelete = () => {

	};

	const refetchMeals = () => {
		if (view === 'user') {
			refetchUserMeals();
		} else {
			refetchPublicMeals();
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
			<div>
				<div className="flex items-center gap-4">
					<h1>{view === 'user' ? 'My Meals' : 'Public Meals'}</h1>
					<div className="flex gap-2">
						<button onClick={() => setView('user')}>My Meals</button>
						<button onClick={() => setView('public')}>Public Meals</button>
					</div>
				</div>

				{view === 'user' && (
					<button onClick={() => setIsAddModalOpen(true)}>Create Meal +</button>
				)}

				<hr />

				{isLoading ? (
					<p>Loading meals...</p>
				) : meals.length === 0 ? (
					<div>
						<p>
							{view === 'user'
							? "No meals yet. Create your first meal to get started."
							: "No public meals available yet."}
						</p>

						{view === 'user' && (
							<button onClick={() => setIsAddModalOpen(true)}>Create Your First Meal</button>
						)}
					</div>
				) : (
				<div>
					{meals.map(meal => (
						<MealCard key={meal._id} meal={meal} onEdit={() => setEditingMeal(meal)} onDelete={handleDelete} showActions={view === 'user' || meal.user_id === currentUser._id} />
					))}
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