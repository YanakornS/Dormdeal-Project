import { useRef, useState, useEffect } from "react";
import { IoArrowDownCircleOutline } from "react-icons/io5";

const TermOfServiceModal = ({ isOpen, onAccept, onCancel }) => {
  const bottomRef = useRef(null);
  const contentRef = useRef(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  if (!isOpen) return null;
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    const el = contentRef.current;
    if (!el) return;
    const isAtBottom =
      Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;
    if (isAtBottom) {
      setHasScrolledToBottom(true);
    }
  };

  return (
    <div className=" fixed inset-0 flex items-center justify-center z-50 mt-85">
      <div className="bg-base-100 border border-base-300 rounded-xl shadow-md max-w-4xl w-full max-h-[60vh] flex flex-col relative p-6 ">
        <h1 className="text-2xl font-bold text-primary mb-6">
          นโยบายความเป็นส่วนตัวและข้อกำหนดการใช้งาน
        </h1>

        <button
          onClick={scrollToBottom}
          className="absolute right-6 top-6 text-primary hover:text-blue-600"
          title="เลื่อนลง"
          type="button"
          data-test="scroll-bottom"
        >
          <IoArrowDownCircleOutline size={30} />
        </button>

        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="text-base-content space-y-6 leading-relaxed overflow-y-auto pr-4 flex-1"
        >
          <section>
            <h2 className="font-semibold text-lg mb-2">1. การยอมรับข้อกำหนด</h2>
            <p>
              เมื่อผู้ใช้งานลงทะเบียนหรือใช้งานเว็บไซต์ DormDeals
              ถือว่าผู้ใช้ยอมรับและตกลงปฏิบัติตามข้อกำหนดและเงื่อนไขที่ระบุไว้ในเอกสารนี้
              รวมถึงข้อกำหนดที่อาจมีการปรับปรุงแก้ไขในอนาคต
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">
              2. ขอบเขตความรับผิดชอบ
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                DormDeals มีบทบาทเป็นสื่อกลางในการโพสต์ซื้อขายสินค้า มือสอง
                ระหว่างผู้ใช้ โดยไม่มีส่วนเกี่ยวข้องในกระบวนการเจรจา การชำระเงิน
                การจัดส่ง หรือการรับประกันสินค้าใดๆ
              </li>
              <li>
                DormDeals
                จะไม่รับผิดชอบต่อความเสียหายหรือการสูญเสียที่เกิดจากการโพสต์ซื้อขายสินค้าหรือการติดต่อใดๆ
                ระหว่างผู้ใช้
              </li>
              <li>
                ผู้ใช้รับทราบและยอมรับว่าการโพสต์ซื้อขายสินค้าบนแพลตฟอร์มเป็นการทำธุรกรรมระหว่างผู้ใช้และต้องรับความเสี่ยงเอง
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">3. ข้อจำกัดการใช้งาน</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                ห้ามโพสต์หรือโพสต์ซื้อขายสินค้าที่ละเมิดลิขสิทธิ์,
                สินค้าผิดกฎหมาย, หรือสินค้าที่ขัดต่อศีลธรรมและจริยธรรม
              </li>
              <li>
                สินค้าประเภทที่ห้ามโพสต์ประกาศ ได้แก่:
                <ul className="list-decimal pl-6 mt-2 space-y-1">
                  <li>
                    สินค้าละเมิดลิขสิทธิ์ เช่น หนังสือปลอม, ซอฟต์แวร์เถื่อน,
                    และสื่อดิจิทัลที่ไม่มีลิขสิทธิ์
                  </li>
                  <li>
                    สินค้าผิดกฎหมาย เช่น บุหรี่ไฟฟ้า, ยาเสพติด, สารเคมีอันตราย,
                    หรืออาวุธ
                  </li>
                  <li>สินค้าที่มีเนื้อหาลามกอนาจารหรือส่งเสริมความรุนแรง</li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">
              4. การรับประกันสินค้า
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                DormDeals ไม่รับรองคุณภาพ ความถูกต้องตามรายละเอียด
                หรือความปลอดภัยของสินค้าที่โพสต์ประกาศ
              </li>
              <li>
                ผู้ใช้ควรตรวจสอบสินค้าอย่างละเอียดก่อนการชำระเงินหรือการส่งมอบ
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">5. การจัดการข้อพิพาท</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                DormDeals
                จะไม่เข้าไปมีส่วนเกี่ยวข้องในการแก้ไขข้อพิพาทระหว่างผู้ซื้อและผู้ขาย
              </li>
              <li>
                ผู้ใช้ควรใช้ความระมัดระวังและดำเนินการแก้ไขข้อพิพาทโดยตรงระหว่างกัน
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">
              6. การปกป้องข้อมูลส่วนบุคคล
            </h2>
            <p>
              DormDeals
              จะเก็บรักษาข้อมูลส่วนบุคคลของผู้ใช้ตามนโยบายความเป็นส่วนตัว
              โดยจะไม่เปิดเผยข้อมูลแก่บุคคลที่สามโดยไม่ได้รับความยินยอม
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">
              7. การแก้ไขข้อกำหนดและเงื่อนไข
            </h2>
            <p>
              DormDeals
              สงวนสิทธิ์ในการปรับปรุงหรือแก้ไขข้อกำหนดและเงื่อนไขนี้ตามดุลยพินิจ
              โดยจะแจ้งให้ผู้ใช้ทราบล่วงหน้า
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">
              8. การบอกเลิกการใช้งาน
            </h2>
            <p>
              DormDeals มีสิทธิ์บอกเลิกการใช้งานของผู้ใช้
              หากพบว่ามีการละเมิดข้อกำหนด หรือการกระทำที่ไม่เหมาะสม
            </p>
          </section>

          <div className="mt-6 font-medium">
            ผู้ใช้ตกลงที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขที่ระบุไว้ข้างต้นอย่างเคร่งครัด
            และต้องรับผิดชอบต่อการกระทำหรือเนื้อหาใดๆ ที่โพสต์บนแพลตฟอร์ม
            DormDeals เพื่อรักษาความปลอดภัย ความน่าเชื่อถือ
            และความเป็นระเบียบเรียบร้อยของชุมชนผู้ใช้งาน
          </div>

          <div ref={bottomRef}></div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button onClick={onCancel} className="btn btn-outline" type="button">
            ยกเลิก
          </button>
          <button
            onClick={() => hasScrolledToBottom && onAccept()}
            className={`btn btn-primary ${
              !hasScrolledToBottom ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!hasScrolledToBottom}
            type="button"
            aria-disabled={!hasScrolledToBottom}
            data-test="accept-button"
            title={
              !hasScrolledToBottom
                ? "กรุณาเลื่อนอ่านเนื้อหาจนจบก่อน"
                : "ยอมรับข้อกำหนด"
            }
          >
            ยอมรับ
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermOfServiceModal;
