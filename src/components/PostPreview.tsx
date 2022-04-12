import { Grid } from "@mui/material";
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
        <Grid container>
          <Grid item>rest of the content</Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
