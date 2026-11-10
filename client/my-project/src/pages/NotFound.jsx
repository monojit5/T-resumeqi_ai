import { ArrowLeft, ArrowRight, Compass } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Brand from "../components/Brand";
import "./NotFound.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="not-found-page">
      <header className="not-found-nav">
        <Brand />
        <Link className="not-found-home-link" to="/">Back to home</Link>
      </header>

      <section className="not-found-content" aria-labelledby="not-found-title">
        <div className="not-found-copy">
          <span className="not-found-eyebrow"><Compass size={15} /> WRONG TURN?</span>
          <h1 id="not-found-title">This page took<br /><span>a little detour.</span></h1>
          <p>
            The page you’re looking for may have moved, or the link might be
            outdated. Let’s get you back on track.
          </p>
          <div className="not-found-actions">
            <Link className="not-found-primary" to="/">
              <ArrowLeft size={17} /> Back to home
            </Link>
            <Link className="not-found-secondary" to="/resume-builder">
              Resume builder <ArrowRight size={16} />
            </Link>
          </div>
          <button className="not-found-back-button" type="button" onClick={() => navigate(-1)}>
            Or return to the previous page
          </button>
        </div>

        <div className="not-found-art">
          <span className="not-found-orbit not-found-orbit-one" />
          <span className="not-found-orbit not-found-orbit-two" />
          <img
            className="not-found-illustration"
            src="/404-illustration.svg"
            alt="A floating resume page marked 404 with a puzzled face"
          />
          <span className="not-found-art-caption">LOST IN THE RIGHT DIRECTION</span>
        </div>
      </section>

      <footer className="not-found-footer">
        <Brand />
        <span>Let’s find your next step.</span>
      </footer>
    </main>
  );
}

export default NotFound;
