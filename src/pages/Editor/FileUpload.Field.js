import React from "react";

import { Box, Button, TextField, Typography } from "@mui/material";

import ImagePreview from "./ImagePreview.";
import { imageUploadAPI } from "../../apis/image.apis";

const FileUploadField = ({
	onUpload,
	label,
	name,
	isMultiple,
	setloading,
	defaulImges,
	onCrossClick,
	...rest
}) => {
	const chnageHandler = (e) => {
		if (!e.target.files.length) {
			console.log("NO FILES");
			return;
		}

		e.persist();

		const fileFormData = new FormData();

		setloading(true);

		if (isMultiple) {
			for (let i = 0; i < e.target.files.length; i++) {
				fileFormData.append(
					"images",
					e.target.files[i],
					e.target.files[i].name
				);
			}
		} else {
			fileFormData.append("images", e.target.files[0], e.target.files[0].name);
		}

		imageUploadAPI(isMultiple ? "array" : "single", "blog_images", fileFormData)
			.then((res) => {
				const {
					data: { data },
				} = res;
				// const value =
				// 	"https://www.feba.co.in//media/BridalImages/270/15918095443150.jpg";
				// onUpload(isMultiple ? [value] : value, e);
				onUpload(data, e);
			})
			.catch((e) => {
				alert("Something went wrong!!");
				console.log(e);
			})
			.finally((e) => setloading(false));
	};

	return (
		<>
			<Box
				m={1}
				pt={3}
				display="flex"
				justifyContent={"center"}
				alignItems={"center"}
				flexDirection="column-reverse">
				<Box borderBottom={"1px solid blue"} borderRadius={"20px"}>
					<Button>
						<label for={label + name}>upload {" " + label}</label>
					</Button>
					<TextField
						type="file"
						id={label + name}
						fullWidth
						name={name}
						style={{ display: "none" }}
						onChange={chnageHandler}
						inputProps={{
							accept: ".jpg, .png, .jpeg, .webp",
							multiple: !!isMultiple,
						}}
						{...rest}
					/>
				</Box>
				<Box display={"flex"} justifyContent={"space-between"}>
					<ImagePreview defaulImges={defaulImges} onCrossClick={onCrossClick} />
				</Box>
			</Box>
		</>
	);
};

export default FileUploadField;
