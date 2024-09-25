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
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { fDate } from "../../utils/formatTime";
import PostReaction from "./PostReaction";
import CommentForm from "../comment/CommentForm";
import CommentList from "../comment/CommentList";
import { deletePost } from "./postSlice";
import { useDispatch } from "react-redux";
import useAuth from "../../hooks/useAuth";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PostUpdate from "./PostUpdate";

function PostCard({ post }) {
  const dispatch = useDispatch();
  const { user } = useAuth();

  // MoreVert

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  //
  // DiaLog
  const [deleteMenu, setDeleteMenu] = useState(false);
  const [editMenu, setEditMenu] = useState(false);
  //

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
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
            {/* Update Post */}

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => setEditMenu(true)}>Edit Post</MenuItem>
              <Dialog
                open={editMenu}
                onClose={() => setEditMenu(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth="md"
              >
                <DialogTitle id="alert-dialog-title">Edit Post</DialogTitle>
                <DialogContent>
                  <PostUpdate
                    post={post}
                    onSuccess={() => setEditMenu(false)}
                  />
                </DialogContent>
              </Dialog>

              <MenuItem onClick={() => setDeleteMenu(true)}>
                Delete Post
              </MenuItem>
              {/* Delete Post */}
              <Dialog
                open={deleteMenu}
                onClose={() => setDeleteMenu(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Are you sure you want to delete this post?"}
                </DialogTitle>

                <DialogActions>
                  <Button onClick={() => setDeleteMenu(false)} color="error">
                    No
                  </Button>
                  <Button
                    color="success"
                    onClick={() => {
                      dispatch(deletePost(post, user));
                      setDeleteMenu(false);
                    }}
                    autoFocus
                  >
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            </Menu>
          </Stack>
        }
      />

      <Stack spacing={2} sx={{ p: 3 }}>
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

        <PostReaction post={post} />
        <CommentList postId={post._id} />
        <CommentForm postId={post._id} />
      </Stack>
    </Card>
  );
}

export default PostCard;
