import re
import json
from pathlib import Path
from .text_preprocessor import TextPreprocessor
from .field_normalizer import FieldNormalizer


class DeclarationExtractor:
    """
    Extracts declarations from OCR text.
    - Uses specific methods for legacy fields (MRP, net quantity, etc.)
    - Uses rules.json patterns for the additional Legal Metrology categories.
    - Vegetarian/Non‑Vegetarian symbols are also extracted (for Food Label module).
    """

    def __init__(self, rules_path=None):
        self.normalizer = FieldNormalizer()
        self.preprocessor = TextPreprocessor()

        # Load rules for new categories
        if rules_path is None:
            rules_path = Path(__file__).parent.parent / "rules" / "rules.json"
        with open(rules_path, 'r', encoding='utf-8') as f:
            self.rules = json.load(f)
            self.categories = self.rules.get("categories", {})

    # ---------- Existing Methods (unchanged) ----------
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
            r"(?:mfg|mfd|manufactured|manufacturing\s+date|"
            r"date\s+of\s+manufacture|packed|packing\s+date)"
            r"\s*[:\-]?\s*"
            r"([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})",
            r"(?:mfg|mfd|manufactured|manufacturing\s+date|"
            r"date\s+of\s+manufacture|packed|packing\s+date)"
            r"\s*[:\-]?\s*"
            r"([0-9]{1,2}[\/\-][0-9]{2,4})",
            r"(?:mfg|mfd|manufactured|manufacturing\s+date|"
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
            r"\s*[:\-]?\s*(.+)",
            r"(?:mfg\.?|mfd\.?)\s*[:\-]?\s*(.+)"
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

    # ---------- Generic extraction using rules.json ----------
    def _extract_by_patterns(self, text: str, patterns: list):
        """Try each pattern and return the captured value after the keyword."""
        for pattern in patterns:
            regex = re.compile(rf'{pattern}\s*[:：]?\s*(.+?)(?:\n|$)', re.IGNORECASE)
            match = regex.search(text)
            if match:
                return match.group(1).strip()
        return None

    def extract_new_category(self, text: str, category: str):
        """Extract a specific new category using its patterns from rules.json."""
        config = self.categories.get(category)
        if not config:
            return None
        patterns = config.get("patterns", [])
        return self._extract_by_patterns(text, patterns)

    # ---------- Main extraction method ----------
    def extract(self, text: str) -> dict:
        # Preprocess text
        cleaned = self.preprocessor.preprocess(text)

        # Use specific methods for existing fields
        result = {
            "mrp": self.extract_mrp(cleaned),
            "net_quantity": self.extract_net_quantity(cleaned),
            "manufacturing_date": self.extract_manufacturing_date(cleaned),
            "manufacturer_details": self.extract_manufacturer_details(cleaned),
            "consumer_care": self.extract_consumer_care(cleaned),
            "vegetarian_symbol": self.extract_vegetarian_symbol(cleaned),
            "non_vegetarian_symbol": self.extract_non_vegetarian_symbol(cleaned),
        }

        # Add new categories using generic extraction
        new_categories = [
            "product_identity",
            "country_of_origin",
            "best_before_use_by",
            "unit_sale_price",
            "dimensions_size"
        ]
        for cat in new_categories:
            value = self.extract_new_category(cleaned, cat)
            # Normalize the extracted value (if normalizer has a method)
            if value and hasattr(self.normalizer, f"normalize_{cat}"):
                norm_func = getattr(self.normalizer, f"normalize_{cat}")
                value = norm_func(value)
            result[cat] = value

        return result
