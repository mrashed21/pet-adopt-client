import { Button, Card, Input, Typography } from "@material-tailwind/react";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaEye, FaEyeSlash, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { AuthContext } from "../../Context/Auth/AuthProvider";

const Register = () => {
  const { handleLoginGoogle, handleRegister, setUser, handleLoginGithub } =
    useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one numeric character")
      .matches(/\W/, "Password must contain at least one special character")
      .required("Password is required"),
    profile: Yup.mixed().required("Profile image is required"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    const { name, email, password, profile } = values;

    try {
      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", profile);
      formData.append("upload_preset", "pet_adopt");
      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dablesuiy/image/upload",
        formData
      );
      const profileImageUrl = cloudinaryResponse.data.secure_url;

      // Register user with all information at once
      await handleRegister(email, password, name, profileImageUrl);

      toast.success("Registration successful!");
      navigate(redirectTo);
    } catch (error) {
      toast.error("Registration failed: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <Helmet>
        <title>Register</title>
      </Helmet>

      <div className="dark:bg-[#1E293B] py-10">
        <div className="px-5 md:px-0 md:w-6/12 mx-auto">
          <Card className="p-6 shadow-md dark:bg-[#202632] dark:text-white">
            <Typography variant="h3" className="text-center font-bold mb-6">
              Register Now
            </Typography>
            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                profile: null,
              }}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ setFieldValue, errors, touched, isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <Field
                      name="name"
                      type="text"
                      placeholder="Full Name"
                      as={Input}
                    />
                    {touched.name && errors.name && (
                      <Typography variant="small" color="red">
                        {errors.name}
                      </Typography>
                    )}
                  </div>

                  <div className="mb-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        setFieldValue("profile", event.currentTarget.files[0])
                      }
                      className="dark:text-white"
                    />
                    {touched.profile && errors.profile && (
                      <Typography variant="small" color="red">
                        {errors.profile}
                      </Typography>
                    )}
                  </div>

                  <div className="mb-4">
                    <Field
                      name="email"
                      type="email"
                      placeholder="Email"
                      as={Input}
                    />
                    {touched.email && errors.email && (
                      <Typography variant="small" color="red">
                        {errors.email}
                      </Typography>
                    )}
                  </div>

                  <div className="mb-4 relative">
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      as={Input}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-5 transform -translate-y-2/4 text-xl"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {touched.password && errors.password && (
                      <Typography variant="small" color="red">
                        {errors.password}
                      </Typography>
                    )}
                  </div>

                  <div className="mb-4">
                    <Typography variant="small">
                      Already have an account?{" "}
                      <Link to="/login" className="text-red-500 font-semibold">
                        Login
                      </Link>
                    </Typography>
                  </div>
                  <Button
                    type="submit"
                    fullWidth
                    disabled={isSubmitting}
                    className="dark:text-white"
                  >
                    {isSubmitting ? "Registering..." : "Register Now"}
                  </Button>
                </Form>
              )}
            </Formik>

            <Button
              variant="outlined"
              fullWidth
              className="mt-4 flex items-center justify-center dark:text-white"
              onClick={() =>
                handleLoginGoogle()
                  .then((user) => {
                    setUser(user);
                    toast.success("Google login successful!");
                    navigate(redirectTo);
                  })
                  .catch(() => {
                    toast.error("Something went wrong! Try again.");
                  })
              }
            >
              <FcGoogle className="mr-2 text-xl" /> Sign Up with Google
            </Button>
            <Button
              variant="outlined"
              fullWidth
              className="mt-4 flex items-center justify-center dark:text-white"
              onClick={() =>
                handleLoginGithub()
                  .then((user) => {
                    setUser(user);
                    toast.success("GitHub login successful!");
                    navigate(redirectTo);
                  })
                  .catch(() => {
                    toast.error("Something went wrong! Try again.");
                  })
              }
            >
              <FaGithub className="mr-2 text-xl" /> Sign Up with GitHub
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Register;
