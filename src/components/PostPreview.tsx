import { Grid, Typography } from "@mui/material";
import React from "react";
import { Post } from "../API";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { IconButton } from "@mui/material";

type Props = {
  post: Post;
};

export default function PostPreview({ post }: Props) {
  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={3}
      style={{ width: "100%" }}
    >
      <Grid item style={{ maxWidth: 128 }}>
        <Grid container direction="column" alignItems="center">
          <Grid item>
            <IconButton color="inherit">
              <ArrowDropUpIcon />
            </IconButton>
          </Grid>
          <Grid item>votes</Grid>
          <Grid item>
            <IconButton color="inherit">
              <ArrowDropDownIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="column" alignItems="flex-start">
          <Grid item>
            <Typography variant="body1">
              Posted by {post.owner} at {post.createdAt}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h2">{post?.title}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
