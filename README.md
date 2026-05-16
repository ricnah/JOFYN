# <p align="center"><img src="src/assets/logo.svg" width="100" alt="JOFYN Logo"/><br/>JOFYN</p>

<p align="center">
  <strong>Automated Career Scouting Engine</strong><br/>
  Automate your job search across multiple Indonesian platforms with Selenium.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
  <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54" alt="Python" />
  <img src="https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
  <img src="https://img.shields.io/badge/-selenium-%2343B02A?style=for-the-badge&logo=selenium&logoColor=white" alt="Selenium" />
  <img src="https://img.shields.io/badge/pandas-%23150458.svg?style=for-the-badge&logo=pandas&logoColor=white" alt="Pandas" />
</p>

---

## 🚀 Overview

**JOFYN** (Job Finder Neuron) is a powerful, automated job scouting tool designed to bridge the gap between your CV and the massive job market in Indonesia. By parsing your CV (`.doc` or `.docx`), JOFYN automatically extracts your skills and matches them against top job platforms including **Jobstreet**, **Glints**, **KitaLulus**, **Tech in Asia**, **Pintarnya**, and **LinkedIn**.

## ✨ Key Features

- **CV-Driven Search**: Upload your CV, and let the engine identify the best keywords for your profile.
- **Multi-Platform Scraper**: Automated Selenium-based scrapers for multiple job portals.
- **Advanced Filtering**: Filter by location (up to 5 cities), date range, and specific target platforms.
- **Modern Dashboard**: View results in a beautiful, glassmorphism-inspired UI with real-time progress logs.
- **Local Database**: All search results are saved locally in JSON and summarized in a Master Excel file.
- **Multi-Language Support**: Easily switch between English (Default) and Indonesian.
- **One-Click Execution**: Simple startup script that handles dependencies and launches both backend and frontend.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, i18next.
- **Backend**: Python (Flask), Selenium, python-docx, Pandas.
- **Automation**: ChromeDriver (via webdriver-manager).

## 📥 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [Python](https://www.python.org/) (v3.8+)
- [Google Chrome](https://www.google.com/chrome/) (installed on your system)

### Quick Run

1.  Clone this repository to your local machine.
2.  Open your terminal in the project directory.
3.  Run the following command:

```bash
python run_jofyn.py
```

This script will:
1.  Center the **JOFYN** ASCII welcome message in your terminal.
2.  Install all necessary Python and Node.js dependencies automatically.
3.  Start the Flask backend and the Vite development server.
4.  Open the JOFYN Dashboard in your default browser.

## 📖 Usage Guide

1.  **Upload CV**: Select your CV file (`.doc` or `.docx`). PDF is currently not supported for better parsing accuracy.
2.  **Configure Filters**:
    *   **Date Range**: Select how far back you want to search.
    *   **Location**: Type and select up to 5 target cities.
    *   **Target Nodes**: Toggle which platforms you want to scout.
3.  **Run Engine**: Click "Run Local Engine". You can watch the real-time logs in the virtual terminal.
4.  **View Results**: Once completed, browse the results in the dashboard. You can track your application status (Applied, Interview, etc.).
5.  **Access Data**: Open the `./data/` folder to see your search history in JSON or check the `MasterData.xlsx` for a consolidated view.

## 📂 Project Structure

```text
JOFYN/
├── backend/            # Python Flask Backend & Scrapers
├── src/                # React Frontend Components & Logic
├── data/               # Local JSON/Excel Storage
├── uploads/            # Temporary CV storage
├── run_jofyn.py        # Main startup script
├── package.json        # Node dependencies
├── tailwind.config.js  # UI Styling configuration
└── README.md           # This documentation
```

## 📝 License

Copyright © 2026 Ricki. All rights reserved.

---

<p align="center">
  Developed with ❤️ for job seekers in Indonesia.
</p>
