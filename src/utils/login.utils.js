import localtoragekeys from "../constants/localstorage.constants";

export function getToken() {
	const localToken = localStorage.getItem(localtoragekeys.token);

	if (!localToken) {
		return false;
	}

	return localToken;
}

export function getRole() {
	const visibleCookie = document.cookie
		.split(";")
		.find(
			(cookie) => cookie.startsWith(" role=") || cookie.startsWith("role=")
		);

	if (visibleCookie) {
		const cookieValue = visibleCookie.split("=")[1];
		return cookieValue;
	} else {
		return "editor";
	}
}

export function logout() {
	localStorage.removeItem(localtoragekeys.role);
	localStorage.removeItem(localtoragekeys.token);
}
