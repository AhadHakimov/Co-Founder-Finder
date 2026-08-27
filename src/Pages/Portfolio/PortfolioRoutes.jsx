import React from "react";
import PortfolioCreate from "./PortfolioCreate";
import PublicPortfolio from "./PublicPortfolio";

/**
 * Route components for CEOBACE portfolio pages.
 * Works without react-router-dom by matching window.location.pathname.
 *
 * Mount this component at your app/root level, or use PortfolioCreate/PublicPortfolio
 * directly in your router for the paths listed below.
 */
export default function PortfolioRoutes() {
  if (typeof window === "undefined") return null;

  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  if (path === "/portfolio/create") {
    return <PortfolioCreate />;
  }

  if (path === "/p" || path.startsWith("/p/")) {
    return <PublicPortfolio />;
  }

  return null;
}

export const PORTFOLIO_ROUTES = [
  { path: "/portfolio/create", component: PortfolioCreate },
  { path: "/p/:slug", component: PublicPortfolio },
];
