import Modal from "./Login/Modal";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const TermOfService = () => {
  const { user } = useContext(AuthContext); // ดึงข้อมูลผู้ใช้จาก contextเเละUserที่Loginอยู่
  return (
    <div className="max-w-4xl mx-auto p-6 bg-base-100 rounded-xl shadow-md border border-base-300 my-10 mt-22">
      <h1 className="text-2xl font-bold text-primary mb-6">
        นโยบายความเป็นส่วนตัวและข้อกำหนดการใช้งาน
      </h1>

      <div className="text-base-content space-y-6 leading-relaxed">
        <section>
          <h2 className="font-semibold text-lg mb-2">1. การยอมรับข้อกำหนด</h2>
          <p>
            เมื่อผู้ใช้งานลงทะเบียนหรือใช้งานเว็บไซต์ DormDeals
            ถือว่าผู้ใช้ยอมรับและตกลงปฏิบัติตามข้อกำหนดและเงื่อนไขที่ระบุในเอกสารนี้
            รวมถึงข้อกำหนดที่อาจมีการปรับปรุงแก้ไขในอนาคต
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">2. ขอบเขตความรับผิดชอบ</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              DormDeals
              ทำหน้าที่เป็นสื่อกลางในการโพสต์ซื้อขายสินค้ามือสองระหว่างผู้ใช้เท่านั้น
            </li>
            <li>
              ไม่เกี่ยวข้องกับการเจรจา การชำระเงิน การจัดส่ง
              หรือการรับประกันสินค้าใด ๆ
            </li>
            <li>
              ผู้ใช้ต้องยอมรับความเสี่ยงในการทำธุรกรรมด้วยตนเอง และ DormDeals
              จะไม่รับผิดชอบต่อความเสียหายหรือข้อพิพาทใด ๆ ที่เกิดขึ้น
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">3. ข้อจำกัดการใช้งาน</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              ห้ามโพสต์หรือซื้อขายสินค้าที่ผิดกฎหมาย ละเมิดลิขสิทธิ์
              หรือขัดต่อศีลธรรมและจริยธรรม
            </li>
            <li>
              สินค้าที่ห้ามโพสต์ ได้แก่:
              <ul className="list-decimal pl-6 mt-2 space-y-1">
                <li>
                  สินค้าละเมิดลิขสิทธิ์ เช่น หนังสือปลอม ซอฟต์แวร์เถื่อน
                  หรือสื่อดิจิทัลที่ไม่มีลิขสิทธิ์
                </li>
                <li>สินค้าผิดกฎหมาย เช่น ยาเสพติด สารเคมีอันตราย หรืออาวุธ</li>
                <li>สินค้าที่มีเนื้อหาลามกอนาจาร หรือส่งเสริมความรุนแรง</li>
              </ul>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">4. การรับประกันสินค้า</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              DormDeals ไม่รับรองคุณภาพ รายละเอียด
              หรือความปลอดภัยของสินค้าที่โพสต์ประกาศ
            </li>
            <li>
              ผู้ใช้ควรตรวจสอบสินค้าอย่างละเอียดก่อนทำการชำระเงินหรือส่งมอบ
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">5. การจัดการข้อพิพาท</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              DormDeals
              จะไม่เข้าไปมีส่วนร่วมในการแก้ไขข้อพิพาทระหว่างผู้ซื้อและผู้ขาย
            </li>
            <li>
              ผู้ใช้ควรใช้ความระมัดระวัง
              และดำเนินการแก้ไขข้อพิพาทโดยตรงระหว่างกัน
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">
            6. การปกป้องข้อมูลส่วนบุคคล
          </h2>
          <p>
            DormDeals จะเก็บรักษาข้อมูลส่วนบุคคลของผู้ใช้อย่างปลอดภัย
            และจะไม่เปิดเผยข้อมูลแก่บุคคลที่สามโดยไม่ได้รับความยินยอมจากผู้ใช้
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">
            7. การแก้ไขข้อกำหนดและเงื่อนไข
          </h2>
          <p>
            DormDeals
            สงวนสิทธิ์ในการปรับปรุงหรือแก้ไขข้อกำหนดและเงื่อนไขตามดุลยพินิจ
            และจะแจ้งให้ผู้ใช้ทราบล่วงหน้าเมื่อมีการเปลี่ยนแปลงสำคัญ
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">8. การบอกเลิกการใช้งาน</h2>
          <p>
            DormDeals มีสิทธิ์ระงับหรือยกเลิกการใช้งานของผู้ใช้
            หากพบว่ามีการละเมิดข้อกำหนด หรือมีพฤติกรรมที่ไม่เหมาะสมบนแพลตฟอร์ม
          </p>
        </section>
        <hr />
        <div className="mt-6 font-medium">
          ผู้ใช้ตกลงที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขข้างต้นอย่างเคร่งครัด
          และต้องรับผิดชอบต่อการกระทำหรือเนื้อหาที่โพสต์บนแพลตฟอร์ม DormDeals
          เพื่อรักษาความปลอดภัย ความน่าเชื่อถือ
          และความเป็นระเบียบเรียบร้อยของชุมชนผู้ใช้งาน
        </div>

        <div className="flex items-center justify-center gap-4 p-4 bg-base-100">
          <a
            href="/"
            className="px-6 py-2 text-sm font-medium bg-base-200 hover:bg-base-300 rounded-lg transition duration-200"
          >
            ย้อนกลับ
          </a>

          {!user && (
            <>
              <button
                className="px-6 py-2 text-sm font-medium bg-base-200 hover:bg-base-300 rounded-lg transition duration-200 cursor-pointer"
                onClick={() => document.getElementById("login").showModal()}
              >
                เข้าสู่ระบบ
              </button>
              <Modal name="login" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermOfService;
