import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ThumbDownAltRoundedIcon from "@mui/icons-material/ThumbDownAltRounded";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteComment, sendCommentReaction } from "./commentSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import useAuth from "../../hooks/useAuth";

function CommentReaction({ comment, postId }) {
  const [deleteMenu, setDeleteMenu] = useState(false);
  const dispatch = useDispatch();

  const { user } = useAuth();

  const handleClick = (emoji) => {
    dispatch(sendCommentReaction({ commentId: comment._id, emoji }));
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      display="flex"
      justifyContent="space-between"
    >
      <IconButton
        onClick={() => {
          setDeleteMenu(true);
        }}
      >
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={deleteMenu}
        onClose={() => setDeleteMenu(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this comment?"}
        </DialogTitle>

        <DialogActions>
          <Button onClick={() => setDeleteMenu(false)} color="error">
            No
          </Button>
          <Button
            color="success"
            onClick={() => {
              dispatch(deleteComment(comment, user, postId));
              setDeleteMenu(false);
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <IconButton
        onClick={() => handleClick("like")}
        sx={{ color: "primary.main" }}
      >
        <ThumbUpRoundedIcon sx={{ fontSize: 20 }} />
      </IconButton>
      <Typography variant="body2" mr={1}>
        {comment?.reactions?.like}
      </Typography>

      <IconButton
        onClick={() => handleClick("dislike")}
        sx={{ color: "error.main" }}
      >
        <ThumbDownAltRoundedIcon sx={{ fontSize: 20 }} />
      </IconButton>
      <Typography variant="body2">{comment?.reactions?.dislike}</Typography>
    </Stack>
  );
}

export default CommentReaction;
