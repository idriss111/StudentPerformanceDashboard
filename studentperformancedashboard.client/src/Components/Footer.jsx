import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full text-gray-700 bg-white body-font border-t border-gray-200">
            <div className="container flex flex-col flex-wrap px-5 py-8 mx-auto md:items-center lg:items-start md:flex-row md:flex-nowrap">
                <div className="flex-shrink-0 w-64 mx-auto text-center md:mx-0 md:text-left">
                    <a href="https://www.fh-aachen.de" className="flex items-center justify-center font-medium text-gray-900 title-font md:justify-start">
                        <img
                            src="./FHAachen-logo2010.svg.png"
                            alt="FH Aachen Logo"
                            className="h-12 w-auto"
                        />
                    </a>
                    <p className="mt-2 text-sm text-gray-500">
                        Fachhochschule Aachen<br />
                        University of Applied Sciences
                    </p>
                    <div className="mt-3">
                        <span className="inline-flex justify-center mt-1 sm:ml-auto sm:mt-0 sm:justify-start">
                            <a href="https://www.facebook.com/fhaachen" className="text-gray-500 hover:text-blue-600">
                                <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                                </svg>
                            </a>
                            <a href="https://twitter.com/fhaachen" className="ml-3 text-gray-500 hover:text-blue-400">
                                <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z">
                                    </path>
                                </svg>
                            </a>
                            <a href="https://www.instagram.com/fhaachen" className="ml-3 text-gray-500 hover:text-pink-600">
                                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                    strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                                </svg>
                            </a>
                            <a href="https://www.linkedin.com/school/fh-aachen" className="ml-3 text-gray-500 hover:text-blue-700">
                                <svg fill="currentColor" stroke="currentColor" strokeLinecap="round"
                                    strokeLinejoin="round" strokeWidth="0" className="w-5 h-5" viewBox="0 0 24 24">
                                    <path stroke="none"
                                        d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z">
                                    </path>
                                    <circle cx="4" cy="4" r="2" stroke="none"></circle>
                                </svg>
                            </a>
                            <a href="https://www.youtube.com/user/fhaachen" className="ml-3 text-gray-500 hover:text-red-600">
                                <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                                </svg>
                            </a>
                        </span>
                    </div>
                </div>
                <div className="flex flex-wrap flex-grow mt-4 -mb-6 text-center md:pl-20 md:mt-0 md:text-left">
                    <div className="w-full px-4 lg:w-1/4 md:w-1/2">
                        <h2 className="mb-2 text-sm font-medium tracking-widest text-gray-900 uppercase title-font">FH Aachen</h2>
                        <nav className="mb-6 list-none">
                            <li className="mt-2">
                                <a href="https://www.fh-aachen.de/hochschule/" className="text-gray-500 cursor-pointer hover:text-gray-900">&Uuml;ber uns</a>
                            </li>
                            <li className="mt-2">
                                <a href="https://www.fh-aachen.de/studium/" className="text-gray-500 cursor-pointer hover:text-gray-900">Studieng&auml;nge</a>
                            </li>
                            <li className="mt-2">
                                <a href="https://www.fh-aachen.de/forschung/" className="text-gray-500 cursor-pointer hover:text-gray-900">Forschung</a>
                            </li>
                        </nav>
                    </div>
                    <div className="w-full px-4 lg:w-1/4 md:w-1/2">
                        <h2 className="mb-2 text-sm font-medium tracking-widest text-gray-900 uppercase title-font">Service</h2>
                        <nav className="mb-6 list-none">
                            <li className="mt-2">
                                <a href="https://www.fh-aachen.de/kontakt/" className="text-gray-500 cursor-pointer hover:text-gray-900">Kontakt</a>
                            </li>
                            <li className="mt-2">
                                <a href="https://www.fh-aachen.de/hochschule/organisation/zentrale-einrichtungen/its/" className="text-gray-500 cursor-pointer hover:text-gray-900">IT-Service</a>
                            </li>
                            <li className="mt-2">
                                <a href="https://www.fh-aachen.de/hochschule/organisation/zentrale-einrichtungen/bibliothek/" className="text-gray-500 cursor-pointer hover:text-gray-900">Bibliothek</a>
                            </li>
                        </nav>
                    </div>
                    <div className="w-full px-4 lg:w-1/4 md:w-1/2">
                        <h2 className="mb-2 text-sm font-medium tracking-widest text-gray-900 uppercase title-font">Rechtliches</h2>
                        <nav className="mb-6 list-none">
                            <li className="mt-2">
                                <a href="https://www.fh-aachen.de/impressum/" className="text-gray-500 cursor-pointer hover:text-gray-900">Impressum</a>
                            </li>
                            <li className="mt-2">
                                <a href="https://www.fh-aachen.de/datenschutz/" className="text-gray-500 cursor-pointer hover:text-gray-900">Datenschutz</a>
                            </li>
                            <li className="mt-2">
                                <a href="https://www.fh-aachen.de/barrierefreiheit/" className="text-gray-500 cursor-pointer hover:text-gray-900">Barrierefreiheit</a>
                            </li>
                        </nav>
                    </div>
                    <div className="w-full px-4 lg:w-1/4 md:w-1/2">
                        <h2 className="mb-2 text-sm font-medium tracking-widest text-gray-900 uppercase title-font">Kontakt</h2>
                        <nav className="mb-6 list-none">
                            <li className="mt-2">
                                <span className="text-gray-500">Bayernallee 9<br />52066 Aachen</span>
                            </li>
                            <li className="mt-2">
                                <span className="text-gray-500">+49 (0)241 6009 0</span>
                            </li>
                            <li className="mt-2">
                                <a href="mailto:info@fh-aachen.de" className="text-gray-500 cursor-pointer hover:text-gray-900">info@fh-aachen.de</a>
                            </li>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="bg-gray-100">
                <div className="container px-5 py-3 mx-auto">
                    <p className="text-sm text-gray-700 xl:text-center">
                        &copy; {new Date().getFullYear()} Fachhochschule Aachen - University of Applied Sciences
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;