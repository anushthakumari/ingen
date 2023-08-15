import React from "react";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";

import configs from "../../configs";

const ImagePreview = ({ defaulImges, onCrossClick }) => {
	const handleCrossClick = (imageArrayIndex) => {
		if (typeof onCrossClick === "function") {
			onCrossClick(imageArrayIndex);
		}
	};

	return defaulImges
		? defaulImges.map((e, i) =>
				e ? (
					<div
						key={e}
						style={{ position: "relative", width: "100px", height: "100px" }}>
						<IconButton
							onClick={handleCrossClick.bind(this, i, e)}
							style={{
								position: "absolute",
								top: 0,
								right: 0,
							}}>
							<CancelIcon />
						</IconButton>
						<img
							width="100"
							height={"100"}
							src={`${configs.BASE_URL}/${e}`}
							alt=""
						/>
					</div>
				) : (
					""
				)
		  )
		: null;
};

export default ImagePreview;
