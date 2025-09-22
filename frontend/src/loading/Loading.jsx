
import Lottie from "lottie-react";

const Loading = ({ animation }) => {
  const defaultOption = {
    loop: true,
    autoplay: true,
    animationData: animation.default || animation, 
  };
  const style = { height: 300 };

  return (
    <Lottie
      animationData={defaultOption.animationData}
      loop={defaultOption.loop}
      autoplay={defaultOption.autoplay}
      style={style}
    />
  );
};

export default Loading;