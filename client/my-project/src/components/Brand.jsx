import { FileCheck2 } from "lucide-react";
import { Link } from "react-router-dom";

function Brand() {
  return (
    <Link to="/" className="brand">
      <span className="brand-icon">
        <FileCheck2 size={21} strokeWidth={2.2} />
      </span>

      <span>
        T-Resume<span className="purple">IQ</span>
      </span>
    </Link>
  );
}

export default Brand;