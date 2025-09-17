import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../utils/slice/FeedSlice.jsx';
import { useNavigate } from 'react-router-dom';
import UserFeed from './UserFeed';

const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const feed = useSelector((store) => store.feed);

  const getFeed = async () => {
    try {
      if (feed) return;
      const res = await axios.get(BASE_URL + '/user/feed');
      console.log(res.data);
      dispatch(addFeed(res.data));
    } catch {
      navigate('/error');
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
    <div>
      <UserFeed />
    </div>
  );
};

export default Feed;
