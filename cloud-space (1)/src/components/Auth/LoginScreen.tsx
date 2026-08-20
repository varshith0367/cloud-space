import React, { useState } from 'react';
import {
  Cloud,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  HardDrive,
  CheckCircle2,
  Eye,
  EyeOff,
  Server,
  FileCheck2,
  LockKeyhole,
  Check,
} from 'lucide-react';
import { useCloudSpace } from '../../context/CloudSpaceContext';

export const LoginScreen: React.FC = () => {
  const { login, register } = useCloudSpace();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid business or personal email address.');
      return;
    }

    if (!password.trim() || password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'register') {
        await register(cleanEmail, name, password);
        setSuccessMessage('Account registered successfully. Initializing 50 GB cloud vault...');
      } else {
        await login(cleanEmail, name, password);
        setSuccessMessage('Authentication successful. Redirecting to workspace...');
      }
    } catch (err) {
      setErrorMessage('Authentication could not be completed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-900 text-slate-100 antialiased lg:flex-row">
      {/* Left Column: Platform Identity & Product Architecture */}
      <div className="relative flex flex-col justify-between border-b border-slate-800 bg-slate-950 p-8 sm:p-12 lg:w-1/2 lg:border-b-0 lg:border-r lg:p-16">
        
        {/* Top Branding */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <Cloud className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">Cloud Space</span>
                <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                  v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400">Enterprise Cloud Storage & Intelligence</p>
            </div>
          </div>

          {/* Core Value Header */}
          <div className="mt-12 space-y-4">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Secure, high-capacity cloud storage built for modern workflows.
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-400">
              Sign in with your email address to access your centralized cloud vault. Every account includes 50 GB of complimentary secure storage with intelligent file indexing and instant search.
            </p>
          </div>

          {/* Key Platform Pillars */}
          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3.5 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-900/50">
                <HardDrive className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">50 GB Complimentary Storage</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  High-speed NVMe storage allocated immediately upon login. Expandable up to 100 TB.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-900/50">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">AES-256 Vault Encryption</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Zero-knowledge encryption for stored assets, shared links, and organization folders.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-950 text-blue-400 border border-blue-900/50">
                <FileCheck2 className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">Intelligent File Assistant</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Full-text semantic search, document summarization, and automated directory organization.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Marks */}
        <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-slate-800/80 pt-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <LockKeyhole className="h-3.5 w-3.5 text-slate-400" />
            <span>SOC2 Type II Ready</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Server className="h-3.5 w-3.5 text-slate-400" />
            <span>99.99% Guaranteed SLA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-slate-400" />
            <span>GDPR & HIPAA Compliant</span>
          </div>
        </div>
      </div>

      {/* Right Column: Clean Authentication Form */}
      <div className="flex flex-1 flex-col justify-center bg-slate-900 p-8 sm:p-12 lg:p-16">
        <div className="mx-auto w-full max-w-md">
          
          {/* Card Container */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-xl">
            
            {/* Mode Switcher */}
            <div className="mb-6 flex rounded-lg border border-slate-800 bg-slate-900 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex-1 rounded-md py-2 text-xs font-bold transition-colors ${
                  mode === 'login'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex-1 rounded-md py-2 text-xs font-bold transition-colors ${
                  mode === 'register'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Title & Instructions */}
            <div className="mb-5">
              <h2 className="text-xl font-bold text-white">
                {mode === 'login' ? 'Sign in to your account' : 'Create your cloud account'}
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {mode === 'login'
                  ? 'Enter your email address and credentials to open your workspace.'
                  : 'Register with your email to claim your 50 GB free cloud storage.'}
              </p>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="mb-4 rounded-lg border border-rose-900/60 bg-rose-950/50 p-3 text-xs text-rose-300">
                {errorMessage}
              </div>
            )}

            {/* Success Notification */}
            {successMessage && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-900/60 bg-emerald-950/50 p-3 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Varshith"
                      required={mode === 'register'}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <label className="font-medium text-slate-300">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setErrorMessage('Password reset link will be sent to your email.')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2.5 pl-9 pr-10 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Keep me signed in on this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Verifying credentials...</span>
                  </div>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In to Workspace' : 'Create 50 GB Free Account'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-slate-800/80 pt-4 text-center text-[11px] text-slate-500">
              By proceeding, you agree to the Cloud Space Terms of Service and Privacy Policy.
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
