import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Box, TextField, Modal } from "@mui/material";

import BackdropLoader from "../../components/Backdrop";
import { createBlog } from "../../apis/blog.apis";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

const CreateBlog = ({ open, handleClose }) => {
	const [title, settitle] = useState("");
	const [desc, setDesc] = useState("");
	const [loading, setloading] = useState("");

	const browserHistory = useHistory();

	const handleSubmit = (e) => {
		e.preventDefault();
		if (title.trim().length < 8) {
			alert("Title must be atleast 8 characters long");
			return;
		}

		if (desc.trim().length < 10) {
			alert("description must be atleast 10 characters long");
			return;
		}

		(async () => {
			try {
				setloading(true);
				let {
					data: { blog_id },
				} = await createBlog({ title, desc });
				browserHistory.push(`/blog/edit/${blog_id}`);
			} catch (error) {
				alert("something went wrong!");
			} finally {
				setloading(false);
			}
		})();
	};

	const handleChange = (keyName, e) => {
		const v = e.target.value;
		if (keyName === "title") {
			settitle(v);
		}
		if (keyName === "desc") {
			setDesc(v);
		}
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description">
			<Box sx={style}>
				<BackdropLoader open={loading} />
				<form onSubmit={handleSubmit}>
					<Box m={1} pt={3}>
						<TextField
							variant="outlined"
							label={"Title"}
							onChange={handleChange.bind(this, "title")}
							fullWidth
							required
						/>
					</Box>
					<Box m={1} pt={3}>
						<TextField
							variant="outlined"
							label="Description"
							fullWidth
							required
							onChange={handleChange.bind(this, "desc")}
						/>
					</Box>
					<Box m={1} pt={3}>
						<Button type="submit" variant="contained" fullWidth>
							Create Blog
						</Button>
					</Box>
				</form>
			</Box>
		</Modal>
	);
};

export default CreateBlog;
