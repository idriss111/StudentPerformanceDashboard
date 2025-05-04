import React from 'react';

const Middle = () => {
    return (
        <div className="pb-1 text-center text-gray-900 bg-white">
            <div className="container relative max-w-2xl px-5 pt-12 mx-auto sm:py-12 lg:px-0">
                <h2
                    className="mb-10 text-4xl font-extrabold leading-10 tracking-tight text-left text-gray-900 sm:text-5xl sm:leading-none md:text-6xl sm:text-center">
                    Campus&ndash;<span className="inline-block text-[#00b1ac]">Check </span></h2>
                <p className="mt-5 text-xl text-left opacity-75 sm:text-center">Dein Studienabbruch in 3 Jahren? Kein Schicksal &ndash; sondern berechenbar! Unsere KI prognostiziert heute mit 90% Genauigkeit, wer an der FH scheitern wird, und liefert dir die Strategien, genau NICHT in diese Statistik zu fallen. Du hast die Daten &ndash; jetzt nutze sie, um deinen Abschluss sicherzustellen!
                </p>
            </div>
            <div className="my-8">
                <div className="max-w-xl px-4 mx-auto sm:px-6 lg:max-w-screen-xl lg:px-8">
                    <div className="lg:grid lg:grid-cols-3 lg:gap-8">

                        <div
                            className="p-16 mt-10 transition-all duration-150 bg-white rounded-lg shadow-xl lg:mt-0 ease hover:shadow-2xl">
                            <div className="relative inline-flex items-center justify-center w-16 h-16 overflow-hidden text-white rounded-full">
                                <svg className="relative w-12 h-12 text-[#00b1ac]" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z">
                                    </path>
                                </svg>
                            </div>
                            <div className="mt-3 mb-6">
                                <h5 className="pb-2 text-xl font-bold leading-6 text-gray-600">Fr&uuml;hwarnsystem</h5>
                                <p className="mt-1 text-base leading-6 text-gray-500">
                                    Erhalte automatische Benachrichtigungen &uuml;ber kritische Leistungstrends, bevor es zu sp&auml;t ist.
                                </p>
                            </div>
                        </div>
                        <div
                            className="p-16 mt-10 transition-all duration-150 bg-white rounded-lg shadow-xl lg:mt-0 ease hover:shadow-2xl">
                            <div className="relative inline-flex items-center justify-center w-16 h-16 overflow-hidden text-white rounded-full">
                                <svg className="relative w-12 h-12 text-[#00b1ac]" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                        d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605">
                                    </path>
                                </svg>
                            </div>
                            <div className="mt-3 mb-6">
                                <h5 className="pb-2 text-xl font-bold leading-6 text-gray-600">Lernanalysen</h5>
                                <p className="mt-1 text-base leading-6 text-gray-500">
                                    Detaillierte Auswertungen deiner Leistungsdaten mit klaren Handlungsempfehlungen.
                                </p>
                            </div>
                        </div>
                        <div className="p-16 transition-all duration-150 bg-white rounded-lg shadow-xl ease hover:shadow-2xl">
                            <div className="relative inline-flex items-center justify-center w-16 h-16 overflow-hidden text-white rounded-full">
                                <svg className="relative w-12 h-12 text-[#00b1ac]" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5">
                                    </path>
                                </svg>
                            </div>
                            <div className="mt-3 mb-6">
                                <h5 className="pb-2 text-xl font-bold leading-6 text-gray-600">Pr&auml;diktive KI</h5>
                                <p className="mt-1 text-base leading-6 text-gray-500">
                                    Vorhersagen deiner akademischen Entwicklung basierend auf tausenden historischen Datenpunkten.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Middle;