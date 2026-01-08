from collections import deque

class ConversationMemory:
    def __init__(self, max_turns=4):
        self.history = deque(maxlen=max_turns)

    def add_user(self, text: str):
        self.history.append({"role": "user", "content": text})

    def add_assistant(self, text: str):
        self.history.append({"role": "assistant", "content": text})

    def get_context(self) -> str:
        """
        Returns formatted conversation context
        """
        return "\n".join(
            f"{h['role'].capitalize()}: {h['content']}"
            for h in self.history
        )

    def clear(self):
        self.history.clear()
