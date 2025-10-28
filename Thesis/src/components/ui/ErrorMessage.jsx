const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-900 bg-opacity-50 border border-red-500 text-red-200 px-6 py-4 rounded-lg max-w-2xl mx-auto my-8">
      <div className="flex items-start">
        <span className="text-2xl mr-3">⚠️</span>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Error</h3>
          <p className="text-sm">{message || 'Something went wrong. Please try again.'}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 btn-primary text-sm"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;

