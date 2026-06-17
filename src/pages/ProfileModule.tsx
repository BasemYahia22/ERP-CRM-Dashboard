import React, { useState } from "react";
import { useAppStore } from "../stores/store";
import { translations } from "../i18n/translations";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import {
  User,
  Mail,
  Shield,
  Phone,
  MapPin,
  Award,
  CheckCircle2,
} from "lucide-react";

export const ProfileModule: React.FC = () => {
  const { currentUser, updateProfile, language, addToast } = useAppStore();
  const t = translations[language];

  const [name, setName] = useState(currentUser?.name || "System Admin");
  const [email, setEmail] = useState(currentUser?.email || "admin@compact.com");
  const [role, setRole] = useState("Senior Administrator");
  const [phone, setPhone] = useState("+1 (555) 234-5678");
  const [location, setLocation] = useState("New York, USA");
  const [avatarUrl, setAvatarUrl] = useState(
    currentUser?.avatarUrl ||
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const presetAvatars = [
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim())
      newErrors.name = language === "ar" ? "الاسم مطلوب" : "Name is required";
    if (!email.trim())
      newErrors.email =
        language === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Call updateProfile in store
    if (updateProfile) {
      updateProfile({ name, email, avatarUrl });
    }

    addToast(
      language === "ar"
        ? "تم تحديث الملف الشخصي بنجاح"
        : "Profile updated successfully!",
      "success",
    );
  };

  const isAr = language === "ar";

  return (
    <div className="space-y-6 animate-fade-in-up" dir={isAr ? "rtl" : "ltr"}>
      {/* Page Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          {isAr ? "الملف الشخصي للمشرف" : "Admin Profile"}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {isAr
            ? "قم بإدارة هويتك وصورتك وإعدادات حسابك في نظام الـ ERP"
            : "Manage your system identity, avatar picture, and account settings"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar Preview */}
        <div className="lg:col-span-1 space-y-6">
          <Card
            title={isAr ? "معاينة الهوية" : "Identity Card"}
            subtitle={
              isAr
                ? "البطاقة الإدارية الحالية في النظام"
                : "Your current admin badge"
            }
          >
            <div className="flex flex-col items-center text-center p-4">
              <div className="relative group">
                <img
                  src={avatarUrl}
                  alt={name || "Admin"}
                  className="h-28 w-28 rounded-2xl border-2 border-indigo-500 shadow-md object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <span className="absolute -bottom-2 -right-2 bg-indigo-500 text-white p-1.5 rounded-xl shadow-md">
                  <Shield className="h-4.5 w-4.5" />
                </span>
              </div>

              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white mt-5">
                {name}
              </h2>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest mt-1 block px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40">
                {role}
              </span>

              <div className="w-full border-t border-slate-100 dark:border-slate-800/80 my-5" />

              <div className="w-full space-y-3.5 text-xs text-slate-600 dark:text-slate-400 text-start">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="truncate">{email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{location}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card
            title={isAr ? "أيقونات الهوية السريعة" : "Quick Presets"}
            subtitle={
              isAr
                ? "اختر صورة رمزية جاهزة بسرعة"
                : "Choose a preset professional avatar"
            }
          >
            <div className="flex justify-center gap-3 py-2 flex-wrap">
              {presetAvatars.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatarUrl(url)}
                  className={`relative rounded-xl overflow-hidden h-12 w-12 border-2 transition-all duration-150 cursor-pointer hover:scale-105 hover:shadow-sm
                    ${avatarUrl === url ? "border-indigo-500 scale-105 ring-2 ring-indigo-500/20" : "border-slate-200 dark:border-slate-800"}`}
                >
                  <img
                    src={url}
                    className="h-full w-full object-cover"
                    alt="avatar option"
                  />
                  {avatarUrl === url && (
                    <div className="absolute inset-0 bg-indigo-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-300 drop-shadow-sm" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Editable Fields */}
        <div className="lg:col-span-2">
          <Card
            title={isAr ? "تعديل البيانات الشخصية" : "Personal Details"}
            subtitle={
              isAr
                ? "حافظ على تحديث معلومات الاتصال والاسم الخاص بك"
                : "Keep your contact profile up to date"
            }
          >
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={
                    isAr ? "الاسم الكامل للعميل / المدير" : "Full Admin Name"
                  }
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name)
                      setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  error={errors.name}
                  leftIcon={<User className="h-4 w-4 text-slate-400" />}
                />

                <Input
                  label={
                    isAr ? "العنوان الإلكتروني للدخول" : "Login Email Address"
                  }
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  error={errors.email}
                  leftIcon={<Mail className="h-4 w-4 text-slate-400" />}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={isAr ? "المسمى الوظيفي" : "Administrative Role"}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  leftIcon={<Award className="h-4 w-4 text-slate-400" />}
                />

                <Input
                  label={isAr ? "رقم هاتف الاتصال" : "Direct Phone Number"}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  leftIcon={<Phone className="h-4 w-4 text-slate-400" />}
                />
              </div>

              <Input
                label={isAr ? "الموقع الجغرافي / المكتب" : "Location / Office"}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                leftIcon={<MapPin className="h-4 w-4 text-slate-400" />}
              />

              <Input
                label={
                  isAr
                    ? "رابط خروج الصورة الرمزية (مخصص)"
                    : "Custom Avatar Image URL"
                }
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary">
                  {t.save}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
