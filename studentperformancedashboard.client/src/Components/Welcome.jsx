import React from 'react';

const Welcome = () => {
    return (
     
        <div className="flex items-center px-20 mx-auto bg-white pt-[26px]">
            <div className="w-1/2">
                <div className="flex flex-col overflow-hidden rounded-lg shadow-2xl">
                   
                    <img
                        src="/FH Aachen.jpg"
                        alt="A wooden table that has some accessories on it."
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>
            <div className="relative w-1/2 h-full pl-12">
                <p className="text-sm font-bold tracking-wide text-[#00b1ac] uppercase">Datengetriebene Bildungserfolge</p>
                <h2 className="mt-5 text-4xl font-bold leading-tight text-gray-900">Fr&uuml;h erkennen, Richtig reagieren. <br /> Zukunft sichern!</h2>
                <p className="mt-3 text-base text-gray-600">Unsere Technologie analysiert Lernverl&auml;ufe und identifiziert fr&uuml;hzeitig Potenziale und Risiken. So k&ouml;nnen P&auml;dagogen gezielt f&ouml;rdern &ndash; wissenschaftlich fundiert, individuell passend.</p>
                <a
                    href="/security-awareness-training-topics/"
                    className="flex items-center inline-block mt-8 font-medium text-[#00b1ac] underline hover:text-[#008a86] transition-colors"
                >
                    <span>Jetzt Dashboard entdecken</span>
                    <svg
                        className="w-4 h-4 mt-1 ml-1 transform -rotate-45"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                    </svg>
                </a>
            </div>
          </div>
       




    );
};

export default Welcome;