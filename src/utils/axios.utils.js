import axios from "axios";

import configs from "../configs";

const axiosHelper = axios.create({
	baseURL: configs.API_BASE_URL,
});

axiosHelper.defaults.headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

export default axiosHelper;

export function getRequest(URL, config) {
	return axiosHelper.get(`/${URL}`, config);
}

export function postRequest(URL, payload, config) {
	return axiosHelper.post(`/${URL}`, payload, config);
}

export function putRequest(URL, payload, config) {
	return axiosHelper.put(`/${URL}`, payload, config);
}

export function deleteRequest(URL, config) {
	return axiosHelper.delete(`/${URL}`, config);
}

export function patchRequest(URL, payload, config) {
	return axiosHelper.patch(`/${URL}`, payload, config);
}
