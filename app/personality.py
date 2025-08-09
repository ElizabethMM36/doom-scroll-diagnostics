from dataclasses import dataclass
from typing import List


@dataclass
class PersonalityQuestion:
    prompt: str

    @staticmethod
    def default_questions() -> List["PersonalityQuestion"]:
        return [
            PersonalityQuestion("I always assume the worst about my health."),
            PersonalityQuestion("I tend to catastrophize small problems."),
            PersonalityQuestion("I ignore professional advice and google it instead."),
            PersonalityQuestion("I am stubborn even when proven wrong."),
            PersonalityQuestion("I am rude when stressed."),
            PersonalityQuestion("I lack empathy for others' struggles."),
            PersonalityQuestion("I rarely take responsibility for my mistakes."),
            PersonalityQuestion("I enjoy doomscrolling and imagining disaster scenarios."),
            PersonalityQuestion("I am overly dramatic about minor inconveniences."),
            PersonalityQuestion("I believe I deserve special treatment at all times."),
        ]


def score_personality(answers: List[int]) -> int:
    """Scores 10 Likert answers (1-5). Higher = worse.

    Clamps values to 1..5, then sums and rescales to 0..100.
    """
    clamped = [min(5, max(1, int(v))) for v in answers]
    total = sum(clamped)  # min 10, max 50
    # Map 10..50 -> 0..100
    score = int((total - 10) * (100 / 40))
    return max(0, min(100, score))