import React, { useState, useEffect } from "react";
import api from "../services/api";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import app from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Chrome,
  ArrowRight,
  BookOpen,
  Shield,
  X,
  KeyRound,
  CheckCircle,
} from "lucide-react";
import "../styles/Login.css";

/*  Firebase Setup */
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

/* Component  */
const Login = () => {
  const [step, setStep] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [resetCode, setResetCode] = useState(["", "", "", "", "", ""]);

  const [error, setError] = useState("");

  /*  Effects */
  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    if (navbar) navbar.style.display = "none";
    return () => {
      if (navbar) navbar.style.display = "block";
    };
  }, []);

  useEffect(() => {
    const particles = document.querySelector(".login-particles");
    if (!particles) return;
    for (let i = 0; i < 20; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDelay = `${Math.random() * 20}s`;
      p.style.animationDuration = `${15 + Math.random() * 10}s`;
      particles.appendChild(p);
    }
    return () => {
      while (particles.firstChild) particles.removeChild(particles.firstChild);
    };
  }, []);

  /*  AUTH HANDLERS  */

  // Firebase Google Login
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      const { data } = await api.post("/auth/google-login", { token });

      alert(data.message || "OTP sent to your email");
      setEmail(result.user.email);
      setStep("verify");
    } catch (err) {
      console.error(err);
      setError("Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) return setError("Please enter both email and password");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email");
    setIsLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/login", { email, password });
      alert(data.message || "OTP sent to your email");
      setStep("verify");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) return setError("Please fill in all fields");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email");
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (password.length < 8) return setError("Password must be at least 8 characters");
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
      return setError("Password must contain uppercase, lowercase, and numbers");
    }

    setIsLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/signup", { email, password });
      alert(data.message || "Signup successful! OTP sent");
      setStep("verify");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return setError("Please enter your email");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email");
    setIsLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      alert(data.message || "Reset code sent to email");
      setStep("reset-verify");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyResetCode = async () => {
    const otp = resetCode.join("");
    if (otp.length !== 6) return setError("Please enter all 6 digits");
    setIsLoading(true);
    setError("");

    try {
      await api.post("/auth/verify-reset-otp", { email, otp });
      setStep("reset-password");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid code");
      setResetCode(["", "", "", "", "", ""]);
      document.getElementById("reset-code-input-0")?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmNewPassword) return setError("Please fill in all fields");
    if (newPassword !== confirmNewPassword) return setError("Passwords do not match");
    if (newPassword.length < 8) return setError("Password must be at least 8 characters");
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      return setError("Password must contain uppercase, lowercase, and numbers");
    }
    setIsLoading(true);
    setError("");

    try {
      await api.post("/auth/reset-password", { email, password: newPassword });
      alert("✅ Password reset successful!");
      setNewPassword("");
      setConfirmNewPassword("");
      setResetCode(["", "", "", "", "", ""]);
      setStep("login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    const otp = verificationCode.join("");
    if (otp.length !== 6) return setError("Please enter all 6 digits");

    setIsLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/verify-otp", { email, otp });
      alert(data.message || "✅ Login successful!");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid code");
      setVerificationCode(["", "", "", "", "", ""]);
      document.getElementById("code-input-0")?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError("");
    try {
      await api.post("/auth/resend-otp", { email });
      alert("📧 Code resent!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendResetCode = async () => {
    setIsLoading(true);
    setError("");
    try {
      await api.post("/auth/resend-reset-otp", { email });
      alert("📧 New reset code sent!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  /* UI HELPERS  */

  const handleVerificationCodeChange = (idx, val, isReset = false) => {
    const arr = isReset ? resetCode : verificationCode;
    const setArr = isReset ? setResetCode : setVerificationCode;
    const pfx = isReset ? "reset-code-input" : "code-input";

    if (val.length > 1) {
      const paste = val.slice(0, 6).split("");
      const newArr = [...arr];
      paste.forEach((c, i) => {
        if (idx + i < 6 && /^\d$/.test(c)) newArr[idx + i] = c;
      });
      setArr(newArr);
      document.getElementById(`${pfx}-${Math.min(idx + paste.length, 5)}`)?.focus();
      return;
    }

    if (!/^\d*$/.test(val)) return;

    const newArr = [...arr];
    newArr[idx] = val;
    setArr(newArr);

    if (val && idx < 5) document.getElementById(`${pfx}-${idx + 1}`)?.focus();
  };

  const handleVerificationCodeKeyDown = (idx, e, isReset = false) => {
    const arr = isReset ? resetCode : verificationCode;
    const setArr = isReset ? setResetCode : setVerificationCode;
    const pfx = isReset ? "reset-code-input" : "code-input";

    if (e.key === "Backspace") {
      if (!arr[idx] && idx > 0) {
        document.getElementById(`${pfx}-${idx - 1}`)?.focus();
      } else {
        const newArr = [...arr];
        newArr[idx] = "";
        setArr(newArr);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault();
      if (step === "login") handleEmailLogin();
      else if (step === "signup") handleSignup();
      else if (step === "verify") handleVerifyCode();
      else if (step === "forgot-password") handleForgotPassword();
      else if (step === "reset-verify") handleVerifyResetCode();
      else if (step === "reset-password") handleResetPassword();
    }
  };

  const switchToSignup = () => {
    setStep("signup");
    setError("");
    setPassword("");
    setConfirmPassword("");
  };

  const switchToLogin = () => {
    setStep("login");
    setError("");
    setPassword("");
    setConfirmPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setResetCode(["", "", "", "", "", ""]);
  };

  const switchToForgotPassword = () => {
    setStep("forgot-password");
    setError("");
  };

  const backToLogin = () => {
    setStep("login");
    setError("");
    setVerificationCode(["", "", "", "", "", ""]);
    setResetCode(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const getPageTitle = () => {
    if (step === "signup") return "Create Account";
    if (step === "verify") return "Verify Your Account";
    if (step === "forgot-password") return "Reset Password";
    if (step === "reset-verify") return "Verify Reset Code";
    if (step === "reset-password") return "Create New Password";
    return "Welcome Back";
  };

  const getPageSubtitle = () => {
    if (step === "signup") return "Join 10,000+ storytellers worldwide";
    if (step === "verify") return "We've sent a code to your email";
    if (step === "forgot-password") return "Enter your email to receive a reset code";
    if (step === "reset-verify") return "Check your email for the reset code";
    if (step === "reset-password") return "Choose a strong password";
    return "Sign in to continue your journey";
  };

  /*  RENDER FUNCTIONS  */

  const renderLoginForm = () => (
    <>
      <div className="login-form-section">
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="login-social-btn"
          type="button"
        >
          <Chrome className="login-social-icon" />
          <span>Continue with Google</span>
        </button>
      </div>

      <div className="login-divider">
        <div className="login-divider-line">
          <div className="login-divider-border"></div>
        </div>
        <div className="login-divider-text">
          <span>Or continue with email</span>
        </div>
      </div>

      <div className="login-form-section">
        <div className="login-input-group">
          <label className="login-input-label" htmlFor="email-input">
            Email Address
          </label>
          <div className="login-input-wrapper">
            <Mail className="login-input-icon" />
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="you@example.com"
              className="login-input"
              autoComplete="email"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="login-input-group">
          <label className="login-input-label" htmlFor="password-input">
            Password
          </label>
          <div className="login-input-wrapper">
            <Lock className="login-input-icon" />
            <input
              id="password-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your password"
              className="login-input login-input-password"
              autoComplete="current-password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="login-password-toggle"
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        <div className="login-options">
          <label className="login-remember">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            <span>Remember me</span>
          </label>
          <button
            type="button"
            onClick={switchToForgotPassword}
            className="login-forgot-btn"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        <button
          onClick={handleEmailLogin}
          disabled={isLoading}
          className="login-submit-btn"
          type="button"
        >
          {isLoading ? (
            <>
              <div className="login-spinner"></div>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="login-submit-icon" />
            </>
          )}
        </button>
      </div>

      <div className="login-switch-link">
        Don't have an account?{" "}
        <button
          onClick={switchToSignup}
          className="login-switch-btn"
          type="button"
          disabled={isLoading}
        >
          Sign up for free →
        </button>
      </div>
    </>
  );

  const renderSignupForm = () => (
    <>
      <div className="login-form-section">
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="login-social-btn"
          type="button"
        >
          <Chrome className="login-social-icon" />
          <span>Sign up with Google</span>
        </button>
      </div>

      <div className="login-divider">
        <div className="login-divider-line">
          <div className="login-divider-border"></div>
        </div>
        <div className="login-divider-text">
          <span>Or sign up with email</span>
        </div>
      </div>

      <div className="login-form-section">
        <div className="login-input-group">
          <label className="login-input-label" htmlFor="signup-email-input">
            Email Address
          </label>
          <div className="login-input-wrapper">
            <Mail className="login-input-icon" />
            <input
              id="signup-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="you@example.com"
              className="login-input"
              autoComplete="email"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="login-input-group">
          <label className="login-input-label" htmlFor="signup-password-input">
            Password
          </label>
          <div className="login-input-wrapper">
            <Lock className="login-input-icon" />
            <input
              id="signup-password-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Create a password"
              className="login-input login-input-password"
              autoComplete="new-password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="login-password-toggle"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        <div className="login-input-group">
          <label className="login-input-label" htmlFor="confirm-password-input">
            Confirm Password
          </label>
          <div className="login-input-wrapper">
            <Lock className="login-input-icon" />
            <input
              id="confirm-password-input"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Confirm your password"
              className="login-input login-input-password"
              autoComplete="new-password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="login-password-toggle"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        <button
          onClick={handleSignup}
          disabled={isLoading}
          className="login-submit-btn"
          type="button"
        >
          {isLoading ? (
            <>
              <div className="login-spinner"></div>
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="login-submit-icon" />
            </>
          )}
        </button>
      </div>

      <div className="login-switch-link">
        Already have an account?{" "}
        <button
          onClick={switchToLogin}
          className="login-switch-btn"
          type="button"
          disabled={isLoading}
        >
          Sign in →
        </button>
      </div>
    </>
  );

  const renderForgotPasswordForm = () => (
    <>
      <div className="login-form-section">
        <div className="login-input-group">
          <label className="login-input-label" htmlFor="forgot-email-input">
            Email Address
          </label>
          <div className="login-input-wrapper">
            <Mail className="login-input-icon" />
            <input
              id="forgot-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="you@example.com"
              className="login-input"
              autoComplete="email"
              disabled={isLoading}
              autoFocus
            />
          </div>
        </div>

        <button
          onClick={handleForgotPassword}
          disabled={isLoading}
          className="login-submit-btn"
          type="button"
        >
          {isLoading ? (
            <>
              <div className="login-spinner"></div>
              <span>Sending code...</span>
            </>
          ) : (
            <>
              <span>Send Reset Code</span>
              <ArrowRight className="login-submit-icon" />
            </>
          )}
        </button>
      </div>

      <button
        onClick={backToLogin}
        className="login-back-btn"
        type="button"
        disabled={isLoading}
      >
        ← Back to login
      </button>
    </>
  );

  const renderResetVerifyForm = () => (
    <>
      <div className="login-verify-header">
        <div className="login-verify-icon-wrapper">
          <KeyRound className="login-verify-icon" />
        </div>
        <h3 className="login-verify-title">Enter Reset Code</h3>
        <p className="login-verify-description">
          Enter the 6-digit code sent to your email
        </p>
        <p className="login-verify-email">{email}</p>
      </div>

      <div className="login-code-inputs">
        {resetCode.map((d, i) => (
          <input
            key={i}
            id={`reset-code-input-${i}`}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={d}
            onChange={(e) => handleVerificationCodeChange(i, e.target.value, true)}
            onKeyDown={(e) => handleVerificationCodeKeyDown(i, e, true)}
            onKeyPress={handleKeyPress}
            className="login-code-input"
            autoComplete="off"
            disabled={isLoading}
            autoFocus={i === 0}
          />
        ))}
      </div>

      <button
        onClick={handleVerifyResetCode}
        disabled={isLoading}
        className="login-submit-btn"
        type="button"
      >
        {isLoading ? (
          <>
            <div className="login-spinner"></div>
            <span>Verifying...</span>
          </>
        ) : (
          <>
            <span>Verify & Continue</span>
            <ArrowRight className="login-submit-icon" />
          </>
        )}
      </button>

      <div className="login-resend-section">
        Didn't receive the code?{" "}
        <button
          onClick={handleResendResetCode}
          disabled={isLoading}
          className="login-resend-btn"
          type="button"
        >
          Resend code
        </button>
      </div>

      <button
        onClick={backToLogin}
        className="login-back-btn"
        type="button"
        disabled={isLoading}
      >
        ← Back to login
      </button>
    </>
  );

  const renderResetPasswordForm = () => (
    <>
      <div className="login-verify-header">
        <div className="login-verify-icon-wrapper">
          <CheckCircle className="login-verify-icon" />
        </div>
        <h3 className="login-verify-title">Create New Password</h3>
        <p className="login-verify-description">Enter your new password below</p>
      </div>

      <div className="login-form-section">
        <div className="login-input-group">
          <label className="login-input-label" htmlFor="new-password-input">
            New Password
          </label>
          <div className="login-input-wrapper">
            <Lock className="login-input-icon" />
            <input
              id="new-password-input"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter new password"
              className="login-input login-input-password"
              autoComplete="new-password"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="login-password-toggle"
              disabled={isLoading}
            >
              {showNewPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        <div className="login-input-group">
          <label className="login-input-label" htmlFor="confirm-new-password-input">
            Confirm New Password
          </label>
          <div className="login-input-wrapper">
            <Lock className="login-input-icon" />
            <input
              id="confirm-new-password-input"
              type={showConfirmNewPassword ? "text" : "password"}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Confirm new password"
              className="login-input login-input-password"
              autoComplete="new-password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
              className="login-password-toggle"
              disabled={isLoading}
            >
              {showConfirmNewPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        <button
          onClick={handleResetPassword}
          disabled={isLoading}
          className="login-submit-btn"
          type="button"
        >
          {isLoading ? (
            <>
              <div className="login-spinner"></div>
              <span>Resetting password...</span>
            </>
          ) : (
            <>
              <span>Reset Password</span>
              <ArrowRight className="login-submit-icon" />
            </>
          )}
        </button>
      </div>
    </>
  );

  const renderVerificationForm = () => (
    <>
      <div className="login-verify-header">
        <div className="login-verify-icon-wrapper">
          <Shield className="login-verify-icon" />
        </div>
        <h3 className="login-verify-title">Two-Factor Authentication</h3>
        <p className="login-verify-description">
          Enter the 6-digit code sent to your email
        </p>
        <p className="login-verify-email">{email}</p>
      </div>

      <div className="login-code-inputs">
        {verificationCode.map((d, i) => (
          <input
            key={i}
            id={`code-input-${i}`}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={d}
            onChange={(e) => handleVerificationCodeChange(i, e.target.value, false)}
            onKeyDown={(e) => handleVerificationCodeKeyDown(i, e, false)}
            onKeyPress={handleKeyPress}
            className="login-code-input"
            autoComplete="off"
            disabled={isLoading}
            autoFocus={i === 0}
          />
        ))}
      </div>

      <button
        onClick={handleVerifyCode}
        disabled={isLoading}
        className="login-submit-btn"
        type="button"
      >
        {isLoading ? (
          <>
            <div className="login-spinner"></div>
            <span>Verifying...</span>
          </>
        ) : (
          <>
            <span>Verify Code</span>
            <ArrowRight className="login-submit-icon" />
          </>
        )}
      </button>

      <div className="login-resend-section">
        Didn't receive the code?{" "}
        <button
          onClick={handleResendCode}
          disabled={isLoading}
          className="login-resend-btn"
          type="button"
        >
          Resend code
        </button>
      </div>

      <button
        onClick={backToLogin}
        className="login-back-btn"
        type="button"
        disabled={isLoading}
      >
        ← Back to login
      </button>
    </>
  );

  /* ================= MAIN RENDER ================= */
  return (
    <div className="login-page">
      <div className="login-bg-effects">
        <div className="login-bg-blur-1"></div>
        <div className="login-bg-blur-2"></div>
        <div className="login-bg-blur-3"></div>
      </div>
      <div className="login-particles"></div>

      <div className="login-container">
        <div className="login-logo-section">
          <div className="login-logo-wrapper">
            <div className="login-logo-glow"></div>
            <div className="login-logo-box">
              <BookOpen className="login-logo-icon" />
            </div>
          </div>
          <h1 className="login-title">{getPageTitle()}</h1>
          <p className="login-subtitle">{getPageSubtitle()}</p>
        </div>

        <div className="login-card">
          {error && (
            <div className="login-error" role="alert">
              <X className="login-error-icon" />
              <p className="login-error-text">{error}</p>
            </div>
          )}

          {step === "login" && renderLoginForm()}
          {step === "signup" && renderSignupForm()}
          {step === "verify" && renderVerificationForm()}
          {step === "forgot-password" && renderForgotPasswordForm()}
          {step === "reset-verify" && renderResetVerifyForm()}
          {step === "reset-password" && renderResetPasswordForm()}
        </div>

        {!["verify", "reset-verify", "reset-password"].includes(step) && (
          <div className="login-security-note">
            <div className="login-security-content">
              <Shield className="login-security-icon" />
              <div>
                <p className="login-security-title">Your security is our priority</p>
                <p className="login-security-text">
                  We use industry-standard encryption and support 2-Step Verification to
                  keep your account safe.
                </p>
              </div>
            </div>
          </div>
        )}

        <p className="login-terms">
          By continuing, you agree to our{" "}
          <button
            className="login-terms-link"
            onClick={() => alert("Terms of Service")}
            type="button"
          >
            Terms of Service
          </button>{" "}
          and{" "}
          <button
            className="login-terms-link"
            onClick={() => alert("Privacy Policy")}
            type="button"
          >
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;