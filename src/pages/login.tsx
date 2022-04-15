import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Grid, TextField } from "@mui/material";
import { Auth } from "aws-amplify";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useRouter } from "next/router";

interface IFormInput {
  email: string;
  password: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();
  const [signInError, setSignInError] = useState<string>("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const { email, password } = data;
    try {
      await Auth.signIn(email, password);
      router.push("/");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setSignInError(e.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Grid
        container
        direction="column"
        spacing={4}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item>
          <TextField
            id="email"
            label="Email"
            error={errors.email ? true : false}
            type="email"
            helperText={errors.email?.message ?? null}
            variant="standard"
            {...register("email", {
              required: { value: true, message: "Please enter a valid email" },
            })}
          />
        </Grid>
        <Grid item>
          <TextField
            id="password"
            label="Password"
            error={errors.password ? true : false}
            type="password"
            helperText={errors.password?.message ?? null}
            variant="standard"
            {...register("password", {
              required: { value: true, message: "Please enter a Password." },
              minLength: {
                value: 8,
                message: "Please enter a valid and stronger password.",
              },
            })}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" type="submit">
            Login
          </Button>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {signInError}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default Login;
