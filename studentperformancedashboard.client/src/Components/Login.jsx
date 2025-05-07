import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@fh-aachen\.de$/i;
        return regex.test(email);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        if (loginError) setLoginError('');
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = { email: '', password: '' };

        if (!formData.email.trim()) {
            newErrors.email = 'E-Mail ist erforderlich';
            valid = false;
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Bitte eine gültige FH Aachen E-Mail verwenden';
            valid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Passwort ist erforderlich';
            valid = false;
        } else if (formData.password.length < 8) {
            newErrors.password = 'Passwort muss mindestens 8 Zeichen lang sein';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5238/api/Students/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Anmeldefehler');
            }

            const data = await response.json();

            // Store authentication data
            const storage = formData.rememberMe ? localStorage : sessionStorage;
            storage.setItem('authToken', data.token);
            storage.setItem('userData', JSON.stringify(data.user));

            navigate('/dashboard');

        } catch (error) {
            console.error('Login error:', error);
            setLoginError(error.message || 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex items-center justify-center w-full min-h-screen bg-gray-50">
            <div className="w-full max-w-3xl overflow-hidden rounded-lg shadow-lg sm:flex">
                {/* Left side with FH Aachen image */}
                <div className="w-full bg-[#00b1ac] bg-center bg-cover sm:w-2/5 flex items-center justify-center p-8"
                    style={{ backgroundImage: "linear-gradient(rgba(0, 177, 172, 0.8), rgba(0, 177, 172, 0.8)), url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }}>
                    <div className="text-center text-white">
                        <img
                            src="./FHAachen-logo2010.svg.png"
                            alt="FH Aachen Logo"
                            className="w-32 mx-auto mb-6"
                        />
                        <h2 className="text-2xl font-bold mb-2">Willkommen zurück!</h2>
                        <p className="text-sm opacity-90">Melden Sie sich an, um auf Ihr persönliches Dashboard zuzugreifen</p>
                    </div>
                </div>

                {/* Right side with login form */}
                <div className="w-full bg-white sm:w-3/5">
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-gray-800">Anmelden</h1>
                        <p className="mt-1 mb-6 text-base text-gray-600">Nutzen Sie Ihr FH Aachen Konto</p>

                        {loginError && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {loginError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">FH E-Mail*</label>
                                <input
                                    id="email"
                                    name="email"
                                    className={`block w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#00b1ac] focus:border-transparent`}
                                    type="email"
                                    placeholder="beispiel@fh-aachen.de"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Passwort*</label>
                                <input
                                    id="password"
                                    name="password"
                                    className={`block w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#00b1ac] focus:border-transparent`}
                                    type="password"
                                    placeholder="Ihr Passwort"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="rememberMe"
                                        type="checkbox"
                                        className="w-4 h-4 text-[#00b1ac] border-gray-300 rounded focus:ring-[#00b1ac]"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-700">
                                        Angemeldet bleiben
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-[#00b1ac] hover:text-[#008a87]">
                                        Passwort vergessen?
                                    </a>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full px-4 py-3 text-sm font-medium text-white bg-[#00b1ac] rounded-md hover:bg-[#008a87] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b1ac] transition-colors"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Verarbeitung...
                                    </span>
                                ) : (
                                    'Anmelden'
                                )}
                            </button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">    
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Noch kein Konto?</span>
                                </div>
                            </div>

                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-600">
                                    <a
                                        href="/register"
                                        className="font-medium text-[#00b1ac] hover:text-[#008a87]"
                                    >
                                        Registrieren
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );

};

export default Login;