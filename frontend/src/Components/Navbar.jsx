import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { removeUser } from '../utils/slice/UserSlice';
import { removeRequests } from '../utils/slice/requestsSlice';
import { removeConnections } from '../utils/slice/connectionSlice';
import { clearFeed } from '../utils/slice/FeedSlice';
import { AuroraText } from './ui/Auroratext';

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    // optimistic client-side clear
    dispatch(removeUser());
    dispatch(clearFeed());
    dispatch(removeRequests());
    dispatch(removeConnections());

    try {
      await axios.post(BASE_URL + '/logout');
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      navigate('/welcome');
    }
  };

  return (
    <div className="navbar bg-slate-900 shadow-sm">
      <div className="flex-1">
        <Link to="/feed" className="flex items-center gap-2 select-none">
          <img
            className="h-10 w-10 rounded-md m-3"
            alt="DevTinder logo"
            src="/download.png"
            onError={(e) => (e.currentTarget.src = '/fallback-avatar.png')}
          />
          <h1 className="text-lg sm:text-xl font-bold tracking-tight">
            <AuroraText>Dev'sTinder🔥</AuroraText>
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <p className="mt-1 hidden sm:block">Welcome {user?.firstName}</p>
        )}

        <div className="dropdown dropdown-end mx-5">
          <div
            tabIndex={0}
            role="button"
            aria-haspopup="menu"
            aria-expanded="false"
            className="btn btn-ghost btn-circle avatar"
          >
            {user && (
              <div className="w-10 rounded-full overflow-hidden">
                <img
                  alt={`${user.firstName || 'User'} avatar`}
                  src={user?.profile || '../../public/icon.png'}
                  onError={(e) =>
                    (e.currentTarget.src = '/fallback-avatar.png')
                  }
                />
              </div>
            )}
          </div>

          {user ? (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/conns">Connections</Link>
              </li>
              <li>
                <Link to="/reqs">Requests</Link>
              </li>
              <li>
                <Link to="/premium">Upgrade pro</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          ) : null}
        </div>

        {!user && (
          <div className="flex gap-7">
            <button
              className="btn btn-primary"
              onClick={() =>
                navigate('/login', { state: { showSignup: false } })
              }
            >
              Login
            </button>
            <button
              className="btn btn-secondary mr-6"
              onClick={() =>
                navigate('/login', { state: { showSignup: true } })
              }
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
