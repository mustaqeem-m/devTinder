import axios from 'axios';
import React from 'react';
import { refreshFeedWithDelay } from '../utils/slice/FeedSlice.js';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';

const UserCard = (userData) => {
  const dispatch = useDispatch();
  const [isExiting, setIsExiting] = React.useState(null);
  const { _id, firstName, lastName, profile, skills, about, age, gender } =
    userData.user || {};

  const handleUsers = (status, _id) => {
    setIsExiting(status === 'ignored' ? 'left' : 'right');
    axios
      .post(`${BASE_URL}/request/send/${status}/${_id}`)
      .catch((err) => console.log(err));
    dispatch(refreshFeedWithDelay(_id));
  };

  return (
    <div className="flex justify-center py-6">
      <div
        className={`relative w-96 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(56,189,248,0.25)]
          ${isExiting === 'left' ? 'animate-slideLeft' : ''} 
          ${isExiting === 'right' ? 'animate-slideRight' : ''}`}
      >
        {/* Banner / profile image */}
        <figure className="relative h-72 overflow-hidden">
          <img
            src={profile}
            alt={`${firstName} ${lastName}`}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent"></div>
          <div className="absolute bottom-4 left-5">
            <h2 className="text-2xl font-semibold tracking-wide drop-shadow-md">
              {firstName + ' ' + lastName}
            </h2>
            {age && gender && (
              <p className="text-sm text-slate-300 mt-1">
                {age} • {gender}
              </p>
            )}
          </div>
        </figure>

        {/* Card body */}
        <div className="card-body px-6 py-6">
          {about && (
            <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-4">
              {about}
            </p>
          )}

          {skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 border border-white/10 text-blue-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between gap-5 mt-6">
            <button
              className="flex-1 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-500 hover:brightness-110 text-sm font-semibold shadow-md shadow-red-700/20 transition-transform active:scale-[0.97]"
              onClick={() => handleUsers('ignored', _id)}
            >
              Ignore
            </button>
            <button
              className="flex-1 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 hover:brightness-110 text-sm font-semibold shadow-md shadow-emerald-700/20 transition-transform active:scale-[0.97]"
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
