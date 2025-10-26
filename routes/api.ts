import type { ApiModules } from "../api/types"
import * as exercisesModule from "../api/exercises"
import * as usersModule from "../api/users"

const api: Partial<ApiModules> = {};
let exercises: typeof exercisesModule;
let users: typeof usersModule;

export default function () {
	exercises = exercisesModule;
	users = usersModule;

	api.exercises = {
		getById: exercises.getById,
		getBySlug: exercises.getBySlug,
		getByIdRendered: exercises.getByIdRendered,
		getBySlugRendered: exercises.getBySlugRendered,
		getHistoryById: exercises.getHistoryById,
		getAll: exercises.getAll,
		add: exercises.add,
		update: exercises.update,
		deleteExercise: exercises.deleteExercise,
	};

	api.users = {
		signup: users.signup,
		confirm: users.confirm,
		login: users.login,
	};

	return api;
}
