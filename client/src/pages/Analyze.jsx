import { useState } from "react";
import axios from "../api/axios";
import ScoreCard from "../components/ScoreCard";
import SkillGapChart from "../components/SkillGapChart";

export default function Analyze() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDesc);
    
    try {
      const { data } = await axios.post("/resume/analyze", formData);
      setResult(data.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-purple-400">
        AI Resume Analyzer
      </h1>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Upload Resume (PDF)</h2>
          <input
            type="file"
            accept=".pdf"
            onChange={e => setFile(e.target.files[0])}
            className="w-full border border-dashed border-gray-600 rounded-lg p-4"
          />
        </div>
        
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Paste Job Description</h2>
          <textarea
            rows={6}
            className="w-full bg-gray-800 rounded-lg p-3 text-sm resize-none"
            placeholder="Paste the full job description here..."
            value={jobDesc}
            onChange={e => setJobDesc(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!file || !jobDesc || loading}
        className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-xl font-semibold text-lg disabled:opacity-50"
      >
        {loading ? "Analyzing with AI..." : "Analyze Resume"}
      </button>

      {result && (
        <div className="mt-10 space-y-6">
          <ScoreCard score={result.scoreResult} />
          <SkillGapChart gaps={result.scoreResult.skill_gaps} />
        </div>
      )}
    </div>
  );
}