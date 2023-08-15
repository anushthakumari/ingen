import { postRequest } from "../utils/axios.utils";

export const login = async ({ email, password }) => {
	return await postRequest("users/login", { email, password });
};
