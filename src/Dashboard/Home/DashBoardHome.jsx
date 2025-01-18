import { Typography } from "@material-tailwind/react";
import { useContext } from "react";
import { AuthContext } from "../../Context/Auth/AuthProvider";

const DashBoardHome = () => {
  const { user } = useContext(AuthContext);
  // const api = 
  return (
    <div>
      <Typography variant="h2">
        WELLCOME ON DASHBOARD {user?.displayName}
      </Typography>
      <p>hello</p>
      
    </div>
  );
};

export default DashBoardHome;
