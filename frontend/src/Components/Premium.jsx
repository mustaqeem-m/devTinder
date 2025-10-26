import React from 'react';
import axios from 'axios';
import { BASE_URL } from './../utils/constants';
const Premium = () => {
  const handleOrder = async (memberShipType) => {
    const order = await axios.post(BASE_URL + '/payment/createOrder', {
      memberShipType,
    });
    const { amount, keyId, currency, description, order_id, notes, status } =
      order.data;
    //It should open the razorpay dialog box
    //crucial step
    //razor pay comes from the script that added in the index.html , so we are adding windows. this is invoke razorpay whenever the page is loaded
    var options = {
      key: keyId, // Enter the Key ID generated from the Dashboard
      amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency,
      name: 'Devs Tinder',
      description,
      image: '/frontend/logo.png',
      order_id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      
      prefill: {
        name: notes.firstName + ' ' + notes.lastName,
        email: notes.emailId,
        status,
      },
      notes: notes,
      theme: {
        color: '#3399cc',
      },
    };

    var rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 p-4">
      <div className="card bg-base-200 hover:bg-base-300 transition-all rounded-2xl shadow-lg flex-1 flex flex-col justify-center items-center text-center p-6">
        <h2 className="text-2xl font-bold mb-2 text-primary">
          Silver Membership
        </h2>
        <p className="text-sm opacity-80 mb-4">
          100 connection requests per day
        </p>
        <button
          className="btn btn-outline btn-primary btn-sm"
          onClick={() => {
            handleOrder('silver');
          }}
        >
          Choose Silver
        </button>
      </div>

      <div className="divider lg:divider-horizontal">OR</div>

      <div className="card bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white rounded-2xl shadow-lg flex-1 flex flex-col justify-center items-center text-center p-6">
        <h2 className="text-2xl font-bold mb-2">Gold Membership</h2>
        <p className="text-sm opacity-90 mb-4">
          Unlimited connections + Profile Boost + Verfied check
        </p>
        <button
          className="btn btn-sm bg-white text-amber-600 border-none hover:bg-gray-100 font-semibold"
          onClick={() => {
            handleOrder('gold');
          }}
        >
          Choose Gold
        </button>
      </div>
    </div>
  );
};

export default Premium;
