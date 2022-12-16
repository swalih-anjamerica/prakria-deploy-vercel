import axios from 'axios';

const API = axios.create({
	baseURL: '/api',
});

API.interceptors.request.use((config) => {
	const token = `Bearer ${localStorage.getItem('token')}`;

	config.headers.Authorization = token;
	return config;
});

export default API;
