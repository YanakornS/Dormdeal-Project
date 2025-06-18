import logo from "/Logo/logo.png";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4 ">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              <img src={logo} alt="Logo" className="size-10 object-contain" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">ยินดีต้อนรับสู่ระบบแชท DormDeals!</h2>
        <p className="text-base-content/60">
        เลือกการสนทนาจากแถบด้านข้างเพื่อเริ่มการแชท
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;