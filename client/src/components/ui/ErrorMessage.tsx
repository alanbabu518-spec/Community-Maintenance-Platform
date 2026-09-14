interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <p className="text-sm text-red-500">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="
            mt-3
            text-xs
            font-semibold
            text-[#2da0a8]
            hover:underline
          "
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;