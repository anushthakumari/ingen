import React, { useState, useEffect, useCallback } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import BackdropLoader from "../../components/Backdrop";

import * as catApis from "../../apis/cat.apis";

const Categories = () => {
	const [categories, setcategories] = useState([]);
	const [isLoading, setisLoading] = useState(false);
	const [catModal, setcatModal] = useState({
		isOpen: false,
		isEdit: false,
	});

	const handleClose = () => {
		setcatModal({
			isOpen: false,
			isEdit: false,
		});
		fetchCats();
	};

	const fetchCats = useCallback(async () => {
		try {
			setisLoading(true);
			const { data } = await catApis.getAllCats();
			setcategories(data.data);
		} catch (error) {
			alert("Something went wrong!");
		} finally {
			setisLoading(false);
		}
	}, []);

	const deleteCat = useCallback(async (id) => {
		try {
			if (window.confirm("Are you sure?")) {
				setisLoading(true);
				await catApis.delegteCat(id);
				alert("Deleted Succesfully!");
				setcategories((prev) => prev.filter((v) => v.id !== id));
			}
		} catch (error) {
			alert("Something went wrong!");
		} finally {
			setisLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchCats();
	}, []);

	return (
		<div>
			<BackdropLoader open={isLoading} />
			<Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
				<TableContainer sx={{ maxWidth: 650 }} component={Paper}>
					<Button
						variant="contained"
						onClick={() => setcatModal({ isEdit: false, isOpen: true })}>
						Add Category
					</Button>
					<Table aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Id </TableCell>
								<TableCell align="right">Title</TableCell>
								<TableCell align="right">Slug</TableCell>
								<TableCell align="right">Edit</TableCell>
								<TableCell align="right">Delete</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{categories.map((row) => (
								<TableRow
									key={row.id}
									sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
									<TableCell component="th" scope="row">
										{row.id}
									</TableCell>
									<TableCell align="right">{row.category}</TableCell>
									<TableCell align="right">{row.slug}</TableCell>
									<TableCell align="right">
										<IconButton
											color="primary"
											onClick={() =>
												setcatModal({
													isEdit: true,
													isOpen: true,
													id: row.id,
													title: row.category,
												})
											}>
											<EditIcon />
										</IconButton>
									</TableCell>
									<TableCell align="right">
										<IconButton
											onClick={() => deleteCat(row.id)}
											color="primary">
											<DeleteIcon />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
			<CatModal
				id={catModal.id}
				title={catModal.title}
				handleClose={handleClose}
				isEdit={catModal.isEdit}
				open={catModal.isOpen}
			/>
		</div>
	);
};

export default Categories;

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

function CatModal({ handleClose, open, isEdit, title, id }) {
	const [isLoading, setisLoading] = useState(false);
	const [text, settext] = useState(title);

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			setisLoading(true);

			const title = e.currentTarget.title.value.trim();

			if (isEdit) {
				await catApis.updateBlog(title, id);
			} else {
				await catApis.createBlog(title);
			}

			alert("Saved successfully!");
			handleClose();
		} catch (error) {
			if (error.response) {
				alert(error.response.data.message);
			} else {
				alert("Something went wrong!!");
			}
		} finally {
			setisLoading(false);
		}
	};

	useEffect(() => {
		settext(title);
	}, [title]);

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description">
			<Box sx={style}>
				<Typography id="modal-modal-title" variant="h6" component="h2">
					Category
				</Typography>
				<form onSubmit={handleSubmit}>
					<Box>
						<TextField
							name="title"
							value={text}
							onChange={(e) => settext(e.target.value)}
							label="Category Name"
							required
							fullWidth
						/>
					</Box>
					<Button
						type="submit"
						disabled={isLoading}
						variant="contained"
						fullWidth>
						{isLoading ? "Loading.." : "Save"}
					</Button>
				</form>
			</Box>
		</Modal>
	);
}
