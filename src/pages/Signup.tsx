import React, { useState } from "react";
import { useAppStore } from "../stores/store";
import { translations } from "../i18n/translations";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User as UserIcon,
  ShieldCheck,
  Globe,
} from "lucide-react";

export const Signup: React.FC = () => {
  const { signup, language, setLanguage, navigateTo, addToast } = useAppStore();
  const t = translations[language];

  // States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation errors
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validate = () => {
    let isValid = true;

    if (!fullName) {
      setNameError(t.required_field);
      isValid = false;
    } else {
      setNameError("");
    }

    if (!email) {
      setEmailError(t.required_field);
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError(t.required_field);
      isValid = false;
    } else if (password.length < 5) {
      setPasswordError("Password must be at least 5 characters long");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!confirmPassword) {
      setConfirmPasswordError(t.required_field);
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError(t.passwords_dont_match);
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    setTimeout(() => {
      const success = signup(fullName, email);
      setIsLoading(false);
      if (success) {
        addToast(t.toast_signup_success, "success");
      } else {
        addToast("Error creating account. Please try again.", "error");
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
      {/* Language Switch Absolute Flag */}
      <div className="absolute top-6 inset-e-6 flex items-center gap-2 z-10">
        <button
          onClick={() => {
            const nextLang = language === "en" ? "ar" : "en";
            setLanguage(nextLang);
            addToast(translations[nextLang].toast_language_switched, "success");
          }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Globe className="h-3.5 w-3.5 text-indigo-500" />
          <span>{language === "en" ? "العربية" : "English"}</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-2xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800/80 flex grid-cols-1 md:grid-cols-2 min-h-[550px] anim-fade-in">
        {/* Left Form Grid Col */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8.5 w-8.5 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-slate-950 dark:text-white tracking-tight uppercase text-sm">
              Compact ERP / CRM
            </span>
          </div>

          <div className="my-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              {t.signup}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              {t.signup_subtitle}
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 flex flex-col gap-3.5"
            >
              <Input
                label={t.full_name}
                type="text"
                placeholder="Systems Architect Manager"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={nameError}
                leftIcon={<UserIcon className="h-4 w-4" />}
                id="signup-name"
                disabled={isLoading}
              />

              <Input
                label={t.email}
                type="email"
                placeholder="manager@compact-erp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                leftIcon={<Mail className="h-4 w-4" />}
                id="signup-email"
                disabled={isLoading}
              />

              <Input
                label={t.password}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                leftIcon={<Lock className="h-4 w-4" />}
                id="signup-pass"
                disabled={isLoading}
              />

              <Input
                label={t.confirm_password}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPasswordError}
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 outline-none cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
                id="signup-confirm"
                disabled={isLoading}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-3 font-bold rounded-xl py-2.5"
                isLoading={isLoading}
              >
                {t.signup}
              </Button>
            </form>
          </div>

          <div className="text-center text-xs text-slate-500">
            <button
              onClick={() => navigateTo("login")}
              className="text-indigo-650 dark:text-indigo-400 hover:underline font-bold cursor-pointer"
            >
              {t.have_account}
            </button>
          </div>
        </div>

        {/* Right Promo Banner Grid Col */}
        <div className="hidden md:flex md:w-1/2 bg-indigo-600 dark:bg-indigo-950 p-12 text-white flex-col justify-between relative overflow-hidden">
          {/* Subtle background items */}
          <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-indigo-505/10 dark:bg-indigo-800/10 border border-white/5" />
          <div className="absolute -bottom-24 -right-12 h-96 w-96 rounded-full bg-indigo-550/20 dark:bg-indigo-800/20 border border-white/5" />

          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-indigo-200">
            <span>{t.sass}</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{t.production}</span>
            </span>
          </div>

          <div className="my-auto max-w-sm">
            <h3 className="text-2xl font-black tracking-tight leading-tight">
              {t.signup_title}
            </h3>
            <p className="text-xs text-indigo-155 dark:text-indigo-300 mt-4 leading-relaxed font-normal">
              {t.signup_description}
            </p>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-indigo-200 divide-x divide-indigo-500/30">
            <div>
              <p className="font-bold text-white text-sm">99.98%</p>
              <p className="mt-0.5">Core Uptime</p>
            </div>
            <div className="ps-4">
              <p className="font-bold text-white text-sm">3.4 ms</p>
              <p className="mt-0.5">Database Delay</p>
            </div>
            <div className="ps-4">
              <p className="font-bold text-white text-sm">AES-256</p>
              <p className="mt-0.5">Secure Tunneling</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
