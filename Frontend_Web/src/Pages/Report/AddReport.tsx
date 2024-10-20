import { useState, useRef  } from "react";
import { Typography, Button } from "@material-tailwind/react"; 
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "@/storage/firebase"; // Your Firebase config
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { isWithinInterval, format } from 'date-fns'; // Importing necessary functions
import "jspdf-autotable"; // Importing jsPDF AutoTable plugin
import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"; // For chart rendering
import html2canvas from "html2canvas"; // For capturing charts as images

export const CreateReportForm = () => {
  const chartContainerRef = useRef(null); // Create a ref
  const [formData, setFormData] = useState({
    reportName: "",
    reportType: "",
    description: "",
    reportFormat: "PDF",
    reportView: "Table", // Default view is Table
    fromDate: "",
    toDate: "",
  });

  const [reportData, setReportData] = useState([]);
  const [chartData, setChartData] = useState(null); // State to hold chart data

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        categories: {
          ...prevData.categories,
          [id]: checked,
        },
      }));
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let fetchedData = [];
    switch (formData.reportType) {
      case "Waste Collection Summary Reports":
        fetchedData = await fetchWasteCollectionData();
        break;
      case "Route Optimization Reports":
        fetchedData = await fetchRouteOptimizationData();
        break;
      case "Waste Generation Trends":
        fetchedData = await fetchWasteTrendsData();
        break;
      case "Recyclable Waste Collection Reports":
        fetchedData = await fetchRecyclableWasteData();
        break;
      case "Account and Payment Reports":
        fetchedData = await fetchAccountPaymentData();
        break;
      default:
        console.error("Invalid report type");
        return;
    }
    
    setReportData(fetchedData); // Store the data in state for rendering
    // Prepare chart data for rendering if the view is Chart or Graph
    if (formData.reportView === "Chart" || formData.reportView === "Graph") {
      setChartData(fetchedData); // Set chart data to state
    }
    generateReport(formData.reportFormat, fetchedData, formData.reportName, formData.reportView);
  };

  const reportConfig = {
   "Waste Collection Summary Reports": {
  fields: [
    { key: "address", label: "Location" },
    { key: "wasteWeight", label: "Waste Amount (kg)" },
    { key: "userEmail", label: "User Email" },
    { key: "collectorName", label: "Collector Name" }, // Added collector name
    { key: "binType", label: "Bin Type" }, // Added bin type
    { key: "wasteType", label: "Waste Type" } // Added waste type
  ],
  summaryField: "wasteWeight",
  summaryText: "Total Waste Collected"
},

    "Route Optimization Reports": {
      fields: [
        { key: "routeName", label: "Route Name" },
        { key: "optimalTime", label: "Optimal Time" }
      ],
      summaryField: null, // No total calculation needed
      summaryText: null
    },
    "Waste Generation Trends": {
      fields: [
        { key: "date", label: "Date" },
        { key: "wasteGenerated", label: "Waste Generated (kg)" }
      ],
      summaryField: "wasteGenerated",
      summaryText: "Total Waste Generated"
    },
    "Recyclable Waste Collection Reports": {
      fields: [
        { key: "recyclableType", label: "Recyclable Type" },
        { key: "amountCollected", label: "Amount Collected (kg)" }
      ],
      summaryField: "amountCollected",
      summaryText: "Total Recyclable Collected"
    },
    "Account and Payment Reports": {
      fields: [
        { key: "paymentID", label: "Payment ID" },
        { key: "amount", label: "Amount" },
        { key: "status", label: "Status" },
        { key: "userEmail", label: "User Email" }
      ],
      summaryField: "amount",
      summaryText: "Total Amount Earned"
    }
  };
  
  
  const fetchWasteCollectionData = async () => {
    const fromDate = new Date(formData.fromDate);
    const toDate = new Date(formData.toDate);
  
    const q = query(
      collection(db, "wasteCollection"),
      where("collectedAt", ">=", fromDate),
      where("collectedAt", "<=", toDate)
    );
  
    const querySnapshot = await getDocs(q);
    let collectorData = {};
  
    console.log("Query Snapshot Size:", querySnapshot.size); // Log the number of documents retrieved
  
    querySnapshot.forEach((doc) => {
      const wasteData = doc.data();
      console.log("Document Data:", wasteData); // Log the entire document data
  
      if (wasteData && wasteData.collectorname && wasteData.wasteWeight) {
        const collectorName = wasteData.collectorname;
        const wasteWeight = wasteData.wasteWeight;
  
        // Aggregate waste weight by collector
        if (collectorData[collectorName]) {
          collectorData[collectorName] += wasteWeight;
        } else {
          collectorData[collectorName] = wasteWeight;
        }
      } else {
        console.warn("No valid data for document:", doc.id);
      }
    });
  
    const result = Object.entries(collectorData).map(([collectorName, totalWaste]) => ({
      collectorName,
      totalWasteCollected: totalWaste,
    }));
  
    console.log("Retrieved Collector Data:", result); // Log the aggregated data
    return result;
  };
  
  
  
  

  const fetchRouteOptimizationData = async () => {
    const q = query(
      collection(db, "routeCollection"),
      where("timestamp", ">=", formData.fromDate),
      where("timestamp", "<=", formData.toDate)
    );
    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    return data;
  };

  const fetchWasteTrendsData = async () => {
    const q = query(
      collection(db, "wasteTrends"),
      where("timestamp", ">=", formData.fromDate),
      where("timestamp", "<=", formData.toDate)
    );
    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    return data;
  };

  const fetchRecyclableWasteData = async () => {
    const q = query(
      collection(db, "recyclableWaste"),
      where("timestamp", ">=", formData.fromDate),
      where("timestamp", "<=", formData.toDate)
    );
    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    return data;
    
  };

  

  const fetchAccountPaymentData = async () => {
    // Convert user input dates (YYYY-MM-DD) to JavaScript Date objects
    const fromDate = new Date(formData.fromDate);
    const toDate = new Date(formData.toDate);
  
    const q = query(
      collection(db, "payments"),
      where("status", "==", "Success") // Filter by status "Success"
    );
    const querySnapshot = await getDocs(q);
    let data = [];
  
    // Loop through each payment document
    for (const docSnapshot of querySnapshot.docs) {
      const paymentData = docSnapshot.data();
  
      // Convert Firestore timestamp to a JavaScript Date object
      const paymentDate = paymentData.date.toDate(); // Convert Firestore timestamp to Date
  
      // Check if paymentDate is within the specified range
      if (isWithinInterval(paymentDate, { start: fromDate, end: toDate })) {
        // Fetch the referred user's email
        const userRef = paymentData.userID; // Firestore document reference for user
        const userDoc = await getDoc(userRef); // Get user document
        if (userDoc.exists()) {
          const userData = userDoc.data();
          paymentData.userEmail = userData.email; // Add user email to payment data
        } else {
          paymentData.userEmail = "User not found"; // Handle missing user
        }
  
        data.push(paymentData);
      }
    }
  
    console.log(data); // Display filtered data with user email
    return data;
  };
  
  

   const generateReport = (format, data, reportName, reportView) => {
    if (format === "PDF") {
      generatePDFReport(data, reportName, reportView);
    } else if (format === "XLSX") {
      generateXLSXReport(data, reportName);
    } else if (format === "CSV") {
      generateCSVReport(data, reportName);
    }
  };

  const generatePDFReport = async (data, reportName, reportView) => {
    const doc = new jsPDF();
    
    // Set the title
    doc.setFontSize(16);
    doc.text(`Report: ${reportName}`, 10, 10);

     // Add description below the title
  doc.setFontSize(12);
  doc.text(`Description: ${formData.description}`, 10, 20); // Adjusted position for description

  let startY = 30; // Set the starting Y position for the rest of the content

    if (reportView === "Table") {
      // Get the configuration for the selected report type
      const reportConfigForType = reportConfig[formData.reportType];

      if (!reportConfigForType) {
        console.error("Invalid report type or missing configuration.");
        return;
      }

      // Prepare the table data and calculate the summary (if applicable)
      let summaryTotal = 0;
      const tableData = data.map((item) => {
        const rowData = [];
        reportConfigForType.fields.forEach((field) => {
          if (field.key === "date") {
            rowData.push(format(item.date.toDate(), "yyyy-MM-dd")); // Format date without time
          } else {
            rowData.push(item[field.key] || "N/A"); // Get field value or 'N/A' if missing
          }
        });

        // If the report type has a summary field, accumulate the total for that field
        if (reportConfigForType.summaryField) {
          const summaryValue = parseFloat(item[reportConfigForType.summaryField]) || 0;
          summaryTotal += summaryValue;
        }

        return rowData;
      });

      // Create the table headers
      const tableHeaders = reportConfigForType.fields.map(field => field.label);

      // Create the table using autoTable
      doc.autoTable({
        head: [tableHeaders],
        body: tableData,
        startY, // Start after the title
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 0] }, // Black header
        styles: { halign: 'center' }, // Center-align text
      });

      // If there's a summary text, display the total at the end of the table
      if (reportConfigForType.summaryText) {
        doc.setFontSize(12);
        doc.text(
          `${reportConfigForType.summaryText}: ${summaryTotal.toFixed(2)}`, 
          10, 
          doc.lastAutoTable.finalY + 10
        ); // Display total under the table
      }
    } else {
      if (reportView === "Chart" || reportView === "Graph") {
        // Ensure the ref is not null before calling html2canvas
        if (chartContainerRef && chartContainerRef.current) {
          await html2canvas(chartContainerRef.current).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            
            
doc.addImage(imgData, "PNG", 10, startY + 20, 180, 160);

          }).catch(error => {
            console.error("Error generating canvas from chart:", error);
          });
        } else {
          console.error("Chart container reference is invalid or not available.");
        }
        
      }
    }

    // Save the generated PDF
    doc.save(`${reportName}.pdf`);
  };


  const generateXLSXReport = (data, reportName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${reportName}.xlsx`);
  };

  const generateCSVReport = (data, reportName) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${reportName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render a table view using Recharts
  const ChartView = ({ data }) => (
    <BarChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="paymentID" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="amount" fill="#8884d8" />
    </BarChart>
  );

  // Render a graph view using Recharts
  const GraphView = ({ data }) => (
    <LineChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="paymentID" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="amount" stroke="#8884d8" />
    </LineChart>
  );

   return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <Typography variant="h5" color="blue-gray" className="mb-1">
          Add New Report
        </Typography>
      </div>
      <div className="p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Form inputs for report details (same as before) */}
          <div className="space-y-2">
            <Typography variant="small" className="font-normal text-blue-gray-600">Report Name</Typography>
            <input
              type="text"
              id="reportName"
              value={formData.reportName}
              onChange={handleInputChange}
              placeholder="Enter report name"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <Typography variant="small" className="font-normal text-blue-gray-600">Report Type</Typography>
            <select
              id="reportType"
              value={formData.reportType}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select report type</option>
              <option value="Waste Collection Summary Reports">Waste Collection Summary Reports</option>
              <option value="Route Optimization Reports">Route Optimization Reports</option>
              <option value="Waste Generation Trends">Waste Generation Trends</option>
              <option value="Recyclable Waste Collection Reports">Recyclable Waste Collection Reports</option>
              <option value="Account and Payment Reports">Account and Payment Reports</option>
            </select>
          </div>

          <div className="space-y-2">
            <Typography variant="small" className="font-normal text-blue-gray-600">Description</Typography>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <Typography variant="small" className="font-normal text-blue-gray-600">Report Format</Typography>
            <select
              id="reportFormat"
              value={formData.reportFormat}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="PDF">PDF</option>
              <option value="XLSX">XLSX</option>
              <option value="CSV">CSV</option>
            </select>
          </div>

          <div className="space-y-2">
            <Typography variant="small" className="font-normal text-blue-gray-600">Report View</Typography>
            <select
              id="reportView"
              value={formData.reportView}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="Table">Table</option>
              <option value="Chart">Chart</option>
              <option value="Graph">Graph</option>
            </select>
          </div>

          {/* Date inputs */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <Typography variant="small" className="font-normal text-blue-gray-600">From Date</Typography>
              <input
                type="date"
                id="fromDate"
                value={formData.fromDate}
                onChange={handleInputChange}
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div className="flex-1">
              <Typography variant="small" className="font-normal text-blue-gray-600">To Date</Typography>
              <input
                type="date"
                id="toDate"
                value={formData.toDate}
                onChange={handleInputChange}
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>

          <Button type="submit" variant="gradient">Generate Report</Button>
        </form>

        <div ref={chartContainerRef}>
  {formData.reportView === "Chart" && <ChartView data={chartData} />}
  {formData.reportView === "Graph" && <GraphView data={chartData} />}
</div>
      </div>
    </div>
  );
};