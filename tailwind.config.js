/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#1E3E62',
				secondary: '#FF6500',
				accent: '#0B192C',
				success: '#5cb85c',
				danger: '#d9534f',
				textColor: '#FFF'
			}
		}
	},
	plugins: []
};
