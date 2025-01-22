import axios from "axios";

export const saveUser = async (user) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/users/${user.email}`,
    {
      name: user?.displayName,
      image: user?.photoURL,
      email: user?.email,
    }
  );
  return res?.data?.role;
};
