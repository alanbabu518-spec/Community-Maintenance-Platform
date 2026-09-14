import type { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

function PageTransition({ children }: PageTransitionProps) {
  return <div className="auth-page-transition">{children}</div>;
}

export default PageTransition;