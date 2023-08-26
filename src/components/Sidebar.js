import React, { useState } from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";

const routes = [
	{
		title: "Blogs",
		path: "/creator",
	},
	{
		title: "Categories",
		path: "/creator/categories",
	},
];

export default function Sidebar() {
	const [isOpen, setisOpen] = useState(false);

	const toggleDrawer = (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setisOpen((prev) => !prev);
	};

	const list = () => (
		<Box role="presentation" onClick={toggleDrawer} onKeyDown={toggleDrawer}>
			<List>
				{routes.map((v, index) => (
					<ListItem key={v.path} disablePadding>
						<ListItemButton LinkComponent={Link} to={v.path}>
							<ListItemText primary={v.title} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);

	return (
		<div>
			<React.Fragment>
				<IconButton onClick={toggleDrawer} color="primary">
					<MenuIcon />
				</IconButton>
				<Drawer anchor={"left"} open={isOpen} onClose={toggleDrawer}>
					{list()}
				</Drawer>
			</React.Fragment>
		</div>
	);
}
