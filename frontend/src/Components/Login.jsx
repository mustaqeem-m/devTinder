// Login.jsx
// Dependencies: axios, react-redux, react-router-dom, react-icons
// npm i axios react-icons
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/slice/UserSlice';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { BASE_URL } from './../utils/constants';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

axios.defaults.withCredentials = true;

const MIN_PASSWORD = 8;

const Login = () => {
  const [firstName, setFirstName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [lastName, setLastName] = useState('');
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [signUpToast, setSignUpToast] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const emailRef = useRef(null);

  const initialSignUp =
    typeof location.state?.showSignup === 'boolean'
      ? !location.state.showSignup
      : true;

  const [signUp, setSignUp] = useState(initialSignUp);

  useEffect(() => {
    if (typeof location.state?.showSignup === 'boolean') {
      setSignUp(!location.state.showSignup);
    }
  }, [location.state]);

  useEffect(() => {
    if (signUpToast) {
      const t = setTimeout(() => setSignUpToast(''), 3500);
      return () => clearTimeout(t);
    }
  }, [signUpToast]);

  useEffect(() => {
    // focus email field on mount
    if (emailRef.current) emailRef.current.focus();
  }, []);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

  const clientValidate = () => {
    if (!validateEmail(emailId)) {
      setError('Please enter a valid email.');
      return false;
    }
    if (password.length < MIN_PASSWORD) {
      setError(`Password must be at least ${MIN_PASSWORD} characters.`);
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e?.preventDefault?.();
    setError('');
    if (!clientValidate()) return;
    setLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + '/login',
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate('/feed');
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed — try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e?.preventDefault?.();
    setError('');
    if (!firstName.trim() && !lastName.trim()) {
      setError('Please provide at least a first name.');
      return;
    }
    if (!clientValidate()) return;
    setLoading(true);
    try {
      const res = await axios.post(BASE_URL + '/signup', {
        firstName,
        lastName,
        emailId,
        password,
      });
      dispatch(addUser(res.data.data));
      setSignUpToast('Signed up successfully! Please login to continue.');
      // switch to login view
      setSignUp(true);
      // optionally navigate to profile
      // navigate('/profile');
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || err?.response?.data || 'Signup failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      {/* toast */}
      {signUpToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-emerald-600 text-white px-4 py-2 rounded-md shadow-md">
            {signUpToast}
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/6 rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-6">
            <div className="mb-4 text-center">
              <h2 className="text-2xl font-semibold">
                {signUp ? 'Login' : 'Create your account'}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {signUp
                  ? 'Welcome back — sign in to continue.'
                  : 'Join DevsTinder — connect with devs & ship faster.'}
              </p>
            </div>

            <form
              onSubmit={signUp ? handleLogin : handleSignUp}
              className="space-y-4"
              noValidate
            >
              {!signUp && (
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col text-sm text-slate-300">
                    <span className="mb-2 text-xs">First name</span>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input bg-white/3 placeholder-white/40 text-white focus:ring-2 focus:ring-emerald-400"
                      placeholder="John"
                    />
                  </label>

                  <label className="flex flex-col text-sm text-slate-300">
                    <span className="mb-2 text-xs">Last name</span>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="input bg-white/3 placeholder-white/40 text-white focus:ring-2 focus:ring-emerald-400"
                      placeholder="Appleseed"
                    />
                  </label>
                </div>
              )}

              <label className="flex flex-col text-sm text-slate-300">
                <span className="mb-2 text-xs">Email</span>
                <input
                  ref={emailRef}
                  type="email"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  className="input bg-white/3 placeholder-white/40 text-white focus:ring-2 focus:ring-emerald-400"
                  placeholder="you@company.com"
                  required
                />
              </label>

              <label className="flex flex-col text-sm text-slate-300 relative">
                <span className="mb-2 text-xs">Password</span>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input bg-white/3 placeholder-white/40 text-white pr-10 focus:ring-2 focus:ring-emerald-400"
                    placeholder="Your secure password"
                    minLength={MIN_PASSWORD}
                    required
                    aria-describedby="pwd-helper"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white p-1 rounded"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                    tabIndex={0}
                  >
                    {showPass ? (
                      <AiOutlineEyeInvisible size={18} />
                    ) : (
                      <AiOutlineEye size={18} />
                    )}
                  </button>
                </div>

                <div id="pwd-helper" className="mt-2 text-xs text-slate-400">
                  Minimum {MIN_PASSWORD} characters, include uppercase & number
                  for best security.
                </div>
              </label>

              {error && <div className="text-red-400 text-sm">{error}</div>}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <input
                    id="remember"
                    type="checkbox"
                    className="checkbox checkbox-xs checkbox-info"
                  />
                  <label htmlFor="remember" className="text-slate-300">
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot"
                  className="text-sm text-blue-300 hover:underline"
                >
                  Forgot?
                </Link>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full btn ${
                    loading ? 'btn-disabled opacity-80' : 'btn-primary'
                  } transition-transform active:scale-[0.995]`}
                >
                  {loading
                    ? signUp
                      ? 'Signing up...'
                      : 'Logging in...'
                    : signUp
                    ? 'Login'
                    : 'Create account'}
                </button>
              </div>
            </form>

            <div className="mt-4 text-center text-sm text-slate-400">
              {signUp ? (
                <>
                  New here?{' '}
                  <button
                    onClick={() => {
                      setSignUp(false);
                      setError('');
                    }}
                    className="text-white underline font-semibold ml-1"
                  >
                    Create account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setSignUp(true);
                      setError('');
                    }}
                    className="text-white underline font-semibold ml-1"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </div>

          {/* footer row within card */}
          <div className="px-6 py-3 bg-gradient-to-t from-transparent to-white/2 text-center text-xs text-slate-400">
            By continuing you agree to our{' '}
            <Link className="text-blue-300 underline">Terms</Link> &{' '}
            <Link className="text-blue-300 underline">Privacy</Link>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
