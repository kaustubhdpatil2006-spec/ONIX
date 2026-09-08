import re


class FieldNormalizer:
    """
    Converts extracted values into a consistent format.
    """

    def normalize_mrp(self, value: str) -> str:
        value = value.strip()

        value = value.replace("₹", "Rs")
        value = value.replace("RS.", "Rs")
        value = value.replace("rs.", "Rs")

        return value

    def normalize_quantity(self, value: str) -> str:
        value = value.strip().lower()

        replacements = {
            "kgs": "kg",
            "k.g": "kg",
            "gms": "g",
            "gm": "g",
            "mls": "ml",
            "ltr": "l",
            "litre": "l",
            "litres": "l"
        }

        for old, new in replacements.items():
            value = value.replace(old, new)

        value = re.sub(r"\s+", " ", value)

        return value

    def normalize_date(self, value: str) -> str:
        value = value.strip()
        value = re.sub(r"\s+", " ", value)

        return value

    def normalize_text(self, value: str) -> str:
        value = value.strip()
        value = re.sub(r"\s+", " ", value)

        return value