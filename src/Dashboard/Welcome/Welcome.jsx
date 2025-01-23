import { useContext } from "react";
import { AuthContext } from "../../Context/Auth/AuthProvider";
import { Typography } from "@material-tailwind/react";

const Welcome = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="flex items-center justify-center">
      <Typography variant="h4" gutterBottom className="text-center mt-20"> 
        Welcome {user?.displayName || "User"}
      </Typography>
    </div>
  );
};

export default Welcome;
