import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (data) => ({
				url: "api/login",
				method: "POST",
				credentials: "include",
				body: data,
			}),
		}),
		register: builder.mutation({
			query: (data) => ({
				url: "api/register",
				method: "POST",
				credentials: "include",
				body: data,
			}),
		}),
		logout: builder.mutation({
			query: () => ({
				url: "api/logout",
				method: "POST",
				credentials: "include",
			}),
		}),
		updateUser: builder.mutation({
			query: (data) => ({
				url: "api/profile",
				method: "PUT",
				credentials: "include",
				body: data,
			}),
		}),
	}),
});

export const {
	useLoginMutation,
	useLogoutMutation,
	useRegisterMutation,
	useUpdateUserMutation,
} = usersApiSlice;
