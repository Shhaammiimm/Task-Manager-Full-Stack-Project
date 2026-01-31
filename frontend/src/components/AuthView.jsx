import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";
import * as api from "../api/client";

export default function AuthView() {
  const [view, setView] = useState("login"); // login | register | forgot | reset
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const { login, register } = useAuth();
  const { show } = useToast();
  const { dark, toggle } = useTheme();

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register
  const [regFirst, setRegFirst] = useState("");
  const [regLast, setRegLast] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Forgot
  const [forgotEmail, setForgotEmail] = useState("");

  // Reset
  const [resetCode, setResetCode] = useState("");
  const [resetPassword, setResetPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      show("Login successful!", "success");
    } catch (err) {
      show(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({
        firstName: regFirst,
        lastName: regLast,
        email: regEmail,
        mobile: regMobile,
        password: regPassword,
      });
      show("Registration successful! Please login.", "success");
      setView("login");
    } catch (err) {
      show(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.emailVerify(forgotEmail);
      setResetEmail(forgotEmail);
      setView("reset");
      show("Reset code sent to your email!", "success");
    } catch (err) {
      show(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.resetPassword({ email: resetEmail, code: resetCode, password: resetPassword });
      show("Password reset! Please login.", "success");
      setView("login");
    } catch (err) {
      show(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const formClass = "max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fade-in";
  const inputClass =
    "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary";
  const labelClass = "block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2";
  const btnClass =
    "w-full bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 relative">
      <button
        onClick={toggle}
        className="absolute top-4 right-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        title={dark ? "Light mode" : "Dark mode"}
      >
        {dark ? "☀️" : "🌙"}
      </button>
      <div className="w-full max-w-md">
        {view === "login" && (
          <form onSubmit={handleLogin} className={formClass}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Login</h2>
            <div className="mb-4">
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div className="mb-6">
              <label className={labelClass}>Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <button type="submit" className={btnClass} disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>
            <div className="mt-4 flex justify-between text-sm">
              <button type="button" onClick={() => setView("register")} className="text-primary hover:underline">
                Register
              </button>
              <button type="button" onClick={() => setView("forgot")} className="text-primary hover:underline">
                Forgot Password?
              </button>
            </div>
          </form>
        )}

        {view === "register" && (
          <form onSubmit={handleRegister} className={formClass}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Register</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>First Name</label>
                <input
                  type="text"
                  value={regFirst}
                  onChange={(e) => setRegFirst(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input
                  type="text"
                  value={regLast}
                  onChange={(e) => setRegLast(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div className="mb-4">
              <label className={labelClass}>Mobile</label>
              <input
                type="tel"
                value={regMobile}
                onChange={(e) => setRegMobile(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div className="mb-6">
              <label className={labelClass}>Password</label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <button type="submit" className={btnClass} disabled={loading}>
              {loading ? "Loading..." : "Register"}
            </button>
            <p className="mt-4 text-center text-sm">
              <button type="button" onClick={() => setView("login")} className="text-primary hover:underline">
                Already have an account? Login
              </button>
            </p>
          </form>
        )}

        {view === "forgot" && (
          <form onSubmit={handleForgot} className={formClass}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Reset Password</h2>
            <div className="mb-6">
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <button type="submit" className={btnClass} disabled={loading}>
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
            <p className="mt-4 text-center">
              <button type="button" onClick={() => setView("login")} className="text-primary hover:underline text-sm">
                Back to Login
              </button>
            </p>
          </form>
        )}

        {view === "reset" && (
          <form onSubmit={handleReset} className={formClass}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Enter Reset Code</h2>
            <div className="mb-4">
              <label className={labelClass}>Verification Code</label>
              <input
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div className="mb-6">
              <label className={labelClass}>New Password</label>
              <input
                type="password"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <button type="submit" className={btnClass} disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
            <p className="mt-4 text-center">
              <button type="button" onClick={() => setView("login")} className="text-primary hover:underline text-sm">
                Back to Login
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
