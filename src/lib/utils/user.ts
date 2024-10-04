import { NEW_POKEBALL_TIMER } from '$lib/constants/user';

export const getPokeballTimeLeft = (lastTimeISO: string) => {
	const now = new Date();
	const lastTime = new Date(lastTimeISO);

	return NEW_POKEBALL_TIMER - (now.getTime() - lastTime.getTime());
};
