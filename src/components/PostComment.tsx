import { Grid, Paper, Typography } from "@mui/material";
import moment from "moment";
import React, { ReactElement } from "react";
import { Comment } from "../API";

type Props = {
  comment: Comment | null;
};

export default function PostComment({ comment }: Props): ReactElement {
  return (
    <Paper
      style={{ width: "100%", minHeight: 128, padding: 16, marginTop: 16 }}
      elevation={1}
    >
      <Grid container spacing={1} direction="column">
        <Grid item>
          <Typography variant="body1">
            {comment?.owner} - posted {moment(comment?.createdAt).fromNow()}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2">
            <b>{comment?.content}</b>
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
