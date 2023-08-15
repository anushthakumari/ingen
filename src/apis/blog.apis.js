import {
	getRequest,
	putRequest,
	deleteRequest,
	postRequest,
	patchRequest,
} from "../utils/axios.utils";
import { getHeaders, getAuthHeader } from "../utils/api.utils";

export const getSingleRawBlog = (id) =>
	getRequest(`blogs/${id}`, getHeaders(getAuthHeader()));

export const getAllBlogs = () =>
	getRequest(`blogs`, getHeaders(getAuthHeader()));

export const createBlog = (data = {}) =>
	postRequest(`blogs`, data, getHeaders(getAuthHeader()));

export const updateBlogById = (id, data) => {
	return putRequest(`blogs/${id}`, data, getHeaders(getAuthHeader()));
};

export const deleteBlogById = (id) => {
	return deleteRequest(`blogs/${id}`, getHeaders(getAuthHeader()));
};

export const togglePublish = async (id, is_published) => {
	return await patchRequest(
		`blogs/${id}/toggle-publish`,
		{ is_published },
		getHeaders(getAuthHeader())
	);
};
