import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Components
import Navbar from "./Components/Navbar";

// Pages
import Home from "./Pages/Home";
import Auth from "./Pages/Auth";
import Onboarding from "./Pages/Onboarding";
import Profile from "./Pages/Profile";
import Projects from "./Pages/Projects";
import Setting from "./Pages/Setting";


const Root = () => {
    // LocalStorage'dan hozirgi foydalanuvchini olish
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    return (
        <BrowserRouter>
            {/* Navbar faqat foydalanuvchi tizimga kirganida ko'rinadi */}
            {currentUser && <Navbar />}

            <Routes>
                {/* Saytga kirganda foydalanuvchi kirmagan bo'lsa /login ga, kirgan bo'lsa /feed ga o'tadi */}
                <Route
                    path="/"
                    element={
                        currentUser ? (
                            currentUser.isOnboarded ? (
                                <Navigate to="/feed" replace />
                            ) : (
                                <Navigate to="/onboarding" replace />
                            )
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Auth sahifalari */}
                <Route path="/login" element={<Auth />} />
                <Route path="/register" element={<Auth />} />

                {/* Himoyalangan sahifalar (Faqat login qilganlar uchun) */}
                <Route
                    path="/feed"
                    element={currentUser ? <Home /> : <Navigate to="/login" replace />}
                />
                <Route
                    path="/onboarding"
                    element={currentUser ? <Onboarding /> : <Navigate to="/login" replace />}
                />
                <Route
                    path="/profile"
                    element={currentUser ? <Profile /> : <Navigate to="/login" replace />}
                />
                <Route
                    path="/projects"
                    element={currentUser ? <Projects /> : <Navigate to="/login" replace />}
                />
                <Route
                    path="/settings"
                    element={currentUser ? <Setting /> : <Navigate to="/login" replace />}
                />

                {/* 404 Noto'g'ri URL */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Root;