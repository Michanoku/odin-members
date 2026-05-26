# Michanoku Clubhouse

A private message board built with Node.js, Express, PostgreSQL, Passport.js, and EJS as part of The Odin Project's "Members Only" project.

Users can register, log in, post messages, join the clubhouse through secret passwords, and gain different permissions depending on their membership status.

---

## Live Site

Live Demo: [Coming Soon](#)

### Demo Passwords

The live demo includes public passwords so visitors can test different permission levels.

| Password | Function |
|---|---|
| `iwannabecool` | Become a Member |
| `iwannabetheverybest` | Become an Admin |
| `reset` | Reset Member/Admin status |

---

## Features

### Authentication & Authorization
- User registration and login with Passport.js
- Persistent login sessions using `express-session`
- Password hashing with `bcrypt`
- Role-based permissions:
  - **Guests**
  - **Members**
  - **Admins**
- Protected routes with custom authorization middleware

### Membership System
- Guests can browse messages anonymously
- Members can reveal author names and message dates
- Admins can delete messages
- Secret password system for:
  - Member access
  - Admin access
  - Membership reset (for testing purposes)

### Messages
- Create new messages
- Delete messages (admin only)
- Conditional rendering based on user permissions

### Validation & Security
- Server-side validation with `express-validator`
- Custom validators for:
  - Password confirmation
  - Duplicate email detection
  - Secret membership passwords
- Input sanitization and trimming
- Protected against common security issues using:
  - `helmet`
  - password hashing
  - authorization middleware
  - PostgreSQL parameterized queries

### UI & UX
- Responsive mobile sidebar navigation
- Light/Dark theme toggle with cookies
- Accessible toggle buttons using ARIA attributes
- Dynamic navigation based on authentication state

### Testing
Comprehensive integration and database testing using Jest and Supertest.

Test coverage includes:
- Authentication flows
- Authorization middleware
- Validation
- Database persistence
- Password hashing
- Duplicate email protection
- Role escalation
- Unauthorized access attempts
- Message creation/deletion
- Error handling
- Route protection

Currently includes 50+ automated tests across multiple test suites.

---

## Tech Stack

### Backend
- Node.js
- Express
- PostgreSQL
- Passport.js
- express-session
- connect-pg-simple

### Frontend
- EJS
- CSS
- Vanilla JavaScript

### Testing
- Jest
- Supertest

---

## Database Models

### User
- First Name
- Last Name
- Email
- Password Hash
- Member Status
- Admin Status

### Message
- Title
- Message Body
- Timestamp
- User ID (foreign key)

---

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
NODE_ENV=development

DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_NAME=your_database_name

SECRET=your_session_secret

MEMBER_PASSWORD=your_member_password
ADMIN_PASSWORD=your_admin_password
RESET_PASSWORD=your_reset_password
```