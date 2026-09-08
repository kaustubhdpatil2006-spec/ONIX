import re


class LegalRuleEngine:
    """
    Applies deterministic rules to extracted declarations.
    """

    def __init__(self, rules: dict):
        self.rules = rules

    def validate_mrp(self, value):
        if not value:
            return False, "MRP declaration is missing"

        pattern = r"(?:rs\.?|₹)\s*[0-9]+(?:\.[0-9]{1,2})?"
        if re.search(pattern, value, re.IGNORECASE):
            return True, "MRP value detected"

        return False, "MRP value is not in a valid format"

    def validate_net_quantity(self, value):
        if not value:
            return False, "Net quantity declaration is missing"

        pattern = r"[0-9]+(?:\.[0-9]+)?\s*(kg|g|mg|l|ml|pcs|pieces|piece)"
        if re.search(pattern, value, re.IGNORECASE):
            return True, "Net quantity with unit detected"

        return False, "Net quantity or unit is invalid"

    def validate_manufacturing_date(self, value):
        if not value:
            return False, "Manufacturing or packing date is missing"

        pattern = (
            r"([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})"
            r"|([0-9]{1,2}[\/\-][0-9]{2,4})"
            r"|([A-Za-z]+\s+[0-9]{4})"
        )
        if re.search(pattern, value, re.IGNORECASE):
            return True, "Manufacturing or packing date detected"

        return False, "Manufacturing date format is invalid"

    def validate_manufacturer_details(self, value):
        if not value:
            return False, "Manufacturer, packer or importer details are missing"
        if len(value.strip()) < 5:
            return False, "Manufacturer details are too short"

        return True, "Manufacturer-related details detected"

    def validate_consumer_care(self, value):
        if not value:
            return False, "Consumer-care details are missing"

        phone_pattern = r"\b[6-9][0-9]{9}\b"
        email_pattern = r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
        if re.search(phone_pattern, value):
            return True, "Consumer-care phone number detected"
        if re.search(email_pattern, value):
            return True, "Consumer-care email detected"
        if len(value.strip()) >= 5:
            return True, "Consumer-care information detected"

        return False, "Consumer-care details are invalid"

    def validate_symbol(self, value, symbol_type):
        if symbol_type == "vegetarian_symbol":
            return (True, "Vegetarian symbol or declaration detected") if value else (False, "Vegetarian symbol is missing")
        if symbol_type == "non_vegetarian_symbol":
            return (True, "Non-vegetarian symbol or declaration detected") if value else (False, "Non-vegetarian symbol is missing")

        return False, "Unknown symbol type"

    def validate_field(self, field_name, value):
        validators = {
            "mrp": self.validate_mrp,
            "net_quantity": self.validate_net_quantity,
            "manufacturing_date": self.validate_manufacturing_date,
            "manufacturer_details": self.validate_manufacturer_details,
            "consumer_care": self.validate_consumer_care,
            "vegetarian_symbol": lambda current: self.validate_symbol(current, "vegetarian_symbol"),
            "non_vegetarian_symbol": lambda current: self.validate_symbol(current, "non_vegetarian_symbol")
        }
        validator = validators.get(field_name)
        if validator is None:
            return False, "Unknown field"

        return validator(value)

    def evaluate(self, extracted_data: dict) -> dict:
        results = {}
        for field_name, rule in self.rules["categories"].items():
            value = extracted_data.get(field_name)
            is_valid, message = self.validate_field(field_name, value)
            status = "PASS" if is_valid or (not rule["required"] and value) else (
                "FAIL" if rule["required"] else "NOT_APPLICABLE_OR_NOT_DETECTED"
            )
            results[field_name] = {
                "value": value,
                "required": rule["required"],
                "status": status,
                "message": message,
                "description": rule["description"]
            }

        return results
