# BankAccountKata

## Overview
BankAccountKata is a full-stack application consisting of a backend server with a RESTful API built using Express and TypeScript, a database, and a frontend developed with React, TypeScript, Fluent UI, and Vite. The project includes all bonus tasks and features with robust search functionality.

## Features
- **Backend**:
  - RESTful API with Express and TypeScript
  - Endpoints for managing bank accounts, transactions, and transfers
  - Error handling and validation using Zod
  - API versioning for future scalability
- **Frontend**:
  - Responsive UI built with React and Fluent UI
  - Real-time data fetching and state management with zustand
  - Pagination, sorting, and filtering of transactions
  - Interactive forms and modals for user actions
- **Database**:
  - Persistent storage for accounts and transactions
  - Seamless integration with the backend

## Main Libraries Used
- **Backend**:
  - [Express](https://expressjs.com/): Web framework for Node.js
  - [TypeScript](https://www.typescriptlang.org/): Typed JavaScript
  - [Zod](https://github.com/colinhacks/zod): TypeScript-first schema declaration and validation library
- **Frontend**:
  - [React](https://reactjs.org/): JavaScript library for building user interfaces
  - [Fluent UI](https://developer.microsoft.com/en-us/fluentui): Microsoft's UI framework for building web apps
  - [Vite](https://vitejs.dev/): Next-generation frontend tooling

## Getting Started

### Prerequisites
- Node.js (version 14.x or higher)
- npm (version 6.x or higher)

### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/AwsAyyash/BankAccountKata.git
    cd BankAccountKata
    ```

2. Install dependencies for both the server and frontend:
    ```bash
    cd server
    npm install
    cd ../frontend
    npm install
    ```

### Running the Application

#### Backend
To run the backend server:
```bash
cd server
npm run dev
