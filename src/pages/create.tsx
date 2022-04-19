import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Container, Grid, TextField } from "@mui/material";
import ImageDropzone from "../components/ImageDropzone";
import { API, Storage } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import * as queries from "../graphql/mutations";
import { CreatePostInput, CreatePostMutation } from "../API";
import { useRouter } from "next/router";

type Props = {};

interface IFormInput {
  title: string;
  content: string;
  image?: string;
}

export default function CreatePost({}: Props) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();
  const [file, setFile] = useState<any>();
  const router = useRouter();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (file) {
      try {
        const imagePath = uuidv4();
        await Storage.put(imagePath, file, {
          contentType: file.type,
        });

        const createNewPostInput: CreatePostInput = {
          title: data?.title,
          contents: data.content,
          image: imagePath,
        };

        const createNewPost = (await API.graphql({
          query: queries.createPost,
          variables: { input: createNewPostInput },
          authMode: "AMAZON_COGNITO_USER_POOLS",
        })) as { data: CreatePostMutation };

        console.log("new post created: ", createNewPost);
        router.push(`/post/${createNewPost.data.createPost?.id}`);
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
    } else {
      const createNewPostInput: CreatePostInput = {
        title: data?.title,
        contents: data.content,
      };

      const createNewPostWithoutImage = (await API.graphql({
        query: queries.createPost,
        variables: { input: createNewPostInput },
        authMode: "AMAZON_COGNITO_USER_POOLS",
      })) as { data: CreatePostMutation };

      router.push(`/post/${createNewPostWithoutImage.data.createPost?.id}`);
    }
  };

  return (
    <Container maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Grid container spacing={4} direction="column">
          {/* Title of the post */}
          <Grid item>
            <TextField
              variant="outlined"
              id="title"
              label="Post Title"
              type="text"
              fullWidth
              error={errors.title ? true : false}
              helperText={errors.title ? errors.title.message : null}
              {...register("title", {
                required: { value: true, message: "Please enter a title." },
                maxLength: {
                  value: 120,
                  message:
                    "Please enter a title that is 120 characters or less.",
                },
              })}
            />
          </Grid>
          {/* Contents of the post */}
          <Grid item>
            <TextField
              variant="outlined"
              id="content"
              label="Post Content"
              type="text"
              fullWidth
              multiline
              error={errors.content ? true : false}
              helperText={errors.content ? errors.content.message : null}
              {...register("content", {
                required: {
                  value: true,
                  message: "Please enter some content for your post.",
                },
                maxLength: {
                  value: 1000,
                  message:
                    "Please make sure your content is 1000 characters or less.",
                },
              })}
            />
          </Grid>
          {/* Optional Image of the post */}
          <Grid item>
            <ImageDropzone file={file} setFile={setFile} />
          </Grid>

          {/* Button to submit the form with those contents */}
          <Button variant="contained" type="submit">
            Create Post
          </Button>
        </Grid>
      </form>
    </Container>
  );
}
