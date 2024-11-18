export default async function page({ params }) {
  const symbol = (await params).symbol;
  const API_KEY = process.env.FINNHUB_API_KEY;
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;

  let stockDetails = null;
  let error = null;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch stock details.");
    }

    stockDetails = await response.json();
  } catch (err) {
    error = err.message || "Failed to fetch stock details.";
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 text-red-500 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto rounded-xl">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        {symbol} Stock Details
      </h1>
      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-700">
            Stock Price Information
          </h2>
          <div className="mt-4">
            <p className="text-lg text-gray-600">
              Current Price:{" "}
              <span className="font-semibold text-green-600">
                ${stockDetails?.c}
              </span>
            </p>
            <p className="text-lg text-gray-600">
              High Price:{" "}
              <span className="font-semibold text-yellow-500">
                ${stockDetails?.h}
              </span>
            </p>
            <p className="text-lg text-gray-600">
              Low Price:{" "}
              <span className="font-semibold text-red-500">
                ${stockDetails?.l}
              </span>
            </p>
            <p className="text-lg text-gray-600">
              Open Price:{" "}
              <span className="font-semibold text-blue-500">
                ${stockDetails?.o}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
