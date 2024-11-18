"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import io from "socket.io-client";
import { useRouter } from "next/navigation";

const AssetList = () => {
  const token = Cookies.get("token");
  const [assets, setAssets] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/user/assets`;

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAssets(response.data.assets);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch assets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [token]);

  useEffect(() => {
    const total = assets.reduce((total, userAsset) => {
      return total + userAsset.quantity * userAsset.assetId.currentPrice;
    }, 0);
    setTotalValue(total);
  }, [assets]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
    assets.forEach((userAsset) => {
      socket.emit("join-room", userAsset.assetId.symbol);
    });

    socket.on("portfolio-update", (data) => {
      setAssets((prevAssets) =>
        prevAssets.map((asset) =>
          asset.assetId.symbol === data.asset
            ? {
                ...asset,
                assetId: {
                  ...asset.assetId,
                  currentPrice: data.newPrice,
                },
              }
            : asset
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [assets]);

  const handleViewDetails = (symbol) => {
    router.push(`/user/stock-details/${symbol}`);
  };

  if (loading) {
    return <div className="text-center text-blue-500 mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  return (
    <div className="mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Your Portfolio
      </h2>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-700">
            Total Value: <span className="text-green-600">${totalValue}</span>
          </h3>
        </div>

        <div className="space-y-4">
          {assets.map((userAsset) => (
            <div
              key={userAsset.assetId._id}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm"
            >
              <div>
                <h4 className="font-semibold text-lg text-gray-800">
                  {userAsset.assetId.name} ({userAsset.assetId.symbol})
                </h4>
                <p className="text-sm text-gray-600">
                  Quantity: {userAsset.quantity} | Current Price: $
                  {userAsset.assetId.currentPrice}
                </p>
              </div>
              <div>
                <button
                  onClick={() => handleViewDetails(userAsset.assetId.symbol)} // Call function on click
                  className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssetList;
