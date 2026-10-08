/*
 * main.tsx-bootstrap: providers, router, route switch, overlays.
 */
import * as React from "react";
import { createRoot } from "react-dom/client";
import "./theme.css";
import "./fonts.css";

import { AppProvider } from "./app-store";
import { RouterCtx, useRouter, useRouteParts } from "./router";
import { setNavigator } from "./nav-bus";
import { Navbar, Footer } from "./chrome";
import { EggLayer } from "./eggs";
import { Deck, useDeckHotkey } from "./deck";
import { CheatSheet } from "./notfound";
import { Home } from "./home";
import { ReposIndex, RepoDoc } from "./repos";
import { NotFound } from "./notfound";
import { MobileDocBar } from "./repos";
import { repoBySlug } from "~/data/types";

function DeckHotkey(): React.ReactElement {
  useDeckHotkey();
  return <></>;
}

function App(): React.ReactElement {
  const router = useRouter();

  React.useEffect(() => {
    setNavigator(router.navigate);
  }, [router.navigate]);

  const parts = router.path.replace(/^\//, "").split("/").filter(Boolean);

  let page: React.ReactElement;
  if (parts.length === 0) page = <Home />;
  else if (parts[0] === "repos") page = <ReposIndex />;
  else if (parts[0] === "repo") page = <RepoDoc />;
  else page = <NotFound />;

  const isRepoDoc = parts[0] === "repo" && repoBySlug(parts[1] ?? "");

  return (
    <RouterCtx.Provider value={router}>
      <AppProvider>
        <DeckHotkey />
        <Navbar />
        {page}
        {isRepoDoc ? <MobileDocBar repo={repoBySlug(parts[1] ?? "")!} /> : null}
        <Footer />
        <Deck />
        <CheatSheet />
        <EggLayer />
      </AppProvider>
    </RouterCtx.Provider>
  );
}

/* re-export for the router file's useRouteParts typing consistency */
export { useRouteParts };

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
