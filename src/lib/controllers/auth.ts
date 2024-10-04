import { loginUser, logoutUser, registerUser } from '$lib/services/auth';

export const handleUserRegistration = async (username: string, email: string, password: string) => {
	try {
		await registerUser(username, email, password);
		return {
			success: true
		};
	} catch (error) {
		let err = error as Error;
		return {
			success: false,
			message: err.message
		};
	}
};

export const handleUserLogin = async (email: string, password: string) => {
	try {
		const user = await loginUser(email, password);

		return {
			success: true
		};
	} catch (error) {
		let err = error as Error;
		return {
			success: false,
			message: err.message
		};
	}
};

export const handleUserLogout = async () => {
	try {
		await logoutUser();

		return { success: true };
	} catch (error) {
		let err = error as Error;
		return {
			success: false,
			message: err.message
		};
	}
};
