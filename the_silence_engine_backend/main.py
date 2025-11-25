from the_silence_engine_backend.puzzles.resonance_trace import ResonanceTrace
from the_silence_engine_backend.puzzles.shard_corruption import ShardCorruption


def run_incident(puzzle):
    print("\n" + "=" * 60)
    print(f"Incident: {puzzle.title}")
    print("=" * 60)
    puzzle.intro()
    solved = puzzle.play()
    if solved:
        print("\n✓ Resonance stabilized.\n")
    else:
        print("\n✗ The lattice trembles. Stability uncertain.\n")
    return solved


def main():
    print("\n")
    print("█████████████████████████████████████████████████████")
    print("     THE  SILENCE  ENGINE")
    print("█████████████████████████████████████████████████████")
    print("\n")
    print("In the last days of Resonance, the world hums on the edge of collapse.")
    print("You are a Soundwright — keeper of the old mechanisms.")
    print("Stabilize what remains.\n")

    incidents = [
        ResonanceTrace(),
        ShardCorruption(),
    ]

    score = 0
    for puzzle in incidents:
        if run_incident(puzzle):
            score += 1

    print("=" * 60)
    print(f"You resolved {score}/{len(incidents)} resonance failures.")
    print("The Silence recedes… for now.")
    print("=" * 60)


if __name__ == "__main__":
    main()
