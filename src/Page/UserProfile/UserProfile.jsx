// // import { AuthContext } from "../../Context/Auth/AuthProvider";

// import { Button, Typography } from "@material-tailwind/react";
// import { useContext } from "react";
// import { AuthContext } from "../../Context/Auth/AuthProvider";

// const UserProfile = () => {
//   const { user } = useContext(AuthContext);
//   return (
//     <div className="flex flex-col items-center justify-center">
//       <div className="h-20 w-20 rounded-full border-2 mt-10">
//         <img
//           className="w-full h-full rounded-full"
//           src={user.photoURL}
//           alt=""
//         />
//       </div>
//       <Typography variant="h2">{user?.displayName}</Typography>
//       <Typography variant="small">{user.email}</Typography>
//       <Button> Update Profile</Button>
//     </div>
//   );
// };

// export default UserProfile;

import { Button, Typography, Input, Dialog } from "@material-tailwind/react";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/Auth/AuthProvider";
import axios from "axios";

const UserProfile = () => {
  const { user, UpdateProfile } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user?.displayName || "");
  const [image, setImage] = useState(null);

  const handleOpen = () => setOpen(!open);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpdateProfile = async () => {
    try {
      let photoURL = user.photoURL;

      // Upload image to Cloudinary
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "your_upload_preset"); // Replace with your Cloudinary preset

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
          formData
        );
        photoURL = response.data.secure_url;
      }

      // Update profile in Firebase
      await UpdateProfile(name, photoURL);

      // Update user in database
      await axios.put(`/users/update/${user.uid}`, {
        name,
        photoURL,
      });

      alert("Profile updated successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="h-20 w-20 rounded-full border-2 mt-10">
        <img className="w-full h-full rounded-full" src={user.photoURL} alt="" />
      </div>
      <Typography variant="h2">{user?.displayName}</Typography>
      <Typography variant="small">{user.email}</Typography>
      <Button onClick={handleOpen}>Update Profile</Button>

      <Dialog open={open} handler={handleOpen}>
        <div className="p-5">
          <Typography variant="h4">Update Profile</Typography>
          <div className="mt-4">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4"
            />
            <Input
              type="file"
              label="Upload Profile Picture"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleOpen} color="red">
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile} color="green">
              Save Changes
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default UserProfile;
