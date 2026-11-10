import { useContext, useState } from "react";
import { Check, Crown, LoaderCircle, ShieldCheck, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Brand from "../components/Brand";
import Navber from "../components/Navber";
import { UserContext } from "../context/UserContext";
import { SubscriptionContext } from "../context/SubscriptionContext";
import "./Subscription.css";

const formatDate = (date) => new Date(date).toLocaleDateString(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function Pricing() {
  const { auth } = useContext(UserContext);
  const {
    isPremium,
    subscription,
    transactions,
    createDemoCheckout,
    busy,
  } = useContext(SubscriptionContext);
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState("monthly");

  const startCheckout = async () => {
    if (!auth?.token) {
      navigate("/login", { state: { from: { pathname: "/pricing" } } });
      return;
    }
    const transaction = await createDemoCheckout(billingCycle);
    if (transaction) {
      navigate(`/demo-checkout?transaction=${encodeURIComponent(transaction.transactionId)}`, {
        state: { transaction },
      });
    }
  };

  const plans = [
    {
      id: "free",
      title: "Free",
      price: "₹0",
      cadence: "forever",
      description: "Start building and get the essentials.",
      features: [
        "Create up to 2 resumes",
        "3 AI resume analyses each month",
        "Classic ATS-friendly template",
        "Save and download resumes",
      ],
    },
    {
      id: "premium",
      title: "Premium",
      price: billingCycle === "yearly" ? "₹499" : "₹99",
      cadence: billingCycle === "yearly" ? "per year" : "per month",
      description: "More room to grow and tailor every application.",
      features: [
        "Unlimited resume creation",
        "Unlimited AI resume analysis",
        "Full AI resume rewrite drafts",
        "All ATS-friendly templates",
      ],
    },
  ];

  return (
    <main className="home subscription-page">
      <Navber />
      <section className="subscription-shell">
        <header className="subscription-heading">
          <span className="subscription-eyebrow"><Sparkles size={15} /> SIMPLE, CLEAR PLANS</span>
          <h1>Build with confidence.<br /><span>Choose your plan.</span></h1>
          <p>Start free and upgrade when you need more space, AI support, or templates.</p>
        </header>

        <div className="subscription-demo-banner" role="note">
          <ShieldCheck size={19} />
          <span><strong>Portfolio demo only.</strong> Checkout is simulated. No real money is collected and no payment provider is used.</span>
        </div>

        {isPremium && subscription?.expiresAt && (
          <div className="subscription-active-banner">
            <Crown size={19} />
            <span>Your Premium plan is active until <strong>{formatDate(subscription.expiresAt)}</strong>.</span>
          </div>
        )}

        <div className="subscription-cycle-picker" aria-label="Premium billing period">
          <button type="button" className={billingCycle === "monthly" ? "active" : ""} onClick={() => setBillingCycle("monthly")}>Monthly</button>
          <button type="button" className={billingCycle === "yearly" ? "active" : ""} onClick={() => setBillingCycle("yearly")}>Yearly <span>Save more</span></button>
        </div>

        <div className="subscription-plans">
          {plans.map((plan) => (
            <article className={`subscription-card${plan.id === "premium" ? " featured" : ""}`} key={plan.id}>
              {plan.id === "premium" && <span className="subscription-popular"><Crown size={13} /> PREMIUM</span>}
              <h2>{plan.title}</h2>
              <p className="subscription-description">{plan.description}</p>
              <div className="subscription-price">{plan.price}<span>{plan.cadence}</span></div>
              <ul>
                {plan.features.map((feature) => <li key={feature}><Check size={17} /> {feature}</li>)}
              </ul>
              {plan.id === "premium" ? (
                <button type="button" className="subscription-cta" disabled={busy} onClick={startCheckout}>
                  {busy ? <LoaderCircle className="subscription-spin" size={17} /> : <Crown size={17} />}
                  {busy ? "Preparing demo…" : isPremium ? "Try another demo renewal" : "Buy Premium"}
                </button>
              ) : (
                <div className="subscription-current-plan">{isPremium ? "Included with Premium" : "Your current plan"}</div>
              )}
              {plan.id === "premium" && (
                <small className="subscription-no-charge">Demo checkout only · No charge</small>
              )}
            </article>
          ))}
        </div>

        {auth?.token && transactions.length > 0 && (
          <section className="subscription-history">
            <h2>Demo transaction history</h2>
            <p>All entries below are simulated portfolio transactions.</p>
            <div className="subscription-history-list">
              {transactions.map((transaction) => (
                <article key={transaction.transactionId}>
                  <div><strong>{transaction.billingCycle === "yearly" ? "Premium yearly" : "Premium monthly"}</strong><small>{formatDate(transaction.createdAt)} · DEMO · {transaction.transactionId}</small></div>
                  <span>₹{transaction.amount}</span>
                  <b className={`transaction-status ${transaction.status}`}>{transaction.status}</b>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>
      <footer className="home-footer"><Brand /><p>Plans are for demonstration only. No real payments are processed.</p></footer>
    </main>
  );
}

export default Pricing;
