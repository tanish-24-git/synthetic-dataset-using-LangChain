

```markdown
# 🌌 Synthetic Dataset Generator with LangChain 🌌

Welcome to the **Synthetic Dataset Generator**! This project combines a sleek **Next.js** frontend with a **FastAPI** backend powered by **LangChain** and Google’s **Gemini 1.5 Pro** to create realistic synthetic datasets. Whether you’re testing models or exploring data, this tool has you covered! 🚀

---

## 📂 Directory Structure

```
tanish-24-git-synthetic-dataset-using-langchain.git/
├── README.md                   # 📜 Project documentation
├── eslint.config.mjs           # 🧹 ESLint configuration
├── next.config.ts              # ⚙️ Next.js configuration
├── package.json                # 📦 Project dependencies and scripts
├── postcss.config.mjs          # 🎨 PostCSS configuration for Tailwind
├── tailwind.config.ts          # 🌈 Tailwind CSS configuration
├── tsconfig.json               # 🛠️ TypeScript configuration
├── backend/                    # 🖥️ Backend folder
│   ├── main.py                 # 🐍 FastAPI app for data generation
│   └── __pycache__/            # 🗑️ Python cache (auto-generated)
├── public/                     # 📁 Static assets (empty for now)
└── src/                        # 🌟 Source code
    └── app/                    # 📱 Next.js app
        ├── globals.css         # 🎨 Global styles with Tailwind
        ├── layout.tsx          # 🏞️ Root layout for the app
        └── page.tsx            # 🖼️ Main page component
```

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

### Installation Steps
1. **Clone the Repository**  
   ```bash
   git clone https://github.com/tanish-24-git-synthetic-dataset-using-langchain.git
   cd tanish-24-git-synthetic-dataset-using-langchain
   ```

2. **Set Up the Frontend**  
   Navigate to the project root and install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set Up the Backend**  
   Navigate to the `backend/` folder, create a virtual environment, and install dependencies:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**  
   In the `backend/` folder, create a `.env` file and add your Google Gemini API key:
   ```bash
   echo "GEMINI_API_KEY=your-api-key-here" > .env
   ```

5. **Run the Backend**  
   Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

6. **Run the Frontend**  
   In a new terminal, navigate to the project root and start the Next.js app:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

7. **Access the App**  
   Open your browser and visit `http://localhost:3000` to use the app.

---

## 🚀 Usage

1. **Enter a Prompt**: Describe the dataset you want (e.g., "Generate a dataset of 100 employee records with name, age, department, and salary").
2. **Specify Row Count**: Choose how many rows of data to generate.
3. **Generate**: Click the generate button to create the dataset.
4. **Preview & Download**: View the dataset in the UI and download it as a CSV file.

---

## 🛠️ Development Notes

- **Frontend**: The Next.js app is located in `src/app/`. Customize `page.tsx` for UI changes and `globals.css` for styling.
- **Backend**: The FastAPI app in `backend/main.py` handles data generation using LangChain and Gemini 1.5 Pro.
- **Styling**: Tailwind CSS is configured in `tailwind.config.ts` and `postcss.config.mjs` for a responsive, modern look.
- **Linting**: ESLint is set up with `eslint.config.mjs` to ensure code quality.

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙌 Contributing

Contributions are welcome! Please:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

---

## 📬 Contact

For questions or feedback, reach out to the project maintainer at:
- GitHub: [tanish-24](https://github.com/tanish-24)
- Email: [your-email@example.com](mailto:your-email@example.com)

Happy data generating! 🎉
```

