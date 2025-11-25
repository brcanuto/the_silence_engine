import { useEffect, useState } from "react"

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:8000"


function App() {
  const [incidentIndex, setIncidentIndex] = useState(1)
  const [incident, setIncident] = useState(null)
  const [loading, setLoading] = useState(false)
  const [answerResult, setAnswerResult] = useState(null)

  useEffect(() => {
    setLoading(true)
    setAnswerResult(null)

    fetch(`${API_BASE}/incidents/${incidentIndex}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load incident")
        return res.json()
      })
      .then((data) => {
        setIncident(data)
      })
      .catch((err) => {
        console.error(err)
        setIncident(null)
      })
      .finally(() => setLoading(false))
  }, [incidentIndex])

  const submitAnswer = async (choiceKey) => {
    try {
      const res = await fetch(`${API_BASE}/incidents/${incidentIndex}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice: choiceKey }),
      })

      const data = await res.json()
      setAnswerResult(data)
    } catch (err) {
      console.error(err)
    }
  }

  const showNextIncident = () => {
    setIncidentIndex((prev) => prev + 1)
  }

  if (loading && !incident) {
    return <div className="app">Loading resonance data…</div>
  }

  if (!incident) {
    return (
      <div className="app" style={{ maxWidth: 700, margin: "2rem auto" }}>
        <h1>The Silence Engine</h1>
        <p>No such incident.</p>
      </div>
    )
  }

  return (
    <div className="app" style={{ maxWidth: 700, margin: "2rem auto", fontFamily: "system-ui" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>The Silence Engine</h1>
      <h2 style={{ marginTop: 0 }}>{incident.title}</h2>

      <p style={{ marginTop: "1rem" }}>{incident.description}</p>

      {incident.lines && incident.lines.length > 0 && (
        <pre
          style={{
            background: "#111",
            color: "#0f0",
            padding: "1rem",
            borderRadius: "8px",
            marginTop: "1rem",
            fontSize: "0.9rem",
            whiteSpace: "pre-wrap",
          }}
        >
          {incident.lines.join("\n")}
        </pre>
      )}

      <div style={{ marginTop: "1.5rem" }}>
        <p>Choose your action:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {incident.choices.map((choice) => (
            <button
              key={choice.key}
              onClick={() => submitAnswer(choice.key)}
              style={{
                padding: "0.75rem 1.2rem",
                borderRadius: "6px",
                border: "1px solid #333",
                background: "#1C1C1C",
                color: "#f0f0f0",
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
                fontSize: "0.95rem",
              }}
            >
              <strong style={{ fontSize: "1rem" }}>{choice.key})</strong>
              <span style={{ fontFamily: "monospace", opacity: 0.9 }}>
                {choice.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {answerResult && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            borderRadius: "8px",
            background: answerResult.correct ? "#1d422a" : "#5a1f1f",
            color: "#f5f5f5", // <-- MAKES TEXT READABLE
            lineHeight: "1.4",
          }}
        >
          <p style={{ margin: 0 }}>{answerResult.message}</p>

          {answerResult.correct && (
            <button
              onClick={showNextIncident}
              style={{
                marginTop: "0.8rem",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                border: "none",
                background: "#4b8cf5",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Continue
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default App
