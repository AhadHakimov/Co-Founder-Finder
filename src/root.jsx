import React from "react";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";

// ============================================================
// COMPONENTS
// ============================================================

import Navbar from "./Components/Navbar";

// ============================================================
// PAGES
// ============================================================

import Home from "./Pages/Home";
import Auth from "./Pages/Auth";
import Onboarding from "./Pages/Onboarding";
import Profile from "./Pages/Profile";
import Projects from "./Pages/Projects";
import Setting from "./Pages/Setting";

// ============================================================
// PORTFOLIO
// ============================================================

import PortfolioCreate from "./Pages/Portfolio/PortfolioCreate";
import PublicPortfolio from "./Pages/Portfolio/PublicPortfolio";

// ============================================================
// APP ROUTER
// ============================================================

const AppRouter = ({
    isLoggedIn,
    currentUser,
}) => {
    const location = useLocation();

    // ----------------------------------------------------------
    // PORTFOLIO ROUTES
    // Global Navbar bu sahifalarda ko'rinmaydi
    // ----------------------------------------------------------

    const isPortfolioPage =
        location.pathname === "/portfolio/create" ||
        location.pathname === "/p" ||
        location.pathname.startsWith("/p/");

    return (
        <>
            {/* ==================================================
                GLOBAL NAVBAR
                Portfolio sahifalarida yashiriladi
            ================================================== */}

            {!isPortfolioPage && isLoggedIn && (
                <Navbar />
            )}

            <Routes>

                {/* ==================================================
                    ROOT
                ================================================== */}

                <Route
                    path="/"
                    element={
                        isLoggedIn ? (
                            currentUser?.isOnboarded ? (
                                <Navigate
                                    to="/feed"
                                    replace
                                />
                            ) : (
                                <Navigate
                                    to="/onboarding"
                                    replace
                                />
                            )
                        ) : (
                            <Navigate
                                to="/login"
                                replace
                            />
                        )
                    }
                />

                {/* ==================================================
                    AUTH
                ================================================== */}

                <Route
                    path="/login"
                    element={<Auth />}
                />

                <Route
                    path="/register"
                    element={<Auth />}
                />

                {/* ==================================================
                    FEED
                ================================================== */}

                <Route
                    path="/feed"
                    element={
                        isLoggedIn ? (
                            <Home />
                        ) : (
                            <Navigate
                                to="/login"
                                replace
                            />
                        )
                    }
                />

                {/* ==================================================
                    ONBOARDING
                ================================================== */}

                <Route
                    path="/onboarding"
                    element={
                        isLoggedIn ? (
                            <Onboarding />
                        ) : (
                            <Navigate
                                to="/login"
                                replace
                            />
                        )
                    }
                />

                {/* ==================================================
                    PROFILE
                ================================================== */}

                <Route
                    path="/profile"
                    element={
                        isLoggedIn ? (
                            <Profile />
                        ) : (
                            <Navigate
                                to="/login"
                                replace
                            />
                        )
                    }
                />

                {/* ==================================================
                    PROJECTS
                ================================================== */}

                <Route
                    path="/projects"
                    element={
                        isLoggedIn ? (
                            <Projects />
                        ) : (
                            <Navigate
                                to="/login"
                                replace
                            />
                        )
                    }
                />

                {/* ==================================================
                    PORTFOLIO CREATE
                    /portfolio/create
                ================================================== */}

                <Route
                    path="/portfolio/create"
                    element={
                        isLoggedIn ? (
                            <PortfolioCreate />
                        ) : (
                            <Navigate
                                to="/login"
                                replace
                            />
                        )
                    }
                />

                {/* ==================================================
                    PUBLIC PORTFOLIO
                    /p/:slug
                ================================================== */}

                <Route
                    path="/p/:slug"
                    element={
                        <PublicPortfolio />
                    }
                />

                {/* ==================================================
                    SETTINGS
                ================================================== */}

                <Route
                    path="/settings"
                    element={
                        isLoggedIn ? (
                            <Setting />
                        ) : (
                            <Navigate
                                to="/login"
                                replace
                            />
                        )
                    }
                />

                {/* ==================================================
                    404
                ================================================== */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>
        </>
    );
};

// ============================================================
// ROOT
// ============================================================

const Root = () => {
    // ----------------------------------------------------------
    // CURRENT USER
    // ----------------------------------------------------------

    let currentUser = null;

    try {
        currentUser = JSON.parse(
            localStorage.getItem("currentUser") || "null"
        );
    } catch (error) {
        console.error(
            "currentUser parse error:",
            error
        );

        currentUser = null;
    }

    // ----------------------------------------------------------
    // AUTH CHECK
    // ----------------------------------------------------------

    const isLoggedIn = !!currentUser;

    // ----------------------------------------------------------
    // BROWSER ROUTER
    // ----------------------------------------------------------

    return (
        <BrowserRouter>
            <AppRouter
                isLoggedIn={isLoggedIn}
                currentUser={currentUser}
            />
        </BrowserRouter>
    );
};

export default Root;