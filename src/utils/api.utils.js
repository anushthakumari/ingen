import { getToken } from "./login.utils";

export const getHeaders = (headers = {}) => {
	return { headers: { "Content-Type": "application/json", ...headers } };
};

export const getAuthHeader = () => {
	let token = getToken();

	return {
		Authorization: `Bearer ${token}`,
	};
};
