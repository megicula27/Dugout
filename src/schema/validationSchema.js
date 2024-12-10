import * as Yup from "yup";

export const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .matches(
      /^[a-zA-Z0-9]{6,}$/,
      "Username must be at least 6 alphanumeric characters"
    )
    .required("Username is required"),
  email: Yup.string()
    .matches(
      /^([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])$/,
      "Invalid email format"
    )
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[!@#$%^&*(),.?":{}|<>\-_])[A-Za-z\d!@#$%^&*(),.?":{}|<>\-_]+$/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
});
