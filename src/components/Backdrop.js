import React from "react";
import MuiBackdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material";

export default function Backdrop({ open }) {
	const theme = useTheme();

	return (
		<div>
			<MuiBackdrop
				style={{
					zIndex: theme.zIndex.drawer + 1,
					color: "#fff",
				}}
				open={open}>
				<CircularProgress color="inherit" />
			</MuiBackdrop>
		</div>
	);
}
