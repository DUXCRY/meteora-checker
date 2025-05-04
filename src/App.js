import "./App.css";
import "./styles.scss";
import React, { useState } from "react";
import meteora from "./assets/meteora.jpg";

function App() {
  const [walletsInput, setWalletsInput] = useState("");
  const [results, setResults] = useState({});
  const [loadingWallets, setLoadingWallets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const wallets = walletsInput
      .split(/[\s,]+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    setResults({});
    setLoadingWallets(wallets);

    let successfulFetch = false;

    for (const wallet of wallets) {
      try {
        const res = await fetch(
          `https://point-api.meteora.ag/points/${wallet}`
        );
        if (!res.ok) throw new Error(`Failed for ${wallet}`);
        const data = await res.json();
        setResults((prev) => ({ ...prev, [wallet]: data }));
        successfulFetch = true;
      } catch (err) {
        setResults((prev) => ({ ...prev, [wallet]: { error: err.message } }));
      }
    }

    setLoadingWallets([]);

    if (successfulFetch && !hasFetchedOnce) {
      setShowModal(true);
      setHasFetchedOnce(true);
    }
  };

  return (
    <div id="App-header" style={{ textAlign: "center", paddingTop: "2em" }}>
      <img src={meteora} height={200} width={200} alt="Meteora" />
      <h1>Meteora Points Checker</h1>
      <p>
        You can check as may wallet as you want using this form, make sure to
        use commas (",") between the address or just enter in the newline.
      </p>
      <div className="App-body">
        {/* Modal */}
        {showModal && (
          <div className="modal">
            <div style={styles.modalOverlay}>
              <div style={styles.modalContent}>
                <h2>☕ Buy me a coffee!</h2>
                <br />
                <br />
                <h3>Solana</h3>
                <p style={{ fontFamily: "monospace" }}>
                  EnnsuLo6dbzTvCt83Kw8SJqVucCwm4PgB3krRncZz4a6
                </p>
                {/* Disclaimer */}

                <br />
                <div class="buttons">
                  <button class="blob-btn" onClick={() => setShowModal(false)}>
                    Close
                    <span class="blob-btn__inner">
                      <span class="blob-btn__blobs">
                        <span class="blob-btn__blob"></span>
                        <span class="blob-btn__blob"></span>
                        <span class="blob-btn__blob"></span>
                        <span class="blob-btn__blob"></span>
                      </span>
                    </span>
                  </button>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#ccc",
                      marginTop: "1.5em",
                    }}
                  >
                    ⚠️ This is <strong>not</strong> the official checker of
                    Meteora! We are just using their official API to fetch the
                    points. ⚠️
                  </p>
                  <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                    <defs>
                      <filter id="goo">
                        <feGaussianBlur
                          in="SourceGraphic"
                          result="blur"
                          stdDeviation="10"
                        ></feGaussianBlur>
                        <feColorMatrix
                          in="blur"
                          mode="matrix"
                          values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7"
                          result="goo"
                        ></feColorMatrix>
                        <feBlend
                          in2="goo"
                          in="SourceGraphic"
                          result="mix"
                        ></feBlend>
                      </filter>
                    </defs>
                  </svg>{" "}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Form */}
      <form id="myform" onSubmit={handleSubmit}>
        <br />
        <label htmlFor="wallets">Enter Wallet Address(es):</label>
        <br />
        <textarea
          className="txtArea"
          id="wallets"
          name="wallets"
          rows="7"
          cols="40"
          placeholder="One or more addresses, separated by comma or newline"
          value={walletsInput}
          onChange={(e) => setWalletsInput(e.target.value)}
        />
        <br />

        <button class="btn glitch" type="submit" value="Submit">
          <span>Check Now</span>
        </button>
      </form>

      {loadingWallets.length > 0 && (
        <p>Checking: {loadingWallets.join(", ")}</p>
      )}

      {Object.keys(results).length > 0 && (
        <div className="tableWrapper" style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Wallet</th>
                <th>Total Points</th>
                <th>Last 24H Points</th>
                <th>Fetch Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(results).map(([wallet, data]) => (
                <tr key={wallet}>
                  <td style={{ fontFamily: "monospace" }}>{wallet}</td>
                  <td>
                    {data.total_points !== undefined ? data.total_points : "-"}
                  </td>
                  <td>
                    {data.last_24h_points !== undefined
                      ? data.last_24h_points
                      : "-"}
                  </td>
                  <td style={{ color: data.error ? "red" : "green" }}>
                    {data.error ? `❌ ${data.error}` : "✅ Success"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#141b37",
    padding: "1em",
    borderRadius: "12px",
    textAlign: "center",
    width: "90vw",
    maxwidth: "700px",
    boxShadow: "0 0 20px rgba(0,0,0,0.3)",
    boxSizing: "border-box",
  },
};

export default App;
