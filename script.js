const assessments = [];

function addAssessment() {
  const name = document.getElementById("name").value;
  const score = parseFloat(document.getElementById("score").value);
  const weight = parseFloat(document.getElementById("weight").value) || 0;

  if (!name || isNaN(score)) {
    alert("Please fill in valid name and score.");
    return;
  }

  assessments.push({ name, score, weight });
  renderAssessments();
  updateChart();
}

function renderAssessments() {
  const list = document.getElementById("assessmentList");
  list.innerHTML = assessments
    .map(a => `<li>${a.name}: ${a.score}% (Weight: ${a.weight}%)</li>`)
    .join("");
}

function predictNeededGrade() {
  const goal = parseFloat(document.getElementById("goal").value);
  if (isNaN(goal)) {
    alert("Enter a valid target grade.");
    return;
  }

  let totalWeight = assessments.reduce((sum, a) => sum + a.weight, 0);
  const knownWeightedSum = assessments.reduce(
    (sum, a) => sum + (a.score * a.weight) / 100,
    0
  );

  const remainingWeight = 100 - totalWeight;
  if (remainingWeight <= 0) {
    document.getElementById("predictionResult").innerText =
      "All assessments entered. Target already calculated.";
    return;
  }

  const needed = ((goal - knownWeightedSum) * 100) / remainingWeight;

  let status = "";
  if (needed > 100) status = "Unlikely";
  else if (needed <= 0) status = "Already Reached";
  else status = "Achievable";

  document.getElementById(
    "predictionResult"
  ).innerHTML = `You need <strong>${needed.toFixed(
    2
  )}%</strong> on remaining assessments to reach your goal.<br>Status: <strong>${status}</strong>`;
}

function interpolateMissingGrade() {
  const prev = parseFloat(document.getElementById("prevScore").value);
  const next = parseFloat(document.getElementById("nextScore").value);
  if (isNaN(prev) || isNaN(next)) {
    alert("Enter valid scores.");
    return;
  }

  const estimate = (prev + next) / 2;
  document.getElementById("interpolatedResult").innerText =
    `Estimated missing grade: ${estimate.toFixed(2)}%`;
}

function updateChart() {
  const ctx = document.getElementById("gradeChart").getContext("2d");
  const labels = assessments.map(a => a.name);
  const data = assessments.map(a => a.score);

  if (window.gradeChart) window.gradeChart.destroy();

  window.gradeChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Grade Progression",
          data,
          borderColor: "green",
          fill: false,
          tension: 0.1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}
