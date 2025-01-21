import { Link } from "react-router-dom";

const Admin = () => {
  return (
    <div className="flex flex-col gap-4">
      <Link to={"all-user"}>All User</Link>
      <Link to={"all-pet"}>All Pet</Link>
      <Link to={"all-donation"}>All Donation</Link>
    </div>
  );
};

export default Admin;
