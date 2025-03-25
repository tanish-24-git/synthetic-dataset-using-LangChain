"use client";
import { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { saveAs } from "file-saver";

type DatasetRow = Record<string, string | number>;

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [rows, setRows] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dataset, setDataset] = useState<DatasetRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [showDataset, setShowDataset] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"generate" | "view">("generate");

  const examplePrompts = [
    "Generate employees with name, age, department, salary",
    "Create a dataset of products with name, category, price, and stock quantity",
    "Generate customer data with name, email, purchase amount, and loyalty status",
    "Create a dataset of cities with name, country, population, and climate",
  ];

  const handleGenerateData = async () => {
    setLoading(true);
    setError(null);
    setShowDataset(false);

    try {
      const response = await axios.post(
        "http://localhost:8000/generate-data",
        { prompt, rows },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "text/csv" });
      const text = await blob.text();
      const parsedData = parseCSV(text);

      if (parsedData.length > 0) {
        setHeaders(Object.keys(parsedData[0]));
        setDataset(parsedData);
        setShowDataset(true);
        setActiveTab("view");
      } else {
        setError("No valid data returned from the server.");
      }

      saveAs(blob, "synthetic_data.csv");
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError
          ? err.response?.data?.detail || "Network error: Ensure the backend is running at http://localhost:8000."
          : "An unexpected error occurred.";
      setError(errorMessage);
      console.error("Error generating data:", err);
    } finally {
      setLoading(false);
    }
  };

  const parseCSV = (csvText: string): DatasetRow[] => {
    const lines = csvText.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim());
    const result: DatasetRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const values = lines[i].split(",").map((v) => v.trim());
      if (values.length !== headers.length) continue;

      const row: DatasetRow = {};
      headers.forEach((header, index) => {
        const value = values[index] || "";
        row[header] = isNaN(Number(value)) ? value : Number(value);
      });
      result.push(row);
    }

    return result;
  };

  const downloadCSV = () => {
    if (dataset.length === 0) return;

    const csvContent = [
      headers.join(","),
      ...dataset.map((row) => headers.map((header) => row[header]).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    saveAs(blob, "synthetic_data.csv");
  };

  const handleExamplePromptClick = useCallback(
    (examplePrompt: string) => {
      setPrompt(examplePrompt);
    },
    []
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-4xl gradient-border p-1">
        <div className="bg-card text-card-foreground p-6 rounded-md">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Synthetic Dataset Generator
            </h1>
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded-md transition-all ${
                  activeTab === "generate"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                onClick={() => setActiveTab("generate")}
              >
                Generate
              </button>
              <button
                className={`px-4 py-2 rounded-md transition-all ${
                  activeTab === "view"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                onClick={() => setActiveTab("view")}
                disabled={dataset.length === 0}
              >
                View Data
              </button>
            </div>
          </div>

          {activeTab === "generate" && (
            <div className="space-y-6">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium mb-2 text-foreground">
                  Dataset Description
                </label>
                <textarea
                  id="prompt"
                  className="w-full p-3 bg-muted text-foreground border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-70 resize-none"
                  rows={4}
                  placeholder="e.g., 'Generate employees with name, age, department, salary'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <p className="text-sm font-medium mb-2 text-foreground">Example Prompts:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {examplePrompts.map((examplePrompt, index) => (
                    <button
                      key={index}
                      className="text-left p-2 text-sm bg-muted/50 hover:bg-muted rounded-md truncate text-foreground"
                      onClick={() => handleExamplePromptClick(examplePrompt)}
                      disabled={loading}
                    >
                      {examplePrompt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="rows" className="block text-sm font-medium mb-2 text-foreground">
                  Number of Rows
                </label>
                <input
                  id="rows"
                  type="number"
                  className="w-full p-3 bg-muted text-foreground border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-70 no-arrows"
                  placeholder="Enter number of rows"
                  value={rows}
                  onChange={(e) => setRows(Math.max(1, Number.parseInt(e.target.value) || 1))}
                  min={1}
                  disabled={loading}
                />
              </div>

              <button
                className="w-full py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50 transition-all"
                onClick={handleGenerateData}
                disabled={loading || !prompt.trim() || rows < 1}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Generating...
                  </div>
                ) : (
                  "Generate Dataset"
                )}
              </button>

              {error && (
                <div className="p-3 bg-destructive/20 border border-destructive text-destructive rounded-md">
                  {error}
                </div>
              )}
            </div>
          )}

          {activeTab === "view" && dataset.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-foreground">Generated Dataset</h2>
                <button
                  onClick={downloadCSV}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Download CSV
                </button>
              </div>

              <div className="max-h-[500px] overflow-auto scrollbar rounded-md border border-border">
                <table className="data-table">
                  <thead>
                    <tr>
                      {headers.map((header, index) => (
                        <th key={index} className="text-foreground">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataset.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {headers.map((header, colIndex) => (
                          <td key={`${rowIndex}-${colIndex}`} className="text-foreground">
                            {row[header]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Total rows: {dataset.length}</p>
                <p>Columns: {headers.join(", ")}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>Powered by LangChain and Gemini 1.5 Pro</p>
      </footer>
    </main>
  );
}