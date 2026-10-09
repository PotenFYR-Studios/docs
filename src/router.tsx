/*
 * router.tsx-tiny history-API router for the SPA (GitHub Pages friendly).
 * Deep links hit 404.html which redirects to /#/path; on boot the pending
 * hash is promoted to a real route.
 */
import * as React from "react";

export const RouterCtx = React.createContext<{
  path: string;
  navigate: (to: string, replace?: boolean) => void;
}>({ path: "/", navigate: () => {} });

function normalize(h: string): string {
  let p = h.trim();
  if (p.startsWith("#")) p = p.slice(1);
  if (!p.startsWith("/")) p = "/" + p;
  // queries never belong to the route path; they stay in location.search
  const q = p.indexOf("?");
  if (q !== -1) p = p.slice(0, q);
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p || "/";
}

export function useRouter(): { path: string; navigate: (to: string, replace?: boolean) => void } {
  const [path, setPath] = React.useState(() => {
    const hash = normalize(window.location.hash);
    if (hash !== "/") {
      history.replaceState(null, "", hash);
      return hash;
    }
    return normalize(window.location.pathname.replace(/\/docs(?=\/)/, "")) || "/";
  });

  React.useEffect(() => {
    const onPop = () => {
      const pn = window.location.pathname.replace(/\/docs(?=\/)/, "");
      setPath(normalize((pn || "") + window.location.search + window.location.hash));
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("hashchange", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("hashchange", onPop);
    };
  }, []);

  const navigate = React.useCallback((to: string, replace = false) => {
    if (replace) history.replaceState(null, "", to);
    else history.pushState(null, "", to);
    setPath(normalize(to));
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  React.useEffect(() => {
    /* promote a 404-redirect hash path once on boot */
    const h = window.location.hash;
    if (h.length > 2 && h.startsWith("#/")) {
      const target = normalize(h);
      history.replaceState(null, "", target);
      setPath(target);
    }
  }, []);

  return { path, navigate };
}

export function Link({
  to,
  children,
  className,
  onClick,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  const { navigate } = React.useContext(RouterCtx);
  const href = to.startsWith("#") ? to : to;
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (to.startsWith("#") && !to.startsWith("#/")) return; // plain anchor
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

/** 8-char pieces like "/repo/fyrwall/configuration" */
export function useRouteParts(): string[] {
  const { path } = React.useContext(RouterCtx);
  return path.split("/").filter(Boolean);
}
