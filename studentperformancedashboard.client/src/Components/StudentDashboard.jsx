import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
    RiMenuLine,
    RiHome2Line,
    RiSearchLine,
    RiNotificationLine,
    RiBarChart2Line,
    RiLineChartLine,
    RiPieChartLine,
    RiLinksLine,
    RiNodeTree,
    RiCpuLine,
    RiBrainLine
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
    const [trainingMetricsLight, setTrainingMetricsLight] = useState(null);
    const [trainingMetricsSvm, setTrainingMetricsSvm] = useState(null);
    const [trainingMetricsSdca, setTrainingMetricsSdca] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [probability, setProbability] = useState(null);
    const [formData, setFormData] = useState({
        studiengebuehrenAktuell: '',
        scholarshipHolder: '',
        immatrikulationsalter: '',
        bestandene1: '',
        bestandene2: ''
    });

    // Input Feld for the prediction

    const InputField = ({ label, name, value, onChange }) => (
        <div className="flex flex-col">
            <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                type="text"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
        </div>
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };




    // handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setPrediction(null);
        setProbability(null);

        try {
            // Convert form data to numbers
            const numericData = {
                studiengebuehrenAktuell: parseFloat(formData.studiengebuehrenAktuell) || 0,
                scholarshipHolder: parseFloat(formData.scholarshipHolder) || 0,
                immatrikulationsalter: parseFloat(formData.immatrikulationsalter) || 0,
                bestandene1: parseFloat(formData.bestandene1) || 0,
                bestandene2: parseFloat(formData.bestandene2) || 0
            };

            console.log('Sending prediction request:', numericData);

            // Send the prediction request to the backend
            const response = await axios.post(
                'http://localhost:5238/api/Prediction/lightgbm', // Must match backend route
                numericData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Received prediction response:', response.data);

            // Update the prediction state
            if (response.data) {
                setPrediction(response.data.target.toString());
                setProbability(response.data.probability);
            } else {
                setError('Invalid response format from server');
            }
        }  catch (err) {
            const errorMessage = err.response
                ? err.response.data?.message || err.response.statusText
                : err.message;
            setError(`Prediction failed: ${errorMessage}`);
        }
         finally {
            setLoading(false);
        }
    };


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

    // Random Forest Model
    const trainModel = async () => {
        try {
            const res = await fetch("http://localhost:5238/api/Students/ml/train-randomforest", {
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

    // LightGBM Model
    const trainModelLight = async () => {
        try {
            const res = await fetch("http://localhost:5238/api/Students/ml/train-lightgbm", {
                method: "POST",
            });

            const data = await res.json();

            if (res.ok && data.metrics) {
                setTrainingMetricsLight(data.metrics); // This is the key
            } else {
                console.error("Training error:", data.errors || "Unexpected response");
                setTrainingMetricsLight(null);
            }
        } catch (error) {
            console.error("Training failed", error);
            setTrainingMetricsLight(null);
        }
    };
    useEffect(() => {
        if (activeTab === "LightGbm") {
            trainModelLight();
        }
    }, [activeTab]);

    // Support Vector Machine Model
    const trainModelSvm = async () => {
        try {
            const res = await fetch("http://localhost:5238/api/Students/ml/train-svm", {
                method: "POST",
            });

            const data = await res.json();

            if (res.ok && data.metrics) {
                setTrainingMetricsSvm(data.metrics); // This is the key
            } else {
                console.error("Training error:", data.errors || "Unexpected response");
                setTrainingMetricsSvm(null);
            }
        } catch (error) {
            console.error("Training failed", error);
            setTrainingMetricsSvm(null);
        }
    };
    useEffect(() => {
        if (activeTab === "SVM") {
            trainModelSvm();
        }
    }, [activeTab]);


    // SDCA Maximum Entropy Model
    const trainModelSdca = async () => {
        try {
            const res = await fetch("http://localhost:5238/api/Students/ml/train-sdca", {
                method: "POST",
            });

            const data = await res.json();

            if (res.ok && data.metrics) {
                setTrainingMetricsSdca(data.metrics);
            } else {
                console.error("Training error:", data.errors || "Unexpected response");
                setTrainingMetricsSdca(null);
            }
        } catch (error) {
            console.error("Training failed", error);
            setTrainingMetricsSdca(null);
        }
    };
    useEffect(() => {
        if (activeTab === "SDCA") {
            trainModelSdca();
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
        <div className="flex h-screen overflow-hidden bg-gray-50 font-inter text-gray-800">
            {/* Sidebar */}
            <aside
                className={`w-64 bg-[#00b1ac] text-white p-4 transition-transform duration-300 ease-in-out z-50 md:sticky md:top-0 h-screen overflow-y-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
            >
                <div className="mb-6">
                    <img src="./FHAachen-logo2010.svg.png" alt="FH Aachen" className="h-12" />
                </div>
                <div className="text-white font-semibold mb-4">
                    Hallo, {userData?.firstName}
                </div>
                <nav className="space-y-2">
                    {[
                        { key: 'overview', icon: <RiHome2Line />, label: 'Dashboard' },
                        { key: 'grades', icon: <RiBarChart2Line />, label: 'Target grades' },
                        { key: 'features', icon: <RiLineChartLine />, label: 'Features' },
                        { key: 'correlations', icon: <RiNodeTree />, label: 'Correlation Matrix' },
                        { key: 'relationships', icon: <RiLinksLine />, label: 'Correlation Ratios' },
                        { key: 'cramersv', icon: <RiPieChartLine />, label: 'Cramers Association' },
                        { key: 'ML', icon: <RiCpuLine />, label: 'Random Forest Model' },
                        { key: 'LightGbm', icon: <RiBrainLine />, label: 'LightGBM Model' },
                        { key: 'SVM', icon: <RiBrainLine />, label: 'Support Vector Machine Model' },
                        { key: 'SDCA', icon: <RiBrainLine />, label: 'SDCA Maximum Entropy Model' },
                        { key: 'Test', icon: <RiBrainLine />, label: 'Test Your Self' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            className={`flex items-center w-full px-4 py-2 rounded-md hover:bg-[#005f66] transition-colors ${activeTab === tab.key ? 'bg-[#005f66]' : ''
                                }`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            <span className="mr-3">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </aside>


            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-auto">

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
                                        Training the Random Forest model,this will only take a few seconds...
                                </p>
                            )}
                        </div>
                    )}


                    {activeTab === "LightGbm" && (
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Light GBM Model Performance</h2>

                            {trainingMetricsLight ? (
                                <div className="space-y-6">
                                    {Object.entries(trainingMetricsLight).map(([metric, value]) => (
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
                                    Training the Light GBM Model,this will only take a few seconds...
                                </p>
                            )}
                        </div>
                    )}



                    {activeTab === "SVM" && (
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Support Vector Machine Model Performance</h2>

                            {trainingMetricsSvm ? (
                                <div className="space-y-6">
                                    {Object.entries(trainingMetricsSvm).map(([metric, value]) => (
                                        <div key={metric} className="mb-3">
                                            <div className="flex justify-between mb-1">
                                                <span className="capitalize">{metric}</span>
                                                <span className="font-mono">{value.toFixed(3)}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{ width: `${Math.min(value * 100, 100)}%` }} // Ensure it doesn't exceed 100%
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">
                                    Training the SVM Model, this will only take a few seconds...
                                </p>
                            )}
                        </div>
                    )}

                    {activeTab === "SDCA" && (
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                                SDCA Maximum Entropy Model Performance
                            </h2>

                            {trainingMetricsSdca ? (
                                <div className="space-y-6">
                                    {Object.entries(trainingMetricsSdca).map(([metric, value]) => (
                                        <div key={metric} className="mb-3">
                                            <div className="flex justify-between mb-1">
                                                <span className="capitalize">{metric}</span>
                                                <span className="font-mono">{value.toFixed(3)}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-500 h-2 rounded-full"
                                                    style={{ width: `${Math.min(value * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">
                                    Training the SDCA Model, this will only take a few seconds...
                                </p>
                            )}
                        </div>
                    )}
                    {activeTab === "Test" && (
                        <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg border border-gray-100 mt-8">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 border-gray-200">
                                Predict Target using LightGBM
                                <span className="block text-sm font-normal text-gray-500 mt-1">Enter student data to predict performance</span>
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Studiengebühren Aktuell"
                                        name="studiengebuehrenAktuell"
                                        value={formData.studiengebuehrenAktuell}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all"
                                    />
                                    <InputField
                                        label="Scholarship Holder (0 or 1)"
                                        name="scholarshipHolder"
                                        value={formData.scholarshipHolder}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all"
                                    />
                                    <InputField
                                        label="Immatrikulationsalter"
                                        name="immatrikulationsalter"
                                        value={formData.immatrikulationsalter}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all"
                                    />
                                    <InputField
                                        label="Bestandene Lehrveranstaltungen 1st"
                                        name="bestandene1"
                                        value={formData.bestandene1}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all"
                                    />
                                    <InputField
                                        label="Bestandene Lehrveranstaltungen 2st"
                                        name="bestandene2"
                                        value={formData.bestandene2}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`mt-6 w-full py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center ${loading
                                            ? 'bg-blue-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium'
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Predicting...
                                        </>
                                    ) : (
                                        'Predict Now'
                                    )}
                                </button>
                            </form>

                            {error && (
                                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                                    <div className="flex items-center">
                                        <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <h3 className="text-red-800 font-medium">Prediction Error</h3>
                                    </div>
                                    <p className="mt-1 text-red-700">{error}</p>
                                </div>
                            )}

                            {prediction && (
                                <div className="mt-6 p-6 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                                    <div className="flex items-center mb-3">
                                        <svg className="h-6 w-6 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <h3 className="text-green-800 text-lg font-semibold">Prediction Successful</h3>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-gray-800">
                                            <span className="font-medium">Target Class:</span>
                                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium">
                                                {prediction}
                                            </span>
                                        </p>
                                        {probability && (
                                            <p className="text-gray-800">
                                                <span className="font-medium">Confidence:</span>
                                                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
                                                    {(probability * 100).toFixed(1)}%
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}






               </div>
                
            </div>
        </div>
    );
};

export default StudentDashboard;