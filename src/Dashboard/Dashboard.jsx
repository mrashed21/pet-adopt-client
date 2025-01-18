import { Typography } from "@material-tailwind/react";
import { NavLink, Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      this is dashboard
      <Typography variant="h2" className="text-center">
        {" "}
        DashBoard
      </Typography>
      {/* <UserDashboard/> */}
      <section className="flex w-11/12 mx-auto">
        <aside className="w-3/12">
          <div className="flex flex-col gap-2">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/dashboard">Profile</NavLink>
            <NavLink to="add-pet">Add a Pet</NavLink>
            <NavLink to="my-added">My added pets</NavLink>

            <NavLink to="adopt-request">Adoption Request</NavLink>
            <NavLink to="add-donation">Create Donation Campaign</NavLink>
            <NavLink to="/">My Donation Campaigns</NavLink>
            <NavLink to="/">My Donations</NavLink>
          </div>
        </aside>
        <main className="w-9/12">
          <Outlet />
        </main>
      </section>
    </div>
  );
};

export default Dashboard;
