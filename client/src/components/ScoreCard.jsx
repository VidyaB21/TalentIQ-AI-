import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

export default function ScoreCard({ score }) {
  const data = [{ value: score.overall_score, fill: "#a855f7" }];
  
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
      <h2 className="text-xl font-bold mb-6 text-purple-300">Overall Match Score</h2>
      
      <div className="flex items-center gap-12">
        <div className="w-48 h-48">
          <ResponsiveContainer>
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={10} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <p className="text-6xl font-bold text-purple-400">{score.overall_score}%</p>
          <p className="text-2xl font-semibold text-white mt-2">Grade: {score.grade}</p>
          <p className="text-gray-400 mt-2">{score.summary}</p>
        </div>
        
        <div className="ml-auto space-y-4">
          <div className="bg-green-900/30 border border-green-700 rounded-xl p-4">
            <p className="text-green-400 font-semibold">✓ Matched Skills</p>
            <p className="text-2xl font-bold">{score.skill_gaps.matched_skills.length}</p>
          </div>
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-4">
            <p className="text-red-400 font-semibold">✗ Missing Skills</p>
            <p className="text-2xl font-bold">{score.skill_gaps.missing_skills.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}