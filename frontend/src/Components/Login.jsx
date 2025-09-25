import React from 'react';
import { useState } from 'react';
import axios, { Axios } from 'axios';
import { useDispatch } from 'react-redux';
import UserSlice from './../utils/slice/UserSlice.js';
import { addUser } from '../utils/slice/UserSlice';
import { useNavigate, Link } from 'react-router-dom';
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
  const [signUp, setSignUp] = useState(true);

  const handleLogin = async () => {
    try {
      setError('');
      const res = await axios.post(
        BASE_URL + '/login',
        {
          emailId,
          password,
        },
        { withCredentials: true } // browser, include cookies when calling the BE
      );
      dispatch(addUser(res.data));
      return navigate('/feed');
    } catch (err) {
      setError(err.response.data.error);
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

      // setSignUpToast(true);
      // setTimeout(() => {
      //   setSignUpToast(false);
      // }, 3000);
      // setSignUp(!signUp);
      // setFirstName('');
      // // setEmailId('');
      // setLastName('');
      // setPassword('');
    } catch (err) {
      console.log(err);
      setError(err.response.data);
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
                    className="input"
                    placeholder=""
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                  />
                  <legend className="fieldset-legend mt-1">Lastname:</legend>
                  <input
                    type="text"
                    value={lastName}
                    className="input"
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
                className="input"
                placeholder=""
                onChange={(e) => {
                  setEmailId(e.target.value);
                }}
              />
              <legend className="fieldset-legend mt-1">Password</legend>
              <label className="input validator">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                    <circle
                      cx="16.5"
                      cy="7.5"
                      r=".5"
                      fill="currentColor"
                    ></circle>
                  </g>
                </svg>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  required
                  placeholder=""
                  minLength="8"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <button
                  type="button"
                  className="ml-2 text-sm opacity-70 hover:opacity-100"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3l18 18M9.88 9.88A3 3 0 0114.12 14.12M6.1 6.1C3.67 8.07 2.25 12 2.25 12s4.5 7.5 10.5 7.5c1.54 0 2.97-.36 4.2-.98M17.9 17.9C20.33 15.93 21.75 12 21.75 12s-4.5-7.5-10.5-7.5c-1.04 0-2.04.18-2.96.5"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M1.5 12s4.5-7.5 10.5-7.5S22.5 12 22.5 12s-4.5 7.5-10.5 7.5S1.5 12 1.5 12z"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        strokeWidth={2}
                        stroke="currentColor"
                      />
                    </svg>
                  )}
                </button>
              </label>
              <p className="validator-hint hidden">
                Must be more than 8 characters, including
                <br />
                At least one number <br />
                At least one lowercase letter <br />
                At least one uppercase letter
              </p>
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
