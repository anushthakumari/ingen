import React, { useState, useEffect } from "react";

import {
	Typography,
	Box,
	TextField,
	Divider,
	Button,
	Select,
	MenuItem,
	InputLabel,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";

import BubbleButon from "./Bubbles";
import FileUploadField from "./FileUpload.Field";
import Paragraph from "./Paragraph";
import BackdropLoader from "../../components/Backdrop";

import { togglePublish } from "../../apis/blog.apis";
import localtoragekeys from "../../constants/localstorage.constants";

const EditBog = ({
	initialValues,
	validationSchema,
	onSubmitHandler,
	handleHeaderImage,
	headerImage,
	fieldsStructure,
	setfieldsStructure,
	setloading,
}) => {
	const [isLoading, setisLoading] = useState(false);
	const [is_published, setis_published] = useState(initialValues.is_published);
	const role = localStorage.getItem(localtoragekeys.role);

	const handleSwithcChange = async (e) => {
		try {
			setisLoading(true);
			await togglePublish(initialValues.blog_id, !is_published);
			setis_published(!is_published);
		} catch (error) {
			alert("Something went wrong!");
		} finally {
			setisLoading(false);
		}
	};

	useEffect(() => {
		setis_published(initialValues.is_published);
	}, [initialValues.is_published]);

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={onSubmitHandler}
			enableReinitialize>
			<Form>
				<BackdropLoader open={isLoading} />
				{role === "admin" ? (
					<Box
						sx={{
							width: "100%",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}>
						<Typography variant="h4">Edit Blog</Typography>
						<Button variant="contained" onClick={handleSwithcChange}>
							{is_published ? "unpublish" : "publish"}
						</Button>
					</Box>
				) : null}

				{/* SEO header image */}

				<FileUploadField
					label="SEO Header Image"
					name="headerImage"
					setloading={setloading}
					defaulImges={[headerImage]}
					onUpload={handleHeaderImage}
					onCrossClick={handleHeaderImage.bind(
						this,
						"media/BridalImages/default.jpg"
					)}
				/>

				{/* Title */}
				{initialValues.category_id ? (
					<Field as="select" name="category_id">
						{(props) => {
							let { field } = props;
							return (
								<Box m={1} pt={3}>
									<InputLabel id="category">Category</InputLabel>
									<Select
										labelId="category"
										id="category-select"
										label="Category"
										required
										defaultValue={initialValues.category_id}
										sx={{ minWidth: "300px" }}
										{...field}>
										{initialValues.cat_rows?.map((v, i) => (
											<MenuItem key={i} value={v.id}>
												{v.category}
											</MenuItem>
										))}
									</Select>
								</Box>
							);
						}}
					</Field>
				) : null}

				{/* Title */}
				<Field type="text" name="title">
					{(props) => {
						let { field } = props;
						return (
							<Box m={1} pt={3}>
								<TextField
									variant="outlined"
									label={"Title"}
									fullWidth
									required
									{...field}
								/>
							</Box>
						);
					}}
				</Field>
				<ErrorMessage name="title">
					{(errMsg) => (
						<Typography color="primary" variant="body2">
							{errMsg}
						</Typography>
					)}
				</ErrorMessage>

				{/* Description */}

				<Field type="text" name="desc">
					{(props) => {
						let { field } = props;
						return (
							<Box m={1} pt={3}>
								<TextField
									variant="outlined"
									label={"Description"}
									fullWidth
									required
									multiline
									{...field}
								/>
							</Box>
						);
					}}
				</Field>
				<ErrorMessage name="desc">
					{(errMsg) => (
						<Typography color="primary" variant="body2">
							{errMsg}
						</Typography>
					)}
				</ErrorMessage>
				{/* HEADING H1 TEXT */}
				<Field type="number" name="h1">
					{(props) => {
						let { field } = props;
						return (
							<Box m={1} pt={3}>
								<TextField
									variant="outlined"
									label={"Heading H1 Text"}
									fullWidth
									{...field}
								/>
							</Box>
						);
					}}
				</Field>
				<ErrorMessage name="h1">
					{(errMsg) => (
						<Typography color="primary" variant="body2">
							{errMsg}
						</Typography>
					)}
				</ErrorMessage>
				{/* HEADING H2 TEXT */}
				<Field type="number" name="h2">
					{(props) => {
						let { field } = props;
						return (
							<Box m={1} pt={3}>
								<TextField
									variant="outlined"
									label={"Heading H2 Text"}
									fullWidth
									{...field}
								/>
							</Box>
						);
					}}
				</Field>
				<ErrorMessage name="h2">
					{(errMsg) => (
						<Typography color="primary" variant="body2">
							{errMsg}
						</Typography>
					)}
				</ErrorMessage>

				<Divider style={{ margin: "20px 0" }} />

				{/*  Paragraphs */}
				<Typography variant="h5">PARAGRAPHS</Typography>
				<Paragraph
					fieldsStructure={fieldsStructure}
					setfieldsStructure={setfieldsStructure}
					setloading={setloading}
					initialValues={initialValues}
				/>

				<Divider style={{ margin: "20px 0" }} />

				{/* Bottom bar */}
				<Typography variant="h5">FIXED BOTTOM BAR SETTINGS</Typography>

				<div
					style={{
						padding: "8px",
						margin: "18px",
						border: "2px solid red",
						borderRadius: "20px",
					}}>
					{/* Bottom bar h3 */}
					<Field type="number" name="bottom_bar_h3">
						{(props) => {
							let { field } = props;
							return (
								<Box m={1} pt={3}>
									<TextField
										variant="outlined"
										label={"Bottom Bar line 1 Text"}
										fullWidth
										{...field}
									/>
								</Box>
							);
						}}
					</Field>
					<ErrorMessage name="bottom_bar_h3">
						{(errMsg) => (
							<Typography color="primary" variant="body2">
								{errMsg}
							</Typography>
						)}
					</ErrorMessage>
					{/* Bottom bar h5 */}
					<Field type="number" name="bottom_bar_h5">
						{(props) => {
							let { field } = props;
							return (
								<Box m={1} pt={3}>
									<TextField
										variant="outlined"
										label={"Bottom Bar line 2 Text"}
										fullWidth
										{...field}
									/>
								</Box>
							);
						}}
					</Field>
					<ErrorMessage name="bottom_bar_h5">
						{(errMsg) => (
							<Typography color="primary" variant="body2">
								{errMsg}
							</Typography>
						)}
					</ErrorMessage>
					{/* button 1 text */}
					<Field type="number" name="btn_1_text">
						{(props) => {
							let { field } = props;
							return (
								<Box m={1} pt={3}>
									<TextField
										variant="outlined"
										label={"Button 1 text"}
										fullWidth
										{...field}
									/>
								</Box>
							);
						}}
					</Field>
					<ErrorMessage name="btn_1_text">
						{(errMsg) => (
							<Typography color="primary" variant="body2">
								{errMsg}
							</Typography>
						)}
					</ErrorMessage>
					{/* button 1 url */}
					<Field type="number" name="btn_1_url">
						{(props) => {
							let { field } = props;
							return (
								<Box m={1} pt={3}>
									<TextField
										variant="outlined"
										label={"Button 1 url"}
										fullWidth
										{...field}
									/>
								</Box>
							);
						}}
					</Field>
					<ErrorMessage name="btn_1_url">
						{(errMsg) => (
							<Typography color="primary" variant="body2">
								{errMsg}
							</Typography>
						)}
					</ErrorMessage>
					{/* button 2 text */}
					<Field type="number" name="btn_2_text">
						{(props) => {
							let { field } = props;
							return (
								<Box m={1} pt={3}>
									<TextField
										variant="outlined"
										label={"Button 2 text"}
										fullWidth
										{...field}
									/>
								</Box>
							);
						}}
					</Field>
					<ErrorMessage name="btn_2_text">
						{(errMsg) => (
							<Typography color="primary" variant="body2">
								{errMsg}
							</Typography>
						)}
					</ErrorMessage>
					{/* button 2 url */}
					<Field type="number" name="btn_2_url">
						{(props) => {
							let { field } = props;
							return (
								<Box m={1} pt={3}>
									<TextField
										variant="outlined"
										label={"Button 2 url"}
										fullWidth
										{...field}
									/>
								</Box>
							);
						}}
					</Field>
					<ErrorMessage name="btn_2_url">
						{(errMsg) => (
							<Typography color="primary" variant="body2">
								{errMsg}
							</Typography>
						)}
					</ErrorMessage>
				</div>

				{/* Save Button */}
				<BubbleButon
					variant="contained"
					text={"Save Blog!"}
					type="submit"
					fullWidth
				/>
			</Form>
		</Formik>
	);
};

export default EditBog;
