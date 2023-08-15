import React, { useState, useEffect } from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import BackdropLoader from "../../components/Backdrop";
import CreateBlog from "./CreateBlog";

import configs from "../../configs";
import { deleteBlogById } from "../../apis/blog.apis";
import { useBlogList } from "../../context/BlogList.context";
import { getRole, logout } from "../../utils/login.utils";

const BlogList = () => {
	const { setloading, loading, rows, fetchBlogs } = useBlogList();
	const [openCreateDialog, setopenCreateDialog] = useState(false);

	const browserHistory = useHistory();
	const role = getRole();

	const is_admin = role === "admin";

	const handleDelete = (blog_id) => {
		if (
			window.confirm("Are you sure you want to delete blog id " + blog_id + "?")
		) {
			(async () => {
				try {
					setloading(true);
					await deleteBlogById(blog_id);
					fetchBlogs();
				} catch (error) {
					alert("something went wrong!");
				} finally {
					setloading(false);
				}
			})();
		}
	};

	const handleLogOut = () => {
		logout();
		browserHistory.push("/login");
	};

	useEffect(() => {
		fetchBlogs();
	}, []);

	return (
		<>
			<BackdropLoader open={loading} />

			<Box
				sx={{
					width: "100%",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}>
				<Button
					variant="contained"
					color="primary"
					onClick={setopenCreateDialog.bind(this, true)}>
					Create Blog
				</Button>
				<Button variant="contained" onClick={handleLogOut}>
					Log Out
				</Button>
			</Box>
			{!rows.length ? (
				<Typography variant="h6">No Data Found!</Typography>
			) : (
				<>
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Blog id</TableCell>
									<TableCell align="left">Title</TableCell>
									<TableCell align="left">Category</TableCell>
									<TableCell align="right">Header SEO Image</TableCell>
									<TableCell align="right">Blog Created At</TableCell>
									<TableCell align="right">URL</TableCell>
									<TableCell align="right">Edit</TableCell>
									{is_admin ? (
										<TableCell align="right">Delete</TableCell>
									) : null}
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.map((row) => (
									<TableRow key={row.blog_id}>
										<TableCell component="th" scope="row">
											{row.blog_id}
										</TableCell>
										<TableCell align="left">{row.title}</TableCell>
										<TableCell align="left">{row.category}</TableCell>
										<TableCell align="right">
											<img
												height="30"
												width="30"
												src={row.header_image}
												alt="blog header"
											/>
										</TableCell>
										<TableCell align="right">
											{moment(row.blog_created_time).format(
												"dddd, MMMM Do YYYY, h:mm:ss a"
											)}
										</TableCell>

										<TableCell align="right">
											<a
												href={`${configs.BASE_URL}/pages/articles/${row.cat_slug}/${row.slug}/preview`}
												target="_blank"
												rel="noopener noreferrer">
												preview
											</a>
										</TableCell>
										<TableCell align="right">
											<IconButton
												onClick={() =>
													browserHistory.push(`/blog/edit/${row.blog_id}`)
												}>
												<EditIcon color="primary" />
											</IconButton>
										</TableCell>
										{is_admin ? (
											<TableCell align="right">
												<IconButton
													onClick={handleDelete.bind(this, row.blog_id)}>
													<DeleteIcon color="primary" />
												</IconButton>
											</TableCell>
										) : null}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</>
			)}
			<CreateBlog
				open={openCreateDialog}
				handleClose={setopenCreateDialog.bind(this, false)}
			/>
		</>
	);
};

export default BlogList;
