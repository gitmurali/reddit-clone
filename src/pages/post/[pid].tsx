import React, { ReactElement } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { withSSRContext } from "aws-amplify";
import * as queries from "../../graphql/queries";
import { GetPostQuery, ListPostsQuery, Post } from "../../API";
import { ParsedUrlQuery } from "querystring";
import PostPreview from "../../components/PostPreview";
import { Container } from "@mui/material";
import PostComment from "../../components/PostComment";

type Props = {
  post: Post;
};

export default function IndividualPosts({ post }: Props): ReactElement {
  return (
    <Container maxWidth="md">
      <PostPreview post={post} />
      {post?.comments?.items.map((comment) => (
        <PostComment comment={comment} key={comment?.id} />
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
