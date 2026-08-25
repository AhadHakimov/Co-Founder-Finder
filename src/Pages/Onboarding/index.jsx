import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://6a7700dd63e9caf860c33d99.mockapi.io/users";

const Onboarding = () => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const [userType, setUserType] = useState("job_seeker");
    const [primaryGoal, setPrimaryGoal] = useState("Ish qidirish");
    const [selectedSkills, setSelectedSkills] = useState([]);

    const skillOptions = ["Frontend", "Backend", "Startups", "UI/UX", "Marketing", "DevOps"];

    const handleSkillToggle = (skill) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter((s) => s !== skill));
        } else {
            setSelectedSkills([...selectedSkills, skill]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!currentUser) return;

        // MockAPI'da faqat ushbu user'ni yangilash (PUT request)
        const updatedUser = {
            ...currentUser,
            userType,
            primaryGoal,
            skills: selectedSkills,
            isOnboarded: true,
        };

        fetch(`${API_URL}/${currentUser.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedUser),
        })
            .then((res) => res.json())
            .then((data) => {
                localStorage.setItem("currentUser", JSON.stringify(data));
                alert("Onboarding muvaffaqiyatli yakunlandi!");
                navigate("/feed");
                window.location.reload();
            })
            .catch((err) => console.error("Onboarding xatoligi:", err));
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Aqlli Kirish va Moslashuv (Onboarding)</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "400px" }}>
                <div>
                    <label><strong>Sizning rolingiz:</strong></label>
                    <select value={userType} onChange={(e) => setUserType(e.target.value)} style={{ width: "100%", marginTop: "5px" }}>
                        <option value="job_seeker">Ish qidiruvchi</option>
                        <option value="recruiter">Xodim qidiruvchi (Recruiter)</option>
                        <option value="co_founder">Startup hamkor qidiruvchi</option>
                    </select>
                </div>

                <div>
                    <label><strong>Asosiy maqsadingiz:</strong></label>
                    <select value={primaryGoal} onChange={(e) => setPrimaryGoal(e.target.value)} style={{ width: "100%", marginTop: "5px" }}>
                        <option value="Ish qidirish">Ish qidirish</option>
                        <option value="Hamkor topish">Hamkor / Co-founder topish</option>
                        <option value="Portfolio yaratish">Portfolio yaratish</option>
                    </select>
                </div>

                <div>
                    <label><strong>Yo'nalishlaringizni tanlang (Multi-select):</strong></label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "5px" }}>
                        {skillOptions.map((skill) => (
                            <button
                                type="button"
                                key={skill}
                                onClick={() => handleSkillToggle(skill)}
                                style={{
                                    background: selectedSkills.includes(skill) ? "black" : "#eee",
                                    color: selectedSkills.includes(skill) ? "white" : "black",
                                    border: "1px solid #ccc",
                                    padding: "5px 10px",
                                    cursor: "pointer"
                                }}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>

                <button type="submit" style={{ padding: "10px", cursor: "pointer" }}>
                    Saqlash va Davom etish
                </button>
            </form>
        </div>
    );
};

export default Onboarding;