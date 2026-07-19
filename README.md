# SmartScheduler

This project is a scalable **Full-Stack** web application that automates the process of creating a weekly timetable in an educational institution. The application automatically generates weekly timetables while satisfying teacher availability, classroom occupancy, and lesson assignment constraints.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Architecture and Tech Stack](#architecture-and-tech-stack)
4. [Project Directory Structure](#project-directory-structure)
5. [Problem Approach and Algorithm Design](#problem-approach-and-algorithm-design)
6. [API Overview](#api-overview)
7. [Installation and Running Guide](#installation-and-running-guide)
8. [Database Schema](#database-schema)
9. [Future Developments](#future-developments)
10. [Highlights](#highlights)

---

## 🚀 Project Overview

Creating a timetable in educational institutions requires balancing hundreds of teachers, dozens of classes, and limited time slots. It is a Constraint Satisfaction Problem. **SmartScheduler** programmatically generates a collision-free weekly schedule, ensuring that all relational data is maintained in a centralized database.

---

## ⚙️ Key Features

### 1. Dynamic Resource Management
- **Teacher Management**: Tracking teachers' branches and personal availability hours.
- **Class Management**: Definition of all physical or virtual classes in the school.
- **Subject Management**: Managing the subjects in the curriculum from a centralized list.

### 2. Smart Distribution Algorithm
- **Lesson Assignment**: Determining which teacher will give which lesson to which classes and how many hours a week.
- **Automatic Generation**: Collision-free weekly plan fully compliant with teacher and class constraints with a single click.

### 3. Authentication & Security
- **JWT Authentication**
- **Role-Based Authorization**
- **Protected Routes**
- **Automatic Token Expiration Handling**

---

## 📦 Architecture and Tech Stack

```text
Next.js
     │
 REST API
     │
 FastAPI
     │
SQLAlchemy
     │
 PostgreSQL
```

### Frontend
- **Next.js 14 (App Router)**
- **Zustand**
- **TypeScript**
- **Tailwind CSS**

### Backend
- **FastAPI**
- **SQLAlchemy**
- **Pydantic**
- **PostgreSQL / SQLite**

---

## 📂 Project Directory Structure

```text
timetable-scheduler/
├── backend/                  # FastAPI Backend Application
│   ├── app/                  # Main application code
│   │   ├── api/              # API endpoints (routers)
│   │   ├── core/             # Core configurations (security, config)
│   │   ├── models/           # SQLAlchemy database models
│   │   ├── schemas/          # Pydantic validation schemas
│   │   ├── services/         # Business logic and algorithm implementation
│   │   └── database.py       # Database connection setup
│   ├── requirements.txt      # Python dependencies
│   └── run.py                # Application entry point
│
└── frontend/                 # Next.js Frontend Application
    ├── src/                  # Source code
    │   ├── app/              # Next.js App Router pages and layouts
    │   ├── components/       # Reusable React components (UI, Dashboard)
    │   ├── lib/              # Utility functions and axios configuration
    │   ├── store/            # Zustand global state stores
    │   └── types/            # TypeScript type definitions
    ├── public/               # Static assets
    ├── tailwind.config.ts    # Tailwind CSS configuration
    └── package.json          # Node.js dependencies
```

---

## 🧠 Problem Approach and Algorithm Design

### 1. Problem Definition
The timetable preparation problem falls into the **Constraint Satisfaction Problem (CSP)** category in computer science. In this project, the goal is to optimize teachers' busyness, classes' availability, and the weekly total hour load of lessons simultaneously.

### 2. Time Complexity
**Worst Case**: `O(A × S)`
- **A** = Total Assignments (Lessons to be taught)
- **S** = Available Slots per week

### 3. Algorithm: Greedy Randomized Search
The algorithm used in the application follows these steps:
1.  **Preparation**: All current assignments are fetched and randomized.
2.  **Constraint Check**: While searching for a suitable slot for each assignment, the following checks are made:
    -   Is the teacher in another class at that time? (Teacher Conflict)
    -   Is the teacher marked as "Busy" at that time? (Availability)
    -   Is the class full with another lesson at that time? (Class Conflict)
3.  **Placement**: If the slot is suitable, placement is made; otherwise, the next slot is tried.
4.  **Error Handling**: If placement cannot be made despite all slots being tried, a "Constraints are too tight" warning is given to the user.

### 4. Technical Decisions and Preferences
-   **Why Not Genetic Algorithm?**: Genetic algorithms are good for very large datasets (e.g., 5000+ students), but for small and medium-sized schools (e.g., 50 teachers, 20 classes), the Greedy approach gives results in milliseconds and reduces complexity.
-   **Relational Data Structure**: Instead of JSON-based storage, data integrity was ensured by establishing Foreign Key relationships between `Teacher`, `Subject`, `Class`, and `Course` tables.
-   **State Management (Zustand)**: Zustand was preferred to avoid Context API complexity and make authentication data accessible from anywhere in the app.
-   **Session Management**: **401 Unauthorized** errors returning from the API are caught centrally. When the user's session expires, the system automatically logs the user out.

---

## API Overview

Some of the core REST endpoints interacting with the client:

- `POST /token` - Obtain JWT access token
- `GET /teachers` - Retrieve list of teachers and their availability
- `POST /teachers` - Add a new teacher
- `GET /classes` - Retrieve list of all classes
- `GET /courses` - Retrieve lesson assignments
- `POST /schedule/generate` - Trigger the automatic scheduling algorithm
- `GET /schedule` - Fetch the generated timetable
- `DELETE /schedule` - Clear the current schedule

---

## Installation and Running Guide

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### Step 1: Backend Setup
```bash
cd backend
python -m venv venv
# For Windows:
venv\Scripts\activate
# For macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

**Initializing Database and Loading Seed:**
```bash
# This command creates tables and loads sample data (4 classes, 8 teachers, etc.).
python -m app.seed
```

**Starting the Server:**
```bash
uvicorn app.main:app --reload
```

### Step 2: Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The application will start running at `http://localhost:3000`.

---

## Database Schema

The application uses the **CASCADE** structure to maintain dependencies between data:
- **Subjects**: Lesson names (e.g., Math, Physics).
- **Teachers**: Teacher names and availability matrix.
- **Classes**: Class definitions (e.g., 9-A, 10-A).
- **Courses**: The bridge table representing a teacher giving a lesson to a class.
- **Schedule Entries**: Final schedule data generated by the algorithm.

*Note: When you delete a teacher or a lesson, all related assignments and schedule entries are automatically cleared.*

---

## Future Developments

While this project more than meets the basic requirements, it can be enriched with the following in the future:
1.  **Export Timetable**: Downloading the generated schedule in PDF or Excel format.
2.  **Student Management**: Assigning students to classes and viewing their personal schedules.
3.  **Constraint Optimization with Metaheuristic Algorithms**: Implementing advanced search techniques to provide a more balanced distribution.
4.  **Multi-School Support**: Multiple institutions using the same infrastructure with the SaaS model.

---

## Highlights

- ✔ Constraint Satisfaction Scheduling
- ✔ FastAPI REST API
- ✔ Next.js App Router
- ✔ Zustand State Management
- ✔ PostgreSQL / SQLite
- ✔ Responsive Dashboard
- ✔ Automatic Timetable Generation
- ✔ JWT Authentication
