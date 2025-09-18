import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addRequests } from '../utils/slice/requestsSlice';
const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);

  const getRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + '/user/requests/recieved');
      console.log(res.data.data);
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.log(err.response.data.Error);
    }
  };

  useEffect(() => {
    if (!requests) {
      getRequests();
    }
  });
  if (!requests) return;
  if (requests.length === 0) return 'Your Requests list is empty!';

  return (
    <ul className="list bg-base-100 rounded-box shadow-md max-w-2xl mx-auto">
      <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
        Your Connections
      </li>

      {requests.map((conn) => {
        const { _id, firstName, lastName, age, gender, about, profile } = conn;

        return (
          <li key={_id} className="list-row">
            {/* Avatar */}
            <div>
              <img
                className="size-10 rounded-box"
                src={profile || 'https://via.placeholder.com/100'}
                alt={`${firstName} ${lastName}`}
              />
            </div>

            {/* Name + sub-info */}
            <div>
              <div className="font-semibold">
                {firstName} {lastName}
              </div>
              <div className="text-xs uppercase font-semibold opacity-60">
                {age} • {gender}
              </div>
            </div>

            {/* About */}
            <p className="list-col-wrap text-xs">{about}</p>

            {/* Actions */}
            <button className="btn btn-square btn-ghost" title="Message">
              <svg
                className="size-[1.2em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M6 3L20 12 6 21 6 3z"></path>
                </g>
              </svg>
            </button>
            <button className="btn btn-square btn-ghost" title="Remove">
              <svg
                className="size-[1.2em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </g>
              </svg>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default Requests;
