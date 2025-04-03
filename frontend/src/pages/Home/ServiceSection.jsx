import React from 'react'
import chat from "/Service/chat.png"
import check from "/Service/check.png"
import shopping from "/Service/shopping.png"
import { motion } from 'motion/react'
const ServiceSection = () => {
  return (
    <motion.div
    initial={{ opacity: 0, y: 100 }} // เริ่มต้นจางและเลื่อนลงมา
    whileInView={{ opacity: 1, y: 0 }} // เมื่ออยู่ใน Viewport ให้ปรากฏ
    transition={{ duration: 0.8, ease: "easeInOut" }} // เพิ่มความสมูธ
  >
    <div className="section-container px-6 py-24">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
        
        {/* คอลัมน์ซ้าย: หัวข้อและคำอธิบาย */}
        <div className="md:w-1/3 text-center md:text-left">
          <h2 className="text-3xl font-bold text-black leading-snug">
            DormDeals โพสต์ประกาศ <br />
            ซื้อ-ขายสินค้ามือสอง <br />
            สำหรับนักศึกษา <span className="text-red-500">“ฟรี”</span>
          </h2>
          <p className="text-gray-500 text-lg mt-3">
            แพลตฟอร์มซื้อขายสินค้าออนไลน์มือสองสำหรับนักศึกษาโดยตรงแบบไม่มีคนกลาง
          </p>
        </div>

        {/* คอลัมน์ขวา: Features (ไอคอน + ข้อความ) */}
        <div className="flex flex-col md:flex-row gap-8 md:w-2/3">
          
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <img src={shopping} alt="โพสต์ฟรี" className="w-24 h-24 mb-4" />
            <h3 className="text-xl font-semibold">โพสต์ซื้อ-ขายฟรี!</h3>
            <p className="text-gray-500 mt-2">
              ผู้ซื้อ-ผู้ขายสามารถมาลงโพสต์ซื้อ-ขายได้ฟรี ไม่เสียค่าใช้จ่ายใดๆ
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <img src={chat} alt="ซื้อขายโดยตรง" className="w-24 h-24 mb-4" />
            <h3 className="text-xl font-semibold">ซื้อขายโดยตรง</h3>
            <p className="text-gray-500 mt-2">
              ผู้ซื้อและผู้ขายได้คุยกันโดยตรงโดยไม่ต้องผ่านตัวกลางใดๆ
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <img src={check} alt="ปลอดภัย" className="w-24 h-24 mb-4" />
            <h3 className="text-xl font-semibold">ปลอดภัยทั้งคู่</h3>
            <p className="text-gray-500 mt-2">
              ผู้ซื้อและผู้ขายอยู่ในมหาลัยเดียวกัน!
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  </motion.div>
  )
}

export default ServiceSection