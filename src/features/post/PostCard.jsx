import React, { useCallback, useState } from "react";
import {
  Box,
  Link,
  Card,
  Stack,
  Avatar,
  Typography,
  CardHeader,
  IconButton,
  alpha,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { fDate } from "../../utils/formatTime";
import BuildIcon from "@mui/icons-material/Build";
import DeleteIcon from "@mui/icons-material/Delete";
import PostReaction from "./PostReaction";
import CommentForm from "../comment/CommentForm";
import CommentList from "../comment/CommentList";
import { deletePost, togglePostEdit, updatePost } from "./postSlice";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";
import PostForm from "./PostForm";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { FTextField, FUploadImage } from "../../components/form";

const yupSchema = Yup.object().shape({
  content: Yup.string().required("Content is required"),
});

const defaultValues = {
  content: "",
  image: null,
};

function PostCard({ post }) {
  const methods = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const { user } = useAuth();
  const isEditing = useSelector(
    (state) => state.post.postsById[post._id].isEditing
  );
  const dispatch = useDispatch();

  return (
    <Card>
      <CardHeader
        disableTypography
        avatar={
          <Avatar src={post?.author?.avatarUrl} alt={post?.author?.name} />
        }
        title={
          <Link
            variant="subtitle2"
            color="text.primary"
            component={RouterLink}
            sx={{ fontWeight: 600 }}
            to={`/user/${post.author._id}`}
          >
            {post?.author?.name}
          </Link>
        }
        subheader={
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            {fDate(post.createdAt)}
          </Typography>
        }
        action={
          <Stack direction="row" spacing={1}>
            <IconButton onClick={() => dispatch(deletePost(post, user))}>
              <DeleteIcon sx={{ fontSize: 30 }} />
            </IconButton>
            <IconButton onClick={() => dispatch(togglePostEdit(post._id))}>
              <BuildIcon sx={{ fontSize: 30 }} />
            </IconButton>
          </Stack>
        }
      />

      <Stack spacing={2} sx={{ p: 3 }}>
        {isEditing ? (
          <Card sx={{ p: 3 }}>
            <FormProvider methods={methods}>
              <Stack spacing={2}>
                <FTextField
                  name="content"
                  multiline
                  fullWidth
                  rows={4}
                  placeholder="Share what you are thinking here..."
                  sx={{
                    "& fieldset": {
                      borderWidth: `1px !important`,
                      borderColor: alpha("#919EAB", 0.32),
                    },
                  }}
                />

                <FUploadImage name="image" accept="image/*" maxSize={3145728} />
              </Stack>
            </FormProvider>
          </Card>
        ) : (
          <>
            <Typography>{post.content}</Typography>
            {post.image && (
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  height: 300,
                  "& img": { objectFit: "cover", width: 1, height: 1 },
                }}
              >
                <img src={post.image} alt="post" />
              </Box>
            )}
          </>
        )}

        <PostReaction post={post} />
        <CommentList postId={post._id} />
        <CommentForm postId={post._id} />
      </Stack>
    </Card>
  );
}

export default PostCard;
