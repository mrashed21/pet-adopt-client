// import { Typography } from "@material-tailwind/react";
// import { FaDonate, FaUsers } from "react-icons/fa";
// import { MdPets } from "react-icons/md";
// import { NavLink } from "react-router-dom";
// const Admin = () => {
//   return (
//     <div className="flex flex-col gap-4">
//       <div className="border-b-2 border-gray-400 w-full mt-4"></div>
//       <Typography
//         variant="h6"
//         color="blue-gray"
//         className="font-bold mt-3 text-center"
//       >
//         Admin Panel
//       </Typography>
//       <NavLink
//         to="all-user"
//         className={({ isActive }) =>
//           `flex items-center gap-3 p-3 rounded-lg transition-colors ${
//             isActive
//               ? "bg-blue-500 text-white"
//               : "hover:bg-blue-100 text-gray-700"
//           }`
//         }
//       >
//         <FaUsers size={20} />
//         All User
//       </NavLink>
//       <NavLink
//         to="all-pet"
//         className={({ isActive }) =>
//           `flex items-center gap-3 p-3 rounded-lg transition-colors ${
//             isActive
//               ? "bg-blue-500 text-white"
//               : "hover:bg-blue-100 text-gray-700"
//           }`
//         }
//       >
//         <MdPets size={20} />
//         All Pet
//       </NavLink>
//       <NavLink
//         to="all-donation"
//         className={({ isActive }) =>
//           `flex items-center gap-3 p-3 rounded-lg transition-colors ${
//             isActive
//               ? "bg-blue-500 text-white"
//               : "hover:bg-blue-100 text-gray-700"
//           }`
//         }
//       >
//         <FaDonate size={20} />
//         All Donation
//       </NavLink>
//     </div>
//   );
// };

// export default Admin;

import { Typography } from "@material-tailwind/react";
import { FaDonate, FaUsers } from "react-icons/fa";
import { MdPets } from "react-icons/md";
import { NavLink } from "react-router-dom";

const Admin = ({ onLinkClick }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="border-b-2 border-gray-400 w-full mt-4"></div>
      <Typography
        variant="h6"
        color="blue-gray"
        className="font-bold mt-3 text-center"
      >
        Admin Panel
      </Typography>
      <NavLink
        to="all-user"
        onClick={onLinkClick}
        className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-100 text-gray-700"
          }`
        }
      >
        <FaUsers size={20} />
        All User
      </NavLink>
      <NavLink
        to="all-pet"
        onClick={onLinkClick}
        className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-100 text-gray-700"
          }`
        }
      >
        <MdPets size={20} />
        All Pet
      </NavLink>
      <NavLink
        to="all-donation"
        onClick={onLinkClick}
        className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-100 text-gray-700"
          }`
        }
      >
        <FaDonate size={20} />
        All Donation
      </NavLink>
    </div>
  );
};

export default Admin;