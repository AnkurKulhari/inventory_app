# 📦 Inventory Management System

![Stack](https://img.shields.io/badge/Stack-React%20%2B%20FastAPI-indigo)
![Deployment](https://img.shields.io/badge/Deployment-Vercel%20%2B%20Render-success)
![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)

A robust, full-stack web application designed to seamlessly track, manage, and grow your product catalog. This project features a blazing-fast Python backend using FastAPI and a modern, responsive frontend built with React and Vite.

---

## ✨ Features

* **Complete CRUD Operations:** Easily Create, Read, Update, and Delete inventory items.
* **Real-time Search & Filtering:** Instantly find products by ID, Name, or Description.
* **Modern UI/UX:** A beautiful, responsive interface styled with Tailwind CSS, featuring subtle animations and interactive feedback.
* **Secure Database Connection:** Fully integrated with a PostgreSQL cloud database using SQLAlchemy ORM.
* **Seamless Deployment:** Configured for automated deployments (Frontend on Vercel, Backend and Database on Render).

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React (via Vite)
* **Styling:** Tailwind CSS (implied via utility classes)
* **Deployment:** Vercel

### Backend
* **Framework:** FastAPI (Python)
* **Database ORM:** SQLAlchemy
* **Server:** Uvicorn
* **Database:** PostgreSQL
* **Deployment:** Render

---

## 📂 Project Structure

This project is organized as a Monorepo, containing both the backend and frontend codebases.

```text
Inventory-Management-App/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── App.jsx           # Main React component & UI logic
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
├── database.py               # Database connection & engine setup
├── database_models.py        # SQLAlchemy table schemas
├── main.py                   # FastAPI application & REST endpoints
├── models.py                 # Pydantic models for data validation
├── requirements.txt          # Python backend dependencies
└── .gitignore                # Git ignore rules for Python & Node
