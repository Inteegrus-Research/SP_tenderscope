# TenderScope

TenderScope is a full-stack enterprise-level project for tracking and reporting public tenders. It allows users to find and publish tenders in their area, view tenders on a map, report inappropriate tenders, and provides an admin panel for managing users, tenders, and reports.

## Features

- User authentication with JWT
- Create, view, and manage tenders
- Interactive map integration with Leaflet and OpenStreetMap
- Report inappropriate tenders
- Admin panel for managing users, tenders, and reports
- Responsive design with Bootstrap

## Tech Stack

- **Frontend**: React, Bootstrap, Leaflet, OpenStreetMap
- **Backend**: Node.js, Express
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Token)

## Project Structure

```
tenderscope/
├── client/ # React frontend
│ ├── public/
│ ├── src/
│ │ ├── components/ # TenderCard, TenderForm, MapView, etc.
│ │ ├── pages/ # Home, Dashboard, Admin, etc.
│ │ ├── context/ # AuthContext
│ │ ├── App.tsx
│ │ └── api.ts # Axios configuration
│ └── package.json
├── server/ # Backend Node + Express
│ ├── db.js # SQLite connection
│ ├── index.js # Main Express app
│ ├── .env
│ ├── middleware/
│ │ ├── auth.js
│ │ └── admin.js
│ ├── routes/
│ │ ├── auth.js # Register/Login
│ │ ├── tenders.js # Post/get tenders
│ │ ├── reports.js # Report tenders
│ │ └── admin.js # Admin-specific routes
│ └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/tenderscope.git
   cd tenderscope
   ```

2. Install dependencies:
   ```
   npm run install-all
   ```

### Running the Application

1. Start the backend server:
   ```
   cd server
   npm run dev
   ```

2. Start the frontend development server:
   ```
   cd client
   npm start
   ```

3. Open your browser and navigate to:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

### Demo Accounts

- **Admin User**:
  - Email: admin@tenderscope.com
  - Password: admin123

- **Regular User**:
  - Email: user@tenderscope.com
  - Password: user123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/user` - Get current user data

### Tenders
- `GET /api/tenders` - Get all tenders
- `GET /api/tenders/:id` - Get tender by ID
- `POST /api/tenders` - Create a tender
- `PUT /api/tenders/:id` - Update a tender
- `DELETE /api/tenders/:id` - Delete a tender
- `GET /api/tenders/user/me` - Get current user's tenders

### Reports
- `POST /api/reports` - Create a report
- `GET /api/reports/user` - Get current user's reports

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/reports` - Get all reports
- `PUT /api/admin/reports/:id` - Update report status
- `GET /api/admin/stats` - Get admin dashboard stats

## License

This project is licensed under the MIT License.