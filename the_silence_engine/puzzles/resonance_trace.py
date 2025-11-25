from .base import BasePuzzle

class ResonanceTrace(BasePuzzle):
    title = "Resonance Trace - The Tower's Howl"

    def intro(self):
        print(
            "A Northern Resonance Tower emits a faunting distortion. \n"
            "You tap into its trace feed - a stream of fragmented echos: \n"
        )

        trace = [
            "[soft] golem-chorus-t: stabilizing memory loop",
            "[shard] golem-chorus-5: missing harmony shard",
            "[burst] exchange-node: failed resonance transfer",
            "[sharp] golem-chorus-5: missing harmony shard",
            "[dim] stream-spire: user-link failed; billing mismatch",
        ]

        for line in trace:
            print(line)

            print(
                "\nWhich construct is the most likely source of the dissonance?\n"
                "A) golem-chorus-2 \n"
                "B) exchange-node\n"
                "C) golem-chorus-5\n"
                "D) stream-spire\n"
            )

        def play(self):
            answer = inpute("Your answer (A/B/C/D): ").strip().upper()
            if answer =="C":
                print(
                    "\nCorrect. golem-chorus-5 lacks a harmony shard,"
                    "causing cascading interference."
                )
                return True
            else:
                print(
                    "\nIncorrect. The repeated missing-shard warning point to golem-chorus-5."
                )
                return False