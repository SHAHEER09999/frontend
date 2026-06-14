import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, CreditCard, Loader2 } from "lucide-react";

type BankAccount = {
  id: number;
  account_name: string;
  account_number: string;
};

const API_URL = "http://localhost:3000";

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const [profileId, setProfileId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: token },
      });
      setProfileId(res.data.id);
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async (id: number) => {
    try {
      const res = await axios.get(`${API_URL}/profiles/${id}/bank_accounts`, {
        headers: { Authorization: token },
      });
      setAccounts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profileId) {
      fetchAccounts(profileId);
    }
  }, [profileId]);

  const addAccount = async () => {
    if (!accountName.trim() || !accountNumber.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post(
        `${API_URL}/profiles/${profileId}/bank_accounts`,
        {
          bank_account: {
            account_name: accountName,
            account_number: accountNumber,
          },
        },
        { headers: { Authorization: token } }
      );

      setAccountName("");
      setAccountNumber("");
      fetchAccounts(profileId!);
    } catch (err: any) {
      alert(err.response?.data?.errors || "Error adding account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteAccount = async (id: number) => {
    if (!window.confirm("Are you sure you want to remove this bank account?")) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/profiles/${profileId}/bank_accounts/${id}`, {
        headers: { Authorization: token },
      });
      fetchAccounts(profileId!);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] text-gray-500 font-medium gap-2">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
        <p>Loading payment accounts...</p>
      </div>
    );
  }

  if (!profileId) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500 font-medium">
        Profile not found. Please log in again.
      </div>
    );
  }

  const isMaxAccountsReached = accounts.length >= 3;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-1">
      {/* Header Section */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">
          Payout Accounts
        </h2>
        <p className="text-sm text-gray-500">
          Manage your bank accounts to receive brand payments directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Creation Form Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4 lg:col-span-1">
          <h3 className="font-bold text-[#0f172a] text-base">Add New Account</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Bank Name
              </label>
              <input
                type="text"
                placeholder="e.g., XYZ Bank"
                value={accountName}
                disabled={isMaxAccountsReached || isSubmitting}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Account Number / IBAN
              </label>
              <input
                type="text"
                placeholder="Account or routing number"
                value={accountNumber}
                disabled={isMaxAccountsReached || isSubmitting}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition"
              />
            </div>

            <button
              onClick={addAccount}
              disabled={isMaxAccountsReached || isSubmitting}
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 transition duration-200 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              Add Account
            </button>
          </div>

          {isMaxAccountsReached && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 font-medium">
              Maximum of 3 payout accounts allowed. Remove an existing account to link a new one.
            </div>
          )}
        </div>

        {/* Right Side: Saved Accounts Deck List */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-[#0f172a] text-base">Linked Accounts</h3>
            <span className="text-xs font-bold text-gray-500 bg-gray-100 border px-2.5 py-1 rounded-full">
              {accounts.length} / 3 Active
            </span>
          </div>

          {accounts.length === 0 ? (
            <div className="bg-white border border-gray-200 border-dashed rounded-3xl p-8 text-center text-gray-400 font-medium shadow-sm">
              <CreditCard className="mx-auto text-gray-300 mb-2" size={36} />
              <p className="text-sm">No bank accounts linked yet.</p>
              <p className="text-xs text-gray-400 mt-1">Add one on the left to activate payouts.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-gray-300 transition duration-200 min-h-[140px]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
                      <CreditCard size={20} />
                    </div>
                    <button
                      onClick={() => deleteAccount(acc.id)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-gray-50 transition"
                      title="Remove Account"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-bold text-gray-800 text-sm truncate">
                      {acc.account_name}
                    </h4>
                    <p className="text-xs text-gray-500 font-mono tracking-wider mt-0.5 truncate">
                      {acc.account_number}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Accounts;