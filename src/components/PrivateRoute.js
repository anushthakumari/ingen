import React from "react";
import { Redirect, Route } from "react-router-dom";

import { getToken } from "../utils/login.utils";

function PrivateRoute({ Comp, ...rest }) {
	const is_logged_in = getToken();

	return (
		<Route
			{...rest}
			render={(pr) => {
				return is_logged_in ? (
					<Comp {...pr} />
				) : (
					<Redirect
						to={{
							pathname: "/login",
						}}
					/>
				);
			}}
		/>
	);
}

export default PrivateRoute;
