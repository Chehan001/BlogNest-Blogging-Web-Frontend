import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Chrome, ArrowRight, BookOpen, Shield, X } from "lucide-react";
import "../styles/Login.css";

const Login = () => {
  const [step, setStep] = useState("login"); // 'login', 'signup', 'verify'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Google login initiated");
      // After successful Google login, go to verification
      setStep("verify");
    } catch (error) {
      setError("Google login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    setError("");
    try {
      // Simulate email login
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Email login:", email);
      // After successful login, go to verification
      setStep("verify");
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    // Password strength check
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setError("Password must contain uppercase, lowercase, and numbers");
      return;
    }
    
    setIsLoading(true);
    setError("");
    try {
      // Simulate signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Signup with email:", email);
      setStep("verify");
    } catch (error) {
      setError("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationCodeChange = (index, value) => {
    if (value.length > 1) {
      value = value[0];
    }
    
    // Only allow digits
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerificationCodeKeyDown = (index, e) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyCode = async () => {
    const code = verificationCode.join("");
    if (code.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    
    setIsLoading(true);
    setError("");
    try {
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Verification code:", code);
      
      // Success! Redirect to dashboard
      alert("Login successful! Redirecting to dashboard...");
      window.location.href = "/dashboard"; // or use your router
    } catch (error) {
      setError("Invalid verification code. Please try again.");
      setVerificationCode(["", "", "", "", "", ""]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Resending code to:", email);
      alert("Verification code has been resent to your email!");
    } catch (error) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (step === "login") {
        handleEmailLogin();
      } else if (step === "signup") {
        handleSignup();
      } else if (step === "verify") {
        handleVerifyCode();
      }
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setRememberMe(false);
    setVerificationCode(["", "", "", "", "", ""]);
    setError("");
  };

  const renderLoginForm = () => (
    <>
      <div className="login-form-section">
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="login-social-btn"
        >
          <Chrome className="login-social-icon" />
          Continue with Google
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
          <label className="login-input-label">Email Address</label>
          <div className="login-input-wrapper">
            <Mail className="login-input-icon" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="you@example.com"
              className="login-input"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="login-input-group">
          <label className="login-input-label">Password</label>
          <div className="login-input-wrapper">
            <Lock className="login-input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your password"
              className="login-input login-input-password"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="login-password-toggle"
              aria-label={showPassword ? "Hide password" : "Show password"}
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
            />
            <span>Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => console.log("Forgot password")}
            className="login-forgot-btn"
          >
            Forgot password?
          </button>
        </div>

        <button
          onClick={handleEmailLogin}
          disabled={isLoading}
          className="login-submit-btn"
        >
          {isLoading ? (
            <>
              <div className="login-spinner"></div>
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="login-submit-icon" />
            </>
          )}
        </button>
      </div>

      <div className="login-switch-link">
        Don't have an account?{" "}
        <button
          onClick={() => {
            setStep("signup");
            setError("");
          }}
          className="login-switch-btn"
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
        >
          <Chrome className="login-social-icon" />
          Sign up with Google
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
          <label className="login-input-label">Email Address</label>
          <div className="login-input-wrapper">
            <Mail className="login-input-icon" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="you@example.com"
              className="login-input"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="login-input-group">
          <label className="login-input-label">Password</label>
          <div className="login-input-wrapper">
            <Lock className="login-input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Create a password"
              className="login-input login-input-password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="login-password-toggle"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        <div className="login-input-group">
          <label className="login-input-label">Confirm Password</label>
          <div className="login-input-wrapper">
            <Lock className="login-input-icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Confirm your password"
              className="login-input login-input-password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="login-password-toggle"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        <button
          onClick={handleSignup}
          disabled={isLoading}
          className="login-submit-btn"
        >
          {isLoading ? (
            <>
              <div className="login-spinner"></div>
              Creating account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="login-submit-icon" />
            </>
          )}
        </button>
      </div>

      <div className="login-switch-link">
        Already have an account?{" "}
        <button
          onClick={() => {
            setStep("login");
            setError("");
          }}
          className="login-switch-btn"
        >
          Sign in →
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
        <p className="login-verify-description">Enter the 6-digit code sent to your email</p>
        <p className="login-verify-email">{email}</p>
      </div>

      <div className="login-code-inputs">
        {verificationCode.map((digit, index) => (
          <input
            key={index}
            id={`code-input-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
            onKeyDown={(e) => handleVerificationCodeKeyDown(index, e)}
            onKeyPress={handleKeyPress}
            className="login-code-input"
            autoComplete="off"
          />
        ))}
      </div>

      <button
        onClick={handleVerifyCode}
        disabled={isLoading}
        className="login-submit-btn"
      >
        {isLoading ? (
          <>
            <div className="login-spinner"></div>
            Verifying...
          </>
        ) : (
          <>
            Verify & Continue
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
        >
          Resend code
        </button>
      </div>

      <button
        onClick={() => {
          setStep("login");
          setError("");
          setVerificationCode(["", "", "", "", "", ""]);
        }}
        className="login-back-btn"
      >
        ← Back to login
      </button>
    </>
  );

  return (
    <div className="login-page">
      {/* Background Effects */}
      <div className="login-bg-effects">
        <div className="login-bg-blur-1"></div>
        <div className="login-bg-blur-2"></div>
      </div>

      <div className="login-container">
        {/* Logo Section */}
        <div className="login-logo-section">
          <div className="login-logo-wrapper">
            <div className="login-logo-glow"></div>
            <div className="login-logo-box">
              <BookOpen className="login-logo-icon" />
            </div>
          </div>
          <h1 className="login-title">
            {step === "verify" ? "Verify Your Account" : step === "signup" ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="login-subtitle">
            {step === "verify" 
              ? "We've sent a code to your email" 
              : step === "signup" 
              ? "Join 10,000+ storytellers worldwide" 
              : "Sign in to continue your journey"}
          </p>
        </div>

        {/* Main Card */}
        <div className="login-card">
          {error && (
            <div className="login-error">
              <X className="login-error-icon" />
              <p className="login-error-text">{error}</p>
            </div>
          )}

          {step === "login" && renderLoginForm()}
          {step === "signup" && renderSignupForm()}
          {step === "verify" && renderVerificationForm()}
        </div>

        {/* Security Note */}
        {step !== "verify" && (
          <div className="login-security-note">
            <div className="login-security-content">
              <Shield className="login-security-icon" />
              <div>
                <p className="login-security-title">Your security is our priority</p>
                <p className="login-security-text">
                  We use industry-standard encryption and support 2-Step Verification to keep your account safe.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Terms */}
        <p className="login-terms">
          By continuing, you agree to our{" "}
          <button 
            className="login-terms-link"
            onClick={() => console.log("Terms clicked")}
          >
            Terms of Service
          </button>{" "}
          and{" "}
          <button 
            className="login-terms-link"
            onClick={() => console.log("Privacy clicked")}
          >
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;