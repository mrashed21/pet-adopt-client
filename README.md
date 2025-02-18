# Pet Adoption Platform

## Purpose

This project aims to create a user-friendly and dynamic platform for pet adoption. By leveraging technology, the platform connects individuals with pets in need of loving homes, enabling an easier and more impactful adoption process.

## Live URL

[Visit the Pet Adoption Platform](https://pet-adopt-web.netlify.app/)

## Key Features

### General Features

- **Homepage**:
  - Fully responsive design with meaningful logo, navbar links, and call-to-action sections.
  - Pet categories, inspirational adoption messages, and an About Us section.
  - Additional sections for user engagement related to the pet adoption theme.
- **Pet Listing**:
  - Display of pets available for adoption in a 3-column grid layout.
  - Features include pet image, name, age, location, and a button to view details.
  - Search and filter by pet name or category.
  - Infinite scrolling for seamless data loading.
- **Pet Details**:
  - Comprehensive information about individual pets.
  - Modal form for adoption requests, capturing user and pet details.

### Donation Campaigns

- **Donation Listing**:
  - 3-column grid display of donation campaigns.
  - Shows pet name, image, donation amount, and a progress bar.
  - Infinite scrolling for campaign discovery.
- **Donation Details**:
  - Complete donation campaign details.
  - Modal for making donations securely using Stripe integration.
  - Recommended donation campaigns section.

### Authentication

- Email and password-based registration and login with form validation.
- Social login via Google and GitHub.
- JWT-based authentication with user roles (`user` and `admin`).
- Secure storage of sensitive credentials using environment variables.

### User Dashboard (Protected Routes)

- **Add a Pet**: Form for adding pets, including image upload via Cloudinary, with validation.
- **My Added Pets**: List of pets added by the user, with options to update, delete, and mark as adopted.
- **Adoption Requests**: View and manage adoption requests for listed pets.
- **Donation Campaigns**: Create, edit, and track donations.

### Admin Dashboard

- Manage users, pets, and donation campaigns.
- UserRole Handle Edit/Delete pets, and pause/unpause donation campaigns.

### Design & UX

- Responsive design for mobile, tablet, and desktop.
- Dark and light mode toggle.
- Skeleton loaders instead of spinners for a better user experience.
- UI design implemented using `Material Tailwind` for a polished and modern look.

## Deployment

- Frontend deployed on Netlify.
- Backend deployed with no CORS/404/504 errors.
- Environment variables secured for Firebase and MongoDB credentials.

## Technology Stack

- **Frontend**: React, TailwindCSS, Material Tailwind, TanStack Query, React-Router-Dom, Axios.
- **Backend**: Node.js, Express.js, MongoDB.
- **Authentication**: Firebase (email/password and social login).
- **Payment**: Stripe API.
- **State Management**: React Query.
- **Other Libraries**: Formik, React-Quill, React-Toastify, SweetAlert2.

## NPM Packages Used

- `@tanstack/react-query` - Efficient data fetching and caching.
- `axios` - Simplified HTTP requests.
- `firebase` - User authentication.
- `formik` - Form management.
- `react-quill` - WYSIWYG editor for rich text input.
- `react-toastify` - Toast notifications.
- `stripe` & `@stripe/react-stripe-js` - Payment gateway integration.

## How to Access Admin Dashboard

- **Admin Credentials:**
  - Email: [admin@admin.admin]
  - Password: [Admin1$]
- **Server Code:** [Visit Here](https://github.com/mrashed21/pet-adopt-server)
