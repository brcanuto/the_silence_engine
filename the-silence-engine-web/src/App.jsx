import { useEffect, useState } from "react"

const API_BASE = import.meta.env.VITE_API_BASE
const TOTAL_INCIDENTS = 3 

function App() {
  const [hasStarted, setHasStarted] = useState(false)
  const [hasFinished, setHasFinished] = useState(false)
  const [incidentIndex, setIncidentIndex] = useState(1)
  const [incident, setIncident] = useState(null)
  const [loading, setLoading] = useState(false)
  const [answerResult, setAnswerResult] = useState(null)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (!hasStarted || hasFinished) return

    let cancelled = false

    const fetchIncident = async () => {
      try {
        setLoading(true)
        setAnswerResult(null)

        const res = await fetch(`${API_BASE}/incidents/${incidentIndex}`)
        if (!res.ok) throw new Error("Failed to load incident")
        const data = await res.json()

        if (!cancelled) {
          setIncident(data)
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) {
          setIncident(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchIncident()

    return () => {
      cancelled = true
    }
  }, [incidentIndex, hasStarted, hasFinished])

  const startGame = () => {
    setHasStarted(true)
    setHasFinished(false)
    setIncidentIndex(1)
    setScore(0)
    setAnswerResult(null)
  }

  const restartGame = () => {
    setHasStarted(false)
    setHasFinished(false)
    setIncidentIndex(1)
    setIncident(null)
    setScore(0)
    setAnswerResult(null)
  }

  const submitAnswer = async (choiceKey) => {
    if (answerResult) return

    try {
      const res = await fetch(
        `${API_BASE}/incidents/${incidentIndex}/answer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ choice: choiceKey }),
        }
      )

      const data = await res.json()
      setAnswerResult(data)

      if (data.correct) {
        setScore((prev) => prev + 1)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const showNextIncident = () => {
    if (incidentIndex < TOTAL_INCIDENTS) {
      setIncidentIndex((prev) => prev + 1)
      setAnswerResult(null)
    }
  }

  const finishRun = () => {
    setHasFinished(true)
    setIncident(null)
  }

  if (hasFinished) {
    return (
      <div className="app-root">
        <div className="card">
          <h1 className="title">The Silence Engine</h1>
          <h2 className="incident-title">Run summary</h2>
          <p className="body-text">
            You stabilized <strong>{score}</strong> out of{" "}
            <strong>{TOTAL_INCIDENTS}</strong> incidents this run.
          </p>
          <p className="body-text">
            Each incident represents a small debugging decision: reading
            signals, choosing a remediation strategy, and validating the result.
          </p>
          <button className="primary-btn" onClick={restartGame}>
            Back to start
          </button>
        </div>
      </div>
    )
  }

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
            Begin incidents
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app-root">
      <div className="card">
        <header className="header">
          <div>
            <h1 className="title">The Silence Engine</h1>
            <p className="subtitle">
              Incident {incidentIndex} of {TOTAL_INCIDENTS} · Score: {score}
            </p>
          </div>
        </header>

        {loading && <p className="body-text">Loading incident… this web app uses render.com's free version to host the backend, the first request may take up to 50 seconds.</p>}

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

            {answerResult.correct && incidentIndex === TOTAL_INCIDENTS && (
              <button
                className="secondary-btn"
                onClick={finishRun}
              >
                Finish run
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
