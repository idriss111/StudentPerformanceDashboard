import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    RiMenuLine,
    RiHome2Line,
    RiSearchLine,
    RiArticleLine,
    RiNotificationLine,
    RiBarChart2Line
} from 'react-icons/ri';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import axios from "axios";

const COLORS = ['#4DC7C3', '#FF0000', '#00549e'];

const StudentDashboard = () => {
    // Hooks must be called in the same order every render
    // 1. Router hooks
    const location = useLocation();
    const navigate = useNavigate();

    // 2. State hooks
    const [userData, setUserData] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedDropdown, setSelectedDropdown] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("grades");
    const [trainingMetrics, setTrainingMetrics] = useState(null);


    // 3. Memoized calculations (must be before any conditional returns)
    const topAssociations = useMemo(() => {
        if (!stats?.cramersvMatrix) return [];

        const associations = [];
        const processedPairs = new Set();

        Object.entries(stats.cramersvMatrix).forEach(([feature1, values]) => {
            Object.entries(values).forEach(([feature2, value]) => {
                const pairKey = [feature1, feature2].sort().join('|');
                if (feature1 !== feature2 && !processedPairs.has(pairKey)) {
                    processedPairs.add(pairKey);
                    associations.push({
                        feature1,
                        feature2,
                        value
                    });
                }
            });
        });

        return associations.sort((a, b) => b.value - a.value);
    }, [stats?.cramersvMatrix]);

    const topCorrelations = useMemo(() => {
        if (!stats?.correlationMatrix) return [];

        const correlations = [];
        Object.entries(stats.correlationMatrix).forEach(([col1, correlationsMap]) => {
            Object.entries(correlationsMap).forEach(([col2, value]) => {
                if (col1 !== col2 && Math.abs(value) >= 0.24) {
                    correlations.push({
                        feature1: col1,
                        feature2: col2,
                        correlation: value
                    });
                }
            });
        });
        return correlations;
    }, [stats?.correlationMatrix]);

    // 4. Effects (after all state declarations)
    useEffect(() => {
        const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');

        if (!authToken || !storedUserData) {
            navigate('/login');
            return;
        }

        try {
            setUserData(JSON.parse(storedUserData));
        } catch (error) {
            console.error('Error parsing user data:', error);
            navigate('/login');
        }
    }, [navigate]);

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
    const trainModel = async () => {
        try {
            const res = await fetch("http://localhost:5238/api/Students/ml/train", {
                method: "POST",
            });

            const data = await res.json();

            if (res.ok && data.metrics) {
                setTrainingMetrics(data.metrics); // This is the key
            } else {
                console.error("Training error:", data.errors || "Unexpected response");
                setTrainingMetrics(null);
            }
        } catch (error) {
            console.error("Training failed", error);
            setTrainingMetrics(null);
        }
    };
    useEffect(() => {
        if (activeTab === "ML") {
            trainModel();
        }
    }, [activeTab]);




    // 5. Other variables and functions
    const colors = {
        primary: 'rgb(0, 177, 172)',
        primaryDark: 'rgb(0, 0, 0)',
        primaryLight: 'rgb(255, 255, 255)',
        secondary: '#E6E6E6',
        accent: '#FFD700',
        white: '#FFFFFF',
        black: '#000000',
    };

    const numericColumns = stats?.columns?.filter(col => stats.numericStats && stats.numericStats[col.name]) || [];
    const targetDistribution = stats?.targetVariableAnalysis?.classDistribution
        ? Object.entries(stats.targetVariableAnalysis.classDistribution).map(([name, value]) => ({ name, value }))
        : [];

    // 6. Handler functions
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleDropdown = (dropdown) => {
        setSelectedDropdown(selectedDropdown === dropdown ? null : dropdown);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userData');
        navigate('/', { replace: true });
    };

    // 7. Conditional rendering (must be after all hooks)
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00549e]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-100 text-red-700 rounded-md max-w-md mx-auto mt-8">
                {error}
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md max-w-md mx-auto mt-8">
                No data available
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row text-gray-800 font-inter min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className={`w-64 h-full bg-[#00b1ac] text-white p-4 z-50 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} md:sticky md:top-0 md:h-screen`}>                <div className="mb-6">
                    <img src="./FHAachen-logo2010.svg.png" alt="FH Aachen" className="h-12" />
                </div>
                <div className="text-white font-semibold mb-4">Hallo, {userData?.firstName}</div>
                <nav className="space-y-2">
                    {[
                        { key: 'overview', icon: <RiHome2Line />, label: 'Dashboard' },
                        { key: 'grades', icon: <RiBarChart2Line />, label: 'Target grades' },
                        { key: 'features', icon: <RiArticleLine />, label: 'Features' },
                        { key: 'correlations', icon: <RiArticleLine />, label: 'Correlation Matrix' },
                        { key: 'relationships', icon: <RiArticleLine />, label: 'Correlation Ratios' },
                        { key: 'cramersv', icon: <RiArticleLine />, label: 'Cramers Assosiation' },
                        { key: 'ML', icon: <RiArticleLine />, label: 'Random Forest Model' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            className={`flex items-center w-full px-4 py-2 rounded-md hover:bg-[#003366] transition-colors ${activeTab === tab.key ? 'bg-[#003366]' : ''}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            <span className="mr-3">{tab.icon}</span>{tab.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col ">
                {/* Top Navigation */}
                <header className="flex justify-between items-center p-4 bg-white shadow sticky top-0 z-30 border-b border-gray-200">
                    <button className="text-xl text-[#00549e]" onClick={toggleSidebar}>
                        <RiMenuLine />
                    </button>
                    <div className="relative w-1/2">
                        <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:border-[#00549e] focus:ring-1 focus:ring-[#00549e]"
                            placeholder="Search..."
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2 rounded-full hover:bg-gray-100 text-[#00549e]">
                            <RiNotificationLine className="text-xl" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => toggleDropdown('profile')}
                                className="w-8 h-8 rounded-full bg-[#00b1ac] text-white flex items-center justify-center"
                            >
                                {userData?.firstName?.charAt(0)}
                            </button>
                            {selectedDropdown === 'profile' && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md">
                                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 text-[#00549e]">Profile</a>
                                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 text-[#00549e]">Settings</a>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-[#00549e]">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content Area */}
               
                    {/* Tabs */}
                    

                    {/* Tab Content */}
                    <div className="space-y-6">
                        {/* Overview Tab */}
                        {activeTab === "overview" && (
                            <div className="space-y-8">
                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                        <h3 className="text-gray-500 font-medium">Train Samples</h3>
                                        <p className="text-3xl font-bold text-[#00549e]">{stats.trainRowCount}</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                        <h3 className="text-gray-500 font-medium">Features</h3>
                                        <p className="text-3xl font-bold text-[#00549e]">{stats.columns.length}</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                        <h3 className="text-gray-500 font-medium">Numeric Features</h3>
                                        <p className="text-3xl font-bold text-[#00549e]">{numericColumns.length}</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                        <h3 className="text-gray-500 font-medium">Target Classes</h3>
                                        <p className="text-3xl font-bold text-[#00549e]">{targetDistribution.length}</p>
                                    </div>
                                </div>

                                {/* Data Preview */}
                                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Data Preview</h2>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    {stats.columns.slice(0, 26).map((col) => (
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
                                                {stats.trainPreview.slice(0, 26).map((row, i) => (
                                                    <tr key={i}>
                                                        {stats.columns.slice(0, 26).map((col) => (
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
                                {/* Pie Chart */}
                                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Grade Distribution</h2>
                                    <div className="h-80 relative">
                                        {targetDistribution?.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
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

                                {/* Bar Chart */}
                                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Grade Statistics</h2>
                                    <div className="h-80 relative">
                                        {targetDistribution?.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
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
                        )}

                        {/* Features Tab */}
                        {activeTab === "features" && (
                            <div className="space-y-8">
                                <h2 className="text-2xl font-semibold text-gray-800">Feature Distributions</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {numericColumns.slice(0, 10).map((col) => {
                                        const columnStats = stats.numericStats[col.name];
                                        const histogramData = columnStats?.histogram
                                            ? Object.entries(columnStats.histogram).map(([bin, count]) => ({
                                                name: bin,
                                                value: count
                                            }))
                                            : [];

                                        return (
                                            <div key={col.name} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
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

                                                    {/* Stats Summary */}
                                                    <div className="space-y-2">
                                                        <h4 className="text-sm font-medium text-gray-500">Statistics</h4>
                                                        <div className="text-sm">
                                                            <div className="flex justify-between">
                                                                <span>Mean:</span>
                                                                <span>{columnStats?.mean?.toFixed(2) || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>Median:</span>
                                                                <span>{columnStats?.median?.toFixed(2) || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>Std Dev:</span>
                                                                <span>{columnStats?.stdDev?.toFixed(2) || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>Min:</span>
                                                                <span>{columnStats?.min?.toFixed(2) || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>Max:</span>
                                                                <span>{columnStats?.max?.toFixed(2) || 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Correlations Tab */}
                        {activeTab === "correlations" && (
                            <div className="space-y-8">
                                {/* Correlation Matrix */}
                                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Feature Correlation Matrix</h2>
                                    <div className="h-[600px] overflow-auto">
                                        {stats.correlationMatrix ? (
                                            <table className="min-w-full border-collapse">
                                                <thead>
                                                    <tr>
                                                        <th className="p-2 border bg-gray-100 sticky top-0 z-10"></th>
                                                        {Object.keys(stats.correlationMatrix).slice(0, 27).map(col => (
                                                            <th key={col} className="p-2 border bg-gray-100 text-xs whitespace-nowrap sticky top-0 z-10">
                                                                {col}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Object.entries(stats.correlationMatrix).slice(0, 27).map(([rowName, correlations]) => (
                                                        <tr key={rowName}>
                                                            <td className="p-2 border bg-gray-100 text-xs whitespace-nowrap sticky left-0">
                                                                {rowName}
                                                            </td>
                                                            {Object.entries(correlations).slice(0, 27).map(([colName, value]) => {
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
                            <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
                                <h2 className="text-base font-semibold mb-3 text-gray-800">Strong Correlations</h2>
                                <div className="flex flex-wrap gap-3">
                                    {topCorrelations
                                        .filter(corr =>
                                            corr.feature2 === "Target" )
                                        .map((corr, index) => {
                                            // Smart label formatting
                                            const formatFeatureName = (name) => {
                                                if (name.length > 15) {
                                                    return name.split(/(?=[A-Z])/).join(' ');
                                                }
                                                return name;
                                            };

                                            const feature1 = formatFeatureName(corr.feature1);
                                            const feature2 = formatFeatureName(corr.feature2);

                                            return (
                                                <div key={index} className="border p-2 rounded-lg hover:shadow-sm transition-shadow min-w-[180px] max-w-[220px] flex flex-col">
                                                    {/* Two-line feature names */}
                                                    <div className="mb-1.5 min-h-[40px]">
                                                        <div className="text-xs leading-tight line-clamp-2 break-all"
                                                            title={`${corr.feature1} ↔ ${corr.feature2}`}>
                                                            <span className="font-bold">{feature1.replace(/([A-ZÄÖÜ][a-zäöüß]+)/g, '$1 ')}</span>
                                                            <span> ↔ </span>
                                                            <span className="font-bold">{feature2.replace(/([A-ZÄÖÜ][a-zäöüß]+)/g, '$1 ')}</span>
                                                        </div>
                                                    </div>

                                                    {/* Correlation bar */}
                                                    <div className="mt-auto">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className={`text-[10px] ${corr.correlation > 0 ? 'text-teal-800' : 'text-red-800'}`}>
                                                                {corr.correlation > 0 ? 'Positive' : 'Negative'}
                                                            </span>
                                                            <span className="text-[10px] font-medium">
                                                                {corr.correlation.toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                            <div
                                                                className={`h-1.5 rounded-full ${corr.correlation > 0 ? 'bg-[#4DC7C3]' : 'bg-red-600'}`}
                                                                style={{ width: `${Math.abs(corr.correlation) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                           


                            


                          </div>
                    )}
                        {activeTab === "relationships" && (
                        
                    
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Correlation Ratios (η)</h2>

                            {stats.featureTargetAnalysis && (
                                <div className="space-y-6">
                                    

                                    {/* Correlation Ratios */}
                                    <div>
                                        <h3 className="font-medium mb-2"></h3>
                                        {Object.entries(stats.featureTargetAnalysis.correlationRatios)
                                            .sort((a, b) => b[1] - a[1])
                                            .map(([feature, value]) => (
                                                <div key={`eta-${feature}`} className="mb-3">
                                                    <div className="flex justify-between mb-1">
                                                        <span>{feature}</span>
                                                        <span className="font-mono">{value.toFixed(3)}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-green-500 h-2 rounded-full"
                                                            style={{ width: `${value * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    
                    
                    
                    
                    
                    
                    )}
                    {activeTab === "cramersv" && (
                        <div className="space-y-8">
                            {/* Cramér's V Matrix */}
                            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">Cramer's V Association Matrix</h2>
                                <div className="h-[600px] overflow-auto">
                                    {stats?.cramersvMatrix ? (
                                        Object.keys(stats.cramersvMatrix).length > 0 ? (
                                            <table className="min-w-full border-collapse">
                                                <thead>
                                                    <tr>
                                                        <th className="p-2 border bg-gray-100 sticky top-0 z-10"></th>
                                                        {Object.keys(stats.cramersvMatrix).slice(0, 25).map(col => (
                                                            <th key={col} className="p-2 border bg-gray-100 text-xs whitespace-nowrap sticky top-0 z-10">
                                                                {col}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Object.entries(stats.cramersvMatrix).slice(0, 26).map(([rowName, associations]) => (
                                                        <tr key={rowName}>
                                                            <td className="p-2 border bg-gray-100 text-xs whitespace-nowrap sticky left-0">
                                                                {rowName}
                                                            </td>
                                                            {Object.entries(associations).slice(0, 26).map(([colName, value]) => {
                                                                const numericValue = Number(value);
                                                                const isValidValue = !isNaN(numericValue) && numericValue >= 0 && numericValue <= 1;

                                                                const intensity = isValidValue ? Math.min(9, Math.floor(numericValue * 10)) : 0;
                                                                const bgColor = `hsl(270, ${50 + intensity * 5}%, ${70 - intensity * 5}%)`;

                                                                return (
                                                                    <td
                                                                        key={colName}
                                                                        style={{
                                                                            backgroundColor: isValidValue ? bgColor : '#f3f4f6',
                                                                            color: isValidValue ? 'white' : 'black'
                                                                        }}
                                                                        className="p-2 border text-center"
                                                                        title={`${rowName} ↔ ${colName}: ${isValidValue ? numericValue.toFixed(2) : 'N/A'}`}
                                                                    >
                                                                        {isValidValue ? numericValue.toFixed(2) : 'N/A'}
                                                                    </td>
                                                                );
                                                            })}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="flex items-center justify-center h-64 text-gray-500">
                                                Matrix exists but contains no data (0 keys)
                                            </div>
                                        )
                                    ) : (
                                        <div className="flex items-center justify-center h-64 text-gray-500">
                                            {stats ? "cramersvMatrix property not found" : "No stats data loaded"}
                                        </div>
                                    )}
                                </div>
                            </div>



                            <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
                                <h2 className="text-base font-semibold mb-3 text-gray-800">Strong Associations</h2>
                                <div className="flex flex-wrap gap-3">
                                    {Object.entries(stats?.cramersvMatrix || {}).flatMap(([feature1, associations]) =>
                                        Object.entries(associations || {})
                                            .filter(([feature2, value]) =>
                                                feature1 !== feature2 && // Remove self-correlations
                                                typeof value === 'number' && // Ensure it's a number
                                                value >= 0.3 // Only show meaningful associations (adjust threshold as needed)
                                            )
                                            .map(([feature2, value]) => ({
                                                feature1,
                                                feature2,
                                                value
                                            }))
                                    )
                                        .sort((a, b) => b.value - a.value) // Sort by strength descending
                                        .slice(0, 20) // Show top 20
                                        .map((assoc, index) => {
                                            // Smart label formatting
                                            const formatFeatureName = (name) => {
                                                if (name.length > 15) {
                                                    return name.split(/(?=[A-Z])/).join(' ');
                                                }
                                                return name;
                                            };

                                            const feature1 = formatFeatureName(assoc.feature1);
                                            const feature2 = formatFeatureName(assoc.feature2);

                                            return (
                                                <div key={index} className="border p-2 rounded-lg hover:shadow-sm transition-shadow min-w-[180px] max-w-[220px] flex flex-col">
                                                    {/* Two-line feature names */}
                                                    <div className="mb-1.5 min-h-[40px]">
                                                        <div className="text-xs leading-tight line-clamp-2 break-all"
                                                            title={`${assoc.feature1} ↔ ${assoc.feature2}`}>
                                                            <span className="font-bold">{feature1.replace(/([A-ZÄÖÜ][a-zäöüß]+)/g, '$1 ')}</span>
                                                            <span> ↔ </span>
                                                            <span className="font-bold">{feature2.replace(/([A-ZÄÖÜ][a-zäöüß]+)/g, '$1 ')}</span>
                                                        </div>
                                                    </div>

                                                    {/* Association strength bar */}
                                                    <div className="mt-auto">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-[10px] text-purple-800">
                                                                Strength
                                                            </span>
                                                            <span className="text-[10px] font-medium">
                                                                {assoc.value.toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                            <div
                                                                className="h-1.5 rounded-full bg-purple-600"
                                                                style={{ width: `${assoc.value * 100}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                            
                        </div>
                    )}
                    {activeTab === "ML" && (
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Random Forest Model Performance</h2>

                            {trainingMetrics ? (
                                <div className="space-y-6">
                                    {Object.entries(trainingMetrics).map(([metric, value]) => (
                                        <div key={metric} className="mb-3">
                                            <div className="flex justify-between mb-1">
                                                <span className="capitalize">{metric}</span>
                                                <span className="font-mono">{value.toFixed(3)}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{ width: `${value * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">
                                        Training the Random Forest model... This will only take a few seconds...
                                </p>
                            )}
                        </div>
                    )}




               </div>
                
            </div>
        </div>
    );
};

export default StudentDashboard;