import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserInfoDisplay from './UserInfoDisplay';


const Register = () => {
    const [registeredUser, setRegisteredUser] = useState(null);
    const navigate = useNavigate(); 

    const [formData, setFormData] = useState({
        vorname: '',
        nachname: '',
        studiengang: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreement: false
    });

    const [errors, setErrors] = useState({
        vorname: '',
        nachname: '',
        studiengang: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreement: ''
    });

    const validateName = (name) => {
        const regex = /^[a-zA-Z‰ˆ¸ƒ÷‹ﬂ\s-]+$/;
        return regex.test(name);
    };

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@fh-aachen\.de$/i;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return regex.test(password);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            vorname: '',
            nachname: '',
            studiengang: '',
            email: '',
            password: '',
            confirmPassword: '',
            agreement: ''
        };

        // First name validation
        if (!formData.vorname.trim()) {
            newErrors.vorname = 'Vorname ist erforderlich';
            valid = false;
        } else if (!validateName(formData.vorname)) {
            newErrors.vorname = 'Vorname darf nur Buchstaben enthalten';
            valid = false;
        }

        // Last name validation
        if (!formData.nachname.trim()) {
            newErrors.nachname = 'Nachname ist erforderlich';
            valid = false;
        } else if (!validateName(formData.nachname)) {
            newErrors.nachname = 'Nachname darf nur Buchstaben enthalten';
            valid = false;
        }

        // Studiengang validation
        if (!formData.studiengang) {
            newErrors.studiengang = 'Studiengang ist erforderlich';
            valid = false;
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'E-Mail ist erforderlich';
            valid = false;
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Bitte eine g¸ltige FH Aachen E-Mail verwenden (beispiel@fh-aachen.de)';
            valid = false;
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Passwort ist erforderlich';
            valid = false;
        } else if (!validatePassword(formData.password)) {
            newErrors.password = 'Passwort muss mindestens 8 Zeichen lang sein und mindestens einen Groﬂbuchstaben, einen Kleinbuchstaben und eine Zahl enthalten';
            valid = false;
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwortbest‰tigung ist erforderlich';
            valid = false;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwˆrter stimmen nicht ¸berein';
            valid = false;
        }

        // Agreement validation
        if (!formData.agreement) {
            newErrors.agreement = 'Sie m¸ssen den Nutzungsbedingungen zustimmen';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            console.error('Form validation failed');
            return;
        }

        try {
            const requestData = {
                firstName: formData.vorname,
                lastName: formData.nachname,
                studyProgram: formData.studiengang,
                email: formData.email,
                password: formData.password
            };

            const response = await fetch('http://localhost:5238/api/Students/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            const responseText = await response.text();
            let data;

            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                throw new Error(`Invalid JSON response: ${responseText}`);
            }

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            console.log('Registration successful:', data);
            navigate('/dashboard', { state: { userData: requestData } });
            // Handle success (redirect, show message, etc.)

        } catch (error) {
            console.error('Registration error:', error);
            // Show user-friendly error message
            alert(error.message || 'Registration failed. Please try again.');
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
                        <h2 className="text-2xl font-bold mb-2">Willkommen!</h2>
                        <p className="text-sm opacity-90">Registrieren Sie sich f&uuml;r Ihren pers&ouml;nlichen Dashboard-Zugang</p>
                    </div>
                </div>

                <div className="w-full bg-white sm:w-3/5">
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-gray-800">Registrieren</h1>
                        <p className="mt-1 mb-6 text-base text-gray-600">Erstellen Sie Ihr FH Dashbord Konto</p>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="mb-4">
                                    <label htmlFor="vorname" className="block text-sm font-medium text-gray-700 mb-1">Vorname*</label>
                                    <input
                                        id="vorname"
                                        name="vorname"
                                        className={`block w-full p-2 border ${errors.vorname ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#00b1ac] focus:border-transparent`}
                                        type="text"
                                        placeholder="Max"
                                        value={formData.vorname}
                                        onChange={handleChange}
                                    />
                                    {errors.vorname && <p className="mt-1 text-sm text-red-600">{errors.vorname}</p>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="nachname" className="block text-sm font-medium text-gray-700 mb-1">Nachname*</label>
                                    <input
                                        id="nachname"
                                        name="nachname"
                                        className={`block w-full p-2 border ${errors.nachname ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#00b1ac] focus:border-transparent`}
                                        type="text"
                                        placeholder="Mustermann"
                                        value={formData.nachname}
                                        onChange={handleChange}
                                    />
                                    {errors.nachname && <p className="mt-1 text-sm text-red-600">{errors.nachname}</p>}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="studiengang" className="block text-sm font-medium text-gray-700 mb-1">Studiengang*</label>
                                <select
                                    id="studiengang"
                                    name="studiengang"
                                    className={`block w-full p-2 border ${errors.studiengang ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#00b1ac] focus:border-transparent`}
                                    value={formData.studiengang}
                                    onChange={handleChange}
                                >
                                    <option value="">Bitte w&auml;hlen</option>
                                    <option value="Informatik">Informatik</option>
                                    <option value="Maschinenbau">Maschinenbau</option>
                                    <option value="Elektrotechnik">Elektrotechnik</option>
                                    <option value="Wirtschaftsingenieurwesen">Wirtschaftsingenieurwesen</option>
                                    <option value="Architektur">Architektur</option>
                                </select>
                                {errors.studiengang && <p className="mt-1 text-sm text-red-600">{errors.studiengang}</p>}
                            </div>

                            <div className="mb-6">
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

                            <div className="mb-6">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Passwort*</label>
                                <input
                                    id="password"
                                    name="password"
                                    className={`block w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#00b1ac] focus:border-transparent`}
                                    type="password"
                                    placeholder="Mindestens 8 Zeichen"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <p className="mt-1 text-xs text-gray-500">Das Passwort muss mindestens 8 Zeichen lang sein und mindestens einen Groﬂbuchstaben, einen Kleinbuchstaben und eine Zahl enthalten</p>
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>

                            <div className="mb-6">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Passwort best&auml;tigen*</label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className={`block w-full p-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#00b1ac] focus:border-transparent`}
                                    type="password"
                                    placeholder=""
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                            </div>

                            <div className="flex items-start mb-6">
                                <div className="flex items-center h-5">
                                    <input
                                        id="agreement"
                                        name="agreement"
                                        type="checkbox"
                                        className="w-4 h-4 text-[#00b1ac] border-gray-300 rounded focus:ring-[#00b1ac]"
                                        checked={formData.agreement}
                                        onChange={handleChange}
                                    />
                                </div>
                                <label htmlFor="agreement" className="block ml-2 text-sm text-gray-700">
                                    Ich stimme den <a href="#" className="text-[#00b1ac] hover:text-[#008a87]">Nutzungsbedingungen</a> zu
                                </label>
                                {errors.agreement && <p className="mt-1 text-sm text-red-600">{errors.agreement}</p>}
                            </div>

                            <button
                                type="submit"
                                className="w-full px-4 py-3 text-sm font-medium text-white bg-[#00b1ac] rounded-md hover:bg-[#008a87] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b1ac] transition-colors"
                            >
                                Konto erstellen
                            </button>
                        </form>
                        
                        

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Bereits registriert?</span>
                                </div>
                            </div>

                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-600">
                                    <a href="#" className="font-medium text-[#00b1ac] hover:text-[#008a87]">
                                        Zur Anmeldung
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

export default Register;