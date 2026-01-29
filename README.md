# ModBrew CMS Frontend

A flexible React-based frontend for the ModBrew CMS.  
This project provides the user interface for managing content, editing component schemas, and interacting with the backend API.

---

## Table of Contents

1. [Overview](#overview)  
2. [Tech Stack](#tech-stack)  
3. [Getting Started](#getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Setup](#setup)  
   - [Running the Dev Server](#running-the-dev-server)  
4. [Environment Configuration](#environment-configuration)  
5. [Project Structure](#project-structure)  
6. [Component System](#component-system)  
7. [Contributing](#contributing)  
8. [License](#license)  

---

## Overview

The ModBrew frontend provides a fully dynamic content management interface:  

- Renders and edits **component-based content** from the CMS backend  
- Supports **dynamic forms** based on component schemas  
- Offers **reusable components** for content managers  
- Integrates with a backend API for data persistence  

---

## Tech Stack

- **Frontend:** React + TypeScript  
- **Styling:** TailwindCSS  
- **State Management:** React Hooks (and any global store if used)  
- **Bundler/Dev:** Vite  
- **Other tools:** Yarn, ESLint, Prettier, Husky  

---

## Getting Started

### Prerequisites

- Node.js >= v24.12.0  
- Yarn >= 1.22.22
- Backend API running (`modbrew-cms-be`)  

---

### Setup

1. Clone the repo:

```bash
git clone git@github.com:jeremyphillips/modbrew-cms-fe.git
cd modbrew-cms-fe
```

2. Install dependencies:

```bash
yarn install
```

3. Configure environment variables:

```bash
cp .env.example .env
```

Running the Dev Server:

```bash
yarn dev
```

## Environment Configuration:
- Default API endpoint: `http://localhost:3000` (or your backend URL)
- Frontend connects to the backend using bearer token authentication

.env variables:
```bash
VITE_API_BASE=http://localhost:5001/api/v1 # update port as needed
```

## Project Structure:

```
modbrew-cms-fe/
├─ src/
│  ├─ components/        # Reusable UI components
│  |  ├─ elements/          # Atomic components like Buttons, Modals, Fields
|  |  └─modules/           # Larger feature modules
│  ├─ pages/             # App pages
│  ├─ hooks/             # Custom hooks
│  ├─ utils/             # Utility functions
│  ├─ api/               # API request handlers
│  └─ index.tsx          # App entry point
├─ public/
├─ package.json
├─ tsconfig.json
└─ vite.config.mjs
```

## Component System

- **Component Schema:** Defines available fields, validation, and allowed children
- **Component Content:** Actual content instances tied to schemas
- **Dynamic Forms:** Generated based on schema definitions
- **State Management:** useState and useEffect manage form state for nested components
