import re


class TextPreprocessor:
    """
    Cleans OCR text before NLP extraction.
    """

    def clean(self, text: str) -> str:
        if not text:
            return ""

        # Convert different types of spaces into normal spaces
        text = text.replace("\u00a0", " ")

        # Convert common OCR symbols
        text = text.replace("₹", "Rs")
        text = text.replace("—", "-")
        text = text.replace("–", "-")

        # Remove repeated spaces
        text = re.sub(r"[ \t]+", " ", text)

        # Remove excessive blank lines
        text = re.sub(r"\n{2,}", "\n", text)

        return text.strip()

    def lines(self, text: str) -> list:
        cleaned_text = self.clean(text)

        result = []

        for line in cleaned_text.splitlines():
            line = line.strip()

            if line:
                result.append(line)

        return result