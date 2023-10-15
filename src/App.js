import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Blogs from "./pages/Blogs";
import Editor from "./pages/Editor";
import Categories from "./pages/Categories";
import Profile from "./pages/Profile";
import TextSum from "./pages/TextSum";

import BlogsListContext from "./context/BlogList.context";

export default function App() {
	return (
		<Router>
			<Sidebar />
			<Switch>
				{/* <Route path={"/creator/login"}>
					<Login />
				</Route> */}
				<BlogsListContext>
					<Route exact path={"/creator"} component={Blogs} />
					<Route exact path={"/creator/categories"} component={Categories} />
					<Route exact path={"/creator/profile"} component={Profile} />
					<Route exact path={"/creator/textsum"} component={TextSum} />
					<Route path={"/creator/blog/edit/:id"} component={Editor} />
				</BlogsListContext>
			</Switch>
		</Router>
	);
}
