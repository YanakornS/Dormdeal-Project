import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import notAllowed from "/Icons/warning-sign.png";

const NotAllowedAdmin = () => {
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
    <div className="flex justify-center items-center h-screen bg-base-200">
      <div className="card bg-base-100 w-[450px] shadow-2xl">
        <figure className="p-6">
          <img src={notAllowed} alt="Access Denied" className="w-40" />
        </figure>
        <div className="card-body text-center">
          <h2 className="card-title justify-center text-red-600 text-3xl">
            Access Denied
            <div className="badge badge-error ml-2">403</div>
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            This page is restricted to <span className="font-bold">Admins only</span>.
          </p>
          <p className="mt-1 text-error">
            Redirecting to the HomePage in{" "}
            <span className="countdown font-mono text-5xl">
              <span style={{ "--value": counter }}></span>
            </span>{" "}
            seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotAllowedAdmin;
