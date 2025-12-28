# Student Expense Tracker 💰

A modern, full-stack expense tracking application designed for students. Manage your daily finances, track expenses, set budgets, and visualize your spending habits with a beautiful, responsive interface.

![Expense Tracker Dashboard](https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000)
*(Replace with actual screenshot)*

## ✨ Features

- **Dashboard Overview**: Visual distribution of expenses and quick actions.
- **Expense Management**: Add, edit, and delete expenses with ease.
- **Income Tracking**: Log income sources to balance your budget.
- **Smart Budgets**: Set monthly limits for specific categories.
- **Comprehensive Reports**: Export your financial data to CSV or PDF.
- **Modern UI/UX**:
    -   **Glassmorphism Design**: Premium, semi-transparent frosted glass visuals.
    -   **Themes**: Switch between **Colorful**, **Light**, and **Dark** modes.
    -   **Responsive**: Works seamlessly on desktop and mobile.
- **Profile Customization**: Update your display name and preferences.

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS (Custom Config).
- **Backend**: Node.js, Express.js.
- **Database**: SQLite (Local file-based database).
- **Icons**: Feather Icons.
- **Charts**: Chart.js.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/student-expense-tracker.git
    cd student-expense-tracker
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Build Styles** (Required for Tailwind CSS)
    ```bash
    npm run build:css
    ```

4.  **Start the Server**
    ```bash
    npm start
    ```

5.  Open your browser and visit `http://localhost:3000`.

## 🌐 Deployment

### Netlify (Frontend Only)
This project includes a `netlify.toml` for easy deployment to Netlify.

1.  **Drag and drop** this folder onto Netlify Drop, or connect your GitHub repository.
2.  **Build Settings**:
    -   Build Command: `npm run build:css`
    -   Publish Directory: `public`

**⚠️ Important**:
Netlify is a static hosting service. Deploying there will host the **Frontend UI only**. Features requiring the backend (Login, Adding Data, Profiles) **will not work** because the Node.js server and SQLite database cannot run on standard Netlify hosting.

### Full Stack Deployment (Recommended)
To run the full application (Frontend + Backend + DB), deploy to a platform that supports Node.js and persistent storage:

-   **Render / Railway / Heroku**:
    -   Deploy as a Web Service.
    -   Start Command: `npm start`.
    -   **Storage**: Since this uses SQLite (`expenses.db`), you must provision a **Persistent Disk** on your hosting provider to ensure data isn't lost on restarts.
    -   *Alternative*: Migrate the database configuration in `src/config/database.js` to use a cloud database like PostgreSQL or MySQL.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
