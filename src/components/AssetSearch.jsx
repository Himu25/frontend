"use client";
import React, { useState } from "react";
import axios from "axios";
import { FaPlus, FaMinus, FaSpinner } from "react-icons/fa";
import Cookies from "js-cookie";

const AssetSearch = ({ fetchAssets, closeModal }) => {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [assetName, setAssetName] = useState("");
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [loading, setLoading] = useState(false); // For asset search
  const [addLoading, setAddLoading] = useState(false); // For adding to cart
  const [searching, setSearching] = useState(false);
  const token = Cookies.get("token");

  const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/user/assets";
  const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

  const handleSearch = () => {
    if (symbol.trim() === "") return;

    setSearching(true);
    setLoading(true);
    axios
      .get(
        `https://finnhub.io/api/v1/search?q=${symbol}&token=${FINNHUB_API_KEY}`
      )
      .then((response) => {
        setAssets(response.data.result);
      })
      .catch((error) => console.log("Error fetching assets:", error))
      .finally(() => {
        setLoading(false);
        setSearching(false);
      });
  };

  const adjustQuantity = (action) => {
    if (action === "increase") setQuantity((prev) => prev + 1);
    else if (action === "decrease" && quantity > 1)
      setQuantity((prev) => prev - 1);
  };

  const handleSelectAsset = (asset) => {
    setSelectedAsset(asset);
    setSymbol(asset.symbol);
    setAssetName(asset.name || asset.description || asset.symbol);
    setAssets([]);
  };

  const addToCart = async () => {
    if (quantity > 0 && symbol && assetName) {
      setAddLoading(true); // Start loading when adding to cart
      try {
        await axios.post(
          API_URL,
          { symbol, quantity, name: assetName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(`Added ${quantity} of ${symbol} (${assetName}) to cart!`);
        fetchAssets(true);
        closeModal();
      } catch (error) {
        alert("Failed to add asset to cart.");
        console.error(error);
      } finally {
        setAddLoading(false); // Stop loading after adding
      }
    } else {
      alert("Please select a valid asset.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-lg mx-auto">
      <div className="mb-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Enter symbol (e.g., AAPL)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full px-5 py-3 text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white rounded-md p-3 hover:bg-blue-700 transition relative"
            disabled={searching || loading}
          >
            {searching || loading ? (
              <FaSpinner className="animate-spin inset-0 m-auto" size={18} />
            ) : (
              "Search"
            )}
          </button>
        </div>
      </div>

      {assets.length > 0 && (
        <div className="mt-3 max-h-64 overflow-y-auto border border-gray-300 rounded-md bg-white shadow-lg">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : (
            assets.map((asset) => (
              <div
                key={asset.symbol}
                className="p-3 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectAsset(asset)}
              >
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-gray-800">
                    {asset.symbol}
                  </div>
                  <div className="text-sm text-gray-500">
                    {asset.name || asset.description}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedAsset && (
        <>
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Adjust Quantity
            </h3>
            <div className="flex items-center mt-3 space-x-3">
              <button
                onClick={() => adjustQuantity("decrease")}
                className="px-4 py-3 bg-gray-200 text-white rounded-md shadow-sm hover:bg-gray-300 transition"
                disabled={quantity <= 1}
              >
                <FaMinus size={16} />
              </button>
              <div className="text-lg font-semibold text-gray-800">
                {quantity}
              </div>
              <button
                onClick={() => adjustQuantity("increase")}
                className="px-4 py-3 bg-gray-200 text-white rounded-md shadow-sm hover:bg-gray-300 transition"
              >
                <FaPlus size={16} />
              </button>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={addToCart}
              className="w-full py-3 bg-green-600 text-white rounded-md shadow-lg hover:bg-green-700 transition relative"
              disabled={addLoading}
            >
              {addLoading ? (
                <FaSpinner
                  className="animate-spin absolute inset-0 m-auto"
                  size={18}
                />
              ) : (
                "Add to Cart"
              )}
            </button>
            <button
              onClick={closeModal}
              className="w-full py-3 bg-gray-600 text-white rounded-md shadow-lg hover:bg-gray-700 transition"
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AssetSearch;
