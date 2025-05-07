import React from 'react';

const Login = () => {
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
                        <h2 className="text-2xl font-bold mb-2">Willkommen zur&uuml;ck!</h2>
                        <p className="text-sm opacity-90">Melden Sie sich an, um auf Ihr pers&ouml;nliches Dashboard zuzugreifen</p>
                    </div>
                </div>

                {/* Right side with login form */}
                <div className="w-full bg-white sm:w-3/5">
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-gray-800">Anmelden</h1>
                        <p className="mt-1 mb-6 text-base text-gray-600">Nutzen Sie Ihr FH Aachen Konto</p>

                        <form>
                            <div className="mb-6">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">FH E-Mail</label>
                                <input
                                    id="email"
                                    className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00b1ac] focus:border-transparent"
                                    type="email"
                                    placeholder="beispiel@fh-aachen.de"
                                />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
                                <input
                                    id="password"
                                    className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00b1ac] focus:border-transparent"
                                    type="password"
                                    placeholder=""
                                />
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="w-4 h-4 text-[#00b1ac] border-gray-300 rounded focus:ring-[#00b1ac]"
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
                            >
                                Anmelden
                            </button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <br></br>
                            </div>

                            

                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-600">   
                                    Noch kein Konto?{' '}
                                    <a href="#" className="font-medium text-[#00b1ac] hover:text-[#008a87]">
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