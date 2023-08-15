import { postRequest } from "../utils/axios.utils";
import { getAuthHeader } from "../utils/api.utils";

export const imageUploadAPI = (type, path, imageFormData) => {
	return postRequest(`images`, imageFormData, {
		headers: {
			"Content-Type": "multipart/form-data",
			...getAuthHeader(),
		},
		params: {
			type,
			path,
		},
	});
};
