import React, { useState } from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import Button from "@mui/material/Button";

import BackdropLoader from "../../components/Backdrop";

const TextSum = () => {
	const [isLoading, setisLoading] = useState(false);
	const [text, settext] = useState("");
	const [resultText, setresultText] = useState("");

	const sumtext = async (index) => {
		try {
			if (!text?.trim()) {
				alert("please enter text in paragraph");
				return;
			}

			setisLoading(true);

			const fd = new FormData();
			fd.append("text", text);

			const { data } = await axios.post(
				"https://www.ingenral.com/text-sum",
				fd
			);

			setresultText(data.text);
		} catch (error) {
			console.log(error);
			alert("Something went wrong!!");
		} finally {
			setisLoading(false);
		}
	};

	return (
		<div>
			<BackdropLoader open={isLoading} />
			<Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
				<Box sx={{ maxWidth: 1000 }} component={Paper}>
					<Typography>Enter Your text</Typography>
					<TextareaAutosize
						style={{
							width: "500px",
							padding: "0.4rem",
							borderRadius: "0.5rem",
						}}
						value={text}
						onChange={(e) => settext(e.target.value)}
						minRows={20}
						min
					/>
					<TextareaAutosize
						style={{
							width: "500px",
							padding: "0.4rem",
							borderRadius: "0.5rem",
						}}
						value={resultText}
						minRows={20}
						min
						disabled
					/>
					<Button onClick={sumtext} variant="contained">
						Summurize
					</Button>
				</Box>
			</Box>
		</div>
	);
};

export default TextSum;
