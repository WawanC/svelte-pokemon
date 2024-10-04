import { writable } from 'svelte/store';

type Toast = {
	id: string;
	title: string;
	type: 'success' | 'failed';
};

type ToastStore = {
	toasts: Toast[];
};

export const toastStore = writable<ToastStore>({
	toasts: []
});

export const showToast = (newToast: Toast) => {
	setTimeout(() => {
		closeToast(newToast.id);
	}, 1000);

	toastStore.update((prev) => {
		const newToasts = [...prev.toasts];
		newToasts.push(newToast);
		return {
			...prev,
			toasts: newToasts
		};
	});
};

export const closeToast = (toastId: string) => {
	toastStore.update((prev) => {
		const newToasts = [...prev.toasts].filter((t) => t.id != toastId);
		return {
			...prev,
			toasts: newToasts
		};
	});
};

export const getToastClass = (toast: Toast) => {
	switch (toast.type) {
		case 'success':
			return 'bg-success';
		case 'failed':
			return 'bg-danger';
		default:
			return 'bg-neutral-200';
	}
};
