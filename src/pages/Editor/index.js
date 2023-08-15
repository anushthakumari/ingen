import React, { useState, useEffect } from "react";
import * as Yup from "yup";

import BlogPageContainer from "./BlogPage.container";
import EditBog from "./EditBog";
import BackdropLoader from "../../components/Backdrop";

import { getSingleRawBlog, updateBlogById } from "../../apis/blog.apis";
import { useBlogList } from "../../context/BlogList.context";

const Editor = (props) => {
	const BLOG_ID = props.match.params.id;
	const { fetchBlogs } = useBlogList();

	const initialVals = {
		title: "",
		desc: "",
		h1: "",
		h2: "",
		bottom_bar_h3: "",
		bottom_bar_h5: "",
		btn_1_text: "",
		btn_1_url: "",
		btn_2_text: "",
		btn_2_url: "",
	};

	const initialParaSettings = [
		{
			para_title: "",
			para: "",
			single_image: "",
			slide_image: [],
			carousel: [],
		},
	];

	const [loading, setloading] = useState(false);
	const [headerImage, setheaderImage] = useState("media/default.jpg");
	const [paragraphSets, setparagraphSets] = useState(initialParaSettings);
	const [initialValues, setinitialValues] = useState(initialVals);

	const validationSchema = Yup.object({
		title: Yup.string().required("Required!"),
		desc: Yup.string().required("Required!"),
		btn_1_text: Yup.string().max(25),
		btn_2_text: Yup.string().max(25),
	});

	const fetchBlogData = () => {
		(async () => {
			setloading(true);
			let {
				data: { data },
			} = await getSingleRawBlog(BLOG_ID);
			if (data) {
				setheaderImage(data.header_image);
				setinitialValues(data);
				if (data.sets.length) {
					setparagraphSets(data.sets);
				}
			}
			setloading(false);
		})();
	};

	const onSubmitHandler = (values) => {
		// on submit handler
		const data = {
			...values,
			header_image: headerImage ? headerImage : initialValues.header_image,
			sets: paragraphSets,
		};

		(async () => {
			try {
				setloading(true);
				await updateBlogById(BLOG_ID, data);
				await fetchBlogData();
			} catch (error) {
				alert("Something went wrong!");
			} finally {
				setloading(false);
			}
		})();
	};

	useEffect(() => {
		fetchBlogData();
		fetchBlogs();
		// eslint-disable-next-line
	}, []);

	return (
		<BlogPageContainer>
			<BackdropLoader open={loading} />
			<EditBog
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmitHandler={onSubmitHandler}
				handleHeaderImage={setheaderImage}
				headerImage={headerImage}
				fieldsStructure={paragraphSets}
				setfieldsStructure={setparagraphSets}
				setloading={setloading}
			/>
		</BlogPageContainer>
	);
};

export default Editor;
