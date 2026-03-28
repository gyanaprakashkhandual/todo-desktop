import React, { useEffect, useState } from "react";
import Counter from "./components/Counter";

const App: React.FC = () => {
  const [version, setVersion] = useState<string>("");
  const [platform, setPlatform] = useState<string>("");

  useEffect(() => {
    window.electronAPI.getAppVersion().then(setVersion);
    window.electronAPI.getPlatform().then(setPlatform);
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Electron App</h1>
      <p style={styles.meta}>
        v{version} — {platform}
      </p>
      <Counter />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#1e1e2e",
    color: "#cdd6f4",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    gap: "1rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 600,
  },
  meta: {
    fontSize: "0.9rem",
    opacity: 0.5,
  },
};

export default App;
