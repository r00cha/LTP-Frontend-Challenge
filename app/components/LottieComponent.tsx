import { useLottie } from "lottie-react";

interface LottieComponentProps {
  animationData: any;
  className?: string;
}

const LottieComponent = ({ animationData, className }: LottieComponentProps) => {
  
  const defaultOptions = {
    animationData: animationData,
    loop: true,
  };

  const { View } = useLottie(defaultOptions);

  if (!animationData) {
    return null; // or a loading spinner
  }

  return <div className={className}>{View}</div>;
};

export default LottieComponent;