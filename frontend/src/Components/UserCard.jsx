import axios from 'axios';
import React from 'react';
import { refreshFeed } from '../utils/slice/FeedSlice.jsx';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';

const UserCard = (userData) => {
  const dispatch = useDispatch();
  const { _id, firstName, lastName, profile, skills, about, age, gender } =
    userData.user || {};

  const handleUsers = async (status, _id) => {
    try {
      const res = await axios.post(
        BASE_URL + '/request/send/' + status + '/' + _id
      );
      dispatch(refreshFeed(_id));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <div className="card bg-black-700 w-96 shadow-sm ">
        <figure>
          <img src={profile} alt="Shoes" />
        </figure>
        <div className="card-body bg-slate-900 rounded-2xl">
          <h2 className="card-title">{firstName + ' ' + lastName}</h2>

          {age && gender && <p>{age + ' ' + gender}</p>}
          <p>
            {about}
            {skills}
          </p>
          <div className="card-actions justify-center gap-5 ">
            <button
              className="btn btn-primary bg-red-500"
              onClick={() => handleUsers('ignored', _id)}
            >
              Ignore
            </button>
            <button
              className="btn btn-primary bg-green-600"
              onClick={() => handleUsers('interested', _id)}
            >
              Interested
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
