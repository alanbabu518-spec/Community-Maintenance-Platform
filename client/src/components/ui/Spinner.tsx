interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

function Spinner({ size = "md" }: SpinnerProps) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-5 h-5 border-2",
    lg: "w-8 h-8 border-4",
  };

  return (
    <span
      className={`
        inline-block
        ${sizes[size]}
        border-white
        border-t-transparent
        rounded-full
        animate-spin
      `}
    />
  );
}

export default Spinner;