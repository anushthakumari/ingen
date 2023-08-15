import React from "react";
import { Button } from "@mui/material";

const Bubbles = ({ text, onClick, ...rest }) => {
	return (
		<Button
			style={{
				borderRadius: "50px",
				margin: "4px",
				padding: "8px",
			}}
			color="primary"
			onClick={onClick}
			{...rest}>
			{text}
		</Button>
	);
};

export default Bubbles;
