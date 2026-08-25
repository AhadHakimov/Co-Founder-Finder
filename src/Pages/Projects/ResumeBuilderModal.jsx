import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Template10 from "./templates/Template10"; // Template10 faylingiz yo'lini tekshirib oling
import { saveUserResume, getUserResume } from "../../services/resumeApi";

export default function ResumeBuilderModal({ userId = "1", isOpen, onClose }) {
  const [loading, setLoading] = React.useState(false);

  const { register, control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      personalInfo: {
        firstName: "",
        lastName: "",
        professionalTitle: "",
        profilePhoto: "",
        email: "",
        phone: "",
        location: ""
      },
      professionalSummary: "",
      workExperience: [{ company: "", position: "", dates: "", responsibilities: "" }],
      education: [{ institution: "", degree: "", dates: "", description: "" }],
      skills: [{ name: "" }],
      references: [{ name: "", title: "", company: "", phone: "", address: "" }]
    }
  });

  // Dynamic inputlar uchun field-arraylar
  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: "workExperience" });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: "education" });
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control, name: "skills" });

  // Real-time preview uchun o'zgarishlarni kuzatish
  const formData = watch();

  // Modal ochilganda mavjud ma'lumotlarni MockAPI'dan yuklab olish
  useEffect(() => {
    if (isOpen && userId) {
      getUserResume(userId).then((data) => {
        if (data) reset(data);
      });
    }
  }, [isOpen, userId, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await saveUserResume(userId, data);
      alert("Rezume muvaffaqiyatli saqlandi!");
      onClose();
    } catch (err) {
      alert("Saqlashda xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        
        {/* CHAP TOMON: FORM */}
        <div style={formContainerStyle}>
          <h2 style={{ fontSize: "20px", marginBottom: "15px" }}>Rezume Ma'lumotlarini To'ldiring</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            
            {/* Shaxsiy Ma'lumotlar */}
            <fieldset style={fieldsetStyle}>
              <legend style={legendStyle}>Shaxsiy Ma'lumotlar</legend>
              <input {...register("personalInfo.firstName")} placeholder="Ism" style={inputStyle} />
              <input {...register("personalInfo.lastName")} placeholder="Familiya" style={inputStyle} />
              <input {...register("personalInfo.professionalTitle")} placeholder="Kasb (Masalan: Dental Assistant)" style={inputStyle} />
              <input {...register("personalInfo.profilePhoto")} placeholder="Rasm URL havolasi" style={inputStyle} />
              <input {...register("personalInfo.email")} placeholder="Email" style={inputStyle} />
              <input {...register("personalInfo.phone")} placeholder="Telefon" style={inputStyle} />
              <input {...register("personalInfo.location")} placeholder="Manzil" style={inputStyle} />
            </fieldset>

            {/* Summary */}
            <fieldset style={fieldsetStyle}>
              <legend style={legendStyle}>O'zingiz haqingizda (Summary)</legend>
              <textarea {...register("professionalSummary")} placeholder="Qisqacha ma'lumot..." style={textareaStyle} />
            </fieldset>

            {/* Ish Tajribasi */}
            <fieldset style={fieldsetStyle}>
              <legend style={legendStyle}>Ish Tajribasi</legend>
              {expFields.map((field, index) => (
                <div key={field.id} style={dynamicBlockStyle}>
                  <input {...register(`workExperience.${index}.company`)} placeholder="Kompaniya nomi" style={inputStyle} />
                  <input {...register(`workExperience.${index}.position`)} placeholder="Lavozim" style={inputStyle} />
                  <input {...register(`workExperience.${index}.dates`)} placeholder="Sana (Masalan: 2023 - 2025)" style={inputStyle} />
                  <textarea {...register(`workExperience.${index}.responsibilities`)} placeholder="Majburiyatlar" style={textareaStyle} />
                  <button type="button" onClick={() => removeExp(index)} style={deleteBtnStyle}>O'chirish</button>
                </div>
              ))}
              <button type="button" onClick={() => appendExp({ company: "", position: "", dates: "", responsibilities: "" })} style={addBtnStyle}>
                + Tajriba qo'shish
              </button>
            </fieldset>

            {/* Ta'lim */}
            <fieldset style={fieldsetStyle}>
              <legend style={legendStyle}>Ta'lim</legend>
              {eduFields.map((field, index) => (
                <div key={field.id} style={dynamicBlockStyle}>
                  <input {...register(`education.${index}.institution`)} placeholder="O'quv muassasasi" style={inputStyle} />
                  <input {...register(`education.${index}.degree`)} placeholder="Daraja / Yo'nalish" style={inputStyle} />
                  <input {...register(`education.${index}.dates`)} placeholder="Yillar" style={inputStyle} />
                  <button type="button" onClick={() => removeEdu(index)} style={deleteBtnStyle}>O'chirish</button>
                </div>
              ))}
              <button type="button" onClick={() => appendEdu({ institution: "", degree: "", dates: "" })} style={addBtnStyle}>
                + Ta'lim qo'shish
              </button>
            </fieldset>

            {/* Ko'nikmalar */}
            <fieldset style={fieldsetStyle}>
              <legend style={legendStyle}>Ko'nikmalar (Skills)</legend>
              {skillFields.map((field, index) => (
                <div key={field.id} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                  <input {...register(`skills.${index}.name`)} placeholder="Ko'nikma (Masalan: React)" style={inputStyle} />
                  <button type="button" onClick={() => removeSkill(index)} style={deleteBtnStyle}>X</button>
                </div>
              ))}
              <button type="button" onClick={() => appendSkill({ name: "" })} style={addBtnStyle}>
                + Ko'nikma qo mezonini qo'shish
              </button>
            </fieldset>

            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button type="submit" disabled={loading} style={saveBtnStyle}>
                {loading ? "Saqlanmoqda..." : "MockAPI'ga Saqlash"}
              </button>
              <button type="button" onClick={onClose} style={closeBtnStyle}>Yopish</button>
            </div>
          </form>
        </div>

        {/* O'NG TOMON: REAL-TIME LIVE PREVIEW */}
        <div style={previewContainerStyle}>
          <div style={{ transform: "scale(0.65)", transformOrigin: "top left" }}>
            <Template10 data={formData} />
          </div>
        </div>

      </div>
    </div>
  );
}

const modalOverlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center" };
const modalContentStyle = { width: "95vw", height: "90vh", backgroundColor: "#fff", borderRadius: "12px", display: "flex", overflow: "hidden" };
const formContainerStyle = { width: "45%", padding: "20px", overflowY: "auto", borderRight: "1px solid #ddd" };
const previewContainerStyle = { width: "55%", padding: "20px", overflowY: "auto", backgroundColor: "#f3f4f6" };
const fieldsetStyle = { marginBottom: "15px", borderRadius: "8px", border: "1px solid #ccc", padding: "12px" };
const legendStyle = { fontWeight: "bold", padding: "0 5px" };
const inputStyle = { width: "100%", padding: "8px", marginBottom: "8px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" };
const textareaStyle = { width: "100%", padding: "8px", marginBottom: "8px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box", minHeight: "60px" };
const dynamicBlockStyle = { borderBottom: "1px dashed #bbb", paddingBottom: "10px", marginBottom: "10px" };
const addBtnStyle = { padding: "6px 12px", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" };
const deleteBtnStyle = { padding: "4px 8px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" };
const saveBtnStyle = { flex: 1, padding: "12px", backgroundColor: "#1f6059", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" };
const closeBtnStyle = { padding: "12px 20px", backgroundColor: "#6b7280", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" };