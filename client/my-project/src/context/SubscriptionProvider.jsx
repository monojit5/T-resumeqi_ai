import { useCallback, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "./UserContext";
import { SubscriptionContext } from "./SubscriptionContext";
import API_URL from "../config/api";
const FREE_PLAN = {
  id: "free",
  name: "Free",
  monthlyPrice: 0,
  yearlyPrice: 0,
  resumeLimit: 2,
  monthlyAiLimit: 3,
  templates: ["classic"],
  features: [],
};

function SubscriptionProvider({ children }) {
  const { auth, handleSessionExpired } = useContext(UserContext);
  const [subscription, setSubscription] = useState(null);
  const [plan, setPlan] = useState(FREE_PLAN);
  const [usage, setUsage] = useState({
    aiAnalysesUsed: 0,
    aiAnalysesLimit: 3,
    resumesLimit: 2,
    period: "",
  });
  const [transactions, setTransactions] = useState([]);
  const [loadedToken, setLoadedToken] = useState(null);
  const [busy, setBusy] = useState(false);
  const token = auth?.token;
  const handleSessionExpiredRef = useRef(handleSessionExpired);

  useEffect(() => {
    handleSessionExpiredRef.current = handleSessionExpired;
  }, [handleSessionExpired]);

  const loadSubscription = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/subscription/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscription(response.data.subscription);
      setPlan(response.data.plan);
      setUsage(response.data.usage);
      setTransactions(response.data.transactions);
      setLoadedToken(token);
    } catch (error) {
      setLoadedToken(token);
      if (error.response?.status === 401) {
        handleSessionExpiredRef.current();
      } else {
        toast.error(error.response?.data?.message || "Could not load your subscription.");
      }
    }
  }, [token]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) loadSubscription();
    });
    return () => {
      active = false;
    };
  }, [loadSubscription]);

  const createDemoCheckout = async (billingCycle) => {
    if (!token) {
      toast.error("Log in to continue to checkout.");
      return null;
    }
    setBusy(true);
    try {
      const response = await axios.post(
        `${API_URL}/subscription/checkout`,
        { plan: "premium", billingCycle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.transaction;
    } catch (error) {
      if (error.response?.status === 401) {
        handleSessionExpiredRef.current();
      } else {
        toast.error(error.response?.data?.message || "Could not start demo checkout.");
      }
      return null;
    } finally {
      setBusy(false);
    }
  };

  const completeDemoCheckout = async (transactionId, outcome) => {
    if (!token) {
      toast.error("Log in to continue.");
      return null;
    }
    setBusy(true);
    try {
      const response = await axios.post(
        `${API_URL}/subscription/transactions/${encodeURIComponent(transactionId)}/complete`,
        { outcome },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await loadSubscription();
      if (response.data.isPremium) toast.success("Demo payment verified. Premium is active!");
      else if (outcome === "failed") toast.error("Demo payment failed. No subscription was activated.");
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        handleSessionExpiredRef.current();
      } else {
        toast.error(error.response?.data?.message || "Could not verify the demo transaction.");
      }
      return null;
    } finally {
      setBusy(false);
    }
  };

  const dataIsCurrent = Boolean(token && loadedToken === token);
  return (
    <SubscriptionContext.Provider value={{
      subscription: dataIsCurrent ? subscription : null,
      plan: dataIsCurrent ? plan : FREE_PLAN,
      isPremium: dataIsCurrent && plan.id === "premium",
      usage: dataIsCurrent ? usage : { aiAnalysesUsed: 0, aiAnalysesLimit: 3, resumesLimit: 2, period: "" },
      transactions: dataIsCurrent ? transactions : [],
      loading: Boolean(token && !dataIsCurrent),
      busy,
      loadSubscription,
      createDemoCheckout,
      completeDemoCheckout,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export default SubscriptionProvider;
