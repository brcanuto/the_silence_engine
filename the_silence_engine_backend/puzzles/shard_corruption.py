from .base import BasePuzzle
import textwrap

class ShardCorruption(BasePuzzle):
    title = "Memory-Shard Audit - The Shard of Broken Time"

    def intro(self):
        print(
            "Fragments of the Memory Archive report impossible resonance durations. \n"
            "You suspect a corrupted shard in the echologs.\n"
        )
        print("Which query best identifies the corrupted fragments?\n")

        print(
            textwrap.dedent(
                """
                A) SELECT * FROM shards WHERE resonance_duration > 0;
                B) SELECT * FROM shards WHERE resonance_duration < 0;
                C) SELECT * FROM shards WHERE resonance_duration = 0;
                D) SELECT * FROM shards ORDER BY created_at DESC LIMIT 10;
                """
            )
        )

    def play(self):
        answer = input("Your answer (A/B/C/D): ").strip().upper()
        if answer == "B":
            print(
                "\nCorrect. Negative durations signify temporal fractures "
                "and must be isolated."
            )
            return True
        else:
            print(
                "\nIncorrect. The corrupted shards are those with negative durations."
            )
            return False