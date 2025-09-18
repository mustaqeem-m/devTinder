import React from 'react';

const UserCard = (userData) => {
  const { firstName, lastName, profile, skills, about, age, gender } =
    userData.user || {};
  return (
    <div>
      <div className="card bg-black-700 w-96 shadow-sm ">
        <figure>
          <img src={profile} alt="Shoes" />
        </figure>
        <div className="card-body bg-slate-900 rounded-2xl">
          <h2 className="card-title">{firstName + ' ' + lastName}</h2>
          {age && gender && <p>{age + ' ' + gender}</p>}
          <p>
            {about}
            {skills}
          </p>
          <div className="card-actions justify-center gap-5 ">
            <button className="btn btn-primary bg-red-500">Ignore</button>
            <button className="btn btn-primary bg-green-600">Interested</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
