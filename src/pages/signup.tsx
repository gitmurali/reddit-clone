import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Grid, TextField } from "@mui/material";
import { Auth } from "aws-amplify";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useUser } from "../context/AuthContext";
import { CognitoUser } from "amazon-cognito-identity-js";
import { useRouter } from "next/router";

interface IFormInput {
  username: string;
  email: string;
  password: string;
  code: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Signup = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();
  const { user, setUser } = useUser();
  const [open, setOpen] = useState(false);
  const [signUpError, setSignupError] = useState<string>("");
  const [showCode, setShowCode] = useState<boolean>(false);
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
    try {
      if (showCode) {
        confirmSignUp(data);
      } else {
        await signUpWithEmailAndPwd(data);
        setShowCode(true);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setOpen(true);
        setSignupError(error?.message);
      }
    }
  };

  async function signUpWithEmailAndPwd(data: IFormInput): Promise<CognitoUser> {
    const { email, password } = data;
    console.log(data);
    try {
      const { user } = await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function confirmSignUp(data: IFormInput) {
    const { email, code, password } = data;
    try {
      await Auth.confirmSignUp(email, code);
      const signedInUser = await Auth.signIn(email, password);
      console.log("signed in a user", signedInUser);
      if (signedInUser) {
        router.push("/");
      } else {
        throw new Error("something went wrong");
      }
    } catch (error) {
      console.log("error confirming sign up", error);
    }
  }

  console.log("the value of user is: ", user);

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
            id="username"
            label="Username"
            error={errors.username ? true : false}
            type="text"
            helperText={errors.username?.message ?? null}
            variant="standard"
            {...register("username", {
              required: { value: true, message: "Please enter a Username" },
              minLength: {
                value: 3,
                message: "Please enter a username between 3 - 16 characters.",
              },
              maxLength: {
                value: 16,
                message: "Please enter a username between 3 - 16 characters.",
              },
            })}
          />
        </Grid>
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
        {showCode && (
          <Grid item>
            <TextField
              id="code"
              label="Verification code"
              error={errors.code ? true : false}
              type="text"
              helperText={errors.code?.message ?? null}
              variant="standard"
              {...register("code", {
                required: { value: true, message: "Please enter a code" },
                minLength: {
                  value: 6,
                  message: "Your verification code is 6 chars long.",
                },
                maxLength: {
                  value: 6,
                  message: "Your verification code is 6 chars long.",
                },
              })}
            />
          </Grid>
        )}
        <Grid item>
          <Button variant="contained" type="submit">
            {!showCode ? "Sign up" : "confirm code"}
          </Button>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {signUpError}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default Signup;
