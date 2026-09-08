import re

from nlp.field_normalizer import FieldNormalizer


class DeclarationExtractor:
    """
    Extracts the seven selected declarations from OCR text.
    """

    def __init__(self):
        self.normalizer = FieldNormalizer()

    def extract_mrp(self, text: str):
        patterns = [
            r"(?:mrp|maximum\s+retail\s+price|retail\s+sale\s+price)"
            r"\s*[:\-]?\s*(?:rs\.?|₹)?\s*([0-9]+(?:\.[0-9]{1,2})?)",
            r"(?:rs\.?|₹)\s*([0-9]+(?:\.[0-9]{1,2})?)"
        ]

        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return self.normalizer.normalize_mrp(match.group(0))

        return None

    def extract_net_quantity(self, text: str):
        patterns = [
            r"(?:net\s*(?:quantity|wt|weight|volume))"
            r"\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)\s*"
            r"(kg|kgs|g|gm|gms|mg|l|ltr|litre|ml|pcs|pieces|piece)",
            r"\b([0-9]+(?:\.[0-9]+)?)\s*"
            r"(kg|kgs|g|gm|gms|mg|l|ltr|litre|ml|pcs|pieces|piece)\b"
        ]

        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return self.normalizer.normalize_quantity(match.group(0))

        return None

    def extract_manufacturing_date(self, text: str):
        patterns = [
            r"(?:mfg\s+date|mfd\s+date|mfg|mfd|manufactured|manufacturing\s+date|"
            r"date\s+of\s+manufacture|packed|packing\s+date)"
            r"\s*[:\-]?\s*"
            r"([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})",
            r"(?:mfg\s+date|mfd\s+date|mfg|mfd|manufactured|manufacturing\s+date|"
            r"date\s+of\s+manufacture|packed|packing\s+date)"
            r"\s*[:\-]?\s*"
            r"([0-9]{1,2}[\/\-][0-9]{2,4})",
            r"(?:mfg\s+date|mfd\s+date|mfg|mfd|manufactured|manufacturing\s+date|"
            r"date\s+of\s+manufacture|packed|packing\s+date)"
            r"\s*[:\-]?\s*"
            r"([A-Za-z]+\s+[0-9]{4})"
        ]

        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return self.normalizer.normalize_date(match.group(1))

        return None

    def extract_manufacturer_details(self, text: str):
        patterns = [
            r"(?:manufactured\s+by|manufactured\s+for|"
            r"packed\s+by|imported\s+by|manufacturer|importer|packer)"
            r"\s*[:\-]?\s*(.+)"
        ]

        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                value = match.group(1).strip()
                if len(value) >= 3:
                    return self.normalizer.normalize_text(value)

        return None

    def extract_consumer_care(self, text: str):
        patterns = [
            r"(?:consumer\s+care|customer\s+care|customer\s+service|"
            r"helpline|toll\s*free|contact\s+us)"
            r"\s*[:\-]?\s*(.+)",
            r"\b[6-9][0-9]{9}\b",
            r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
        ]

        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return self.normalizer.normalize_text(match.group(0))

        return None

    def extract_vegetarian_symbol(self, text: str):
        patterns = [
            r"\bvegetarian\b",
            r"\bveg\b",
            r"green\s+dot",
            r"green\s+symbol"
        ]

        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(0)

        return None

    def extract_non_vegetarian_symbol(self, text: str):
        patterns = [
            r"\bnon[\s\-]?vegetarian\b",
            r"\bnon[\s\-]?veg\b",
            r"brown\s+dot",
            r"red\s+dot",
            r"brown\s+symbol",
            r"red\s+symbol"
        ]

        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(0)

        return None

    def extract(self, text: str) -> dict:
        return {
            "mrp": self.extract_mrp(text),
            "net_quantity": self.extract_net_quantity(text),
            "manufacturing_date": self.extract_manufacturing_date(text),
            "manufacturer_details": self.extract_manufacturer_details(text),
            "consumer_care": self.extract_consumer_care(text),
            "vegetarian_symbol": self.extract_vegetarian_symbol(text),
            "non_vegetarian_symbol": self.extract_non_vegetarian_symbol(text)
        }
