import { postRequest } from "../utils/axios.utils";

export const login = async ({ email, password }) => {
	return await postRequest("users/login", { email, password });
};

export const register = async ({ email, pass, name }) => {
	return await postRequest("users/register", { email, pass, name });
};
