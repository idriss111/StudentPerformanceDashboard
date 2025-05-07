import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell,
    LineChart, Line,
    ScatterChart, Scatter, ZAxis
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Stats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("overview");

    

    useEffect(() => {
        axios.get("http://localhost:5238/api/Students/ml/analytics")
            .then((res) => {
                setStats(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.response?.data?.message || "Error fetching data");
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="p-4 bg-red-100 text-red-700 rounded-md max-w-md mx-auto mt-8">
            {error}
        </div>
    );

    if (!stats) return (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md max-w-md mx-auto mt-8">
            No data available
        </div>
    );

    // Data preparation
    const numericColumns = stats.columns.filter(col =>
        stats.numericStats && stats.numericStats[col.name]);

    const targetDistribution = stats.targetVariableAnalysis?.classDistribution
        ? Object.entries(stats.targetVariableAnalysis.classDistribution).map(([name, value]) => ({ name, value }))
        : [];
    

    const topCorrelations = [];
    if (stats.correlationMatrix) {
        Object.entries(stats.correlationMatrix).forEach(([col1, correlations]) => {
            Object.entries(correlations).forEach(([col2, value]) => {
                if (col1 !== col2 && Math.abs(value) > 0.3) {
                    topCorrelations.push({
                        feature1: col1,
                        feature2: col2,
                        correlation: value
                    });
                }
            });
        });
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Student Performance Analytics
            </h1>

            {/* Navigation Tabs */}
            <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
                {["overview", "grades", "features", "correlations"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-md font-medium whitespace-nowrap ${activeTab === tab
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
                <div className="space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-gray-500 font-medium">Train Samples</h3>
                            <p className="text-3xl font-bold text-blue-600">{stats.trainRowCount}</p>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-gray-500 font-medium">Features</h3>
                            <p className="text-3xl font-bold text-purple-600">{stats.columns.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-gray-500 font-medium">Numeric Features</h3>
                            <p className="text-3xl font-bold text-orange-600">{numericColumns.length}</p>
                        </div>
                    </div>

                    {/* Data Preview */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Data Preview</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {stats.columns.slice(0, 37).map((col) => (
                                            <th
                                                key={col.name}
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                {col.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {stats.trainPreview.slice(0, 37).map((row, i) => (
                                        <tr key={i}>
                                            {stats.columns.slice(0, 37).map((col) => (
                                                <td key={col.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {row[col.name]?.toString() || 'null'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Grades Tab */}
            {activeTab === "grades" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pie Charts Column */}
                    <div className="space-y-8">
                        {/* Target Distribution Pie */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Grade Distribution</h2>
                            <div className="h-80 relative">
                                {targetDistribution?.length > 0 ? (
                                    <ResponsiveContainer width="99%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={targetDistribution}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {targetDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => [`Count: ${value}`, 'Students']} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="text-gray-400">No grade data available</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
            
                       

                    {/* Bar Chart Column */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Grade Statistics</h2>
                        <div className="h-80 relative">
                            {targetDistribution?.length > 0 ? (
                                <ResponsiveContainer width="99%" height="100%">
                                    <BarChart
                                        data={targetDistribution}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="name"
                                            angle={-45}
                                            textAnchor="end"
                                            height={60}
                                        />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                            dataKey="value"
                                            name="Students"
                                            fill="#8884d8"
                                            animationDuration={1500}
                                        >
                                            {targetDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-gray-400">No statistics available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}            {/* Features Tab */}
            

            // Features Tab
          {activeTab === "features" && (
  <div className="space-y-8">
    <h2 className="text-2xl font-semibold text-gray-800">Feature Distributions</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {numericColumns.slice(0, 4).map((col) => {
        const columnStats = stats.numericStats[col.name];
        const histogramData = columnStats?.histogram
          ? Object.entries(columnStats.histogram).map(([bin, count]) => ({
              name: bin,
              value: count
            }))
          : [];

        return (
          <div key={col.name} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800 mb-4">{col.name}</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Histogram */}
              <div className="h-64">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Histogram</h4>
                {histogramData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="90%">
                    <BarChart
                      data={histogramData}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" name="Frequency" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    No histogram data
                  </div>
                )}
              </div>

              {/* Pie Chart: Only if column is "Familienstand" */}
              {col.name === "Familienstand" && (
                <div className="h-64">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Distribution</h4>
                  {histogramData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="90%">
                      <PieChart>
                        <Pie
                          data={histogramData}
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          innerRadius={40}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {histogramData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${value}`, name]} />
                        <Legend
                          layout="vertical"
                          verticalAlign="middle"
                          align="right"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      No distribution data
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Stats Summary (unchanged) */}
            <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
              {/* ... keep your existing stats summary code ... */}
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}


            {/* Correlations Tab */}
            {/* Correlations Tab */}
            {activeTab === "correlations" && (
                <div className="space-y-8">
                    {/* Correlation Matrix */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Feature Correlation Matrix</h2>
                        <div className="h-[600px] overflow-auto">
                            {stats.correlationMatrix ? (
                                <table className="min-w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="p-2 border bg-gray-100 sticky top-0 z-10"></th>
                                            {Object.keys(stats.correlationMatrix).map(col => (
                                                <th key={col} className="p-2 border bg-gray-100 text-xs whitespace-nowrap sticky top-0 z-10">
                                                    {col}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(stats.correlationMatrix).map(([rowName, correlations]) => (
                                            <tr key={rowName}>
                                                <td className="p-2 border bg-gray-100 text-xs whitespace-nowrap sticky left-0">
                                                    {rowName}
                                                </td>
                                                {Object.entries(correlations).map(([colName, value]) => {
                                                    const absValue = Math.abs(value);
                                                    const intensity = Math.min(9, Math.floor(absValue * 10));
                                                    const colorClass = value > 0
                                                        ? `bg-blue-${100 + intensity * 100}`
                                                        : `bg-red-${100 + intensity * 100}`;

                                                    return (
                                                        <td
                                                            key={colName}
                                                            className={`p-2 border text-center ${colorClass} text-white`}
                                                            title={`${rowName} vs ${colName}: ${value.toFixed(2)}`}
                                                        >
                                                            {value.toFixed(2)}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="flex items-center justify-center h-64 text-gray-500">
                                    No correlation data available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top Correlations */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Strongest Correlations</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {stats.correlationMatrix ? (
                                Object.entries(stats.correlationMatrix)
                                    .flatMap(([col1, correlations]) =>
                                        Object.entries(correlations)
                                            .filter(([col2]) => col1 !== col2)
                                            .map(([col2, value]) => ({ col1, col2, value }))
                                    )
                                    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
                                    .slice(0, 8)
                                    .map((corr, index) => (
                                        <div key={index} className="border p-4 rounded-lg hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-medium">{corr.col1}</span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${corr.value > 0 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {corr.value > 0 ? 'Positive' : 'Negative'}
                                                </span>
                                                <span className="font-medium">{corr.col2}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className={`h-2.5 rounded-full ${corr.value > 0 ? 'bg-blue-600' : 'bg-red-600'
                                                            }`}
                                                        style={{ width: `${Math.abs(corr.value) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="ml-2 text-sm font-medium">
                                                    {corr.value.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <div className="col-span-2 flex items-center justify-center h-32 text-gray-500">
                                    No correlation data available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}        </div>
    );
}