"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSave, FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import Cookies from "js-cookie";
import AssetSearch from "./AssetSearch";

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const token = Cookies.get("token");
  const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/user/assets";

  const fetchAssets = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssets(response.data.assets || []);
    } catch (err) {
      setError("Error fetching assets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [token]);

  const adjustQuantity = (index, action) => {
    setAssets((prevAssets) =>
      prevAssets.map((asset, i) =>
        i === index
          ? {
              ...asset,
              quantity:
                action === "increase"
                  ? asset.quantity + 1
                  : asset.quantity > 1
                  ? asset.quantity - 1
                  : 1,
            }
          : asset
      )
    );
  };

  const saveChanges = async (index) => {
    const updatedAsset = assets[index];
    try {
      setSavingId(updatedAsset._id);
      await axios.put(
        `${API_URL}/quantity/${updatedAsset._id}`,
        {
          quantity: updatedAsset.quantity,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(`Changes saved for ${updatedAsset.assetId.name}`);
    } catch (err) {
      setError("Error saving changes. Please try again.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteAsset = async (id) => {
    try {
      setDeletingId(id);
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssets(assets.filter((asset) => asset._id !== id));
      alert("Asset deleted successfully");
    } catch (err) {
      setError("Error deleting asset. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="text-center text-blue-500 mt-8">Loading...</div>;
  }

  return (
    <div className=" mx-auto p-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Your Assets
      </h2>
      {error && <div className="text-red-600 text-center mb-4">{error}</div>}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition flex items-center justify-center space-x-2"
        >
          <FaPlus />
          <span>Add Asset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {assets.map((asset, index) => (
          <div
            key={asset.assetId.symbol}
            className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg border border-gray-200"
          >
            <div>
              <h3 className="font-semibold text-lg text-gray-800">
                {asset.assetId.name} ({asset.assetId.symbol})
              </h3>
              <p className="text-sm text-gray-600">
                Current Price: ${asset.assetId.currentPrice} | Total Value: $
                {(asset.quantity * asset.assetId.currentPrice).toFixed(2)}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => adjustQuantity(index, "decrease")}
                className="px-4 py-2 bg-gray-300 text-white rounded-lg shadow-sm hover:bg-gray-400 transition"
                disabled={asset.quantity <= 1}
              >
                <FaMinus />
              </button>
              <div className="font-semibold text-xl text-gray-800">
                {asset.quantity}
              </div>
              <button
                onClick={() => adjustQuantity(index, "increase")}
                className="px-4 py-2 bg-gray-300 text-white rounded-lg shadow-sm hover:bg-gray-400 transition"
              >
                <FaPlus />
              </button>
              <button
                onClick={() => saveChanges(index)}
                className="px-4 py-2 bg-green-600 text-white flex flex-row gap-4 items-center rounded-lg shadow-md hover:bg-green-700 transition"
                disabled={savingId === asset._id}
              >
                {savingId === asset._id ? (
                  <div className="">Saving...</div>
                ) : (
                  <>
                    <FaSave />
                    Save Changes
                  </>
                )}
              </button>
              <button
                onClick={() => handleDeleteAsset(asset._id)}
                className="px-4 py-2 bg-red-600 flex flex-row gap-4 items-center text-white rounded-lg shadow-md hover:bg-red-700 transition"
                disabled={deletingId === asset._id}
              >
                {deletingId === asset._id ? (
                  <div className="">Deleting...</div>
                ) : (
                  <>
                    <FaTrash />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className=" w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <AssetSearch closeModal={closeModal} fetchAssets={fetchAssets} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetList;
