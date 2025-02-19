// import { useState } from "react";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function Newsletter() {
//   const [email, setEmail] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (email.trim() === "") {
//       toast.error("Please enter a valid email address!");
//       return;
//     }

//     toast.success("Thank you for subscribing to our newsletter!");
//     setEmail("");
//   };

//   return (
//     <div id="join-us" className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
//         <h2 className="text-2xl font-bold mb-4 text-center">
//           Subscribe to our Newsletter
//         </h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Email address
//             </label>
//             <input
//               type="email"
//               id="email"
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all duration-200"
//           >
//             Subscribe
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() === "") {
      toast.error("Please enter a valid email address!");
      return;
    }

    toast.success("Thank you for subscribing to our newsletter!");
    setEmail("");
  };

  return (
    <div id="join-us" className="flex justify-center items-center bg-gray-100 pt-6 pb-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Subscribe to our Newsletter
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Stay updated with the latest news about pet adoptions, rescue stories, and how you can support us through donations. Join our mission to give every pet a loving home!
        </p>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              id="email"
              className="flex-1 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-500 text-white py-4 px-6 rounded-md hover:bg-blue-600 transition-all duration-200 text-lg font-medium"
            >
              Subscribe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
