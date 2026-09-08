import json
import os

from nlp.text_preprocessor import TextPreprocessor
from nlp.declaration_extractor import DeclarationExtractor

from legal_engine.rule_loader import RuleLoader
from legal_engine.rule_engine import LegalRuleEngine
from legal_engine.compliance_evaluator import ComplianceEvaluator


def save_report(report: dict, file_path: str):
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(
            report,
            file,
            indent=4,
            ensure_ascii=False
        )


def main():
    input_file = "sample_label.txt"
    rules_file = "rules/rules.json"
    report_file = "reports/compliance_report.json"

    with open(input_file, "r", encoding="utf-8") as file:
        raw_text = file.read()

    preprocessor = TextPreprocessor()
    cleaned_text = preprocessor.clean(raw_text)

    extractor = DeclarationExtractor()
    extracted_data = extractor.extract(cleaned_text)

    loader = RuleLoader(rules_file)
    rules = loader.load()

    rule_engine = LegalRuleEngine(rules)
    validation_results = rule_engine.evaluate(extracted_data)

    evaluator = ComplianceEvaluator()
    summary = evaluator.generate_summary(validation_results)

    final_report = {
        "project": "Legal Metrology NLP and Rule Engine",
        "rules_version": rules["rules_version"],
        "selected_categories": list(rules["categories"].keys()),
        "ocr_text": raw_text,
        "cleaned_text": cleaned_text,
        "extracted_data": extracted_data,
        "validation_results": validation_results,
        "summary": summary
    }

    save_report(final_report, report_file)

    print("\n========== LEGAL METROLOGY REPORT ==========\n")

    print("Overall Status:", summary["overall_status"])
    print("Compliance Percentage:",
          summary["compliance_percentage"], "%")

    print("\nField-wise Results:")

    for field_name, result in validation_results.items():
        print("\nCategory:", field_name)
        print("Value:", result["value"])
        print("Status:", result["status"])
        print("Message:", result["message"])

    print("\nReport saved at:", report_file)


if __name__ == "__main__":
    main()