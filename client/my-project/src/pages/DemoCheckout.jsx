import { useContext, useState } from "react";
import { AlertCircle, CheckCircle2, CreditCard, LoaderCircle, ShieldCheck, XCircle } from "lucide-react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import Brand from "../components/Brand";
import Navber from "../components/Navber";
import { SubscriptionContext } from "../context/SubscriptionContext";
import "./Subscription.css";

const formatDate = (date) => new Date(date).toLocaleDateString(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function DemoCheckout() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const transactionId = searchParams.get("transaction");
  const { transactions, busy, completeDemoCheckout } = useContext(SubscriptionContext);
  const [result, setResult] = useState(null);
  const transaction = location.state?.transaction?.transactionId === transactionId
    ? location.state.transaction
    : transactions.find((item) => item.transactionId === transactionId);
  const completed = result?.transaction || transaction;
  const status = completed?.status || "missing";

  const finish = async (outcome) => {
    if (!transactionId || status !== "pending") return;
    const response = await completeDemoCheckout(transactionId, outcome);
    if (response) setResult(response);
  };

  return (
    <main className="home subscription-page">
      <Navber />
      <section className="checkout-shell">
        <Link className="checkout-back-link" to="/pricing">← Back to plans</Link>
        <div className="checkout-card">
          <span className="subscription-eyebrow"><CreditCard size={15} /> DEMO CHECKOUT</span>
          <h1>Complete your <span>Premium demo.</span></h1>
          <div className="subscription-demo-banner" role="note">
            <ShieldCheck size={19} />
            <span><strong>Simulation only.</strong> This page does not collect card details or charge money.</span>
          </div>

          {!transaction ? (
            <div className="checkout-result checkout-result-failed">
              <AlertCircle size={24} />
              <div><strong>Demo transaction not found</strong><p>Start a new checkout from the pricing page.</p></div>
            </div>
          ) : (
            <>
              <div className="checkout-order">
                <div><span>Plan</span><strong>Premium · {transaction.billingCycle}</strong></div>
                <div><span>Amount (demo only)</span><strong>₹{transaction.amount} INR</strong></div>
                <div><span>Transaction ID</span><strong className="checkout-transaction-id">{transaction.transactionId}</strong></div>
                <div><span>Status</span><strong className={`transaction-status ${status}`}>{status}</strong></div>
              </div>

              {result?.isPremium && (
                <div className="checkout-result checkout-result-success">
                  <CheckCircle2 size={24} />
                  <div><strong>Premium activated</strong><p>The server verified your simulated transaction. {result.subscription?.expiresAt && `Your subscription expires ${formatDate(result.subscription.expiresAt)}.`}</p></div>
                </div>
              )}
              {status === "failed" && (
                <div className="checkout-result checkout-result-failed">
                  <XCircle size={24} />
                  <div><strong>Demo payment failed</strong><p>No subscription was activated. No money was collected.</p></div>
                </div>
              )}
              {status === "success" && !result?.isPremium && (
                <div className="checkout-result checkout-result-success">
                  <CheckCircle2 size={24} />
                  <div><strong>Transaction already verified</strong><p>Your Premium plan status has been refreshed.</p></div>
                </div>
              )}

              {status === "pending" && (
                <div className="checkout-actions">
                  <p>Choose an outcome to simulate the demo payment. Both actions are recorded as DEMO transactions.</p>
                  <button type="button" className="subscription-cta" disabled={busy} onClick={() => finish("success")}>
                    {busy ? <LoaderCircle className="subscription-spin" size={17} /> : <CheckCircle2 size={17} />}
                    Simulate successful payment
                  </button>
                  <button type="button" className="checkout-fail-button" disabled={busy} onClick={() => finish("failed")}>
                    {busy ? <LoaderCircle className="subscription-spin" size={17} /> : <XCircle size={17} />}
                    Simulate failed payment
                  </button>
                </div>
              )}
            </>
          )}

          {status !== "pending" && (
            <div className="checkout-footer-links">
              <Link to="/pricing">View plan and transactions</Link>
              {status === "success" && <Link to="/resume-builder">Go to resume builder</Link>}
            </div>
          )}
        </div>
      </section>
      <footer className="home-footer"><Brand /><p>No external payment gateways or credentials are used.</p></footer>
    </main>
  );
}

export default DemoCheckout;
