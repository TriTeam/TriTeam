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

const menu = document.getElementById("menu");
const menubar = document.getElementById("menubar");
const content = document.getElementById("content");
const root = document.getElementById("root");
let switchmenu = true;

menu.addEventListener("click", function () {
  if (switchmenu) {
    menubar.style.display = "flex";
    content.style.display = "none";
    root.style.display = "none";
    switchmenu = false;
  } else {
    menubar.style.display = "none";
    content.style.display = "block";
    root.style.display = "block";
    switchmenu = true;
  }
});
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
  }, 5000);
});

// Global variables
let allRaces = [];
let allUsers = [];
const allTeams = {};
let currentUserId = null;
let leaderboardData = [];
let allCompetitors = {}; // Declare allCompetitors

// DOM elements
const leaderboardBody = document.getElementById("leaderboardBody");
const noPlayers = document.getElementById("noPlayers");
const playerDetail = document.getElementById("playerDetail");
const closePlayerDetail = document.getElementById("closePlayerDetail");

// Summary elements
const totalPlayers = document.getElementById("totalPlayers");
const avgScore = document.getElementById("avgScore");
const topScore = document.getElementById("topScore");
const yourRank = document.getElementById("yourRank");

// Podium elements
const firstPlace = document.getElementById("firstPlace");
const secondPlace = document.getElementById("secondPlace");
const thirdPlace = document.getElementById("thirdPlace");

// Detail elements
const detailAvatar = document.getElementById("detailAvatar");
const detailPlayerName = document.getElementById("detailPlayerName");
const detailRank = document.getElementById("detailRank");
const detailTotalPoints = document.getElementById("detailTotalPoints");
const detailRaces = document.getElementById("detailRaces");
const detailAvgPoints = document.getElementById("detailAvgPoints");
const detailBestRace = document.getElementById("detailBestRace");
const racePerformance = document.getElementById("racePerformance");
const teamHistory = document.getElementById("teamHistory");

// Event listeners
closePlayerDetail.addEventListener("click", () => {
  playerDetail.style.display = "none";
});

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserId = user.uid;
  } else {
    window.location.href = "login.html";
  }
});

// Fetch data
async function fetchData() {
  try {
    // Fetch races
    const racesSnapshot = await get(ref(db, "FANTASY/utrke"));
    if (racesSnapshot.exists()) {
      const racesData = racesSnapshot.val();
      allRaces = Object.entries(racesData).map(([id, data]) => ({
        id,
        ...data,
      }));

      // Sort races by date
      allRaces.sort((a, b) => {
        const dateA = new Date(a.datum.split("-").reverse().join("-"));
        const dateB = new Date(b.datum.split("-").reverse().join("-"));
        return dateA - dateB;
      });
    }

    // Fetch users
    const usersSnapshot = await get(ref(db, "FANTASY/users"));
    if (usersSnapshot.exists()) {
      const usersData = usersSnapshot.val();

      // Filter out users without names
      allUsers = {};
      Object.entries(usersData).forEach(([userId, userData]) => {
        // Only include users with displayName or ime property
        if (userData.displayName || userData.ime) {
          allUsers[userId] = {
            ...userData,
            // Ensure displayName exists (use ime if displayName is missing)
            displayName: userData.displayName || userData.ime,
          };
        }
      });
    }

    // Fetch competitors for reference
    const competitorsSnapshot = await get(ref(db, "FANTASY/natjecatelji"));
    if (competitorsSnapshot.exists()) {
      allCompetitors = competitorsSnapshot.val();
    }

    // Fetch teams for all races
    for (const race of allRaces) {
      const maleTeamsSnapshot = await get(
        ref(db, `FANTASY/utrke/${race.id}/timovi/M`)
      );
      const femaleTeamsSnapshot = await get(
        ref(db, `FANTASY/utrke/${race.id}/timovi/Z`)
      );

      allTeams[race.id] = {
        M: maleTeamsSnapshot.exists() ? maleTeamsSnapshot.val() : {},
        Z: femaleTeamsSnapshot.exists() ? femaleTeamsSnapshot.val() : {},
      };
    }

    // Calculate points for all users
    calculatePoints();

    // Display leaderboard
    displayLeaderboard();
  } catch (error) {
    console.error("Error fetching data:", error);
    showError("Failed to load data. Please try again later.");
  }
}

// Calculate points for all users
function calculatePoints() {
  leaderboardData = [];

  // Process each user
  Object.keys(allUsers).forEach((userId) => {
    const user = allUsers[userId];
    const userData = {
      id: userId,
      name: user.displayName || user.ime || "Unknown User",
      email: user.email || "",
      photoURL: user.photoURL || "noprofile.jpg",
      totalPoints: user.bodovi || 0,
      raceCount: user.utrke?.length || 0,
      races: {},
      bestRace: { name: "", points: 0 },
    };

    // Process each race from user's race history
    if (user.utrke && Array.isArray(user.utrke)) {
      user.utrke.forEach((raceData, index) => {
        if (raceData) {
          const raceName = raceData.ime;
          const racePoints = raceData.bodovi;

          // Find the race in allRaces
          const race = allRaces.find((r) => r.id === raceName);

          if (race) {
            userData.races[raceName] = {
              points: racePoints,
              maleTeam: allTeams[raceName]?.M?.[userId] || null,
              femaleTeam: allTeams[raceName]?.Z?.[userId] || null,
              date: race.datum,
            };

            // Update best race
            if (racePoints > userData.bestRace.points) {
              userData.bestRace = {
                name: raceName,
                points: racePoints,
              };
            }
          }
        }
      });
    }

    // Add user to leaderboard data
    if (userData.totalPoints > 0) {
      leaderboardData.push(userData);
    }
  });

  // Sort leaderboard by total points
  leaderboardData.sort((a, b) => b.totalPoints - a.totalPoints);

  // Assign ranks
  leaderboardData.forEach((user, index) => {
    user.rank = index + 1;
  });
}

// Calculate points for a team in a race
function calculateTeamPoints(team, raceId, gender) {
  let totalPoints = 0;

  // Get race results
  const raceResults =
    allRaces.find((race) => race.id === raceId)?.rezultati || {};

  // Process each team member
  team.forEach((member) => {
    const competitorId = Object.keys(member)[0];
    const competitorName = Object.values(member)[0];
    const competitorType = member.value; // "gold" or "silver"

    // Find competitor's result in this race
    const points = raceResults[competitorName] || 0;

    // Apply multiplier based on competitor type
    let adjustedPoints = points;
    if (competitorType === "silver") {
      adjustedPoints *= 0.5; // Silver competitors get 50% of points
    }

    totalPoints += adjustedPoints;
  });

  return totalPoints;
}

// Display leaderboard
function displayLeaderboard() {
  const users = [...leaderboardData];

  // Clear table
  leaderboardBody.innerHTML = "";

  // Show/hide no players message
  if (users.length === 0) {
    noPlayers.style.display = "block";
    return;
  } else {
    noPlayers.style.display = "none";
  }

  // Update summary stats
  updateSummaryStats(users);

  // Update podium
  updatePodium(users);

  // Add users to table
  users.forEach((user) => {
    const row = document.createElement("tr");
    row.addEventListener("click", () => showPlayerDetail(user));

    // Highlight current user
    if (user.id === currentUserId) {
      row.classList.add("current-user");
    }

    // Get points and race count
    const points = user.totalPoints;
    const raceCount = Object.keys(user.races).length;

    // Create rank display with medal for top 3
    let rankDisplay = `<div class="rank-number">${user.rank}</div>`;
    if (user.rank <= 3) {
      rankDisplay = `
        <div class="rank-number">
          <div class="rank-medal rank-${user.rank}">${user.rank}</div>
        </div>
      `;
    }

    // Use default profile image if photoURL is missing
    const photoURL = user.photoURL || "noprofile.jpg";

    row.innerHTML = `
      <td>${rankDisplay}</td>
      <td>
        <div class="player-info">
          <div class="player-avatar">
            <img src="${photoURL}" alt="${
      user.name
    }" onerror="this.src='noprofile.jpg'">
          </div>
          <div>
            <div class="player-name">${user.name}</div>
            <div class="player-email">${user.email || ""}</div>
          </div>
        </div>
      </td>
      <td><div class="race-count">${raceCount}</div></td>
      <td class="points-value">${points}</td>
    `;

    leaderboardBody.appendChild(row);
  });
}

// Update summary statistics
function updateSummaryStats(users) {
  // Total players
  totalPlayers.textContent = users.length;

  // Average score
  const totalScore = users.reduce((sum, user) => sum + user.totalPoints, 0);
  const average = users.length > 0 ? Math.round(totalScore / users.length) : 0;
  avgScore.textContent = average;

  // Top score
  const maxScore = users.length > 0 ? users[0].totalPoints : 0;
  topScore.textContent = maxScore;

  // Your rank
  const currentUser = users.find((user) => user.id === currentUserId);
  yourRank.textContent = currentUser
    ? `${currentUser.rank}/${users.length}`
    : "-";
}

// Update podium
function updatePodium(users) {
  // First place
  if (users.length > 0) {
    const first = users[0];

    firstPlace.querySelector(".podium-name").textContent = first.name;
    firstPlace.querySelector(
      ".podium-score"
    ).textContent = `${first.totalPoints} pts`;
  } else {
    firstPlace.querySelector(".podium-name").textContent = "-";
    firstPlace.querySelector(".podium-score").textContent = "0 pts";
  }

  // Second place
  if (users.length > 1) {
    const second = users[1];

    secondPlace.querySelector(".podium-name").textContent = second.name;
    secondPlace.querySelector(
      ".podium-score"
    ).textContent = `${second.totalPoints} pts`;
  } else {
    secondPlace.querySelector(".podium-name").textContent = "-";
    secondPlace.querySelector(".podium-score").textContent = "0 pts";
  }

  // Third place
  if (users.length > 2) {
    const third = users[2];

    thirdPlace.querySelector(".podium-name").textContent = third.name;
    thirdPlace.querySelector(
      ".podium-score"
    ).textContent = `${third.totalPoints} pts`;
  } else {
    thirdPlace.querySelector(".podium-name").textContent = "-";
    thirdPlace.querySelector(".podium-score").textContent = "0 pts";
  }
}

// Show player detail
function showPlayerDetail(user) {
  // Set basic info

  detailPlayerName.textContent = user.name;
  detailRank.textContent = `${user.rank}/${leaderboardData.length}`;

  // Set stats
  detailTotalPoints.textContent = user.totalPoints;
  detailRaces.textContent = Object.keys(user.races).length;
  detailAvgPoints.textContent =
    Object.keys(user.races).length > 0
      ? Math.round(user.totalPoints / Object.keys(user.races).length)
      : 0;
  detailBestRace.textContent =
    user.bestRace.points > 0 ? user.bestRace.points : "-";

  // Create race performance chart
  createPerformanceChart(user);

  // Create team history
  createTeamHistory(user);

  // Show modal
  playerDetail.style.display = "block";
}

// Create performance chart
function createPerformanceChart(user) {
  // Clear chart
  racePerformance.innerHTML = "";

  // Create chart container
  const chartContainer = document.createElement("div");
  chartContainer.className = "performance-chart";

  // Get race data
  const raceData = [];

  // Get all races where user participated
  Object.keys(user.races).forEach((raceId) => {
    raceData.push({
      id: raceId,
      points: user.races[raceId].points,
      date: user.races[raceId].date,
    });
  });

  // Sort by date
  raceData.sort((a, b) => {
    const dateA = new Date(a.date.split("-").reverse().join("-"));
    const dateB = new Date(b.date.split("-").reverse().join("-"));
    return dateA - dateB;
  });

  // If no race data, show message
  if (raceData.length === 0) {
    const noData = document.createElement("div");
    noData.textContent = "No race data available";
    noData.style.color = "white";
    noData.style.textAlign = "center";
    noData.style.padding = "20px";
    racePerformance.appendChild(noData);
    return;
  }

  // Find max points for scaling
  const maxPoints = Math.max(...raceData.map((race) => race.points));

  // Create bars
  raceData.forEach((race, index) => {
    // Calculate bar height (max 150px)
    const height = maxPoints > 0 ? (race.points / maxPoints) * 150 : 0;

    // Create bar
    const bar = document.createElement("div");
    bar.className = "chart-bar";
    bar.style.height = `${height}px`;
    bar.style.left = `${index * 40 + 20}px`;

    // Create label
    const label = document.createElement("div");
    label.className = "chart-label";
    label.textContent = race.id;
    label.style.left = `${index * 40 + 20}px`;

    // Create value
    const value = document.createElement("div");
    value.className = "chart-value";
    value.textContent = race.points;
    value.style.left = `${index * 40 + 20}px`;

    // Add to chart
    chartContainer.appendChild(bar);
    chartContainer.appendChild(label);
    chartContainer.appendChild(value);
  });

  racePerformance.appendChild(chartContainer);
}

// Create team history
function createTeamHistory(user) {
  // Clear history
  teamHistory.innerHTML = "";

  // Get race data
  const raceData = [];

  // Get all races where user participated
  Object.keys(user.races).forEach((raceId) => {
    raceData.push({
      id: raceId,
      ...user.races[raceId],
    });
  });

  // Sort by date
  raceData.sort((a, b) => {
    const dateA = new Date(a.date.split("-").reverse().join("-"));
    const dateB = new Date(b.date.split("-").reverse().join("-"));
    return dateB - dateA; // Most recent first
  });

  // If no race data, show message
  if (raceData.length === 0) {
    const noData = document.createElement("div");
    noData.textContent = "No team history available";
    noData.style.color = "white";
    noData.style.textAlign = "center";
    noData.style.padding = "20px";
    teamHistory.appendChild(noData);
    return;
  }

  // Get race results
  const raceResults = {};
  allRaces.forEach((race) => {
    if (race.rezultati) {
      raceResults[race.id] = race.rezultati;
    }
  });

  // Create team cards
  raceData.forEach((race) => {
    const teamCard = document.createElement("div");
    teamCard.className = "team-card";

    // Create header
    const header = document.createElement("div");
    header.className = "team-header";
    header.innerHTML = `
      <div>
        <div class="team-race">${race.id}</div>
        <div class="team-date">${formatDate(race.date)}</div>
      </div>
      <div class="team-points">${race.points} pts</div>
    `;

    // Create members container
    const membersContainer = document.createElement("div");
    membersContainer.className = "team-members";

    // Add male team members if available
    if (race.maleTeam) {
      race.maleTeam.forEach((member) => {
        const competitorId = Object.keys(member)[0];
        const competitorName = Object.values(member)[0];
        const competitorType = member.value; // "gold" or "silver"

        // Get competitor's result in this race
        const competitorPoints = raceResults[race.id]?.[competitorName] || 0;

        // Calculate points
        let points = competitorPoints;
        if (competitorType === "silver") {
          points *= 0.5;
        }

        // Create member element
        const memberElement = document.createElement("div");
        memberElement.className = "team-member";
        memberElement.innerHTML = `
          <div class="member-type member-${competitorType}">${
          competitorType === "gold" ? "G" : "S"
        }</div>
          <div class="member-name">${competitorName}</div>
          <div class="member-points">${points} pts</div>
        `;

        membersContainer.appendChild(memberElement);
      });
    }

    // Add female team members if available
    if (race.femaleTeam) {
      race.femaleTeam.forEach((member) => {
        const competitorId = Object.keys(member)[0];
        const competitorName = Object.values(member)[0];
        const competitorType = member.value; // "gold" or "silver"

        // Get competitor's result in this race
        const competitorPoints = raceResults[race.id]?.[competitorName] || 0;

        // Calculate points
        let points = competitorPoints;
        if (competitorType === "silver") {
          points *= 0.5;
        }

        // Create member element
        const memberElement = document.createElement("div");
        memberElement.className = "team-member";
        memberElement.innerHTML = `
          <div class="member-type member-${competitorType}">${
          competitorType === "gold" ? "G" : "S"
        }</div>
          <div class="member-name">${competitorName}</div>
          <div class="member-points">${points} pts</div>
        `;

        membersContainer.appendChild(memberElement);
      });
    }

    // Add to card
    teamCard.appendChild(header);
    teamCard.appendChild(membersContainer);

    // Add to history
    teamHistory.appendChild(teamCard);
  });
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
