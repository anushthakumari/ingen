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
	Modal,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";

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
	setinitialValues,
}) => {
	const [isLoading, setisLoading] = useState(false);
	const [extLinkModal, setextLinkModal] = useState({
		isOpen: false,
		index: -1,
		selectedText: "",
		key: "",
	});
	const [is_published, setis_published] = useState(initialValues.is_published);
	// const role = localStorage.getItem(localtoragekeys.role);

	const handleSwithcChange = async (e) => {
		try {
			setisLoading(true);
			await togglePublish(initialValues.blog_id, !is_published);
			setis_published(!is_published);
			if (is_published === false) {
				alert("blog is published!");
			} else {
				alert("blog is unpublished!");
			}
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

	const handleRightClick = (key, e) => {
		e.preventDefault();

		const selectedText = getSelectedText().toString();

		if (!selectedText) {
			return;
		}

		// console.log(selectedText);
		setextLinkModal({ isOpen: true, index: -1, selectedText, key });
	};

	let handleExtSubmit = (e) => {
		e.stopPropagation();
		e.preventDefault();
		const caption = extLinkModal.selectedText;
		const link = e.currentTarget.link.value.trim();

		const anchor_text = "@" + caption;
		const anchor_url = link;
		const anchor_tag = `<a href="${anchor_url}" target="_blank" >${anchor_text}</a>`;

		const i = extLinkModal.index;
		const key = extLinkModal.key;

		if (i > -1) {
			setfieldsStructure((prev) => {
				let newFormValues = [...prev];
				newFormValues[i][key] = newFormValues[i][key].replace(
					caption,
					anchor_tag
				); //+ " " + anchor_tag;
				return newFormValues;
			});
		} else {
			setinitialValues((prev) => {
				const vals = { ...prev };
				vals[key] = vals[key].replace(caption, anchor_tag);
				return vals;
			});
		}

		setextLinkModal({ isOpen: false, index: 0 });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmitHandler({
			h1: initialValues.h1,
			h2: initialValues.h2,
			title: initialValues.title,
			desc: initialValues.desc,
			category_id: initialValues.category_id,
		});
	};

	const handleChange = (e) => {
		const key = e.target.name;
		const value = e.target.value;
		setinitialValues((prev) => {
			const vals = { ...prev };
			vals[key] = value;
			return vals;
		});
	};

	useEffect(() => {
		setis_published(initialValues.is_published);
	}, [initialValues.is_published]);

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<BackdropLoader open={isLoading} />
				{/* {role === "admin" ? ( */}
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
				{/* ) : null} */}

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

				{/* category */}
				{initialValues.category_id ? (
					<Box m={1} pt={3}>
						<InputLabel id="category">Category</InputLabel>
						<Select
							labelId="category"
							id="category-select"
							label="Category"
							required
							name="category_id"
							defaultValue={initialValues.category_id}
							onChange={handleChange}
							value={initialValues.category_id}
							sx={{ minWidth: "300px" }}>
							{initialValues.cat_rows?.map((v, i) => (
								<MenuItem key={i} value={v.id}>
									{v.category}
								</MenuItem>
							))}
						</Select>
					</Box>
				) : null}

				{/* Title */}

				<Box m={1} pt={3}>
					<TextField
						variant="outlined"
						label={"Title"}
						type="text"
						name="title"
						value={initialValues.title}
						onChange={handleChange}
						fullWidth
						required
					/>
				</Box>

				{/* Description */}

				<Box m={1} pt={3}>
					<TextField
						variant="outlined"
						label={"Description"}
						type="text"
						name="desc"
						value={initialValues.desc}
						onChange={handleChange}
						fullWidth
						required
						multiline
					/>
				</Box>
				{/* HEADING H1 TEXT */}

				<Box m={1} pt={3}>
					<TextField
						variant="outlined"
						label={"Heading H1 Text"}
						fullWidth
						name="h1"
						value={initialValues.h1}
						onChange={handleChange}
						onContextMenu={handleRightClick.bind(this, "h1")}
					/>
				</Box>
				{/* HEADING H2 TEXT */}
				<Box m={1} pt={3}>
					<TextField
						variant="outlined"
						label={"Heading H2 Text"}
						fullWidth
						name="h2"
						value={initialValues.h2}
						onChange={handleChange}
						onContextMenu={handleRightClick.bind(this, "h2")}
					/>
				</Box>

				<Divider style={{ margin: "20px 0" }} />

				{/*  Paragraphs */}
				<Typography variant="h5">PARAGRAPHS</Typography>
				<Paragraph
					fieldsStructure={fieldsStructure}
					setfieldsStructure={setfieldsStructure}
					setloading={setloading}
					initialValues={initialValues}
					setextLinkModal={setextLinkModal}
				/>

				<Divider style={{ margin: "20px 0" }} />

				{/* Bottom bar */}
				{/* <Typography variant="h5">FIXED BOTTOM BAR SETTINGS</Typography> */}

				{/* <div
					style={{
						padding: "8px",
						margin: "18px",
						border: "2px solid red",
						borderRadius: "20px",
					}}> */}
				{/* Bottom bar h3 */}
				{/* <Field type="number" name="bottom_bar_h3">
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
					</ErrorMessage> */}
				{/* Bottom bar h5 */}
				{/* <Field type="number" name="bottom_bar_h5">
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
					</ErrorMessage> */}
				{/* button 1 text */}
				{/* <Field type="number" name="btn_1_text">
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
					</Field> */}
				{/* <ErrorMessage name="btn_1_text">
						{(errMsg) => (
							<Typography color="primary" variant="body2">
								{errMsg}
							</Typography>
						)}
					</ErrorMessage> */}
				{/* button 1 url */}
				{/* <Field type="number" name="btn_1_url">
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
					</Field> */}
				{/* <ErrorMessage name="btn_1_url">
						{(errMsg) => (
							<Typography color="primary" variant="body2">
								{errMsg}
							</Typography>
						)}
					</ErrorMessage> */}
				{/* button 2 text */}
				{/* <Field type="number" name="btn_2_text">
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
					</Field> */}
				{/* <ErrorMessage name="btn_2_text">
						{(errMsg) => (
							<Typography color="primary" variant="body2">
								{errMsg}
							</Typography>
						)}
					</ErrorMessage> */}
				{/* button 2 url */}
				{/* <Field type="number" name="btn_2_url">
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
					</Field> */}
				{/* <ErrorMessage name="btn_2_url">
						{(errMsg) => (
							<Typography color="primary" variant="body2">
								{errMsg}
							</Typography>
						)}
					</ErrorMessage> */}
				{/* </div> */}

				{/* Save Button */}
				<BubbleButon
					variant="contained"
					text={"Save Blog!"}
					type="submit"
					fullWidth
				/>
			</form>

			<Modal
				open={extLinkModal.isOpen}
				onClose={() => setextLinkModal({ isOpen: false, index: 0 })}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description">
				<Box component={"form"} onSubmit={handleExtSubmit} sx={style}>
					<Typography> Add External Link</Typography>
					<Box m={1} pt={3}>
						<TextField
							name="link"
							type="url"
							label="Complete Url"
							required
							fullWidth
						/>
					</Box>
					<Button fullWidth type="submit">
						Submit
					</Button>
				</Box>
			</Modal>
		</div>
	);
};

export default EditBog;

function getSelectedText() {
	let txt;
	if (window.getSelection) {
		txt = window.getSelection();
	} else if (window.document.getSelection) {
		txt = window.document.getSelection();
	} else if (window.document.selection) {
		txt = window.document.selection.createRange().text;
	}
	return txt;
}

var style = {
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
