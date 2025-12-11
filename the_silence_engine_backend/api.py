from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

from puzzles.resonance_trace import ResonanceTrace
from puzzles.shard_corruption import ShardCorruption


app = FastAPI(title="The Silence Engine API")

# Allow React dev server to call this API
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://the-silence-engine.netlify.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Choice(BaseModel):
    key: str
    label: str


class IncidentResponse(BaseModel):
    id: str
    index: int
    title: str
    description: str
    lines: List[str]
    choices: List[Choice]


class AnswerRequest(BaseModel):
    choice: str


class AnswerResponse(BaseModel):
    correct: bool
    message: str


INCIDENTS: Dict[int, Dict[str, Any]] = {
    1: {
        "id": "resonance_trace",
        "title": "Resonance Trace — The Tower's Howl",
        "description": (
            "A Northern Resonance Tower emits a haunting distortion. "
            "You tap into its trace feed — a stream of fragmented echoes."
        ),
        "lines": [
            "[soft] golem-chorus-2: stabilizing memory loop",
            "[sharp] golem-chorus-5: missing harmony shard",
            "[burst] exchange-node: failed resonance transfer",
            "[sharp] golem-chorus-5: missing harmony shard",
            "[dim] stream-spire: user-link failed; billing mismatch",
        ],
        "choices": [
            {"key": "A", "label": "golem-chorus-2"},
            {"key": "B", "label": "exchange-node"},
            {"key": "C", "label": "golem-chorus-5"},
            {"key": "D", "label": "stream-spire"},
        ],
        "correct_choice": "C",
    },
    2: {
        "id": "shard_corruption",
        "title": "Memory-Shard Audit — The Shard of Broken Time",
        "description": (
            "Fragments of the Memory Archive report impossible resonance durations. "
            "You suspect a corrupted shard in the echo logs."
        ),
        "lines": [],
        "choices": [
            {"key": "A", "label": "SELECT * FROM shards WHERE resonance_duration > 0;"},
            {"key": "B", "label": "SELECT * FROM shards WHERE resonance_duration < 0;"},
            {"key": "C", "label": "SELECT * FROM shards WHERE resonance_duration = 0;"},
            {
                "key": "D",
                "label": "SELECT * FROM shards ORDER BY created_at DESC LIMIT 10;",
            },
        ],
        "correct_choice": "B",
    },
    3: {
    "id": "echo_scaling",
    "title": "Echo-Chamber Load — Strain on the Amplifiers",
    "description": (
        "Resonance traffic spikes as a new broadcast sweeps the outer districts. "
        "Echo-chamber amplifiers are nearing their limits, and failures begin "
        "to ripple through the lattice."
    ),
    "lines": [
        "metric: echo_chamber.cpu = 91%",
        "metric: echo_chamber.latency_ms = 780",
        "metric: core_tower.cpu = 54%",
        "metric: archive_node.io_wait = 12%",
        "log: echo-chamber-2: dropped resonance packets; queue overflow",
    ],
    "choices": [
        {
            "key": "A",
            "label": "Increase core tower depth; redirect more load to the central pillar.",
        },
        {
            "key": "B",
            "label": "Add two more echo-chambers to the outer ring and rebalance traffic.",
        },
        {
            "key": "C",
            "label": "Expand archive node capacity to cache more dormant shards.",
        },
        {
            "key": "D",
            "label": "Purge low-priority shards from the archive.",
        },
    ],
    "correct_choice": "B",
},
}


@app.get("/incidents", response_model=List[IncidentResponse])
def list_incidents():
    results: List[IncidentResponse] = []
    for index, data in INCIDENTS.items():
        results.append(
            IncidentResponse(
                id=data["id"],
                index=index,
                title=data["title"],
                description=data["description"],
                lines=data["lines"],
                choices=[Choice(**c) for c in data["choices"]],
            )
        )
    return results


@app.get("/incidents/{index}", response_model=IncidentResponse)
def get_incident(index: int):
    data = INCIDENTS.get(index)
    if not data:
        raise HTTPException(status_code=404, detail="Incident not found")

    return IncidentResponse(
        id=data["id"],
        index=index,
        title=data["title"],
        description=data["description"],
        lines=data["lines"],
        choices=[Choice(**c) for c in data["choices"]],
    )


@app.post("/incidents/{index}/answer", response_model=AnswerResponse)
def answer_incident(index: int, body: AnswerRequest):
    data = INCIDENTS.get(index)
    if not data:
        raise HTTPException(status_code=404, detail="Incident not found")

    submitted = body.choice.strip().upper()
    correct_key = data["correct_choice"].upper()

    correct = submitted == correct_key
    if correct:
        if index == 1:
            message = (
                "Correct. golem-chorus-5 lacks a harmony shard, "
                "causing cascading interference."
            )
        elif index == 2:
            message = (
                "Correct. Negative durations signify temporal fractures "
                "and must be isolated."
            )
        elif index == 3:
            message = (
                "Correct. Scaling out the outer echo-chambers relieves load "
                "where the failures are actually happening."
            )
        else:
            message = "Correct."
    else:
        if index == 1:
            message = (
                "Incorrect. The repeated missing-shard warnings "
                "point to golem-chorus-5."
            )
        elif index == 2:
            message = (
                "Incorrect. The corrupted shards are those with negative durations."
            )
        elif index == 3:
            message = (
                "Incorrect. The metrics point to overload in the echo-chambers, "
                "not the core tower or archive nodes."
            )
        else:
            message = "Incorrect."

    return AnswerResponse(correct=correct, message=message)
