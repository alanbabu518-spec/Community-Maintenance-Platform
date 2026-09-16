import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "lottie-player": {
        src: string;
        background: string;
        speed: string;
        style?: React.CSSProperties;
        loop?: boolean;
        autoplay?: boolean;
      };
    }
  }
}