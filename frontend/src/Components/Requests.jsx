import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  addRequests,
  removeRequest,
  removeRequests,
} from '../utils/slice/requestsSlice';
import { useNavigate } from 'react-router-dom';
// axios.defaults.withCredentials = true;
const Requests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const requests = useSelector((store) => store.requests);

  const reveiewRequests = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + '/request/review/' + status + '/' + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.log(err);
      navigate('/error');
    }
  };
  const getRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + '/user/requests/recieved');
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.log(err.response.data.Error);
    }
  };
  console.log(requests);

  useEffect(() => {
    if (!requests) {
      getRequests();
    }
  });
  if (!requests) return;
  if (requests.length === 0) {
    return (
      <div className="text-2xl font-semibold flex justify-center m-7">
        Your requests list is Empty !{' '}
      </div>
    );
  }

  return (
    <ul className="list bg-base-100 rounded-box shadow-md max-w-2xl mx-auto">
      <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Requests</li>

      {requests.map((request) => {
        const { _id } = requests;
        const { firstName, lastName, age, gender, about, profile } =
          request.fromUserId;

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
            <button
              className="btn btn-square btn-ghost"
              title="Message"
              onClick={() => reveiewRequests('accepted', request._id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <title>Accept</title>
                <circle cx="12" cy="12" r="9" />
                <path d="M9 12.5l1.8 1.8L16.2 9" />
              </svg>
            </button>
            <button
              className="btn btn-square btn-ghost"
              title="Remove"
              onClick={() => reveiewRequests('rejected', request._id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                role="img"
                className="text-red-500"
              >
                <title>Reject</title>
                <circle cx="12" cy="12" r="9" />
                <path d="M15 9L9 15M9 9l6 6" />
              </svg>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default Requests;
