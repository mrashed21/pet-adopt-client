import {
  Button,
  Card,
  Dialog,
  Input,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/Auth/AuthProvider";
import { Helmet } from "react-helmet-async";

const UserProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
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
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append(
          "upload_preset",
          `${import.meta.env.VITE_CLOUDINARY_PRESET}`
        );

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_NAME
          }/image/upload`,
          formData
        );
        photoURL = response.data.secure_url;
      }
      await updateUserProfile(name, photoURL);

      alert("Profile updated successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <>
    <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div className="flex flex-col items-center justify-center px-4 py-8">
        <Card className="flex flex-col items-center w-full max-w-md p-6 shadow-lg">
          <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-gray-300">
            <img
              className="w-full h-full object-cover"
              src={user.photoURL}
              alt="Profile"
            />
          </div>
          <Typography variant="h5" className="mt-4 font-semibold">
            {user?.displayName || "Your Name"}
          </Typography>
          <Typography variant="small" className="text-gray-500">
            {user?.email}
          </Typography>
          <Button onClick={handleOpen} className="mt-6" color="blue">
            Update Profile
          </Button>
        </Card>

        <Dialog open={open} handler={handleOpen} size="sm">
          <div className="p-6">
            <Typography variant="h4" className="mb-4 font-bold text-center">
              Update Profile
            </Typography>
            <div className="space-y-4">
              <Input
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
              <Input
                type="file"
                label="Upload Profile Picture"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <Button onClick={handleOpen} variant="text" color="red">
                Cancel
              </Button>
              <Button onClick={handleUpdateProfile} color="green">
                Save Changes
              </Button>
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default UserProfile;
