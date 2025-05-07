import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './Components/Welcome';
import Footer from './Components/Footer';
import Middle from './Components/Middle';
import Header from './Components/Header';
import Rating from './Components/Rating';
import Login from './Components/Login'; 
import Register from './Components/Register';
import UserInfoDisplay from './Components/UserInfoDisplay';
const Home = () => (
    <>
        <Header />
        <Welcome />
        <Middle />
        <Rating />
        <Footer />
    </>
);

const App = () => {
    return (
        <Router>
            <div className="font-mono">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/user-info" element={<UserInfoDisplay />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;