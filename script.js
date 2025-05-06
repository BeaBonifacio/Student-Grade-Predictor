let subject = "";
let assessments = [];

function startSubject() {
  subject = document.getElementById("subjectName").value.trim();
  if (!subject) {
    alert("Please enter a subject name.");
    return;
  }
  document.getElementById("assessmentSection").style.display = "block";
  renderTable(); // Show empty subject row
}

function addAssessment() {
  const category = document.getElementById("category").value;
  const name = document.getElementById("assessmentName").value.trim();
  const weight = parseFloat(document.getElementById("weight").value);
  const scoreRaw = document.getElementById("score").value;
  const score = scoreRaw ? parseFloat(scoreRaw) : null;

  if (!name || isNaN(weight)) {
    alert("Please enter a valid name and weight.");
    return;
  }

  assessments.push({ category, name, weight, score });

  document.getElementById("assessmentName").value = "";
  document.getElementById("weight").value = "";
  document.getElementById("score").value = "";

  renderTable();
}

function renderTable() {
  const goal = parseFloat(document.getElementById("goal").value) || null;

  const categoryData = {};
  let overallTotal = 0;
  let overallWeight = 0;
  let rows = "";

  for (const a of assessments) {
    if (!categoryData[a.category]) categoryData[a.category] = [];
    categoryData[a.category].push(a);
  }

  for (const [cat, items] of Object.entries(categoryData)) {
    let total = 0, weightSum = 0, missingWeight = 0;

    for (const item of items) {
      if (item.score !== null) {
        total += (item.score * item.weight) / 100;
        weightSum += item.weight;
      } else {
        missingWeight += item.weight;
      }

      rows += `
        <tr>
          <td>${item.category}</td>
          <td>${item.name}</td>
          <td>${item.weight}%</td>
          <td>${item.score !== null ? item.score + "%" : "Missing"}</td>
        </tr>`;
    }

    const categoryPercent = (total / weightSum) * 100 || 0;
    overallTotal += total;
    overallWeight += weightSum;

    const neededScore = goal && missingWeight > 0
      ? ((goal - (overallTotal / overallWeight * 100)) * (overallWeight + missingWeight) + goal * missingWeight) / missingWeight
      : "-";

    rows += `
      <tr style="background-color:#e8f4ff;">
        <td colspan="2"><strong>${cat} Summary</strong></td>
        <td><strong>${weightSum + missingWeight}%</strong></td>
        <td><strong>${categoryPercent.toFixed(2)}%</strong></td>
      </tr>
      ${
        missingWeight > 0 && goal
          ? `<tr style="background-color:#fff9e6;">
              <td colspan="3">Required Avg in Missing (${missingWeight}%)</td>
              <td>${!isNaN(neededScore) ? neededScore.toFixed(2) + "%" : "-"}</td>
            </tr>`
          : ""
      }
    `;
  }

  const overallPercent = (overallTotal / overallWeight) * 100;

  rows += `
    <tr style="background-color:#d0f0d0;">
      <td colspan="3"><strong>Overall</strong></td>
      <td><strong>${!isNaN(overallPercent) ? overallPercent.toFixed(2) + "%" : "-"}</strong></td>
    </tr>
  `;

  document.getElementById("resultsContainer").innerHTML = `
    <h3>Subject: ${subject || "(not set)"}</h3>
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Assessment</th>
          <th>Weight</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}
