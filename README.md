# Timetable Scheduler - Smart Lesson Program Management System

This project is a modern, scalable, and user-centric **Full-Stack** web application that automates the process of creating a weekly timetable in an educational institution. It was developed to digitalize administrative processes and increase operational efficiency.

---

## 📖 Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technical Architecture and Tech Stack](#technical-architecture-and-tech-stack)
4. [Problem Approach and Algorithm Design](#problem-approach-and-algorithm-design)
5. [Installation and Running Guide](#installation-and-running-guide)
6. [Database Schema and Relational Structure](#database-schema-and-relational-structure)
7. [User Experience and UI Decisions](#user-experience-and-ui-decisions)
8. [Future Developments and Roadmap](#future-developments-and-roadmap)

---

## 🚀 Project Overview

Creating a timetable in educational institutions requires balancing hundreds of teachers, dozens of classes, and limited time slots. It is a process with a high margin of error. **Timetable Scheduler** is designed as a digital assistant that solves this complex process in seconds. The application not only works as a schedule generator but also acts as an Enterprise Resource Planning (ERP) module, ensuring that all data is safely stored in a relational database.

---

## ✨ Key Features

### 1. Dynamic Resource Management
- **Teacher Management**: Tracking teachers' branches and personal availability hours.
- **Class Management**: Definition of all physical or virtual classes in the school.
- **Subject Management**: Managing the subjects in the curriculum from a centralized list.

### 2. Smart Distribution Algorithm
- **Lesson Assignment**: Determining which teacher will give which lesson to which classes and how many hours a week.
- **Automatic Generation**: Collision-free weekly plan fully compliant with teacher and class constraints with a single click.

### 3. Modern Dashboard and Visualization
- **Responsive Design**: Fully compatible on desktop, tablet, and mobile devices.
- **Advanced Grid View**: Instant tracking of the weekly schedule with class-based filtering.
- **Live Notifications**: Instant feedback of operation results (success/error).

---

## 🛠 Technical Architecture and Tech Stack

### Frontend: Modern and Fast
- **Next.js 14 (App Router)**: Preferred for SSR (Server Side Rendering) and fast page transitions.
- **Zustand**: Used as a performant alternative for global state management (Auth, User Roles) and persist storage operations.
- **TypeScript**: Minimized errors during development thanks to type safety.
- **Tailwind CSS**: Used to build modern UI components quickly and efficiently.
- **Lucide Icons**: Modern and minimalist icon sets.
- **Sonner**: User-friendly toast notifications.

### Backend: Powerful and Flexible
- **FastAPI**: Preferred as one of the fastest Python-based web frameworks.
- **SQLAlchemy**: Used to manage database operations via ORM and prevent security vulnerabilities.
- **Pydantic**: Plays a critical role in data validation and API documentation.
- **PostgreSQL / SQLite**: Used to maintain the relational data structure.

---

## 🧠 Problem Approach and Algorithm Design

### 1. Problem Definition
The timetable preparation problem falls into the **Constraint Satisfaction Problem (CSP)** category in computer science. In this project, the goal is to optimize teachers' busyness, classes' availability, and the weekly total hour load of lessons simultaneously.

### 2. Algorithm: Greedy Randomized Search
The algorithm used in the application follows these steps:
1.  **Preparation**: All current assignments are fetched and randomized.
2.  **Constraint Check**: While searching for a suitable slot for each assignment, the following checks are made:
    -   Is the teacher in another class at that time? (Teacher Conflict)
    -   Is the teacher marked as "Busy" at that time? (Availability)
    -   Is the class full with another lesson at that time? (Class Conflict)
3.  **Placement**: If the slot is suitable, placement is made; otherwise, the next slot is tried.
4.  **Error Handling**: If placement cannot be made despite all slots being tried, a "Constraints are too tight" warning is given to the user.

### 3. Technical Decisions and Preferences
-   **Why Not Genetic Algorithm?**: Genetic algorithms are good for very large datasets (e.g., 5000+ students), but for small and medium-sized schools (e.g., 50 teachers, 20 classes), the Greedy approach gives results in milliseconds and reduces complexity.
-   **Relational Data Structure**: Instead of JSON-based storage, data integrity was ensured by establishing Foreign Key relationships between `Teacher`, `Subject`, `Class`, and `Course` tables.
-   **State Management (Zustand)**: Zustand was preferred to avoid Context API complexity and make authentication data (JWT, user roles) accessible from anywhere in the app. LocalStorage integration ensures session retention even if the page is refreshed.
-   **Session Management**: **401 Unauthorized** errors returning from the API are caught centrally. When the user's session expires (token expire), the system automatically logs the user out and redirects them to the login screen, ensuring security.

---

## 🏗 Installation and Running Guide

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

## 📊 Database Schema

The application uses the **CASCADE** structure to maintain dependencies between data:
- **Subjects**: Lesson names (e.g., Math, Physics).
- **Teachers**: Teacher names and availability matrix.
- **Classes**: Class definitions (e.g., 9-A, 10-A).
- **Courses**: The bridge table representing a teacher giving a lesson to a class.
- **Schedule Entries**: Final schedule data generated by the algorithm.

*Note: When you delete a teacher or a lesson, all related assignments and schedule entries are automatically cleared.*

---

## 🎨 User Experience and UI Decisions

- **Glassmorphism Effect**: Semi-transparent (blur) backgrounds were used to make the Dashboard look modern and spacious.
- **Sidebar and Navigation**: The menu, which is fixed on the left on desktop, turns into a hamburger menu on mobile, optimizing screen space.
- **Real-Time Feedback**: Loading animations on buttons during API calls and colorful toast messages afterwards are used.
- **Selectable Class View**: Instead of seeing the entire school at once, the user filters by class, preventing clutter.

---

## 🔮 Future Developments and Roadmap

While this project more than meets the basic requirements, it can be enriched with the following in the future:
1.  **Export Timetable**: Downloading the generated schedule in PDF or Excel format.
2.  **Student Management**: Assigning students to classes and viewing their personal schedules.
3.  **AI Integration**: A heuristic model that distributes the schedule more balancedly (e.g., putting Math lessons in the morning hours).
4.  **Multi-School Support**: Multiple institutions using the same infrastructure with the SaaS model.
