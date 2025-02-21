import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { unitsPerKw, exportRate } from "../utils/constants";
import { BoltIcon, SunIcon, CurrencyDollarIcon, HomeIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import jsPDF from "jspdf"; // For PDF export

const SolarCalculator = () => {
  // Input states
  const [monthlyConsumption, setMonthlyConsumption] = useState("");
  const [propertyType, setPropertyType] = useState("House (Single Phase Electricity Supply)");
  const [error, setError] = useState("");

  // Recommended systems for each property type
  const recommendedSystems = {
    "House (Single Phase Electricity Supply)": [3, 5, 7, 10, 15, 20],
    "House (Three Phase Electricity Supply)": [5, 7, 10, 15, 20, 25, 30, 40],
    "Business (Single Phase Electricity Supply)": [5, 7, 10, 15, 20, 25, 30, 40],
    "Business (Three Phase Electricity Supply)": [5, 7, 10, 15, 20, 25, 30, 40, 100],
    "Business (Bulk Supply)": [40, 100, 200, 300, 500, 1000],
  };

  // Calculate minimum system size
  const minSystemSize = monthlyConsumption / unitsPerKw;

  // Filter recommended systems based on minimum size
  const filteredSystems = monthlyConsumption > 0
    ? recommendedSystems[propertyType].filter((size) => size >= minSystemSize)
    : [];

  // Calculate financial benefit
  const calculateFinancialBenefit = (systemSize, months) => {
    const unitsGenerated = systemSize * unitsPerKw * months;
    const income = (unitsGenerated - monthlyConsumption * months) * exportRate;
    return income > 0 ? income : 0;
  };

  // Handle export to PDF
  const handleExportPDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Solar Calculator Results", 10, 10);

    pdf.setFontSize(12);
    let yPosition = 20;

    // Add input details
    pdf.text(`Monthly Consumption: ${monthlyConsumption} Units`, 10, yPosition);
    yPosition += 10;
    pdf.text(`Property Type: ${propertyType}`, 10, yPosition);
    yPosition += 20;

    // Add recommended systems
    pdf.text("Recommended Systems and Benefits:", 10, yPosition);
    yPosition += 10;

    filteredSystems.forEach((size, index) => {
      const monthlyBenefit = calculateFinancialBenefit(size, 1);
      const benefit6Months = calculateFinancialBenefit(size, 6);
      const yearlyBenefit = calculateFinancialBenefit(size, 12);

      pdf.text(`${size} kW System:`, 15, yPosition);
      yPosition += 10;
      pdf.text(`- Monthly Benefit: Rs. ${monthlyBenefit}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`- 6-Month Benefit: Rs. ${benefit6Months}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`- Yearly Benefit: Rs. ${yearlyBenefit}`, 20, yPosition);
      yPosition += 10;
    });

    // Save the PDF
    pdf.save("solar_calculator_results.pdf");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center"
        >
          <SunIcon className="w-8 h-8 mr-2 text-yellow-500" />
          Solar Calculator
        </motion.h1>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {/* Monthly Consumption Input */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700">Monthly Electricity Consumption (Units):</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                value={monthlyConsumption}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value >= 0) {
                    setMonthlyConsumption(value);
                    setError("");
                  } else {
                    setError("Monthly consumption must be greater than 0.");
                  }
                }}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter monthly consumption"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BoltIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </motion.div>

          {/* Property Type Dropdown */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700">Property Type:</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer"
              >
                <option>House (Single Phase Electricity Supply)</option>
                <option>House (Three Phase Electricity Supply)</option>
                <option>Business (Single Phase Electricity Supply)</option>
                <option>Business (Three Phase Electricity Supply)</option>
                <option>Business (Bulk Supply)</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {propertyType.includes("House") ? (
                  <HomeIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          </motion.div>

          {/* Recommended Systems */}
          {monthlyConsumption > 0 ? (
            filteredSystems.length > 0 ? (
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Systems</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {filteredSystems.map((size) => {
                      const monthlyBenefit = calculateFinancialBenefit(size, 1);
                      const benefit6Months = calculateFinancialBenefit(size, 6);
                      const yearlyBenefit = calculateFinancialBenefit(size, 12);

                      return (
                        <motion.div
                          key={size}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="bg-gray-100 p-4 rounded-lg shadow-sm"
                        >
                          <h3 className="text-lg font-bold text-gray-800 flex items-center">
                            <SunIcon className="w-5 h-5 mr-2 text-yellow-500" />
                            {size} kW System
                          </h3>
                          <ul className="mt-2 space-y-2 text-sm text-gray-600">
                            <li className="flex items-center">
                              <CurrencyDollarIcon className="w-4 h-4 mr-2 text-green-500" />
                              <span>Monthly Benefit: Rs. {monthlyBenefit}</span>
                            </li>
                            <li className="flex items-center">
                              <CurrencyDollarIcon className="w-4 h-4 mr-2 text-green-500" />
                              <span>6-Month Benefit: Rs. {benefit6Months}</span>
                            </li>
                            <li className="flex items-center">
                              <CurrencyDollarIcon className="w-4 h-4 mr-2 text-green-500" />
                              <span>Yearly Benefit: Rs. {yearlyBenefit}</span>
                            </li>
                          </ul>
                          {/* Electricity Bill: Zero */}
                          <div className="mt-4 text-sm text-gray-600">
                            <CurrencyDollarIcon className="w-4 h-4 mr-2 text-green-500 inline" />
                            <span>Electricity Bill: Zero</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="text-center text-gray-600"
              >
                <p>No recommended systems found for your input.</p>
              </motion.div>
            )
          ) : null}

          {/* Export Results Button */}
          {monthlyConsumption > 0 && filteredSystems.length > 0 && (
            <motion.div variants={itemVariants} className="flex justify-center mt-6">
              <button
                onClick={handleExportPDF}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
              >
                <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                Export Results as PDF
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SolarCalculator;