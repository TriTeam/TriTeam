import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
  onAuthStateChanged,
  getAuth,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAeTpzrQ-V21EwUF-26DNLGY6n_ZiZ7weg",
  authDomain: "triteam-7328e.firebaseapp.com",
  databaseURL: "https://triteam-7328e-default-rtdb.firebaseio.com",
  projectId: "triteam-7328e",
  storageBucket: "triteam-7328e.appspot.com",
  messagingSenderId: "99207607267",
  appId: "1:99207607267:web:07c7b9549374b32fa326d6",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

// Show loader
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const content = document.getElementById("sve");

  // Fetch data with timeout
  setTimeout(() => {
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.display = "none";
        if (content) {
          content.style.display = "flex";
          setTimeout(() => {
            content.style.opacity = "1";
          }, 50);
        }
      }, 300);
    }
  }, 800);
});

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});

// Global variables
let allCompetitors = [];
let allRaces = [];

// DOM elements
const searchInput = document.getElementById("searchInput");
const genderFilter = document.getElementById("genderFilter");
const sortBy = document.getElementById("sortBy");
const statsTableBody = document.getElementById("statsTableBody");
const noResults = document.getElementById("noResults");
const competitorDetail = document.getElementById("competitorDetail");
const closeDetail = document.getElementById("closeDetail");

// Summary elements
const totalCompetitors = document.getElementById("totalCompetitors");
const avgPoints = document.getElementById("avgPoints");
const totalRaces = document.getElementById("totalRaces");
const topValue = document.getElementById("topValue");

// Detail elements
const detailName = document.getElementById("detailName");
const detailClub = document.getElementById("detailClub");
const detailGender = document.getElementById("detailGender");
const detailValue = document.getElementById("detailValue");
const detailPoints = document.getElementById("detailPoints");
const detailPodiums = document.getElementById("detailPodiums");
const detailRaces = document.getElementById("detailRaces");
const raceHistory = document.getElementById("raceHistory");

// Event listeners
searchInput.addEventListener("input", filterAndSortCompetitors);
genderFilter.addEventListener("change", filterAndSortCompetitors);
sortBy.addEventListener("change", filterAndSortCompetitors);
closeDetail.addEventListener("click", () => {
  competitorDetail.style.display = "none";
});

// Add shadow elements to indicate sticky columns
function addStickyShadows() {
  const tableContainer = document.querySelector(".stats-table-container");
  const firstColumnCells = document.querySelectorAll(
    ".stats-table td:first-child, .stats-table th:first-child"
  );
  const secondColumnCells = document.querySelectorAll(
    ".stats-table td:nth-child(2), .stats-table th:nth-child(2)"
  );

  // Add shadow to second column to indicate scrollable content
  secondColumnCells.forEach((cell) => {
    const shadow = document.createElement("div");
    shadow.className = "sticky-shadow";
    cell.appendChild(shadow);
  });

  // Check if scrolling is needed
  if (tableContainer) {
    const isScrollable =
      tableContainer.scrollWidth > tableContainer.clientWidth;
    const scrollHint = document.querySelector(".scroll-hint");

    if (scrollHint) {
      scrollHint.style.display = isScrollable ? "block" : "none";
    }
  }
}

// Fetch data
async function fetchData() {
  try {
    // Fetch competitors
    const competitorsSnapshot = await get(ref(db, "FANTASY/natjecatelji"));
    if (competitorsSnapshot.exists()) {
      const competitorsData = competitorsSnapshot.val();
      allCompetitors = Object.entries(competitorsData).map(([id, data]) => ({
        id,
        ...data,
      }));
    }

    // Fetch races
    const racesSnapshot = await get(ref(db, "FANTASY/utrke"));
    if (racesSnapshot.exists()) {
      const racesData = racesSnapshot.val();
      allRaces = Object.entries(racesData).map(([id, data]) => ({
        id,
        ...data,
      }));
    }

    // Update summary stats
    updateSummaryStats();

    // Initial display
    filterAndSortCompetitors();

    // Add sticky shadows after table is populated
    setTimeout(addStickyShadows, 100);
  } catch (error) {
    console.error("Error fetching data:", error);
    showError("Failed to load data. Please try again later.");
  }
}

// Update summary statistics
function updateSummaryStats() {
  // Total competitors
  totalCompetitors.textContent = allCompetitors.length;

  // Average points
  const totalPoints = allCompetitors.reduce(
    (sum, competitor) => sum + (competitor.bodovi || 0),
    0
  );
  const average =
    allCompetitors.length > 0
      ? Math.round(totalPoints / allCompetitors.length)
      : 0;
  avgPoints.textContent = average;

  // Total races
  totalRaces.textContent = allRaces.length;

  // Top value
  const maxValue = allCompetitors.reduce((max, competitor) => {
    const value = Number.parseFloat(competitor.vrijednost?.sad || 0);
    return value > max ? value : max;
  }, 0);
  topValue.textContent = `$${maxValue}`;
}

// Filter and sort competitors
function filterAndSortCompetitors() {
  const searchTerm = searchInput.value.toLowerCase();
  const gender = genderFilter.value;
  const sort = sortBy.value;

  // Filter competitors
  const filtered = allCompetitors.filter((competitor) => {
    // Search term filter
    const nameMatch = (competitor.ime || "").toLowerCase().includes(searchTerm);
    const clubMatch = (competitor.klub || "")
      .toLowerCase()
      .includes(searchTerm);
    const searchMatch = nameMatch || clubMatch;

    // Gender filter
    const genderMatch = gender === "all" || competitor.spol === gender;

    return searchMatch && genderMatch;
  });

  // Sort competitors
  filtered.sort((a, b) => {
    switch (sort) {
      case "points":
        return (b.bodovi || 0) - (a.bodovi || 0);
      case "podiums":
        return countPodiums(b) - countPodiums(a);
      case "value":
        return (
          Number.parseFloat(b.vrijednost?.sad || 0) -
          Number.parseFloat(a.vrijednost?.sad || 0)
        );
      case "name":
        return (a.ime || "").localeCompare(b.ime || "");
      default:
        return (b.bodovi || 0) - (a.bodovi || 0);
    }
  });

  // Display results
  displayCompetitors(filtered);

  // Re-add sticky shadows after table update
  setTimeout(addStickyShadows, 100);
}

// Count podiums for a competitor
function countPodiums(competitor) {
  if (!competitor.utrke) return 0;

  return competitor.utrke.filter((race) => {
    const position = calculatePoints(Object.values(race)[0]);
    return position <= 3;
  }).length;
}

// Display competitors in the table
function displayCompetitors(competitors) {
  // Clear table
  statsTableBody.innerHTML = "";

  // Show/hide no results message
  if (competitors.length === 0) {
    noResults.style.display = "block";
    return;
  } else {
    noResults.style.display = "none";
  }

  // Add competitors to table
  competitors.forEach((competitor, index) => {
    const row = document.createElement("tr");
    row.addEventListener("click", () => showCompetitorDetail(competitor));

    // Calculate podiums
    const podiums = countPodiums(competitor);

    // Get last 3 race results
    const lastRaces = getLastThreeRaces(competitor);

    // Create race results HTML
    const raceResultsHtml = lastRaces
      .map((position) => {
        const isPodium = position <= 3 && position > 0;
        return `<div class="race-result ${isPodium ? "podium" : ""}">${
          position > 0 ? position : "-"
        }</div>`;
      })
      .join("");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>
        <div class="competitor-name">${competitor.ime || "Unknown"}</div>
        <div class="competitor-club">${competitor.klub || ""}</div>
      </td>
      <td>${competitor.klub || ""}</td>
      <td>${competitor.spol || ""}</td>
      <td>${getValueWithChangeIndicator(competitor.vrijednost)}</td>

      <td class="points-value">${competitor.bodovi || 0}</td>
      <td>${podiums}</td>
      <td>${raceResultsHtml}</td>
    `;

    statsTableBody.appendChild(row);
  });
}

// Get last three race results
function getLastThreeRaces(competitor) {
  if (!competitor.utrke || competitor.utrke.length <= 1) {
    return [0, 0, 0];
  }

  const results = competitor.utrke
    .slice(1)
    .map((race) => calculatePoints(Object.values(race)[0]));

  // Pad with zeros if less than 3 races
  while (results.length < 3) {
    results.unshift(0);
  }

  // Return last 3 races
  return results.slice(-3);
}

// Show competitor detail
function showCompetitorDetail(competitor) {
  // Set basic info
  detailName.textContent = competitor.ime || "Unknown";
  detailClub.textContent = competitor.klub || "Unknown";
  detailGender.textContent = competitor.spol === "M" ? "Male" : "Female";
  detailValue.textContent = `$${competitor.vrijednost?.sad || 0}`;
  detailPoints.textContent = competitor.bodovi || 0;

  // Calculate podiums
  const podiums = countPodiums(competitor);
  detailPodiums.textContent = podiums;

  // Count races
  const raceCount = competitor.utrke ? competitor.utrke.length - 1 : 0;
  detailRaces.textContent = raceCount;

  // Clear race history
  raceHistory.innerHTML = "";

  // Add race history
  if (competitor.utrke && competitor.utrke.length > 1) {
    // Sort races by date if possible
    const competitorRaces = [...competitor.utrke.slice(1)]; // Preskoči nulti element
    competitorRaces.reverse(); // Show most recent first
    console.log(competitorRaces);

    competitorRaces.forEach((raceEntry) => {
      const raceName = raceEntry.ime;
      const position = calculatePoints(Object.values(raceEntry)[0]);
      const points = Object.values(raceEntry)[0];

      const isPodium = calculatePoints(position) <= 3;

      // Find race details
      const raceDetails = allRaces.find((race) => race.id === raceName);
      const raceDate = raceDetails ? formatDate(raceDetails.datum) : "";

      const raceItem = document.createElement("div");
      raceItem.className = "race-item";
      raceItem.innerHTML = `
    <div>
      <div class="race-name">${raceName}</div>
      <div class="race-date">${raceDate}</div>
    </div>
    <div class="race-position">
      <div class="position-number ${isPodium ? "podium" : ""}">${position}</div>
      <div class="position-points">${points} pts</div>
    </div>
  `;

      raceHistory.appendChild(raceItem);
    });
  } else {
    // No race history
    const noRaceItem = document.createElement("div");
    noRaceItem.className = "race-item";
    noRaceItem.innerHTML = `
      <div>No race history available</div>
    `;
    raceHistory.appendChild(noRaceItem);
  }

  // Show modal
  competitorDetail.style.display = "block";
}

// Calculate points based on position
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
      return 21; // ili -1 ako želiš označiti nepoznatu vrijednost
  }
}

// Format date
function formatDate(dateString) {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${day} ${months[Number.parseInt(month) - 1]} ${year}`;
}

// Show error message
function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  errorDiv.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
  errorDiv.style.color = "white";
  errorDiv.style.padding = "15px";
  errorDiv.style.borderRadius = "8px";
  errorDiv.style.margin = "20px auto";
  errorDiv.style.width = "90%";
  errorDiv.style.maxWidth = "1200px";
  errorDiv.style.textAlign = "center";

  const content = document.getElementById("content");
  content.prepend(errorDiv);

  // Remove after 5 seconds
  setTimeout(() => {
    errorDiv.style.opacity = "0";
    setTimeout(() => errorDiv.remove(), 300);
  }, 5000);
}

// Initialize
fetchData();

// Add code to handle horizontal scrolling indicators
document.addEventListener("DOMContentLoaded", () => {
  const tableContainer = document.querySelector(".stats-table-container");

  // Check if scrolling is needed and show/hide indicators
  function checkScrollIndicator() {
    if (tableContainer) {
      const isScrollable =
        tableContainer.scrollWidth > tableContainer.clientWidth;
      const scrollHint = document.querySelector(".scroll-hint");

      if (scrollHint) {
        scrollHint.style.display = isScrollable ? "block" : "none";
      }

      // Add a class to indicate scrollability
      if (isScrollable) {
        tableContainer.classList.add("is-scrollable");
      } else {
        tableContainer.classList.remove("is-scrollable");
      }
    }
  }

  // Run on load and on resize
  window.addEventListener("resize", checkScrollIndicator);
  checkScrollIndicator();

  // Hide scroll hint after user has scrolled
  if (tableContainer) {
    tableContainer.addEventListener("scroll", () => {
      const scrollHint = document.querySelector(".scroll-hint");
      if (scrollHint && tableContainer.scrollLeft > 0) {
        scrollHint.style.opacity = "0";
        setTimeout(() => {
          scrollHint.style.display = "none";
        }, 500);
      }
    });
  }
});
// Funkcija za prikaz vrijednosti sa strelicom
// Funkcija za prikaz vrijednosti sa strelicom
function getValueWithChangeIndicator(vrijednost) {
  if (!vrijednost) return "$0 <span class='arrow neutral'>↔ 0</span>";

  const currentValue = parseFloat(vrijednost.sad) || 0;
  const previousValue = parseFloat(vrijednost.prije) || 0;
  const difference = currentValue - previousValue;

  let arrowClass = "neutral";
  let arrowSymbol = "↔";
  let differenceText = "0";

  if (difference > 0) {
    arrowClass = "positive";
    arrowSymbol = "↑";
    differenceText = `+${difference.toFixed(2)}`;
  } else if (difference < 0) {
    arrowClass = "negative";
    arrowSymbol = "↓";
    differenceText = `${difference.toFixed(2)}`;
  }

  return `$${currentValue.toFixed(
    2
  )} <span class='arrow ${arrowClass}'>${arrowSymbol} ${differenceText}</span>`;
}
