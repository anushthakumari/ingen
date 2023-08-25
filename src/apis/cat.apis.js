import {
	getRequest,
	postRequest,
	deleteRequest,
	putRequest,
} from "../utils/axios.utils";
import { getHeaders, getAuthHeader } from "../utils/api.utils";

export const getAllCats = () => getRequest(`cats`, getHeaders(getAuthHeader()));

export const delegteCat = (id) =>
	deleteRequest(`cats/${id}`, getHeaders(getAuthHeader()));

export const createBlog = (title = "") =>
	postRequest(`cats`, { title }, getHeaders(getAuthHeader()));

export const updateBlog = (title = "", id = 0) =>
	putRequest(`cats/${id}`, { title }, getHeaders(getAuthHeader()));
