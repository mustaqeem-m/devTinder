import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../utils/slice/FeedSlice.jsx';
import { useNavigate } from 'react-router-dom';
import UserFeed from './UserCard.jsx';

const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((store) => store.user?._id);

  const feed = useSelector((store) => store.feed);

  const getFeed = async () => {
    try {
      if (feed) return;
      const res = await axios.get(BASE_URL + '/user/feed');
      dispatch(addFeed(res.data));
    } catch (err) {
      console.log(err);
      navigate('/error');
    }
  };

  useEffect(() => {
    if (userId) getFeed();
  }, [userId]);

  if (!feed) return;

  if (feed.length === 0)
    return (
      <h2 className="text-2xl justify-center m-10 flex font-semibold">
        Your connections is full!
      </h2>
    );

  return (
    feed && (
      <div className="flex justify-center mx-auto mt-10">
        <UserFeed user={feed[0]} />
        {/* <UserCard user={{ firstName, lastName, age, gender, about, profile }} /> */}
      </div>
    )
  );
};

export default Feed;
