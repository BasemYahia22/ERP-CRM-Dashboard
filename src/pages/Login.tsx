import React, { useState } from "react";
import { useAppStore } from "../stores/store";
import { translations } from "../i18n/translations";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Eye, EyeOff, Mail, Lock,UserCheck, ShieldCheck, Globe } from "lucide-react";

export const Login: React.FC = () => {
  const { login, language, setLanguage, navigateTo, addToast } = useAppStore();
  const t = translations[language];

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState('');

  const validate = () => {
    let isValid = true;
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

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    // Simulate database lookup latency
    setTimeout(() => {
      // Mock login always successful for any valid-looking address in ERP preview
      const success = login(
        email,
        email.split("@")[0].toUpperCase(),
        rememberMe,
      );
      setIsLoading(false);
      if (success) {
        addToast(t.toast_login_success, "success");
      } else {
        addToast(t.invalid_credentials, "error");
      }
    }, 1200);
  };

    const handleGuestLogin = () => {
    setError('');
    login('demo@example.com', language === 'ar' ? 'مستخدم زائر' : 'Guest Account');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
      {/* Absolute Header with localized language toggler */}
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

      {/* Main card panel */}
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-2xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800/80 flex grid-cols-1 md:grid-cols-2 min-h-[550px] anim-fade-in">
        {/* Left Form Branding Grid Col */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8.5 w-8.5 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-slate-950 dark:text-white tracking-tight uppercase text-sm">
              Compact ERP / CRM
            </span>
          </div>

          <div className="my-8">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              {t.login}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              {t.login_subtitle}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
              <Input
                label={t.email}
                type="email"
                placeholder="admin@compact-erp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                leftIcon={<Mail className="h-4 w-4" />}
                id="login-email"
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
                id="login-pass"
                disabled={isLoading}
              />

              <div className="flex items-center justify-between mt-1 text-xs">
                <label className="flex items-center gap-2 text-slate-650 dark:text-slate-350 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-550 h-3.5 w-3.5 dark:border-slate-800"
                    disabled={isLoading}
                  />
                  <span>{t.remember_me}</span>
                </label>
                <button
                  type="button"
                  className="text-indigo-600 hover:underline font-semibold dark:text-indigo-400 cursor-pointer"
                  onClick={() =>
                    addToast(
                      "This is a demo. All administrative passwords can be recovered by logging in with generic inputs.",
                      "info",
                    )
                  }
                >
                  {t.forgot_password}
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-4 font-bold rounded-xl py-2.5"
                isLoading={isLoading}
              >
                {t.login}
              </Button>
            </form>
          </div>

          <div className="text-center text-xs text-slate-500">
            <button
              onClick={() => {
                navigateTo("signup");
              }}
              className="text-indigo-650 dark:text-indigo-400 hover:underline font-bold cursor-pointer"
            >
              {t.no_account}
            </button>
          </div>
          {/* PROMINENT GUEST LOGIN BUTTON */}
        <Button
          type="button"
          variant="secondary"
          onClick={handleGuestLogin}
          className="w-full border border-indigo-150 dark:border-indigo-900/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold"
        >
          <UserCheck className="h-4 w-4 flex-shrink-0" />
          <span>{language === 'ar' ? 'الدخول السريع كزائر' : 'Guest Sign In (Instant Access)'}</span>
        </Button>
        </div>

        {/* Right Info Branding Banner Grid Col */}
        <div className="hidden md:flex md:w-1/2 bg-indigo-600 dark:bg-indigo-950 p-12 text-white flex-col justify-between relative overflow-hidden">
          {/* Subtle background circles */}
          <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-indigo-500/10 dark:bg-indigo-800/10 border border-white/5" />
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
              {t.login_title}
            </h3>
            <p className="text-xs text-indigo-155 dark:text-indigo-300 mt-4 leading-relaxed">
              {t.login_description}
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
