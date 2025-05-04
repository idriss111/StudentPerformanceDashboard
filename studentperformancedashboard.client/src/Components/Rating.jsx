import React from 'react';

const Bewertung = () => {
    return (
        <div className="bg-white">
            <div className="max-w-6xl px-6 py-8 mx-auto md:px-12">
                <div className="items-center -mx-6 md:flex md:-mx-12">
                    <div className="w-full px-10 mt-16 md:w-1/2 md:mt-0">
                        <div className="overflow-hidden bg-white rounded-lg shadow-xl">
                            <img
                                className="w-full"
                                loading="lazy"
                                src="./Students.jpg"
                                alt="Portr&auml;t eines Studenten"
                            />
                            <div className="p-12">
                                <blockquote className="text-lg italic text-gray-800">
                                    <div className="absolute -mt-2 -ml-2 pin-t pin-l">
                                        <svg className="w-8 h-8" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M15.264 19.552C15.264 23.2 17.664 25.12 20.352 25.12C23.328 25.12 26.112 22.624 26.112 19.456C26.112 16.864 24.288 15.136 22.08 15.136C21.888 15.136 21.408 15.136 21.312 15.136C22.368 12.064 25.824 8.8 29.376 7.072L26.4 4C20.448 6.976 15.264 13.504 15.264 19.552ZM0 19.552C0 23.2 2.304 25.12 5.088 25.12C8.064 25.12 10.848 22.624 10.848 19.456C10.848 16.864 8.928 15.136 6.72 15.136C6.528 15.136 6.048 15.136 5.952 15.136C7.008 12.064 10.56 8.8 14.016 7.072L11.136 4C5.184 6.976 0 13.504 0 19.552Z"
                                                className="text-gray-300 fill-current"
                                            />
                                        </svg>
                                    </div>
                                    <div className="relative">
                                        <p>
                                            Das Dashboard hat komplett ver&auml;ndert, wie ich meinen Lernfortschritt verfolge. Die Vorhersageanalysen halfen mir, meine Schw&auml;chen fr&uuml;hzeitig zu erkennen und meine Noten deutlich zu verbessern.
                                        </p>
                                    </div>
                                </blockquote>
                                <div className="mt-10">
                                    <div>
                                        <div className="font-semibold tracking-wider text-gray-900 uppercase">
                                            Markus Schneider
                                        </div>
                                        <div className="text-gray-700">Informatikstudent, FH Aachen</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full px-6 md:w-1/2 md:px-12">
                        <h2 className="text-2xl font-bold text-gray-900">F&uuml;r akademischen Erfolg entwickelt</h2>
                        <div className="flex mt-10">
                            <div>
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                    />
                                </svg>
                            </div>
                            <div className="mt-2 ml-4">
                                <div className="text-lg font-semibold">Vorausschauende Leistungsanalyse</div>
                                <p className="mt-2 text-gray-700">
                                    Unsere KI identifiziert Risikostudenten fr&uuml;hzeitig durch Analyse tausender Datenpunkte, sodass rechtzeitig eingegriffen werden kann.
                                </p>
                            </div>
                        </div>
                        <div className="flex mt-10">
                            <div>
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                            </div>
                            <div className="mt-2 ml-4">
                                <div className="text-lg font-semibold">Personalisierte Lernpfade</div>
                                <p className="mt-2 text-gray-700">
                                    Erhalten Sie ma&szlig;geschneiderte Empfehlungen basierend auf Ihrem Leistungsverlauf und Lernstil, um Ihr Potenzial optimal auszusch&ouml;pfen.
                                </p>
                            </div>
                        </div>
                        <div className="flex mt-10">
                            <div>
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                            <div className="mt-2 ml-4">
                                <div className="text-lg font-semibold">Fr&uuml;hwarnsystem</div>
                                <p className="mt-2 text-gray-700">
                                    Erhalten Sie Warnungen zu m&ouml;glichen akademischen Risiken bis zu 3 Semester im Voraus mit umsetzbaren Verbesserungsstrategien.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bewertung;