import { ButtonBase, Grid, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Post } from "../API";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { IconButton } from "@mui/material";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import { Storage } from "aws-amplify";

type Props = {
  post: Post;
};

export default function PostPreview({ post }: Props) {
  const router = useRouter();
  const [postImage, setPostImage] = useState<string>();

  const addVote = async (oteType: string) => {
    // create a vote
  };

  useEffect(() => {
    const getImage = async () => {
      try {
        const signedURL = await Storage.get(post.image as string);
        console.log("found the image: ", signedURL);
        setPostImage(signedURL);
      } catch (error) {
        console.error(error);
      }
    };

    getImage();
  }, []);

  return (
    <Paper elevation={24}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        wrap="nowrap"
        spacing={3}
        style={{ width: "100%", marginTop: 16, padding: 16 }}
      >
        <Grid item style={{ maxWidth: 128 }}>
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <IconButton color="inherit" onClick={() => addVote("upvote")}>
                <ArrowDropUpIcon style={{ maxWidth: 24 }} />
              </IconButton>
            </Grid>
            <Grid item>
              <Grid container alignItems="center" direction="column">
                <Grid item>
                  <Typography variant="h6">
                    {(post.votes?.items?.filter((v) => v?.vote === "upvote"))
                      .length -
                      post?.votes?.items?.filter((v) => v?.vote === "downvote")
                        ?.length}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2">votes</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <IconButton color="inherit" onClick={() => addVote("downvote")}>
                <ArrowDropDownIcon style={{ maxWidth: 24 }} />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <ButtonBase onClick={() => router.push(`/post/${post.id}`)}>
            <Grid container direction="column" alignItems="flex-start">
              <Grid item>
                <Typography variant="body1">
                  Posted by {post.owner} {moment(post.createdAt).fromNow()}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h2">{post?.title}</Typography>
              </Grid>
              <Grid
                item
                style={{
                  maxHeight: 32,
                  overflowY: "hidden",
                  overflowX: "hidden",
                }}
              >
                <Typography variant="body1">{post?.contents}</Typography>
              </Grid>
              {/* {post.image && ( */}
              <Grid item>
                {post.image && postImage && (
                  <Image
                    src={postImage}
                    height={540}
                    width={980}
                    layout="intrinsic"
                  />
                )}
              </Grid>
              <Grid item></Grid>
            </Grid>
          </ButtonBase>
        </Grid>
      </Grid>
    </Paper>
  );
}

