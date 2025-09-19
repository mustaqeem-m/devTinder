import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserCard from './UserCard';
import axios from 'axios';
import { addUser } from '../utils/slice/UserSlice';
import { BASE_URL } from './../utils/constants';

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [age, setAge] = useState(user.age || 0);
  const [about, setAbout] = useState(user.about);
  const [profile, setProfile] = useState(user.profile);
  const [gender, setGender] = useState(user.gender);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const saveProfile = async () => {
    try {
      setError('');
      const updatedProfile = await axios.patch(
        BASE_URL + '/profile/edit',
        {
          firstName,
          lastName,
          age,
          gender,
          about,
          profile,
        },
        { withCredentials: true }
      );
      dispatch(addUser(updatedProfile));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setError(err.response.data.Error);
    }
  };
  return (
    <div className="flex justify-center gap-32">
      <div className="flex justify-center my-7">
        <div className="card card-border bg-base-300 w-96 ">
          <div className="card-body">
            <h2 className="card-title mx-auto">Login</h2>
            <div>
              <fieldset className="fieldset">
                <legend className="fieldset-legend mt-1">FirstName: </legend>
                <input
                  type="text"
                  value={firstName}
                  className="input"
                  placeholder=""
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                />

                <legend className="fieldset-legend mt-1">LastName: </legend>
                <input
                  type="text"
                  value={lastName}
                  className="input"
                  placeholder=""
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                />

                <legend className="fieldset-legend mt-1">Age: </legend>
                <input
                  type="number"
                  value={age}
                  className="input"
                  placeholder=""
                  onChange={(e) => {
                    setAge(e.target.value);
                  }}
                />
                <legend className="fieldset-legend mt-1">Gender: </legend>
                <select
                  value={gender}
                  className="select select-bordered w-80"
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="male">male</option>
                  <option value="female">female</option>
                  <option value="Others">Others</option>
                </select>

                <legend className="fieldset-legend mt-1">Photo: </legend>
                <input
                  type="text"
                  value={profile}
                  className="input"
                  placeholder="Only provide Photo link"
                  onChange={(e) => {
                    setProfile(e.target.value);
                  }}
                />

                <legend className="fieldset-legend">About: </legend>
                <textarea
                  className="textarea h-24"
                  placeholder="About me"
                  onChange={(e) => {
                    setAbout(e.target.value);
                  }}
                ></textarea>
              </fieldset>
            </div>
            <p className="text-red-500 font-semibold">{error}</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary mx-auto" onClick={saveProfile}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-7">
        <UserCard user={{ firstName, lastName, age, gender, about, profile }} />
      </div>
      {showToast && (
        <div>
          <div className="toast toast-top toast-center">
            <div className="alert alert-success">
              <span>Profile Updated successfully!</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
