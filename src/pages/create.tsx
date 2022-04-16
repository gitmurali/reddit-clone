import React from "react";
import { Button, Container, Grid, TextField } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";

interface IFormInput {
  title: string;
  content: string;
  image?: string;
}

type Props = {};

export default function CreatePost({}: Props) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
  };

  return (
    <Container maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Grid container direction="column">
          <Grid item>
            <TextField
              id="title"
              label="Post Title"
              fullWidth
              error={errors.title ? true : false}
              type="text"
              helperText={errors.title?.message ?? null}
              variant="standard"
              {...register("title", {
                required: { value: true, message: "Please enter a Title" },
                maxLength: {
                  value: 120,
                  message: "Please enter a title that is 120 chars or less.",
                },
              })}
            />
          </Grid>
          <Grid item>
            <TextField
              id="content"
              label="Post Content"
              fullWidth
              multiline
              error={errors.content ? true : false}
              type="text"
              helperText={errors.content?.message ?? null}
              variant="outlined"
              {...register("title", {
                required: {
                  value: true,
                  message: "Please enter some content for your post",
                },
                maxLength: {
                  value: 1000,
                  message:
                    "Please make sure your content is 1000 chars or less.",
                },
              })}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" type="submit">
              Post
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
