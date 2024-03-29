import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

export const taskSlice = apiSlice.injectEndpoints({
  tagTypes: ["Task"],
  endpoints: (build) => ({
    addTask: build.mutation({
      query(body) {
        return {
          url: "/task/add",
          method: "POST",
          body,
        };
      },
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
    listTask: build.query({
      query: (status) => `/task/list`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Task", id })), { type: "Task", id: "LIST" }]
          : [{ type: "Task", id: "LIST" }],
    }),
    listDepartmentTask: build.query({
      query: (department) => `/task/list/${department}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Task", id })), { type: "Task", id: "LIST" }]
          : [{ type: "Task", id: "LIST" }],
    }),
    listBucketTask: build.query({
      query: (id) => `/task/buckettask/${id}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Task", id })), { type: "Task", id: "LIST" }]
          : [{ type: "Task", id: "LIST" }],
    }),
    detailTask: build.query({
      query: (id) => `/task/detail/${id}`,
      providesTags: (result, error, id) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
    }),
    editTask: build.mutation({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `/task/edit/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
    }),
    deleteTask: build.mutation({
      query(id) {
        return {
          url: `/task/delete/${id}`,
          method: "PUT",
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
    }),
    generateChecklistTask: build.mutation({
      query: (id) => `/checklist/generatetask/${id}`,
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddTaskMutation,
  useListTaskQuery,
  useListDepartmentTaskQuery,
  useListBucketTaskQuery,
  useDetailTaskQuery,
  useEditTaskMutation,
  useDeleteTaskMutation,
  useGenerateChecklistTaskMutation,
} = taskSlice;

export const taskStateSlice = createSlice({
  name: "TaskState",
  initialState: { showComplete: "" },
  reducers: {
    taskState: (state, action) => {
      // if (state.showComplete == false) {
      //   state.showComplete = true;
      // } else if (state.showComplete == true) {
      state.showComplete = action.payload;
      // }
    },
  },
});

export const { taskState } = taskStateSlice.actions;

export default taskStateSlice.reducer;
