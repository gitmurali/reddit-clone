import { ButtonBase, Grid, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  CreateVoteInput,
  CreateVoteMutation,
  Post,
  UpdateVoteInput,
  UpdateVoteMutation,
} from "../API";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { IconButton } from "@mui/material";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import { Storage } from "aws-amplify";
import * as queries from "../graphql/mutations";
import { API } from "aws-amplify";
import { useUser } from "../context/AuthContext";

type Props = {
  post: Post;
};

export default function PostPreview({ post }: Props) {
  const router = useRouter();
  const { user } = useUser();
  const [postImage, setPostImage] = useState<string>();
  const [existingVote, setExistingVote] = useState<string | undefined>();
  const [existingVoteId, setExistingVoteId] = useState<string>();
  const [upvotes, setUpvotes] = useState<number>(
    post?.votes?.items
      ? post?.votes?.items.filter((v) => v?.vote === "upvote").length
      : 0
  );
  const [downvotes, setDownvotes] = useState<number>(
    post?.votes?.items
      ? post?.votes?.items.filter((v) => v?.vote === "downvote").length
      : 0
  );

  useEffect(() => {
    if (user) {
      const tryFindVote = post?.votes?.items?.find(
        (v) => v?.owner === user.getUsername()
      );
      if (tryFindVote) {
        setExistingVote(tryFindVote.vote);
        setExistingVoteId(tryFindVote.id);
      }
    }
  }, [user]);

  useEffect(() => {
    const getImage = async () => {
      try {
        const signedURL = await Storage.get(post.image as string);
        console.log("found the image: ", signedURL);
        setPostImage(signedURL);
      } catch (error) {
        console.error("no image found");
      }
    };

    getImage();
  }, []);

  const addVote = async (voteType: string) => {
    if (existingVote && existingVote !== voteType) {
      const updateVoteInput: UpdateVoteInput = {
        postVotesId: post.id,
        vote: voteType,
        id: existingVoteId as string,
      };

      const updateVote = (await API.graphql({
        query: queries.updateVote,
        variables: { input: updateVoteInput },
        authMode: "AMAZON_COGNITO_USER_POOLS",
      })) as { data: UpdateVoteMutation };

      if (voteType === "upvote") {
        setUpvotes(upvotes + 1);
        setDownvotes(downvotes - 1);
      }

      if (voteType === "downvote") {
        setUpvotes(upvotes - 1);
        setDownvotes(downvotes + 1);
      }
      setExistingVote(voteType);
      setExistingVoteId(updateVote.data?.updateVote?.id);
      console.log("Updated vote:", updateVote);
    }

    if (!existingVote) {
      const createNewVoteInput: CreateVoteInput = {
        postVotesId: post.id,
        vote: voteType,
      };

      const createNewVote = (await API.graphql({
        query: queries.createVote,
        variables: { input: createNewVoteInput },
        authMode: "AMAZON_COGNITO_USER_POOLS",
      })) as { data: CreateVoteMutation };

      if (createNewVote.data?.createVote?.vote === "downvote") {
        setDownvotes(downvotes + 1);
      }
      if (createNewVote.data?.createVote?.vote === "upvote") {
        setUpvotes(upvotes + 1);
      }
      setExistingVote(voteType);
      setExistingVoteId(createNewVote.data?.createVote?.id);
    }
  };

  console.log(post);
  console.log("Upvotes:", upvotes);
  console.log("Downvotes:", downvotes);
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
                  <Typography variant="h6">{upvotes - downvotes}</Typography>
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

