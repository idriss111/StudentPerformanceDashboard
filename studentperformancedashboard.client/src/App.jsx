import React from 'react';
import Welcome from './Components/Welcome';
import Footer from './Components/Footer';
import Middle from './Components/Middle';
import Header from './Components/Header';
import Rating from './Components/Rating';


const App = () => {
    return (
        <>
            

            <div className="font-mono" >
                
                <Header/>
                <Welcome />
                <Middle />
                <Rating />
                <Footer />
            
        </div>
        </>
    );
};

export default App;