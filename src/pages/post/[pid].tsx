import React, { ReactElement, useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { withSSRContext } from "aws-amplify";
import * as queries from "../../graphql/queries";
import * as mutationQueries from "../../graphql/mutations";
import {
  GetPostQuery,
  ListPostsQuery,
  Post,
  CreateCommentMutation,
  CreateCommentInput,
  Comment,
} from "../../API";
import { ParsedUrlQuery } from "querystring";
import PostPreview from "../../components/PostPreview";
import { Container, TextField, Button, Grid } from "@mui/material";
import PostComment from "../../components/PostComment";
import { SubmitHandler, useForm } from "react-hook-form";
import { API } from "aws-amplify";

interface IFormInput {
  comment: string;
}

type Props = {
  post: Post;
};

export default function IndividualPosts({ post }: Props): ReactElement {
  console.log(post);
  const [comments, setComments] = useState<Comment[]>(
    post.comments?.items as Comment[]
  );

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const createCommentInput: CreateCommentInput = {
      content: data.comment,
      postCommentsId: post.id,
    };

    const createNewComment = (await API.graphql({
      query: mutationQueries.createComment,
      variables: { input: createCommentInput },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    })) as { data: CreateCommentMutation };

    setComments([...comments, createNewComment.data.createComment as Comment]);
  };

  return (
    <Container maxWidth="md">
      <PostPreview post={post} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        style={{ marginTop: 64, marginBottom: 32 }}
      >
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <TextField
              id="comment"
              label="Add a Comment"
              error={errors.comment ? true : false}
              type="text"
              multiline
              fullWidth
              helperText={errors.comment?.message ?? null}
              variant="standard"
              {...register("comment", {
                required: { value: true, message: "Please enter a Comment" },
                maxLength: {
                  value: 240,
                  message: "Please enter a comment under 240 characters.",
                },
              })}
            />
          </Grid>
          <Grid item justifyContent="flex-end">
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      {comments
        .sort((a: Comment, b: Comment) =>
          b.createdAt.localeCompare(a.createdAt)
        )
        .map((comment) => (
          <PostComment key={comment.id} comment={comment} />
        ))}
    </Container>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const SSR = withSSRContext();
  const postsQuery = (await SSR.API.graphql({
    query: queries.getPost,
    variables: { id: params?.pid },
  })) as { data: GetPostQuery };
  return {
    props: { post: postsQuery.data.getPost }, // will be passed to the page component as props
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const SSR = withSSRContext();
  const response = (await SSR.API.graphql({ query: queries.listPosts })) as {
    data: ListPostsQuery;
    errors: any[];
  };

  const paths = response?.data?.listPosts?.items.map((post) => {
    return {
      params: { pid: post?.id },
    };
  });

  return {
    paths: paths as (
      | string
      | { params: ParsedUrlQuery; locale?: string | undefined }
    )[],
    fallback: "blocking", // false or 'blocking'
  };
};
