// Requests.jsx
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  addRequests,
  removeRequest,
  removeRequests,
} from '../utils/slice/requestsSlice';
import { BASE_URL } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;

export default function Requests() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const requests = useSelector((s) => s.requests || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState({}); // { [id]: 'accept'|'reject' }
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    // fetch only if store empty to avoid duplicate calls
    if (!requests || requests.length === 0) {
      fetchRequests();
    }
    return () => {
      mounted.current = false;
    };
    // intentionally not depending on requests to avoid refetch loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  async function fetchRequests() {
    setError('');
    setLoading(true);
    const controller = new AbortController();
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/recieved`, {
        signal: controller.signal,
        withCredentials: true,
      });
      const data = res?.data?.data ?? res?.data ?? [];
      if (!mounted.current) return;
      dispatch(addRequests(data));
    } catch (err) {
      console.error('requests fetch failed', err);
      if (!mounted.current) return;
      const msg =
        err?.response?.data?.Error ||
        err?.response?.data?.message ||
        'Failed to load requests';
      setError(msg);
    } finally {
      if (mounted.current) setLoading(false);
    }
    // abort if unmounted
    return () => controller.abort();
  }

  async function reviewRequest(status, id) {
    if (!id) return;
    const confirmMsg =
      status === 'accepted'
        ? 'Accept this request and connect?'
        : 'Reject this request?';
    if (!window.confirm(confirmMsg)) return;

    // optimistic UI: mark this id as loading
    setActionLoading((s) => ({ ...s, [id]: status }));
    try {
      await axios.post(
        `${BASE_URL}/request/review/${status}/${id}`,
        {},
        { withCredentials: true }
      );
      // remove from store
      dispatch(removeRequest(id));
    } catch (err) {
      console.error('review request failed', err);
      const msg =
        err?.response?.data?.Error ||
        err?.response?.data?.message ||
        'Action failed';
      alert(msg);
      // Optionally navigate to an error page as before:
      // navigate('/error');
    } finally {
      setActionLoading((s) => {
        const copy = { ...s };
        delete copy[id];
        return copy;
      });
    }
  }

  // Remove all requests (button)
  async function clearAll() {
    if (!confirm('Clear all requests?')) return;
    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}/user/requests/recieved`, {
        withCredentials: true,
      });
      dispatch(removeRequests()); // clear in redux
    } catch (err) {
      console.error('clear all failed', err);
      alert('Failed to clear requests');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-white/20 animate-spin" />
          <div className="text-slate-300">Loading requests…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-xl text-center bg-slate-900/60 border border-white/6 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            Could not load requests
          </h3>
          <p className="text-sm text-slate-300 mb-4">{error}</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => fetchRequests()}
              className="px-4 py-2 rounded-md bg-emerald-500 text-white hover:brightness-95"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-md bg-slate-700 text-white/90"
            >
              Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">No Requests</h2>
          <p className="text-slate-400">
            You haven’t received any connection requests yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Requests</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchRequests()}
            className="text-sm bg-slate-800/60 border border-white/6 px-3 py-1.5 rounded-md text-slate-200 hover:bg-slate-800"
          >
            Refresh
          </button>
          <button
            onClick={clearAll}
            className="text-sm bg-rose-700/10 border border-rose-600/20 px-3 py-1.5 rounded-md text-rose-300 hover:bg-rose-700/5"
            title="Clear all requests"
          >
            Clear All
          </button>
        </div>
      </div>

      <ul className="space-y-4">
        {requests.map((req) => {
          const id = req?._id;
          const from = req?.fromUserId ?? {};
          const { firstName, lastName, age, gender, about, profile } = from;

          return (
            <li
              key={id}
              className="bg-gradient-to-b from-slate-900/60 to-slate-900/40 border border-white/6 rounded-2xl shadow-md p-4 flex items-start gap-4"
            >
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
                      {firstName ?? 'Unknown'} {lastName ?? ''}
                    </div>
                    <div className="text-xs uppercase text-slate-400 mt-1">
                      {age ?? '—'} • {gender ?? '—'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => reviewRequest('accepted', id)}
                      disabled={Boolean(actionLoading[id])}
                      title="Accept request"
                      className="px-3 py-2 rounded-md bg-emerald-500 text-white text-sm font-medium hover:brightness-95 disabled:opacity-60"
                      aria-disabled={Boolean(actionLoading[id])}
                    >
                      {actionLoading[id] === 'accepted'
                        ? 'Accepting…'
                        : 'Accept'}
                    </button>

                    <button
                      onClick={() => reviewRequest('rejected', id)}
                      disabled={Boolean(actionLoading[id])}
                      title="Reject request"
                      className="px-3 py-2 rounded-md bg-rose-500 text-white text-sm font-medium hover:brightness-95 disabled:opacity-60"
                    >
                      {actionLoading[id] === 'rejected'
                        ? 'Rejecting…'
                        : 'Reject'}
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
