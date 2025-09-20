import WTB from "/ChooseInterest/WTB.png";
import WTS from "/ChooseInterest/WTS.png";
import { motion } from "motion/react";
import { useNavigate } from "react-router";

const ChooseSection = () => {
  const navigate = useNavigate();

  return (
    <div className="section-container flex flex-col items-center py-12">
      <h2 className="text-3xl lg:text-3xl xl:text-4xl font-bold mb-4 text-center">
        ลองเลือกสิ่งที่คุณสนใจ ?
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-[18rem] w-full max-w-5xl">
          {/* ฝั่ง Want to Sell */}
          <div className="w-full md:w-1/2 flex flex-col items-center group">
            <img
              src={WTS}
              alt="WTS"
              className="w-96 h-96 object-contain transition-all duration-300 ease-in-out group-hover:-translate-y-2 cursor-pointer"
              onClick={() => navigate("/shoppingpost", { state: { type: "wts" } })}
            />
            <button
              className="btn-choices"
              onClick={() => navigate("/shoppingpost", { state: { type: "wts" } })}
            >
              Want to Sell
            </button>
          </div>

          {/* ฝั่ง Want to Buy */}
          <div className="w-full md:w-1/2 flex flex-col items-center group">
            <img
              src={WTB}
              alt="WTB"
              className="w-96 h-96 object-contain transition-all duration-300 ease-in-out group-hover:-translate-y-2 cursor-pointer"
              onClick={() => navigate("/shoppingpost", { state: { type: "wtb" } })}
            />
            <button
              className="btn-choices"
              onClick={() => navigate("/shoppingpost", { state: { type: "wtb" } })}
            >
              Want to Buy
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChooseSection;
