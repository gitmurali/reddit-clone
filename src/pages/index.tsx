import { Container } from "@mui/material";
import { API } from "aws-amplify";
import { useEffect, useState } from "react";
import { ListPostsQuery, Post } from "../API";
import PostPreview from "../components/PostPreview";
import { useUser } from "../context/AuthContext";
import * as queries from "../graphql/queries";

export default function Home() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Array<Post>>([]);

  useEffect(() => {
    const fetchPostsFromApi = async () => {
      const allPosts = (await API.graphql({ query: queries.listPosts })) as {
        data: ListPostsQuery;
        errors: any[];
      };
      setPosts(allPosts.data.listPosts?.items as Post[]);
    };

    fetchPostsFromApi();
  }, []);

  console.log(user, posts);
  return (
    <Container maxWidth="md">
      {posts.map((post) => {
        return <PostPreview key={post.id} post={post} />;
      })}
    </Container>
  );
}
