import React, { useState } from "react";

const Counter: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  return (
    <div style={styles.wrapper}>
      <p style={styles.count}>{count}</p>
      <div style={styles.buttons}>
        <button style={styles.btn} onClick={() => setCount((c) => c - 1)}>
          −
        </button>
        <button style={styles.btn} onClick={() => setCount((c) => c + 1)}>
          +
        </button>
        <button
          style={{ ...styles.btn, opacity: 0.5 }}
          onClick={() => setCount(0)}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  count: {
    fontSize: "3rem",
    fontWeight: 700,
    minWidth: "80px",
    textAlign: "center",
  },
  buttons: {
    display: "flex",
    gap: "0.75rem",
  },
  btn: {
    padding: "0.5rem 1.5rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#cdd6f4",
    cursor: "pointer",
  },
};

export default Counter;
