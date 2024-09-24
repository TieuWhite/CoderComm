import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";
import { POSTS_PER_PAGE } from "../../app/config";
import { cloudinaryUpload } from "../../utils/cloudinary";
import { getCurrentUserProfile } from "../user/userSlice";

const initialState = {
  isLoading: false,
  error: null,
  postsById: {},
  currentPagePosts: [],
};

const slice = createSlice({
  name: "post",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    resetPosts(state, action) {
      state.postsById = {};
      state.currentPagePosts = [];
    },

    getPostsSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const { posts, count } = action.payload;
      posts.forEach((post) => {
        state.postsById[post._id] = post;
        if (!state.currentPagePosts.includes(post._id))
          state.currentPagePosts.push(post._id);
      });
      state.totalPosts = count;
    },

    createPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const newPost = action.payload;
      if (state.currentPagePosts.length % POSTS_PER_PAGE === 0)
        state.currentPagePosts.pop();
      state.postsById[newPost._id] = newPost;
      state.currentPagePosts.unshift(newPost._id);
    },

    updatePostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },

    deletePostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },

    sendPostReactionSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { postId, reactions } = action.payload;
      state.postsById[postId].reactions = reactions;
    },
    togglePostEdit(state, action) {
      const postId = action.payload;
      state.postsById[postId].isEditing = !state.postsById[postId].isEditing;
    },
  },
});

export default slice.reducer;

export const togglePostEdit = (postId) => (dispatch) => {
  dispatch(slice.actions.togglePostEdit(postId));
};

export const getPosts =
  ({ userId, page = 1, limit = POSTS_PER_PAGE }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = { page, limit };
      const response = await apiService.get(`/posts/user/${userId}`, {
        params,
      });
      if (page === 1) dispatch(slice.actions.resetPosts());
      dispatch(slice.actions.getPostsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const sendPostReaction =
  ({ postId, emoji }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.post(`/reactions`, {
        targetType: "Post",
        targetId: postId,
        emoji,
      });
      dispatch(
        slice.actions.sendPostReactionSuccess({
          postId,
          reactions: response.data,
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const createPost =
  ({ content, image }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const imageUrl = await cloudinaryUpload(image);
      const response = await apiService.post("/posts", {
        content,
        image: imageUrl,
      });
      dispatch(slice.actions.createPostSuccess(response.data));
      toast.success("Post successfully");
      dispatch(getCurrentUserProfile());
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const updatePost = (post, user, content, image) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    if (user._id == post.author._id) {
      const imageUrl = await cloudinaryUpload(image);
      const response = await apiService.put(`/posts/${post._id}`, {
        content,
        image: imageUrl,
      });
      dispatch(slice.actions.updatePostSuccess(response.data));
      toast.success("Post successfully updated");
    } else {
      toast.error("You're not the author");
    }
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
    console.log(error);
  }
};

export const deletePost = (post, user) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    if (user._id == post.author._id) {
      const response = await apiService.delete(`/posts/${post._id}`);
      toast.success("Successfully delete post");
      dispatch(slice.actions.deletePostSuccess(...response.data, post._id));
      return response;
    } else {
      toast.error("You're not the author");
    }
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};
