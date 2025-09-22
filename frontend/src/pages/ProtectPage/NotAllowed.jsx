import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router";

import notAllowed from "/Icons/warnings.png";

const NotAllowed = () => {
  const [counter, setCounter] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000);

    const countDown = setInterval(() => {
      setCounter((prevCounter) => {
        if (prevCounter <= 1) {
          clearInterval(countDown);
          return 0;
        }
        return prevCounter - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countDown);
    };
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="card bg-base-100 w-106 shadow-xl">
        <figure>
          <img src={notAllowed} alt="NOT" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            Page NotAllowed!
            <div className="badge badge-error">NOT</div>
          </h2>
          <p>You cannot access this HomePage.</p>
          <p className="text-error -500 mt-1">
            Redirecting to the HomePage in
            <span className="countdown font-mono text-6xl">
              <span style={{ "--value": counter }}></span>
            </span>
            seconds...
          </p>
          <div className="card-actions justify-end"></div>
        </div>
      </div>
    </div>
  );
};

export default NotAllowed;