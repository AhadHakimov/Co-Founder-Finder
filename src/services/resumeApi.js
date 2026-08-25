const API_URL = "https://6a7700dd63e9caf860c33d99.mockapi.io/users";

// User rezyumesini olish
export const getUserResume = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/${userId}`);
    if (!response.ok) throw new Error("Ma'lumot topilmadi");
    const data = await response.json();
    return data.resumeData || null;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};

// User rezyumesini saqlash yoki yangilash
export const saveUserResume = async (userId, resumeData) => {
  try {
    const response = await fetch(`${API_URL}/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeData })
    });
    return await response.json();
  } catch (error) {
    console.error("Save Error:", error);
    throw error;
  }
};