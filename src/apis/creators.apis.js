import { getRequest, patchRequest, putRequest } from "../utils/axios.utils";

export const get_profile = async () => {
	return await getRequest("creators/profile");
};

export const update_profile = async (
	data = {
		f_name: "",
		l_name: "",
		cat_id: 0,
		gender: "",
		creator_type: "",
		org_name: "",
	}
) => {
	return await putRequest("creators/profile", data);
};

export const update_profile_img = async (formdata) => {
	return await patchRequest("creators/profile/image", formdata, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};
