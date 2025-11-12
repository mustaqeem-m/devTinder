// Connections.jsx
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import { addConnections } from '../utils/slice/connectionSlice';
import { Link } from 'react-router-dom';

axios.defaults.withCredentials = true;

export default function Connections() {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const mounted = useRef(true);

  async function getConnections() {
    setError('');
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`);
      if (!mounted.current) return;
      // assume API returns { data: [...] } or similar — adapt if needed
      const data = res?.data?.data ?? res?.data ?? [];
      dispatch(addConnections(data));
    } catch (err) {
      console.error('connections fetch error', err);
      const msg =
        err?.response?.data?.Error ||
        err?.response?.data?.message ||
        'Unable to load connections';
      if (mounted.current) setError(msg);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }

  useEffect(() => {
    mounted.current = true;
    // fetch only once if store empty
    if (!connections || connections.length === 0) {
      getConnections();
    }
    return () => {
      mounted.current = false;
    };
    // intentionally only depend on dispatch (store changes come from redux)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Remove a connection (simple refresh after delete to keep logic consistent)
  async function handleRemove(id) {
    if (!confirm('Remove this connection?')) return;
    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}/user/connections/${id}`);
      // refresh list
      await getConnections();
    } catch (err) {
      console.error('remove error', err);
      setError('Failed to remove connection');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-white/20 animate-spin" />
          <div className="text-slate-300">Loading your connections…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-xl text-center bg-slate-900/60 border border-white/6 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            Something went wrong
          </h3>
          <p className="text-sm text-slate-300 mb-4">{error}</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => getConnections()}
              className="px-4 py-2 rounded-md bg-emerald-500 text-white hover:brightness-95"
            >
              Retry
            </button>
            <Link
              to="/"
              className="px-4 py-2 rounded-md bg-slate-700 text-white/90"
            >
              Back Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!connections || connections.length === 0) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">No Connections Found</h2>
          <p className="text-slate-400">
            You don't have any active connections yet. Explore profiles and
            start connecting.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Your Connections</h1>
        <button
          onClick={() => getConnections()}
          className="text-sm bg-slate-800/60 border border-white/6 px-3 py-1.5 rounded-md text-slate-200 hover:bg-slate-800"
        >
          Refresh
        </button>
      </div>

      <ul className="space-y-4">
        {connections.map((conn) => {
          const { _id, firstName, lastName, age, gender, about, profile } =
            conn;
          return (
            <li
              key={_id}
              className="bg-gradient-to-b from-slate-900/60 to-slate-900/40 border border-white/6 rounded-2xl shadow-md p-4 flex items-start gap-4"
            >
              {/* avatar */}
              <div className="flex-shrink-0">
                <img
                  src={profile || 'https://via.placeholder.com/100?text=User'}
                  alt={`${firstName} ${lastName}`}
                  className="w-16 h-16 rounded-lg object-cover border border-white/8 shadow-sm"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      'https://via.placeholder.com/100?text=User';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold text-white">
                      {firstName} {lastName}
                    </div>
                    <div className="text-xs uppercase text-slate-400 mt-1">
                      {age ?? '—'} • {gender ?? '—'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/chat/${_id}`} title="Message">
                      <button className="btn btn-ghost btn-square p-2 text-slate-300 hover:text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />
                          <circle
                            cx="8.5"
                            cy="10.5"
                            r="0.9"
                            fill="currentColor"
                          />
                          <circle
                            cx="12"
                            cy="10.5"
                            r="0.9"
                            fill="currentColor"
                          />
                          <circle
                            cx="15.5"
                            cy="10.5"
                            r="0.9"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    </Link>

                    <button
                      onClick={() => handleRemove(_id)}
                      title="Remove connection"
                      className="btn btn-ghost btn-square p-2 text-rose-400 hover:text-rose-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M19 7L5 21" />
                        <path d="M5 7l14 14" />
                      </svg>
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-sm text-slate-300 line-clamp-3">
                  {about || 'No bio provided.'}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
