import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";

import Login from "./pages/Login";
import Blogs from "./pages/Blogs";
import Editor from "./pages/Editor";

import BlogsListContext from "./context/BlogList.context";

export default function App() {
	return (
		<Router>
			<Switch>
				<Route path="/login">
					<Login />
				</Route>
				<BlogsListContext>
					<PrivateRoute exact path="/" Comp={Blogs} />
					<PrivateRoute path="/blog/edit/:id" Comp={Editor} />
				</BlogsListContext>
			</Switch>
		</Router>
	);
}
