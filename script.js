let subject = "";
let assessments = [];
let editIndex = -1;

function startSubject() {
  subject = document.getElementById("subjectName").value.trim();
  if (!subject) {
    alert("Please enter a subject name.");
    return;
  }
  document.getElementById("assessmentSection").style.display = "block";
  renderTable(); // Initialize table
}

function addAssessment() {
  const category = document.getElementById("category").value;
  const name = document.getElementById("assessmentName").value.trim();
  const perfectScore = parseFloat(document.getElementById("perfectScore").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const scoreRaw = document.getElementById("score").value;
  const score = scoreRaw ? parseFloat(scoreRaw) : null;

  if (!name || isNaN(weight) || isNaN(perfectScore)) {
    alert("Please enter valid inputs.");
    return;
  }

  const newData = { category, name, perfectScore, weight, score };

  if (editIndex >= 0) {
    assessments[editIndex] = newData;
    editIndex = -1;
  } else {
    assessments.push(newData);
  }

  // Reset fields
  document.getElementById("assessmentName").value = "";
  document.getElementById("perfectScore").value = "";
  document.getElementById("weight").value = "";
  document.getElementById("score").value = "";

  renderTable();
}

function renderTable() {
  const goal = parseFloat(document.getElementById("goal").value) || null;

  const categoryData = {};
  let overallEarned = 0, overallWeight = 0;
  let tableRows = "";

  assessments.forEach((a, index) => {
    if (!categoryData[a.category]) categoryData[a.category] = [];
    categoryData[a.category].push({ ...a, index });
  });

  for (const [cat, items] of Object.entries(categoryData)) {
    let earned = 0, possible = 0, missingWeight = 0;

    for (const item of items) {
      const percentScore = item.score !== null
        ? (item.score / item.perfectScore) * 100
        : null;

      if (percentScore !== null) {
        earned += percentScore * (item.weight / 100);
        possible += item.weight;
      } else {
        missingWeight += item.weight;
      }

      tableRows += `
        <tr>
          <td>${item.category}</td>
          <td>${item.name}</td>
          <td>${item.perfectScore}</td>
          <td>${item.weight}%</td>
          <td>${item.score !== null ? item.score : "Missing"}</td>
          <td>
            <button onclick="editAssessment(${item.index})">✏️</button>
            <button onclick="deleteAssessment(${item.index})">🗑️</button>
          </td>
        </tr>`;
    }

    const categoryPercent = (earned / possible) * 100 || 0;
    overallEarned += earned;
    overallWeight += possible;

    const needed = goal && missingWeight > 0
      ? ((goal - (overallEarned / overallWeight) * 100) * (overallWeight + missingWeight) + goal * missingWeight) / missingWeight
      : "-";

    tableRows += `
      <tr style="background-color:#fff0f5;">
        <td colspan="3"><strong>${cat} Summary</strong></td>
        <td><strong>${possible + missingWeight}%</strong></td>
        <td><strong>${categoryPercent.toFixed(2)}%</strong></td>
        <td></td>
      </tr>
      ${
        missingWeight > 0 && goal
          ? `<tr style="background-color:#ffe4ec;">
              <td colspan="4">Needed Avg in Missing (${missingWeight}%)</td>
              <td><strong>${!isNaN(needed) ? needed.toFixed(2) + "%" : "-"}</strong></td>
              <td></td>
            </tr>`
          : ""
      }
    `;
  }

  const overallPercent = (overallEarned / overallWeight) * 100 || 0;

  tableRows += `
    <tr style="background-color:#ffc0cb;">
      <td colspan="4"><strong>Overall Grade</strong></td>
      <td><strong>${!isNaN(overallPercent) ? overallPercent.toFixed(2) + "%" : "-"}</strong></td>
      <td></td>
    </tr>
  `;

  document.getElementById("resultsContainer").innerHTML = `
    <h3>📚 Subject: ${subject || "(not set)"}</h3>
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Assessment</th>
          <th>Perfect Score</th>
          <th>Weight</th>
          <th>Your Score</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>
  `;
}

function editAssessment(index) {
  const a = assessments[index];
  document.getElementById("category").value = a.category;
  document.getElementById("assessmentName").value = a.name;
  document.getElementById("perfectScore").value = a.perfectScore;
  document.getElementById("weight").value = a.weight;
  document.getElementById("score").value = a.score ?? "";

  editIndex = index;
}

function deleteAssessment(index) {
  if (confirm("Are you sure you want to delete this assessment?")) {
    assessments.splice(index, 1);
    renderTable();
  }
}
