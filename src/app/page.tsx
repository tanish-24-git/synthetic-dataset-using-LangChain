"use client";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { saveAs } from "file-saver";

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [rows, setRows] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:8000/generate-data",
        { prompt, rows },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "text/csv" });
      saveAs(blob, "synthetic_data.csv");
    } catch (err) {
      const errorMessage = err instanceof AxiosError
        ? err.response?.data?.detail || "An error occurred while generating data."
        : "An unexpected error occurred.";
      setError(errorMessage);
      console.error("Error generating data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Synthetic Data Generator</h1>

        <div className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
              Dataset Description
            </label>
            <textarea
              id="prompt"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              rows={4}
              placeholder="e.g., 'Generate employees with name, age, department, salary'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="rows" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Rows
            </label>
            <input
              id="rows"
              type="number"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="Enter number of rows"
              value={rows}
              onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              disabled={loading}
            />
          </div>

          <button
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            onClick={handleGenerateData}
            disabled={loading || !prompt.trim() || rows < 1}
          >
            {loading ? "Generating..." : "Generate & Download CSV"}
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}
        </div>
      </div>
    </main>
  );
}