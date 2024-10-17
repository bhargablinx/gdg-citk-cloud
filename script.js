// Helper function to parse CSV file into an array of objects
const parseCSV = async (url) => {
    const response = await fetch(url);
    const csvText = await response.text();
    
    const rows = csvText.split("\n");
    const headers = rows[0].split(","); // Get the headers from the first row
  
    const data = rows.slice(1).map(row => {
      const values = row.split(",");
      let obj = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = values[index].trim();
      });
      return obj;
    });
  
    return data;
  };
  
  // Comparator functions for sorting
  function compareCourses(a, b) {
    if (parseInt(a["# of Courses Completed"]) > parseInt(b["# of Courses Completed"])) {
      return -1;
    }
    if (parseInt(a["# of Courses Completed"]) < parseInt(b["# of Courses Completed"])) {
      return 1;
    }
    return 0;
  }
  
  function compareGenGames(a, b) {
    if (parseInt(a["# of GenAI Game Completed"]) > parseInt(b["# of GenAI Game Completed"])) {
      return -1;
    }
    if (parseInt(a["# of GenAI Game Completed"]) < parseInt(b["# of GenAI Game Completed"])) {
      return 1;
    }
    return 0;
  }
  
  // Function to update the table based on CSV data
  const updateData = async (filter) => {
    // Fetch and parse the CSV data
    let data = await parseCSV("./data.csv");
    let total_started = 0;
  
    // Filter data if filter is applied
    if (filter !== "") {
      data = data.filter((el) => {
        return el["Student Name"].toLowerCase().includes(filter.toLowerCase());
      });
    }
  
    // Sort data
    data.sort(compareCourses);
    data.sort(compareGenGames);
  
    let total_reg = data.length;
    let html = "";
    
    // Generate HTML for table rows
    data.forEach((d, i) => {
      total_started += d["Redemption Status"] === "Yes" ? 1 : 0;
      html += `<tr>
                  <th>${i + 1}</th>
                  <td><a href="${d["Google Cloud Skills Boost Profile URL"]}" target="_blank" style="color:black;">${d["Student Name"]}</a></td>
                  <td>${d["Redemption Status"] === "Yes" ? "✅" : "⚠️"}</td>
                  <td>${d["# of Courses Completed"]}</td>
                  <td>${d["# of Skill Badges Completed"]}</td>
                  <td>${d["# of GenAI Game Completed"]}</td>
                  <td>${d["Total Completions of both Pathways"]}</td>
               </tr>`;
    });
  
    // Insert generated rows into the table body
    document.getElementById("gccp_body").innerHTML = html;
  };
  
  // Initialize table data without any filters
  updateData("");
  
  // Search functionality to filter data
  const input = document.getElementById("input");
  input.addEventListener("input", () => {
    updateData(input.value); // Call updateData with the search filter
  });
  