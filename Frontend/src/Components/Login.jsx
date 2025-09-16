import React from 'react';
import { useState } from 'react';
import axios, { Axios } from 'axios';
import { useDispatch } from 'react-redux';
import UserSlice from './../utils/slice/UserSlice.jsx';
import { addUser } from '../utils/slice/UserSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from './../utils/constants';

axios.defaults.withCredentials = true;

const Login = () => {
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + 'login',
        {
          emailId,
          password,
        },
        { withCredentials: true } // browser, include cookies when calling the BE
      );
      dispatch(addUser(res.data));
      return navigate('/feed');
    } catch (err) {
      console.log({ Error: err.message });
    }
  };

  return (
    <div className="flex justify-center my-28">
      <div className="card card-border bg-base-300 w-96 ">
        <div className="card-body">
          <h2 className="card-title mx-auto">Login</h2>
          <div>
            <fieldset className="fieldset">
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
              <input
                type="text"
                value={password}
                className="input"
                placeholder=""
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </fieldset>
          </div>
          <div className="card-actions justify-end">
            <button className="btn btn-primary mx-auto" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
