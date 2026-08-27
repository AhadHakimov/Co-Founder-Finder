import React, {
    useState,
    useEffect,
} from "react";

import {
    Avatar,
    Typography,
    ConfigProvider,
    theme,
    Popover,
    Button,
} from "antd";

import {
    CompassOutlined,
    ProjectOutlined,
    UserOutlined,
    SettingOutlined,
} from "@ant-design/icons";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    TRANSLATIONS,
} from "../../utils/themeAndI18n";

// LOGO
import logoDark from "../../assets/icons/logoDark.svg";
import logoLight from "../../assets/icons/logoLight.svg";

const { Text } = Typography;

const Navbar = () => {
    const location =
        useLocation();

    const navigate =
        useNavigate();

    const [lang, setLang] =
        useState(
            localStorage.getItem(
                "app_lang"
            ) || "uz"
        );

    const [
        isDarkMode,
        setIsDarkMode,
    ] = useState(
        JSON.parse(
            localStorage.getItem(
                "app_dark_mode"
            ) || "true"
        )
    );

    const [
        currentUser,
        setCurrentUser,
    ] = useState(null);

    const t =
        TRANSLATIONS[lang] ||
        TRANSLATIONS.uz;

    // ==========================================================
    // USER + SETTINGS
    // ==========================================================

    useEffect(() => {
        const loadData =
            () => {
                const storedUser =
                    JSON.parse(
                        localStorage.getItem(
                            "currentUser"
                        ) || "null"
                    );

                setCurrentUser(
                    storedUser
                );

                setLang(
                    localStorage.getItem(
                        "app_lang"
                    ) || "uz"
                );

                setIsDarkMode(
                    JSON.parse(
                        localStorage.getItem(
                            "app_dark_mode"
                        ) || "true"
                    )
                );
            };

        loadData();

        const syncSettings =
            () => {
                setLang(
                    localStorage.getItem(
                        "app_lang"
                    ) || "uz"
                );

                setIsDarkMode(
                    JSON.parse(
                        localStorage.getItem(
                            "app_dark_mode"
                        ) || "true"
                    )
                );

                const storedUser =
                    JSON.parse(
                        localStorage.getItem(
                            "currentUser"
                        ) || "null"
                    );

                setCurrentUser(
                    storedUser
                );
            };

        window.addEventListener(
            "storage",
            syncSettings
        );

        window.addEventListener(
            "focus",
            syncSettings
        );

        window.addEventListener(
            "app-settings-change",
            syncSettings
        );

        return () => {
            window.removeEventListener(
                "storage",
                syncSettings
            );

            window.removeEventListener(
                "focus",
                syncSettings
            );

            window.removeEventListener(
                "app-settings-change",
                syncSettings
            );
        };
    }, []);

    // ==========================================================
    // NAVIGATION
    // ==========================================================

    const navItems = [
        {
            key: "/feed",

            icon: (
                <CompassOutlined />
            ),

            label:
                t.feedMenu ||
                "Explore",
        },

        {
            key: "/projects",

            icon: (
                <ProjectOutlined />
            ),

            label:
                t.projectsMenu ||
                "Projects",
        },
    ];

    // ==========================================================
    // PROFILE POPOVER
    // ==========================================================

    const profilePopover = (
        <div
            style={{
                width: 220,
                padding: 5,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems:
                        "center",
                    gap: 10,
                    marginBottom: 14,
                }}
            >
                <Avatar
                    src={
                        currentUser?.avatar
                    }
                    icon={
                        <UserOutlined />
                    }
                    size={42}
                />

                <div
                    style={{
                        minWidth: 0,
                    }}
                >
                    <Text
                        strong
                        ellipsis
                        style={{
                            display:
                                "block",
                            fontSize: 13,
                        }}
                    >
                        {currentUser?.fullName ||
                            currentUser?.name ||
                            "User"}
                    </Text>

                    <Text
                        type="secondary"
                        ellipsis
                        style={{
                            display:
                                "block",
                            fontSize: 11,
                        }}
                    >
                        @
                        {currentUser?.username ||
                            "username"}
                    </Text>
                </div>
            </div>

            <Button
                block
                type="default"
                icon={
                    <UserOutlined />
                }
                onClick={() =>
                    navigate(
                        "/profile"
                    )
                }
                style={{
                    marginBottom: 7,
                    borderRadius: 9,
                }}
            >
                {t.profileMenu ||
                    "Profile"}
            </Button>

            <Button
                block
                type="default"
                icon={
                    <SettingOutlined />
                }
                onClick={() =>
                    navigate(
                        "/settings"
                    )
                }
                style={{
                    borderRadius: 9,
                }}
            >
                {t.settingsTitle ||
                    "Settings"}
            </Button>
        </div>
    );

    // ==========================================================
    // LOGO
    // ==========================================================

    const currentLogo =
        isDarkMode
            ? logoDark
            : logoLight;

    // ==========================================================
    // RENDER
    // ==========================================================

    return (
        <ConfigProvider
            theme={{
                algorithm:
                    isDarkMode
                        ? theme.darkAlgorithm
                        : theme.defaultAlgorithm,
            }}
        >
            <div
                style={{
                    position:
                        "fixed",

                    top: 16,

                    left: "50%",

                    transform:
                        "translateX(-50%)",

                    zIndex: 1000,

                    width:
                        "calc(100% - 32px)",

                    maxWidth: 1080,

                    height: 64,

                    borderRadius: 32,

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "space-between",

                    padding:
                        "0 20px 0 18px",

                    boxSizing:
                        "border-box",

                    background:
                        isDarkMode
                            ? "rgba(18, 26, 36, 0.65)"
                            : "rgba(255, 255, 255, 0.7)",

                    backdropFilter:
                        "blur(24px) saturate(200%)",

                    WebkitBackdropFilter:
                        "blur(24px) saturate(200%)",

                    border: `1px solid ${isDarkMode
                        ? "rgba(255,255,255,0.18)"
                        : "rgba(255,255,255,0.8)"
                        }`,

                    boxShadow:
                        isDarkMode
                            ? "0 16px 40px rgba(0,0,0,0.5)"
                            : "0 16px 40px rgba(0,0,0,0.08)",

                    transition:
                        "all .3s ease",
                }}
            >
                {/* =====================================================
            LOGO
        ===================================================== */}

                <div
                    onClick={() =>
                        navigate(
                            "/feed"
                        )
                    }
                    style={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        cursor:
                            "pointer",

                        minWidth: 0,
                    }}
                >
                    <img
                        src={
                            currentLogo
                        }
                        alt="MatchHub"
                        draggable="false"
                        style={{
                            display:
                                "block",

                            width:
                                "auto",

                            height:
                                28,

                            maxWidth:
                                160,

                            objectFit:
                                "contain",
                        }}
                    />
                </div>

                {/* =====================================================
            CAPSULE MENU
        ===================================================== */}

                <div
                    style={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap: 6,

                        background:
                            isDarkMode
                                ? "rgba(0,0,0,.35)"
                                : "rgba(0,0,0,.05)",

                        padding:
                            "4px 6px",

                        borderRadius: 24,

                        border: `1px solid ${isDarkMode
                            ? "rgba(255,255,255,.05)"
                            : "rgba(0,0,0,.03)"
                            }`,
                    }}
                >
                    {navItems.map(
                        (item) => {
                            const isActive =
                                location.pathname ===
                                item.key;

                            return (
                                <div
                                    key={
                                        item.key
                                    }
                                    onClick={() =>
                                        navigate(
                                            item.key
                                        )
                                    }
                                    style={{
                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        gap: 8,

                                        padding:
                                            "8px 18px",

                                        borderRadius:
                                            20,

                                        cursor:
                                            "pointer",

                                        fontSize:
                                            15,

                                        fontWeight:
                                            isActive
                                                ? 600
                                                : 500,

                                        color:
                                            isActive
                                                ? "#FFFFFF"
                                                : isDarkMode
                                                    ? "#C0C9D0"
                                                    : "#4A5568",

                                        background:
                                            isActive
                                                ? "linear-gradient(135deg,#31708E 0%,#5085A5 100%)"
                                                : "transparent",

                                        boxShadow:
                                            isActive
                                                ? "0 4px 14px rgba(49,112,142,.35)"
                                                : "none",

                                        transition:
                                            "all .25s ease",
                                    }}
                                >
                                    {React.cloneElement(
                                        item.icon,
                                        {
                                            style: {
                                                fontSize:
                                                    17,
                                            },
                                        }
                                    )}

                                    <span>
                                        {
                                            item.label
                                        }
                                    </span>
                                </div>
                            );
                        }
                    )}
                </div>

                {/* =====================================================
            AVATAR
        ===================================================== */}

                <Popover
                    content={
                        profilePopover
                    }
                    trigger="click"
                    placement="bottomRight"
                >
                    <div
                        style={{
                            cursor:
                                "pointer",

                            display:
                                "flex",

                            alignItems:
                                "center",
                        }}
                    >
                        <Avatar
                            src={
                                currentUser?.avatar
                            }
                            icon={
                                <UserOutlined />
                            }
                            size={40}
                            style={{
                                border:
                                    "2px solid #31708E",

                                boxShadow:
                                    "0 4px 10px rgba(0,0,0,.15)",
                            }}
                        />
                    </div>
                </Popover>
            </div>
        </ConfigProvider>
    );
};

export default Navbar;