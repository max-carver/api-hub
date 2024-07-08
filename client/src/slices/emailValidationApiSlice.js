import { apiSlice } from "./apiSlice";

export const emailValidationApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		validateEmail: builder.mutation({
			query: ({ email, apiKey }) => ({
				url: "/api/validateEmail",
				method: "POST",
				credentials: "include",
				headers: { apikey: apiKey },
				body: { email },
			}),
		}),
	}),
});

export const { useValidateEmailMutation } = emailValidationApiSlice;
