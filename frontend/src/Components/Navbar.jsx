import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { removeUser } from '../utils/slice/UserSlice';
import Connections from './Connections';
import { removeRequests } from '../utils/slice/requestsSlice';
import { removeConnections } from '../utils/slice/connectionSlice';
import { clearFeed } from '../utils/slice/feedSlice';

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + '/logout');
      navigate('/login');
      dispatch(removeUser());
      dispatch(clearFeed());
      dispatch(removeRequests());
      dispatch(removeConnections());
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className="navbar bg-base-300 shadow-sm">
        <div className="flex-1">
          <Link to="/feed" className="btn btn-ghost text-xl bg-slate-400">
            🧑‍💻 DevTinder
          </Link>
        </div>
        <div className="flex gap-2">
          {user && <p className="mt-2">Welcome {user?.firstName}</p>}
          <div className="dropdown dropdown-end mx-5">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              {user && (
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src={user?.profile}
                  />
                </div>
              )}
            </div>
            {user && (
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/conns">Connentions</Link>
                </li>

                <li>
                  <Link to="/reqs">Requests</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
