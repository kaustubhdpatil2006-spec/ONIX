import jsPDF from 'jspdf'

function imageUrlToDataUrl(imageUrl) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()

      const reader = new FileReader()

      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject

      reader.readAsDataURL(blob)
    } catch (error) {
      reject(error)
    }
  })
}

export async function exportReportAsPdf(
  results,
  filename = 'report.pdf'
) {
  if (!results) return

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  const margin = 40
  const contentWidth = pageWidth - margin * 2

  let y = margin

  // Title
  pdf.setFontSize(20)
  pdf.setFont(undefined, 'bold')
  pdf.text('Legal Metrology Compliance Report', margin, y)

  y += 20

  // Generated date
  pdf.setFontSize(9)
  pdf.setFont(undefined, 'normal')
  pdf.setTextColor(100, 100, 100)

  pdf.text(
    `Generated on ${new Date().toLocaleString()}`,
    margin,
    y
  )

  y += 30

  // Overall status
  const passCount = results.rules.filter(
    (rule) => rule.status === 'pass'
  ).length

  const overallCompliant =
    passCount === results.rules.length

  pdf.setFontSize(12)
  pdf.setFont(undefined, 'bold')
  pdf.setTextColor(
    overallCompliant ? 22 : 220,
    overallCompliant ? 163 : 38,
    overallCompliant ? 74 : 38
  )

  pdf.text(
    overallCompliant ? 'COMPLIANT' : 'NON-COMPLIANT',
    margin,
    y
  )

  y += 25

  pdf.setTextColor(0, 0, 0)
  pdf.setFont(undefined, 'normal')
  pdf.setFontSize(11)

  pdf.text(
    `${passCount} of ${results.rules.length} mandatory declarations compliant`,
    margin,
    y
  )

  y += 30

  // Images
  for (let i = 0; i < results.images.length; i++) {
    const imageUrl = results.images[i]

    const imageData = await imageUrlToDataUrl(imageUrl)

    const imageProperties = pdf.getImageProperties(imageData)

    const imageWidth = contentWidth
    const imageHeight =
      (imageProperties.height * imageWidth) /
      imageProperties.width

    // Add a new page if the image won't fit
    if (y + imageHeight + 30 > pageHeight - margin) {
      pdf.addPage()
      y = margin
    }

    pdf.setFontSize(10)
    pdf.setFont(undefined, 'bold')

    pdf.text(`Image ${i + 1}`, margin, y)

    y += 15

    pdf.addImage(
      imageData,
      'JPEG',
      margin,
      y,
      imageWidth,
      imageHeight
    )

    y += imageHeight + 25
  }

  // Rules heading
  if (y + 80 > pageHeight - margin) {
    pdf.addPage()
    y = margin
  }

  pdf.setFontSize(14)
  pdf.setFont(undefined, 'bold')
  pdf.text('Compliance Checklist', margin, y)

  y += 25

  // Rules
  results.rules.forEach((rule) => {
    if (y + 25 > pageHeight - margin) {
      pdf.addPage()
      y = margin
    }

    pdf.setFontSize(10)
    pdf.setFont(undefined, 'normal')
    pdf.setTextColor(0, 0, 0)

    pdf.text(rule.name, margin, y)

    pdf.setFont(undefined, 'bold')

    if (rule.status === 'pass') {
      pdf.setTextColor(22, 163, 74)
      pdf.text('PASS', pageWidth - margin - 35, y)
    } else {
      pdf.setTextColor(220, 38, 38)
      pdf.text('FAIL', pageWidth - margin - 35, y)
    }

    pdf.setTextColor(0, 0, 0)

    y += 20
  })

  pdf.save(filename)
}