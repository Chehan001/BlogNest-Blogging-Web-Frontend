import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, Chrome, ArrowRight, BookOpen, Shield, X, KeyRound, CheckCircle } from "lucide-react";
import "../styles/Login.css";

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
  const [generatedCode, setGeneratedCode] = useState(""); // Store --> generated verification code  

  // Hide --> navbar 
  useEffect(() => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.style.display = 'none';
    }

    return () => {
      if (navbar) {
        navbar.style.display = 'block';
      }
    };
  }, []);

  // Create animated particles
  useEffect(() => {
    const particles = document.querySelector('.login-particles');
    if (!particles) return;

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 20}s`;
      particle.style.animationDuration = `${15 + Math.random() * 10}s`;
      particles.appendChild(particle);
    }

    return () => {
      while (particles.firstChild) {
        particles.removeChild(particles.firstChild);
      }
    };
  }, []);

  const generateVerificationCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return `G-${code}`;
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Google login initiated");
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Email login:", email);
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
      setError("Password must be at least 8 characters long");
      return;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setError("Password must contain uppercase, lowercase, and numbers");
      return;
    }
    
    setIsLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Signup with email:", email);
      setStep("verify");
    } catch (error) {
      setError("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate verification code
      const code = generateVerificationCode();
      setGeneratedCode(code);
      
      console.log("Password reset code sent to:", email);
      console.log("Generated code:", code); 
      
      alert(`📧 Password reset code sent!\n\nYour verification code is: ${code}\n\n(In production, this would be sent to your email)`);
      
      setStep("reset-verify");
    } catch (error) {
      setError("Failed to send reset code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyResetCode = async () => {
    const enteredCode = resetCode.join("");
    if (enteredCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    const fullCode = `G-${enteredCode}`;
    
    setIsLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verify the code
      if (fullCode !== generatedCode) {
        throw new Error("Invalid code");
      }
      
      console.log("Reset code verified:", fullCode);
      setStep("reset-password");
    } catch (error) {
      setError("Invalid verification code. Please try again.");
      setResetCode(["", "", "", "", "", ""]);
      const firstInput = document.getElementById('reset-code-input-0');
      if (firstInput) firstInput.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setError("Password must contain uppercase, lowercase, and numbers");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Password reset successful for:", email);
      
      alert("✅ Password reset successful! You can now login with your new password.");
      
      // Reset form --> Then --> go back to login
      setNewPassword("");
      setConfirmNewPassword("");
      setResetCode(["", "", "", "", "", ""]);
      setGeneratedCode("");
      setStep("login");
    } catch (error) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationCodeChange = (index, value, isReset = false) => {
    const codeArray = isReset ? resetCode : verificationCode;
    const setCodeArray = isReset ? setResetCode : setVerificationCode;
    const inputPrefix = isReset ? 'reset-code-input' : 'code-input';

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split('');
      const newCode = [...codeArray];
      
      pastedCode.forEach((char, i) => {
        if (index + i < 6 && /^\d$/.test(char)) {
          newCode[index + i] = char;
        }
      });
      
      setCodeArray(newCode);
      
      const nextIndex = Math.min(index + pastedCode.length, 5);
      const nextInput = document.getElementById(`${inputPrefix}-${nextIndex}`);
      if (nextInput) nextInput.focus();
      
      return;
    }
    
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newCode = [...codeArray];
    newCode[index] = value;
    setCodeArray(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`${inputPrefix}-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerificationCodeKeyDown = (index, e, isReset = false) => {
    const codeArray = isReset ? resetCode : verificationCode;
    const setCodeArray = isReset ? setResetCode : setVerificationCode;
    const inputPrefix = isReset ? 'reset-code-input' : 'code-input';

    if (e.key === "Backspace") {
      if (!codeArray[index] && index > 0) {
        const prevInput = document.getElementById(`${inputPrefix}-${index - 1}`);
        if (prevInput) prevInput.focus();
      } else {
        const newCode = [...codeArray];
        newCode[index] = "";
        setCodeArray(newCode);
      }
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Verification code:", code);
      
      alert("✅ Login successful! Redirecting to dashboard...");
      
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (error) {
      setError("Invalid verification code. Please try again.");
      setVerificationCode(["", "", "", "", "", ""]);
      const firstInput = document.getElementById('code-input-0');
      if (firstInput) firstInput.focus();
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
      alert("📧 Verification code has been resent to your email!");
    } catch (error) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendResetCode = async () => {
    setIsLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const code = generateVerificationCode();
      setGeneratedCode(code);
      
      console.log("Reset code resent to:", email);
      console.log("New code:", code);
      
      alert(`📧 New reset code sent!\n\nYour verification code is: ${code}\n\n(In production, this would be sent to your email)`);
    } catch (error) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      if (step === "login") {
        handleEmailLogin();
      } else if (step === "signup") {
        handleSignup();
      } else if (step === "verify") {
        handleVerifyCode();
      } else if (step === "forgot-password") {
        handleForgotPassword();
      } else if (step === "reset-verify") {
        handleVerifyResetCode();
      } else if (step === "reset-password") {
        handleResetPassword();
      }
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
              aria-label={showPassword ? "Hide password" : "Show password"}
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
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
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
          Enter the 6-digit code from G-XXXXXX format
        </p>
        <p className="login-verify-email">{email}</p>
        <div className="login-code-format-hint">
          <p>Code format: <strong>G-123456</strong></p>
          <p className="login-hint-text">Enter only the 6 digits after "G-"</p>
        </div>
      </div>

      <div className="login-code-inputs">
        {resetCode.map((digit, index) => (
          <input
            key={index}
            id={`reset-code-input-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={digit}
            onChange={(e) => handleVerificationCodeChange(index, e.target.value, true)}
            onKeyDown={(e) => handleVerificationCodeKeyDown(index, e, true)}
            onKeyPress={handleKeyPress}
            className="login-code-input"
            autoComplete="off"
            disabled={isLoading}
            autoFocus={index === 0}
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
        <p className="login-verify-description">
          Enter your new password below
        </p>
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
              aria-label={showNewPassword ? "Hide password" : "Show password"}
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
              aria-label={showConfirmNewPassword ? "Hide password" : "Show password"}
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
        {verificationCode.map((digit, index) => (
          <input
            key={index}
            id={`code-input-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={digit}
            onChange={(e) => handleVerificationCodeChange(index, e.target.value, false)}
            onKeyDown={(e) => handleVerificationCodeKeyDown(index, e, false)}
            onKeyPress={handleKeyPress}
            className="login-code-input"
            autoComplete="off"
            disabled={isLoading}
            autoFocus={index === 0}
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

  const getPageTitle = () => {
    switch(step) {
      case "signup": return "Create Account";
      case "verify": return "Verify Your Account";
      case "forgot-password": return "Reset Password";
      case "reset-verify": return "Verify Reset Code";
      case "reset-password": return "Create New Password";
      default: return "Welcome Back";
    }
  };

  const getPageSubtitle = () => {
    switch(step) {
      case "signup": return "Join 10,000+ storytellers worldwide";
      case "verify": return "We've sent a code to your email";
      case "forgot-password": return "Enter your email to receive a reset code";
      case "reset-verify": return "Check your email for the reset code";
      case "reset-password": return "Choose a strong password";
      default: return "Sign in to continue your journey";
    }
  };

  return (
    <div className="login-page">
      {/* Background Effects */}
      <div className="login-bg-effects">
        <div className="login-bg-blur-1"></div>
        <div className="login-bg-blur-2"></div>
        <div className="login-bg-blur-3"></div>
      </div>

      {/* Animated Particles */}
      <div className="login-particles"></div>

      <div className="login-container">
        {/* Logo Section */}
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

        {/* Main Card */}
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

        {/* Security Note */}
        {!["verify", "reset-verify", "reset-password"].includes(step) && (
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