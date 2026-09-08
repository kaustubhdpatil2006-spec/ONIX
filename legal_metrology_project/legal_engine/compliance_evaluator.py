class ComplianceEvaluator:
    """
    Produces the final compliance summary.
    """

    def generate_summary(self, results: dict) -> dict:
        required_fields = []
        passed_fields = []
        failed_fields = []
        conditional_fields = []

        for field_name, result in results.items():
            if result["required"]:
                required_fields.append(field_name)
                if result["status"] == "PASS":
                    passed_fields.append(field_name)
                else:
                    failed_fields.append(field_name)
            else:
                conditional_fields.append(field_name)

        total_required = len(required_fields)
        total_passed = len(passed_fields)
        compliance_percentage = round((total_passed / total_required) * 100, 2) if total_required else 0

        return {
            "overall_status": "NON_COMPLIANT" if failed_fields else "COMPLIANT",
            "compliance_percentage": compliance_percentage,
            "total_required_fields": total_required,
            "passed_required_fields": total_passed,
            "failed_required_fields": len(failed_fields),
            "passed_fields": passed_fields,
            "failed_fields": failed_fields,
            "conditional_fields": conditional_fields
        }
