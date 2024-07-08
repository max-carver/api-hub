import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (data) => ({
				url: "/apilogin",
				method: "POST",
				credentials: "include",
				body: data,
			}),
		}),
		register: builder.mutation({
			query: (data) => ({
				url: "/api/register",
				method: "POST",
				credentials: "include",
				body: data,
			}),
		}),
		logout: builder.mutation({
			query: () => ({
				url: "/api/logout",
				method: "POST",
				credentials: "include",
			}),
		}),
		updateUser: builder.mutation({
			query: (data) => ({
				url: "/api/profile",
				method: "PUT",
				credentials: "include",
				body: data,
			}),
		}),
		validateEmail: builder.mutation({
			query: ({ email, apiKey }) => ({
				url: "/api/validateEmail",
				method: "POST",
				credentials: "include",
				headers: { Authorization: apiKey },
				body: { email },
			}),
		}),
	}),
});

export const {
	useLoginMutation,
	useLogoutMutation,
	useRegisterMutation,
	useUpdateUserMutation,
	useValidateEmailMutation,
} = usersApiSlice;
