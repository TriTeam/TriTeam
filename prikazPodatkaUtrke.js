const detailName = document.getElementById("detailName");

const raceDetail = document.getElementById("competitorDetail");
const detailStats = document.getElementById("detail-stats");

export function showRaceDetail(race) {
  // Set basic info

  detailName.textContent = race[0] || "Unknown";

  // Add race history
  if (race[1].rezultati && Object.entries(race[1].rezultati).length > 1) {
    // Sort races by date if possible
    const raceResults = Object.entries(race[1].rezultati);

    console.log(race);
    raceResults.sort((a, b) => b[1] - a[1]);
    raceResults.forEach((natjecatelj) => {
      const raceName = natjecatelj[0];
      const position = calculatePoints(natjecatelj[1]);

      const raceItem = document.createElement("div");
      raceItem.className = "race-item";
      raceItem.innerHTML = `
    <div>
      <div class="race-name">${raceName}</div>
      <div class="race-date">${position}</div>
    </div>
  `;

      detailStats.appendChild(raceItem);
    });
  } else {
    // No race history
    const noRaceItem = document.createElement("div");
    noRaceItem.className = "race-item";
    noRaceItem.innerHTML = `
      <div>No race history available</div>
    `;
  }

  // Show modal
  raceDetail.style.display = "block";
}

function calculatePoints(position) {
  switch (position) {
    case 160:
      return 1;
    case 140:
      return 2;
    case 120:
      return 3;
    case 100:
      return 4;
    case 90:
      return 5;
    case 80:
      return 6;
    case 70:
      return 7;
    case 65:
      return 8;
    case 60:
      return 9;
    case 55:
      return 10;
    case 50:
      return 11;
    case 45:
      return 12;
    case 40:
      return 13;
    case 35:
      return 14;
    case 30:
      return 15;
    case 25:
      return 16;
    case 20:
      return 17;
    case 15:
      return 18;
    case 10:
      return 19;
    case 5:
      return 20;
    default:
      return null; // ili -1 ako želiš označiti nepoznatu vrijednost
  }
}
