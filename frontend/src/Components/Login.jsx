import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/slice/UserSlice';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { BASE_URL } from './../utils/constants';

axios.defaults.withCredentials = true;

const Login = () => {
  const [firstName, setFirstName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [lastName, setLastName] = useState('');
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [signUpToast, setSignUpToast] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleLogin = async () => {
    try {
      setError('');
      const res = await axios.post(
        BASE_URL + '/login',
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      return navigate('/feed');
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed');
      console.log(err);
    }
  };

  const handleSignUp = async () => {
    try {
      setError('');
      const res = await axios.post(BASE_URL + '/signup', {
        firstName,
        lastName,
        emailId,
        password,
      });
      dispatch(addUser(res.data.data));
      navigate('/profile');
    } catch (err) {
      console.log(err);
      setError(err?.response?.data || 'Signup failed');
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center my-28">
      {signUpToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-info">
            <span>SignedUp successfully! login to Continue!</span>
          </div>
        </div>
      )}
      <div className="card card-border bg-base-300 w-96 ">
        <div className="card-body">
          {!signUp ? (
            <h2 className="card-title mx-auto">SignUp</h2>
          ) : (
            <h2 className="card-title mx-auto">Login</h2>
          )}
          <div>
            <fieldset className="fieldset">
              {!signUp && (
                <>
                  <legend className="fieldset-legend mt-1">Firstname:</legend>
                  <input
                    type="text"
                    value={firstName}
                    className="input text-white"
                    placeholder=""
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                  />
                  <legend className="fieldset-legend mt-1">Lastname:</legend>
                  <input
                    type="text"
                    value={lastName}
                    className="input text-white"
                    placeholder=""
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                  />
                </>
              )}
              <legend className="fieldset-legend mt-1">Email-Id:</legend>
              <input
                type="text"
                value={emailId}
                className="input text-white"
                placeholder=""
                onChange={(e) => {
                  setEmailId(e.target.value);
                }}
              />
              <legend className="fieldset-legend mt-1">Password</legend>
              <label className="input validator">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  required
                  placeholder=""
                  minLength="8"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                  className="text-white" // Added text-white here
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <button
                  type="button"
                  className="ml-2 text-sm opacity-70 hover:opacity-100"
                  onClick={() => setShowPass(!showPass)}
                >
                  {/* icons omitted for brevity */}
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </label>
            </fieldset>
          </div>

          {signUp ? (
            <div>
              <span className="opacity-50">New to DevTinder? </span>
              <span className="font-semibold opacity-100 underline">
                <Link
                  onClick={() => {
                    setSignUp(false);
                  }}
                >
                  Signup
                </Link>
              </span>
            </div>
          ) : (
            <div>
              <span className="opacity-50">Already have an account? </span>
              <span className="font-semibold opacity-100 underline">
                <Link
                  onClick={() => {
                    setSignUp(true);
                  }}
                >
                  Login.
                </Link>
              </span>
            </div>
          )}

          <p className="text-red-500 font-semibold">{error}</p>
          <div className="card-actions justify-end">
            {!signUp ? (
              <button
                className="btn btn-primary mx-auto"
                onClick={handleSignUp}
              >
                signUp.
              </button>
            ) : (
              <button className="btn btn-primary mx-auto" onClick={handleLogin}>
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
