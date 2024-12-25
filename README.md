# Test Glory: Sign In & Sign Up

## Overview

**Test Glory** is a full-stack application built for **Sign In** and **Sign Up** functionalities, utilizing a modern tech stack:

- **Frontend**: React with **Tailwind CSS** for styling, **Shacdn** for UI components.
- **Backend**: **NestJS** for the server, **PostgreSQL** as the database, and **TypeORM** for database interaction.
- **Package Manager**: **Yarn** is used to manage dependencies.

This application implements JWT-based authentication, supporting a secure user sign-in and sign-up process.

---

## Tech Stack

### Frontend:
- **React**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework for styling the frontend.
- **Shacdn**: A CDN for sharing React components and other UI elements.

### Backend:
- **NestJS**: A progressive Node.js framework for building efficient, scalable server-side applications.
- **PostgreSQL**: A relational database management system used for storing user data.
- **TypeORM**: An ORM for TypeScript and JavaScript (ES7, ES6, ES5) to manage database operations.

---

## Setup

Follow the steps below to set up the project locally.

### 1. Clone the repository:

```bash
git clone https://github.com/trandiepphuong/test-glory.git
```
### 2. Install dependencies:
Navigate to the project root folder and install dependencies for both the client and server:

```bash
yarn install
```
### 3. Setup PostgreSQL:
Ensure you have a PostgreSQL instance running locally or use a cloud provider like Heroku Postgres.
Add your PostgreSQL connection details to the .env file in the backend directory (nest folder).
### 4. Start the server and client:
Start both the client (React) and server (NestJS) in development mode:

For the client:
```bash
cd client && yarn start
```
For the server:
```bash
cd client && yarn start
```
---
## CI/CD Configuration
The project uses GitHub Actions for continuous integration and deployment.

### Build Workflow
The workflow is defined in .github/workflows/build.yml and runs on each push or pull request to the main branch.

---
## Conclusion
Test Glory is a comprehensive and well-structured full-stack application. The project leverages modern web technologies like React, Tailwind CSS, and NestJS, integrated with PostgreSQL and TypeORM for data management. With CI/CD integration, it ensures smooth deployment and continuous testing on each commit.