import WTB from "/ChooseInterest/WTB.png";
import WTS from "/ChooseInterest/WTS.png";
import { motion } from "motion/react";

const ChooseSection = () => {
  return (
    <div className="section-container flex flex-col items-center py-24">
      <h2 className="text-4xl font-bold mb-12 text-center">
        ลองเลือกสิ่งที่คุณสนใจ ?
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 50 }} // เริ่มต้นโปร่งใส + ขยับลง 50px
        animate={{ opacity: 1, y: 0 }} // แสดงเต็ม + ขยับขึ้นไปที่ตำแหน่งปกติ
        transition={{ duration: 0.8 }} // กำหนดความเร็วของ Animation
      >
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-[18rem] w-full max-w-5xl">
          {/* ฝั่ง Want to Sell */}
          <div className="w-full md:w-1/2 flex flex-col items-center group">
            <a href="/shoppingpost">
              <img
                src={WTS}
                alt="WTS"
                className="w-96 h-96 object-contain transition-all duration-300 ease-in-out group-hover:-translate-y-2"
              />
            </a>

            <a href="/shoppingpost" className="btn-choices">
              Want to Sell
            </a>
          </div>

          {/* ฝั่ง Want to Buy */}
          <div className="w-full md:w-1/2 flex flex-col items-center group">
            <img
              src={WTB}
              alt="WTB"
              className="w-96 h-96 object-contain transition-all duration-300 ease-in-out group-hover:-translate-y-2"
            />
            <button className="btn-choices">Want to Buy</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChooseSection;
