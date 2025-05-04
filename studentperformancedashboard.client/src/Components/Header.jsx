import React from 'react';

const Header = () => {
    return (
        <header className="w-full text-gray-700 bg-white border-t border-gray-100 shadow-sm body-font">
            <div className="container flex flex-col items-start justify-between p-6 mx-auto md:flex-row">
                <div className="flex items-center w-full md:w-auto">
                    <a href="/" className="flex items-center justify-center font-medium text-gray-900 title-font md:justify-start">
                        <img
                            src="./FHAachen-logo2010.svg.png"
                            alt="FH Aachen Logo"
                            className="h-10 w-auto"
                        />
                    </a>

      
                    <div className="ml-6 hidden lg:block">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search courses, resources..."
                                className="w-64 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                            <button className="absolute right-3 top-2.5">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <nav className="flex flex-wrap items-center justify-center text-base md:ml-auto md:mr-auto">
                    <a href="#" className="px-4 py-2 font-bold text-gray-900 hover:text-[#00b1ac] transition-colors duration-200">Startseite</a>
                    <a href="#" className="px-4 py-2 font-bold text-gray-900 hover:text-[#00b1ac] transition-colors duration-200">Dashboard</a>
                    <a href="#" className="px-4 py-2 font-bold text-gray-900 hover:text-[#00b1ac] transition-colors duration-200">Kurse</a>
                    <a href="#" className="px-4 py-2 font-bold text-gray-900 hover:text-[#00b1ac] transition-colors duration-200">Resourcen</a>
                    <a href="#" className="px-4 py-2 font-bold text-gray-900 hover:text-[#00b1ac] transition-colors duration-200">&uuml;ber uns</a>
                </nav>

                <div className="flex items-center h-full space-x-4">
                    
                    <button className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>

                    
                    <div class="items-center h-full">
                        <a href="#_" class="mr-5 font-bold hover:text-gray-900">Anmelden</a>
                        <a href="#_"
                            class="px-4 py-2 text-xs font-bold text-white uppercase transition-all duration-150 bg-teal-500 rounded shadow outline-none active:bg-teal-600 hover:shadow-md focus:outline-none ease">
                            Registieren
                        </a>
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Header;