import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Blogs from "./pages/Blogs";
import Editor from "./pages/Editor";
import Categories from "./pages/Categories";

import BlogsListContext from "./context/BlogList.context";

export default function App() {
	return (
		<Router>
			<Sidebar />
			<Switch>
				<Route path={"/login"}>
					<Login />
				</Route>
				<BlogsListContext>
					<PrivateRoute exact path={"/"} Comp={Blogs} />
					<PrivateRoute exact path={"/categories"} Comp={Categories} />
					<PrivateRoute path={"/blog/edit/:id"} Comp={Editor} />
				</BlogsListContext>
			</Switch>
		</Router>
	);
}
