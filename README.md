# Admin Analytics Dashboard

A modern React-based admin panel designed for tracking business metrics, managing team members, and overseeing platform operations. 

Currently, this repository contains the **frontend application** integrated with a mock API for demonstration and development purposes. It simulates backend interactions using local storage, allowing you to run the complete user experience without a backend.

## 🚀 Features

- **Authentication System:** Secure login flow with JWT (access + refresh tokens) simulation.
- **Analytics Dashboard:** Overview of key performance indicators including revenue, orders, user growth, and conversion rates.
- **User Management:** Comprehensive CRUD operations (Create, Read, Update, Delete) for user management with advanced filtering, debounced search, and pagination.
- **Data Persistence:** Mock API utilizes `localStorage` to persist user data across sessions.
- **Role-Based Access:** Simulates access levels (admin, editor, viewer) and user statuses (active, inactive, pending).

##  Tech Stack

- **Framework:** React 19, Vite
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Routing:** React Router v7
- **Network:** Axios (with Interceptors)
- **Forms & Validation:** React Hook Form + Yup
- **UI & Styling:** Tailwind CSS 4, shadcn/ui
- **Charts:** Recharts
- **Testing:** Jest + React Testing Library

##  Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js**: Version 18.x or higher
- **npm**: Comes with Node.js

##  Getting Started (Step-by-Step)

Follow these steps to set up the project locally:

### 1. Clone the repository
```bash
git clone https://github.com/Madhuri1511/Admin-Analytics
cd Admin-Analytics
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```
The application will start running at `http://localhost:5173`.

### 4. Login to the application
Use the following demo credentials to access the dashboard:
- **Email:** `madhuri.patil@yopmail.com`
- **Password:** `password123`

---

##  Available Scripts

In the project directory, you can run:

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run preview`: Locally preview the production build.
- `npm run lint`: Runs ESLint to check for code quality and styling issues.
- `npm run test`: Runs the Jest test suite.
- `npm run test:watch`: Runs tests in interactive watch mode.

---

##  Project Structure

```text
src/
├── app/              # App shell and global providers
├── components/       # Shared UI components and layout wrappers (shadcn UI)
├── features/         # Feature-based modules (auth, dashboard, users)
├── hooks/            # Custom React hooks (auth, debounce, token expiry)
├── routes/           # Application routing setup (React Router)
├── services/         # API layer, Axios configuration, and Mock API setup
├── store/            # Redux store configuration and slices
└── utils/            # Helper functions, formatters, validators
```

##  About the Mock API

This project uses `axios-mock-adapter` in `src/services/mockApi.ts` to intercept Axios requests and return mock data. 

- Data is initialized from `src/services/mockData.ts`.
- Updates to user data (Create, Update, Delete) are saved to `localStorage` under the key `app_users_store`.
- Tokens (Access and Refresh) are simulated with a short-lived access token (60 seconds) to demonstrate automatic token refresh workflows via Axios interceptors.

To connect this to a real backend in the future:
1. Remove or disable the mock setup in `main.tsx` (`setupMockApi()`).
2. Update the `baseURL` in your Axios configuration (`src/services/api.ts`).

## Roadmap / Future Scope

While the core admin foundation is complete, the following modules are designed but pending implementation:
- **Payments:** Transaction listings and refund capabilities.
- **Complaints & Service Requests:** Ticketing system with assignment and SLAs.
- **Notifications:** WhatsApp Business API integration for automated customer updates.
- **Advanced Reporting:** Detailed breakdowns of revenue and agent performance metrics.
