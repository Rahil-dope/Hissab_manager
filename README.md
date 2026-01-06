# Student Expense Tracker 💰

A modern, full-stack expense tracking application designed for students. Manage your daily finances, track expenses, set budgets, and visualize your spending habits with a beautiful, responsive interface.


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

## 🌐 Deployment (Demo Mode)

This project has been configured to run in **Demo Mode**, meaning it uses your browser's local storage instead of a backend database. This allows it to be hosted easily on static platforms like Netlify.

### 🚀 Deploy to Netlify
1.  **Drag and drop** this folder onto Netlify Drop, or connect your GitHub repository.
2.  **Build Settings**:
    -   Build Command: `npm run build:css`
    -   Publish Directory: `public`

**Note**: In Demo Mode, all data (users, expenses) is stored in your browser's `localStorage`. If you clear your cache or switch devices, your data will not be available.

### Full Stack (Optional)
To run with the real Node.js backend + SQLite:
1.  Revert the frontend JS files to use API `fetch` calls.
2.  Deploy to Render/Railway.

To run the full application (Frontend + Backend + DB), deploy to a platform that supports Node.js and persistent storage:

-   **Render / Railway / Heroku**:
    -   Deploy as a Web Service.
    -   Start Command: `npm start`.
    -   **Storage**: Since this uses SQLite (`expenses.db`), you must provision a **Persistent Disk** on your hosting provider to ensure data isn't lost on restarts.
    -   *Alternative*: Migrate the database configuration in `src/config/database.js` to use a cloud database like PostgreSQL or MySQL.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
