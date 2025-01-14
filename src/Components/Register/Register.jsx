import { Button, Card, Input, Typography } from "@material-tailwind/react";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../Context/Auth/AuthProvider";


const Register = () => {
  const { handleLoginGoogle, handleRegister, setUser, handleName } =
    useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleGoogleLogin = () => {
    handleLoginGoogle()
      .then((user) => {
        setUser(user);
        toast.success("Google login successful!");
        navigate(redirectTo);
      })
      .catch(() => {
        toast.error("Something went wrong! Try again.");
      });
  };
  const validatePassword = (password) => {
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one numeric character.";
    }
    if (!/\W/.test(password)) {
      return "Password must contain at least one special character.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    return "";
  };

  const onSubmit = async (data) => {
    const { email, password, name, profile } = data;
    const passwordError = validatePassword(password);

    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const result = await handleRegister(email, password);
      await handleName(name, profile);
      setUser({ ...result.user, displayName: name, photoURL: profile });

      toast.success("Registration successful!", {});

      navigate(redirectTo);
    } catch (error) {
      setError(error.message);

      toast.error("Registration failed: " + error.message, {});
    }
  };

  return (
    <>
      <Helmet>
        <title>Register</title>
      </Helmet>

      <div className=" dark:bg-[#1E293B]  py-10">
        <div className="px-5 md:px-0 md:w-6/12 mx-auto">
          <Card className="p-6 shadow-md dark:bg-[#202632] dark:text-white">
            <Typography variant="h3" className="text-center font-bold mb-6">
              Register Now
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <Input
                  type="text"
                  label={<span className="dark:text-white">Name</span>}
                  className="dark:text-white"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <Typography variant="small" color="red">
                    {errors.name.message}
                  </Typography>
                )}
              </div>

              <div className="mb-4">
                <Input
                  type="text"
                  label={<span className="dark:text-white">Image URL</span>}
                  className="dark:text-white"
                  {...register("profile", {
                    required: "Image URL is required.",
                    pattern: {
                      value:
                        /^(https?):\/\/[^\s$.?#].[^\s]*\.(jpg|jpeg|png|gif|bmp)$/i,
                      message:
                        "Please enter a valid image URL (e.g., .jpg, .jpeg, .png).",
                    },
                  })}
                />
                {errors.profile && (
                  <Typography variant="small" color="red">
                    {errors.profile.message}
                  </Typography>
                )}
              </div>

              <div className="mb-4">
                <Input
                  type="email"
                  label={<span className="dark:text-white">Email</span>}
                  className="dark:text-white"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email format",
                    },
                  })}
                />
                {errors.email && (
                  <Typography variant="small" color="red">
                    {errors.email.message}
                  </Typography>
                )}
              </div>

              <div className="mb-4 relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  label={<span className="dark:text-white">Password</span>}
                  className="dark:text-white"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-5 transform -translate-y-2/4 text-xl"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {error && (
                  <Typography variant="small" color="red" className="mt-2">
                    {error}
                  </Typography>
                )}
              </div>
              <div className="mb-4">
                <Typography variant="small">
                  All Ready Have an Accont?{" "}
                  <Link to="/login" className="text-red-500 font-semibold">
                    Login
                  </Link>
                </Typography>
              </div>
              <Button type="submit" fullWidth>
                Register Now
              </Button>
            </form>

            <Button
              variant="outlined"
              fullWidth
              className="mt-4 flex items-center justify-center dark:text-white"
              onClick={handleGoogleLogin}
            >
              <FcGoogle className="mr-2 text-xl " /> Sign Up with Google
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Register;
