import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;
const TOTAL_INCIDENTS = 2; 

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [incidentIndex, setIncidentIndex] = useState(1);
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answerResult, setAnswerResult] = useState(null);

  useEffect(() => {
    if (!hasStarted) return;

    let cancelled = false;

    const fetchIncident = async () => {
      try {
        setLoading(true);
        setAnswerResult(null);

        const res = await fetch(`${API_BASE}/incidents/${incidentIndex}`);
        if (!res.ok) throw new Error("Failed to load incident");
        const data = await res.json();

        if (!cancelled) {
          setIncident(data);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setIncident(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchIncident();

    return () => {
      cancelled = true;
    };
  }, [incidentIndex, hasStarted]);

  const startGame = () => {
    setHasStarted(true);
    setIncidentIndex(1);
  };

  const submitAnswer = async (choiceKey) => {
    try {
      const res = await fetch(
        `${API_BASE}/incidents/${incidentIndex}/answer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ choice: choiceKey }),
        }
      );

      const data = await res.json();
      setAnswerResult(data);
    } catch (err) {
      console.error(err);
    }
  };

  const showNextIncident = () => {
    if (incidentIndex < TOTAL_INCIDENTS) {
      setIncidentIndex((prev) => prev + 1);
    }
  };

  if (!hasStarted) {
    return (
      <div className="app-root">
        <div className="card">
          <h1 className="title">The Silence Engine</h1>
          <p className="subtitle">
            A small full-stack puzzle app built with Python (FastAPI) and React.
          </p>
          <p className="body-text">
            Each incident presents a short scenario with structured data and a
            set of possible actions. Your job is to pick the option that best
            stabilizes the system.
          </p>
          <button className="primary-btn" onClick={startGame}>
            Begin Incidents
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-root">
      <div className="card">
        <header className="header">
          <div>
            <h1 className="title">The Silence Engine</h1>
            <p className="subtitle">
              Incident {incidentIndex} of {TOTAL_INCIDENTS}
            </p>
          </div>
        </header>

        {loading && <p className="body-text">Loading incident… this site uses render.com free plan which can take up to 50 seconds for the first request.</p>}

        {!loading && incident && (
          <>
            <h2 className="incident-title">{incident.title}</h2>
            <p className="body-text">{incident.description}</p>

            {incident.lines && incident.lines.length > 0 && (
              <pre className="trace-block">
                {incident.lines.join("\n")}
              </pre>
            )}

            <section className="choices-section">
              <p className="body-text">Choose your action:</p>
              <div className="choices-list">
                {incident.choices.map((choice) => (
                  <button
                    key={choice.key}
                    onClick={() => submitAnswer(choice.key)}
                    className="choice-btn"
                  >
                    <span className="choice-key">{choice.key})</span>
                    <span className="choice-label">{choice.label}</span>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {answerResult && (
          <div
            className={`result-banner ${
              answerResult.correct ? "result-correct" : "result-incorrect"
            }`}
          >
            <p className="result-text">{answerResult.message}</p>

            {answerResult.correct && incidentIndex < TOTAL_INCIDENTS && (
              <button
                className="secondary-btn"
                onClick={showNextIncident}
              >
                Continue
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
