export const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      alert("No data to export!");
      return;
    }
  
    const csvHeader = Object.keys(data[0]).join(",") + "\n";
    const csvRows = data.map(row => Object.values(row).join(",")).join("\n");
  
    const csvContent = "data:text/csv;charset=utf-8," + csvHeader + csvRows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  