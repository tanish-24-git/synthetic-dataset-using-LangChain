# 🌌 Synthetic Dataset Generator with LangChain 🌌

Welcome to the **Synthetic Dataset Generator**! This project combines a sleek **Next.js** frontend with a **FastAPI** backend powered by **LangChain** and Google’s **Gemini 1.5 Pro** to create realistic synthetic datasets. Whether you’re testing models or exploring data, this tool has you covered! 🚀

---

## 📂 Directory Structure

Here’s what’s inside the magic box:
tanish-24-git-synthetic-dataset-using-langchain.git/
'''
├── README.md               # 📜 You’re reading it!
├── eslint.config.mjs       # 🧹 ESLint configuration
├── next.config.ts          # ⚙️ Next.js configuration
├── package.json            # 📦 Project dependencies and scripts
├── postcss.config.mjs      # 🎨 PostCSS configuration for Tailwind
├── tailwind.config.ts      # 🌈 Tailwind CSS configuration
├── tsconfig.json           # 🛠️ TypeScript configuration
├── backend/                # 🖥️ Backend folder
│   ├── main.py             # 🐍 FastAPI app for data generation
│   └── pycache/        # 🗑️ Python cache (auto-generated)
├── public/                 # 📁 Static assets (empty for now)
└── src/                    # 🌟 Source code
└── app/                # 📱 Next.js app
├── globals.css     # 🎨 Global styles with Tailwind
├── layout.tsx      # 🏞️ Root layout for the app
└── page.tsx        # 🖼️ Main page component

'''
---

## 📜 Project Overview

This project lets you generate synthetic datasets with a few clicks:
- **Frontend**: Built with Next.js, React, and Tailwind CSS for a modern, responsive UI.
- **Backend**: A FastAPI server using LangChain and Gemini 1.5 Pro to generate CSV data.
- **Features**: Input a prompt, specify row count, preview the dataset, and download it as CSV.

### Key Highlights
- **Dynamic Data**: Generate datasets like employee records, product lists, or city stats.
- **Interactive UI**: Tabs for generating and viewing data, with a sleek gradient design.
- **Scalable**: Handles large datasets with batch processing and streaming responses.

---

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.8+)
- **npm** or **yarn**
- A **Google Gemini API Key** (add to `.env` in `backend/`)

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/tanish-24-git-synthetic-dataset-using-langchain/your-repo-name.git
   cd tanish-24-git-synthetic-dataset-using-langchain.git
