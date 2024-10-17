function compareCombined(a, b) {
  const courseComparison = b["# of Skill Badges Completed"] - a["# of Skill Badges Completed"];
  if (courseComparison !== 0) return courseComparison;
  return b["# of Arcade Games Completed"] - a["# of Arcade Games Completed"];
}

const updateData = async (filter) => {
  try {
      let response = await fetch("./Central Institute of Technology - Kokrajhar, India [15 Oct].csv");
      let text = await response.text();
      let data = Papa.parse(text, { header: true }).data;

      let total_started = 0;

      if (filter !== "") {
          data = data.filter((el) => {
              return el["User Name"].toLowerCase().includes(filter.toLowerCase());
          });
      }

      data.sort(compareCombined);

      let total_reg = data.length;
      let html = "";

      data.forEach((d, i) => {
          const skillBadgesCompleted = parseInt(d["# of Skill Badges Completed"], 10) || 0;
          const arcadeGamesCompleted = parseInt(d["# of Arcade Games Completed"], 10) || 0;
          const totalCompletions = skillBadgesCompleted + arcadeGamesCompleted;

          total_started += d["Access Code Redemption Status"] === "Yes" ? 1 : 0;
          html += `<tr>
                      <th>${i + 1}</th>
                      <td><a href="${d["Google Cloud Skills Boost Profile URL"]}" target="_blank" style="color:black;">${d["User Name"]}</a></td>
                      <td>${d["Access Code Redemption Status"] === "Yes" ? "✅" : "⚠️"}</td>
                      <td>${skillBadgesCompleted}</td>
                      <td>${arcadeGamesCompleted}</td>
                   </tr>`;
      });

      document.getElementById("gccp_body").innerHTML = html;
  } catch (error) {
      console.error("Error fetching or processing data:", error);
  }
};

updateData("");

const input = document.getElementById("input");
input.addEventListener("input", () => {
  console.log(input.value);
  updateData(input.value);
});