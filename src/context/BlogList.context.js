import React, { createContext, useContext, useState, useEffect } from "react";

import { getAllBlogs } from "../apis/blog.apis";

const Context = createContext();

export default function BlogsListContext({ children }) {
	const [loading, setloading] = useState(false);
	const [rows, setrows] = useState([]);

	const fetchBlogs = () => {
		(async () => {
			try {
				setloading(true);
				const {
					data: { data },
				} = await getAllBlogs();
				setrows(data);
			} catch (error) {
				alert("something went wrong!");
			} finally {
				setloading(false);
			}
		})();
	};

	return (
		<Context.Provider
			value={{
				loading,
				setloading,
				rows,
				fetchBlogs,
			}}>
			{children}
		</Context.Provider>
	);
}

export const useBlogList = () => useContext(Context);
