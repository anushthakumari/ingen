import React, { useState, useEffect } from "react";
import {
	Box,
	TextField,
	Button,
	List,
	ListItem,
	ListItemText,
	ListItemButton,
} from "@mui/material";

import FileUploadField from "./FileUpload.Field";
import { useBlogList } from "../../context/BlogList.context";
import configs from "../../configs";

const Paragraph = ({
	fieldsStructure,
	setfieldsStructure,
	setloading,
	initialValues,
}) => {
	const { rows } = useBlogList();

	const [search_result, setsearch_result] = useState([]);

	const [tagState, settagState] = useState({
		is_search_start: false,
		text_data: "",
		fields_structure_index: -1,
	});

	const handleADDclick = () => {
		setfieldsStructure((prev) => [
			...prev,
			{
				para_title: "",
				para: "",
				single_image: "",
				slide_image: [],
				carousel: [],
			},
		]);
	};

	let handleKeyDown = (e, i) => {
		if (!allowed_keys_for_tags.includes(e.key)) {
			return;
		}

		if (tagState.is_search_start) {
			if (e.key === "Backspace") {
				if (tagState.text_data.length === 0) {
					settagState({ is_search_start: false, text_data: "" });
				} else {
					settagState((prev) => ({
						...prev,
						text_data: prev.text_data.slice(0, prev.text_data.length - 1),
					}));
				}

				return;
			}

			settagState((prev) => ({ ...prev, text_data: prev.text_data + e.key }));
			return;
		}

		if (e.key === "@") {
			settagState((prev) => ({
				...prev,
				is_search_start: true,
				fields_structure_index: i,
			}));
		}

		if (e.key === "Enter") {
			let newFormValues = [...fieldsStructure];
			newFormValues[i]["para"] = newFormValues[i]["para"] + "<br />";
			setfieldsStructure(newFormValues);
		}
	};

	let handleChange = (i, e) => {
		if (tagState.is_search_start && tagState.fields_structure_index === i) {
			return;
		}
		let newFormValues = [...fieldsStructure];
		newFormValues[i][e.target.name] = e.target.value;
		setfieldsStructure(newFormValues);
	};

	let handleTagItemClick = (data = {}) => {
		let newFormValues = [...fieldsStructure];

		const anchor_text = "@" + data.title;
		const anchor_url =
			configs.BASE_URL + "/pages/articles/wedding/" + data.slug;
		const anchor_tag = `<a href="${anchor_url}" target="_blank" >${anchor_text}</a>`;

		newFormValues[data.index]["para"] =
			newFormValues[data.index]["para"] + anchor_tag;
		setfieldsStructure(newFormValues);
		settagState({
			fields_structure_index: -1,
			text_data: "",
			is_search_start: false,
		});
	};

	const handleUpload = (i, v, e) => {
		let newFormValues = [...fieldsStructure];
		newFormValues[i][e.target.name] = v;
		setfieldsStructure(newFormValues);
	};

	const handleImageCrossClick = (inputName, arrIndex, imgIndex, imgSrc) => {
		if (inputName === "single_image") {
			let newfieldsStructure = fieldsStructure.map((e, i) => {
				if (i === arrIndex) {
					return { ...e, single_image: "" };
				}
				return e;
			});

			setfieldsStructure(newfieldsStructure);
			return;
		}

		let newfieldsStructure = fieldsStructure.map((e, i) => {
			if (i === arrIndex) {
				let d = { ...e };
				d[inputName] = d[inputName].filter((e, i) => i !== imgIndex);
				return d;
			}
			return e;
		});

		setfieldsStructure(newfieldsStructure);

		// console.log({ inputName, arrIndex, imgIndex });
	};

	const closeTags = () => {
		settagState({ is_search_start: false, text_data: "" });
	};

	// const handleCrossClick = (structureIndex) => {
	// 	setfieldsStructure((curr) => curr.filter((e, i) => i !== structureIndex));
	// };

	useEffect(() => {
		if (tagState.text_data) {
			setsearch_result(
				rows.filter((v) =>
					v.title?.toLowerCase().includes(tagState.text_data.toLowerCase())
				)
			);
		}
	}, [tagState.text_data, rows]);

	return (
		<div style={{ margin: "12px" }}>
			{fieldsStructure.map((d, index) => (
				<div
					key={index}
					style={{
						padding: "8px",
						margin: "18px",
						border: "2px solid red",
						borderRadius: "20px",
						position: "relative",
					}}>
					{/* <IconButton
						style={{ position: "absolute", top: 0, right: 0 }}
						onClick={handleCrossClick.bind(this, index)}>
						<CancelIcon />
					</IconButton> */}
					<FileUploadField
						label="Single Image"
						name={"single_image"}
						defaulImges={[d.single_image]}
						setloading={setloading}
						onCrossClick={handleImageCrossClick.bind(
							this,
							"single_image",
							index
						)}
						onUpload={handleUpload.bind(this, index)}
					/>
					<FileUploadField
						label="Slide Images"
						name={"slide_image"}
						defaulImges={d.slide_image}
						setloading={setloading}
						onUpload={handleUpload.bind(this, index)}
						onCrossClick={handleImageCrossClick.bind(
							this,
							"slide_image",
							index
						)}
						isMultiple
					/>
					<FileUploadField
						label="Carousel Image"
						name={"carousel"}
						defaulImges={d.carousel}
						setloading={setloading}
						onUpload={handleUpload.bind(this, index)}
						onCrossClick={handleImageCrossClick.bind(this, "carousel", index)}
						isMultiple
					/>

					<Box m={1} pt={3}>
						<TextField
							variant="outlined"
							label={"Para Title (h2)"}
							name={"para_title"}
							defaultValue={fieldsStructure[index].para_title}
							onChange={handleChange.bind(this, index)}
							InputLabelProps={{ shrink: true }}
							fullWidth
							multiline
						/>
					</Box>
					<Box m={1} pt={3}>
						<TextField
							variant="outlined"
							label={"Paragraph"}
							name={"para"}
							value={fieldsStructure[index].para}
							defaultValue={fieldsStructure[index].para}
							onChange={handleChange.bind(this, index)}
							InputLabelProps={{ shrink: true }}
							onKeyDown={(e) => handleKeyDown(e, index)}
							fullWidth
							multiline
						/>
						{tagState.is_search_start &&
						tagState.fields_structure_index === index ? (
							<Box border={"2px solid red"} padding={1}>
								<Box
									sx={{
										width: "100%",
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
									}}>
									<p>{tagState.text_data}</p>
									<Button onClick={closeTags}>Close</Button>
								</Box>
								<List sx={{ maxHeight: "300px", overflowY: "scroll" }}>
									{search_result.map((v) => (
										<ListItem>
											<ListItemButton
												onClick={handleTagItemClick.bind(this, {
													title: v.title,
													slug: v.slug,
													index: tagState.fields_structure_index,
												})}
												dense>
												<ListItemText primary={v.title} />
											</ListItemButton>
										</ListItem>
									))}
								</List>
							</Box>
						) : null}
					</Box>
				</div>
			))}

			<Button
				style={{ float: "right" }}
				variant="contained"
				color="primary"
				onClick={handleADDclick}>
				ADD MORE PARAGRAPH
			</Button>
		</div>
	);
};

export default Paragraph;

var alphabets = (() => {
	const caps = [...Array(26)].map((val, i) => String.fromCharCode(i + 65));
	return caps.concat(caps.map((letter) => letter.toLowerCase()));
})();

var allowed_keys_for_tags = [...alphabets, "_", "@", " ", "Backspace", "Enter"];
