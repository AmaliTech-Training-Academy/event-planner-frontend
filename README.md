# Event Planner

A modern event management platform built with Angular 19 that enables users to create, discover, and manage events with role-based access for attendees and administrators.

## Overview

Event Planner is a full-featured web application designed to streamline event management. The platform provides an intuitive interface for users to browse events, create their own events, and manage their event participation. Administrators have access to a dedicated dashboard for user management and platform oversight.

## Features

### For Attendees
- **Landing Page** - Welcome page with platform overview
- **Explore Events** - Browse and discover available events
- **Create Events** - Create and publish new events
- **Event Details** - View comprehensive event information
- **My Events** - Manage personal events and registrations
- **Profile Management** - Update user profile and preferences
- **About Page** - Learn more about the platform

### For Administrators
- **Admin Dashboard** - Centralized management console
- **User Management** - Manage platform users and permissions

### Authentication
- User registration and login
- Separate admin authentication
- Email verification
- Password recovery

## Tech Stack

- **Framework:** Angular 19.2
- **Language:** TypeScript 5.7
- **Styling:** SCSS with custom theming
- **Routing:** Lazy-loaded modules
- **Testing:** Jasmine & Karma
- **Build Tool:** Angular CLI

## Project Structure

```
event-planner-frontend/
├── src/
│   ├── app/
│   │   ├── core/              # Core services and utilities
│   │   ├── layouts/           # Layout components
│   │   │   ├── admin-layout/
│   │   │   └── atendee-layout/
│   │   ├── modules/
│   │   │   ├── admin/         # Admin module
│   │   │   │   └── pages/
│   │   │   │       ├── dashboard-page/
│   │   │   │       └── user-management-page/
│   │   │   ├── attendee/      # Attendee module
│   │   │   │   └── pages/
│   │   │   │       ├── landing-page/
│   │   │   │       ├── explore-page/
│   │   │   │       ├── create-event-page/
│   │   │   │       ├── event-page/
│   │   │   │       ├── my-events-page/
│   │   │   │       ├── profile-page/
│   │   │   │       └── about-page/
│   │   │   └── auth/          # Authentication module
│   │   │       ├── components/
│   │   │       └── pages/
│   │   │           ├── login-page/
│   │   │           ├── signup-page/
│   │   │           ├── admin-login-page/
│   │   │           ├── verify-email-page/
│   │   │           └── forgot-password-page/
│   │   ├── shared/            # Shared components and utilities
│   │   ├── app.routes.ts      # Application routing
│   │   └── app.config.ts      # Application configuration
│   ├── environments/          # Environment configurations
│   └── styles/                # Global styles and theming
├── public/                    # Static assets
└── docs/                      # Documentation
```

## Setup Guide

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v19 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd event-planner-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.sample .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:4200`

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run watch` - Build in watch mode

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Development

### Code Style

- Follow Angular style guide
- Use SCSS for styling
- Implement lazy loading for modules
- Write unit tests for components

### Module Architecture

The application uses a modular architecture with three main modules:
- **Auth Module:** Handles authentication flows
- **Attendee Module:** User-facing features
- **Admin Module:** Administrative functions

Each module is lazy-loaded to optimize performance.


