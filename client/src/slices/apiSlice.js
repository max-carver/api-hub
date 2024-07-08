import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ baseUrl: "pex-api-hub.onrender.com" });

export const apiSlice = createApi({
	baseQuery,
	tagTypes: ["User"],
	endpoints: (builder) => ({}),
});
