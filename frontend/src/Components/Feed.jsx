// Feed.jsx (robust, avoids endless loading)
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../utils/slice/FeedSlice.js';
import { useNavigate } from 'react-router-dom';
import UserFeed from './UserCard.jsx';
import CardStage from './CardStage.jsx';

const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((store) => store.user?._id);
  const feed = useSelector((store) => store.feed || []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // only run when we have a logged-in user and feed is empty
    if (!userId) return;
    if (feed.length > 0) return;

    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchFeed() {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${BASE_URL}/user/feed`, {
          signal,
          withCredentials: true,
        });
        // if request was aborted, don't dispatch
        if (signal.aborted) return;
        dispatch(addFeed(res.data));
      } catch (err) {
        if (axios.isCancel(err) || err.name === 'CanceledError') {
          // request was cancelled — ignore
          console.log('Feed request cancelled');
        } else {
          console.error('Failed to fetch feed:', err);
          setError('Failed to load matches. Try again.');
          // DON'T auto-navigate to /error here — that can cause mount/navigation loops.
          // If you still want to navigate on serious errors, do it from the UI (user click).
        }
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    }

    fetchFeed();

    return () => {
      controller.abort(); // cancel the request when unmounting / deps change
    };
  }, [userId, dispatch, feed.length]);

  // Loading UI
  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-white/20 animate-spin" />
          <div className="text-slate-300">Fetching matches…</div>
        </div>
      </div>
    );
  }

  // Error UI with retry and optional manual navigation
  if (error) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              className="px-4 py-2 rounded-md bg-emerald-500 text-white"
              onClick={() => {
                // retry: clear error and re-run effect by dispatching a no-op or forcing feed length to 0.
                setError('');
                // simplest: reload same component (re-run effect) by re-fetching manually
                window.location.reload(); // quick & simple retry
              }}
            >
              Retry
            </button>
            <button
              className="px-4 py-2 rounded-md bg-slate-700 text-white"
              onClick={() => navigate('/error')}
            >
              Go to error page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No profiles
  if (!feed || feed.length === 0) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">No profiles right now</h2>
          <p className="text-slate-400">
            We’ll surface more matches when they’re available. Try again later.
          </p>
        </div>
      </div>
    );
  }

  // Normal render: show top profile in the CardStage
  const currentIndex = 1; // 1-based index
  const totalProfiles = feed.length;

  return (
    <div className="w-full">
      <CardStage index={currentIndex} total={totalProfiles}>
        <UserFeed key={feed[0]._id} user={feed[0]} />
      </CardStage>
    </div>
  );
};

export default Feed;
