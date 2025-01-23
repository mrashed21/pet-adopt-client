import {
  Button,
  Card,
  Dialog,
  Input,
  Typography,
} from "@material-tailwind/react";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaEye, FaEyeSlash, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../Context/Auth/AuthProvider";

const Login = () => {
  const {
    handleLogin,
    handleLoginGoogle,
    handleReseTPassword,
    setUser,
    handleLoginGithub,
  } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";
  // Handle Login
  const handleLoginForm = (e) => {
    e.preventDefault();
    const password = e.target.password.value;

    handleLogin(email, password)
      .then(() => {
        toast.success("Login successful!");
        navigate(redirectTo);
      })
      .catch(() => {
        toast.error("Something went wrong! Try again.");
      });
  };

  // const handleGoogleLogin = () => {
  //   handleLoginGoogle()
  //     .then((user) => {
  //       setUser(user);
  //       toast.success("Google login successful!");
  //       navigate(redirectTo);
  //     })
  //     .catch(() => {
  //       toast.error("Something went wrong! Try again.");
  //     });
  // };

  // Handle Password Reset
  const handlePasswordReset = async () => {
    try {
      await handleReseTPassword(resetEmail);
      toast.success("Reset email sent successfully!");
      setIsModalOpen(false);
    } catch {
      toast.error("Failed to send reset email!");
    }
  };

  // Open Modal and pre-fill email
  const openResetPasswordModal = () => {
    setResetEmail(email);
    setIsModalOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      {/* Login Form */}
      <div className="py-10 min-h-screen flex items-center justify-center dark:bg-[#292933]">
        <Card className="p-6 md:w-1/2 w-full shadow-lg dark:bg-[#303030] dark:text-white">
          <Typography
            variant="h4"
            color="blue-gray"
            className="mb-6 text-center dark:text-white"
          >
            Login
          </Typography>
          <form onSubmit={handleLoginForm}>
            <div className="mb-4">
              <Typography variant="small" className="mb-2">
                Email
              </Typography>
              <Input
                type="email"
                className="dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-4 relative">
              <Typography variant="small" className="mb-2">
                Password
              </Typography>
              <Input
                className="dark:text-white"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-xl"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <button
                type="button"
                onClick={openResetPasswordModal}
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot password?
              </button>
              <Typography variant="small">
                Don’t Have An Account?{" "}
                <a href="/register" className="text-red-500 hover:underline">
                  Register Now
                </a>
              </Typography>
            </div>

            <Button type="submit" className="w-full mb-4">
              Login
            </Button>
          </form>

          <Button
            variant="outlined"
            color="black"
            onClick={() => {
              handleLoginGoogle().then(() => {
                navigate(redirectTo);
              });
            }}
            className="w-full flex items-center justify-center gap-2 dark:text-white"
          >
            <FcGoogle className="text-2xl" /> Login with Google
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

      {/* Reset Password Modal */}
      <Dialog
        open={isModalOpen}
        handler={() => setIsModalOpen(!isModalOpen)}
        size="sm"
        className="p-6 dark:bg-[#202632] dark:text-white"
      >
        <Typography
          variant="h5"
          color="blue-gray"
          className="text-center mb-4 dark:text-white"
        >
          Reset Password
        </Typography>
        <div className="space-y-4">
          <Input
            type="email"
            className="dark:text-white"
            label={<span className="dark:text-white">Email Address</span>}
            placeholder="Enter your email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
          />
          <div className="flex justify-between mt-4">
            <Button
              color="blue"
              onClick={handlePasswordReset}
              className="w-full mr-2"
            >
              Send Reset Link
            </Button>
            <Button
              color="red"
              variant="outlined"
              onClick={() => setIsModalOpen(false)}
              className="w-full ml-2"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Login;
