import { CheckCircle2, XCircle } from 'lucide-react'

export default function ComplianceChecklist({ rules }) {
  return (
    <div className="border rounded-lg divide-y">
      {rules.map((rule) => (
        <div
          key={rule.id}
          className="flex items-center justify-between px-4 py-3"
        >
          <span className="text-sm font-medium">{rule.name}</span>

          {rule.status === 'pass' ? (
            <span className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircle2 size={16} /> Compliant
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-600 text-sm">
              <XCircle size={16} /> Violation
            </span>
          )}
        </div>
      ))}
    </div>
  )
}