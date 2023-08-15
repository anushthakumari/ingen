import React from "react";

const BlogPageContainer = ({ children }) => {
	return (
		<div
			style={{
				maxWidth: "1299px",
				margin: "2% 6%",
			}}>
			{children}
		</div>
	);
};

export default BlogPageContainer;
