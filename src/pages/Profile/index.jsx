import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import {
	Button,
	FormControl,
	Select,
	InputLabel,
	TextField,
	MenuItem,
	Box,
	Typography,
} from "@mui/material";

import * as creatorsAPI from "../../apis/creators.apis";
import image_path_prefix from "../../constants/image_path_prefix";

const Profile = () => {
	const [categories, setcategories] = useState([]);
	const [imageLoading, setimageLoading] = useState(false);
	const [loading, setloading] = useState(false);
	const [userData, setuserData] = useState({
		gender: "",
		cat_id: 0,
		creator_type: "",
		org_name: "",
		f_name: "",
		l_name: "",
		email: "",
		phone: "",
	});

	const profile_image_url =
		image_path_prefix.PROFILE_IMAGE +
		(userData.profile_img_name ? userData.profile_img_name : "default.png");

	const onChangeHandler = (e) => {
		const name = e.target.name;
		const value = e.target.value;

		setuserData((prev) => {
			const nextD = { ...prev };
			nextD[name] = value;
			return nextD;
		});
	};

	const handleImageChange = async (e) => {
		setimageLoading(true);
		if (!e.target.files.length) {
			return;
		}

		const file = e.target.files[0];

		const fd = new FormData();
		fd.append("image", file);

		const { data } = await creatorsAPI.update_profile_img(fd);

		setuserData((prev) => {
			const nextD = { ...prev };
			nextD["profile_img_name"] = data.data;
			return nextD;
		});

		alert("image changed successfully!");
		setimageLoading(false);
	};

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();

			setloading(true);
			await creatorsAPI.update_profile({
				f_name: userData.f_name,
				l_name: userData.l_name,
				org_name: userData.org_name ? userData.org_name : "",
				cat_id: userData.cat_id,
				gender: userData.gender,
				creator_type: userData.creator_type,
				phone: userData.phone,
			});

			alert("Updated Successfully!");
		} catch (e) {
			if (e.response) {
				alert(e.response.data.message);
			} else {
				alert("something went wrong!!");
			}
		} finally {
			setloading(false);
		}
	};

	useEffect(() => {
		creatorsAPI
			.get_profile()
			.then(({ data }) => {
				setuserData(data.data);
				setcategories(data.data.cats);
			})
			.catch((e) => {
				if (e.response) {
					alert(e.response.data.message);
				} else {
					alert("something went wrong!!");
				}
			});
	}, []);

	return (
		<center>
			<Typography variant="h3" width={"80%"} textAlign={"left"}>
				Profile
			</Typography>
			<form onSubmit={handleSubmit}>
				<Grid
					borderRadius={"20px"}
					boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px"}
					maxWidth={"80%"}
					padding={"10px"}
					bgcolor={"white"}
					container>
					<Grid
						display={"flex"}
						flexDirection={"column"}
						alignItems={"center"}
						justifyContent={"center"}
						xs={12}
						sm={4}
						padding={"10px"}
						item>
						<img
							height={300}
							width={300}
							src={profile_image_url}
							alt="profile.png"
						/>
						<Button
							variant="contained"
							disabled={imageLoading}
							disableElevation>
							<input
								type="file"
								id="upload"
								accept="image/*"
								onChange={handleImageChange}
								hidden
							/>
							<label for="upload">
								{imageLoading ? "Loading.." : "Change Image"}
							</label>
						</Button>
					</Grid>
					<Grid
						xs={12}
						sm={8}
						display={"flex"}
						flexDirection={"column"}
						gap={2}
						item>
						<Grid spacing={2} justifyContent={"space-between"} container>
							<Grid sm={6} item>
								<FormControl fullWidth>
									{/* <InputLabel htmlFor="f_name">First Name</InputLabel> */}
									<TextField
										label="First Name"
										id="f_name"
										name="f_name"
										onChange={onChangeHandler}
										value={userData.f_name}
									/>
								</FormControl>
							</Grid>
							<Grid sm={6} item>
								<FormControl fullWidth>
									{/* <InputLabel htmlFor="l_name">Last Name</InputLabel> */}
									<TextField
										label="Last Name"
										id="l_name"
										name="l_name"
										onChange={onChangeHandler}
										value={userData.l_name}
									/>
								</FormControl>
							</Grid>
						</Grid>
						<Grid spacing={2} container>
							<Grid sm={6} item>
								<FormControl fullWidth>
									{/* <InputLabel htmlFor="email">Email</InputLabel> */}
									<TextField
										label="Email"
										id="email"
										name="email"
										onChange={onChangeHandler}
										value={userData.email}
										disabled
									/>
								</FormControl>
							</Grid>
							<Grid sm={6} item>
								<FormControl fullWidth>
									{/* <InputLabel htmlFor="phone">Phone Number</InputLabel> */}
									<TextField
										label="Phone"
										id="phone"
										name="phone"
										value={userData.phone}
										onChange={onChangeHandler}
									/>
								</FormControl>
							</Grid>
						</Grid>
						<Grid spacing={2} container>
							<Grid sm={6} item>
								<FormControl fullWidth>
									<InputLabel id="gender_lable">Gender</InputLabel>
									<Select
										value={userData.gender}
										labelId="gender_lable"
										name="gender"
										onChange={onChangeHandler}
										id="gender"
										label="Gender">
										<MenuItem value={"male"}>Male</MenuItem>
										<MenuItem value={"female"}>Female</MenuItem>
										<MenuItem value={"other"}>Other</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid sm={6} item>
								<FormControl fullWidth>
									<InputLabel id="domain_of_writing_label">
										Domain Of Writing
									</InputLabel>
									<Select
										name="cat_id"
										value={userData.cat_id}
										onChange={onChangeHandler}
										labelId="domain_of_writing_label"
										id="domain_of_writing"
										label="Domain Of Writing">
										{categories.map((v) => (
											<MenuItem key={v.id} value={v.id}>
												{v.category}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
						</Grid>
						<Grid spacing={2} container>
							<Grid sm={6} item>
								<FormControl fullWidth>
									<InputLabel id="creator_type_lable">Type</InputLabel>
									<Select
										labelId="creator_type_lable"
										id="creator_type"
										name="creator_type"
										value={userData.creator_type}
										onChange={onChangeHandler}
										label="creator_type">
										<MenuItem value={"individual"}>Individual</MenuItem>
										<MenuItem value={"organisation"}>Organisation</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid sm={6} item>
								<FormControl fullWidth>
									{/* <InputLabel htmlFor="org_name">Organisation Name</InputLabel> */}
									<TextField
										label="Oraganisation Name"
										id="org_name"
										name="org_name"
										value={userData.org_name}
										onChange={onChangeHandler}
									/>
								</FormControl>
							</Grid>
						</Grid>
						<Box display={"flex"} justifyContent={"flex-end"}>
							<Button
								disabled={loading}
								sx={{ width: "20%" }}
								type="submit"
								variant="contained">
								{loading ? "Loading..." : "Save"}
							</Button>
						</Box>
					</Grid>
				</Grid>
			</form>
			<Box
				position={"absolute"}
				zIndex={-2}
				height={"80vh"}
				width={"99%"}
				top={"20%"}
				bgcolor={"#80B3FF"}>
				hs
			</Box>
		</center>
	);
};

export default Profile;
