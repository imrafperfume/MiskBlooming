"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Eye,
  RefreshCw,
} from "lucide-react";
import { Button } from "../../../../components/ui/Button";

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedReport, setSelectedReport] = useState("sales");

  const reportTypes = [
    {
      id: "sales",
      name: "Sales Report",
      description: "Revenue, orders, and sales performance",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: "products",
      name: "Product Performance",
      description: "Best sellers, inventory, and product analytics",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "customers",
      name: "Customer Analytics",
      description: "Customer behavior, retention, and demographics",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "orders",
      name: "Order Analytics",
      description: "Order trends, fulfillment, and delivery metrics",
      icon: ShoppingCart,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const quickReports = [
    {
      name: "Daily Sales Summary",
      lastGenerated: "2024-01-15",
      size: "2.3 MB",
    },
    {
      name: "Weekly Product Performance",
      lastGenerated: "2024-01-14",
      size: "1.8 MB",
    },
    {
      name: "Monthly Customer Report",
      lastGenerated: "2024-01-13",
      size: "3.1 MB",
    },
    {
      name: "Quarterly Financial Summary",
      lastGenerated: "2024-01-12",
      size: "4.2 MB",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-cormorant font-bold text-foreground ">
            Business Reports
          </h1>
          <p className="text-foreground  mt-2">
            Generate comprehensive business reports and analytics
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="luxury">
            <Download className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes.map((report, index) => (
          <motion.div
            key={report.id}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
              selectedReport === report.id
                ? "border-luxury-300 bg-foreground "
                : "border-border  bg-background hover:border-gray-300"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onClick={() => setSelectedReport(report.id)}
          >
            <div className={`p-3 rounded-xl ${report.bgColor} mb-4 w-fit`}>
              <report.icon className={`w-6 h-6 ${report.color}`} />
            </div>
            <h3 className="font-semibold text-foreground  mb-2">
              {report.name}
            </h3>
            <p className="text-sm text-foreground ">{report.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Report Configuration */}
      <motion.div
        className="bg-background rounded-2xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold text-foreground  mb-6">
          Report Configuration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format
            </label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent">
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Include
            </label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent">
              <option value="summary">Summary Only</option>
              <option value="detailed">Detailed Data</option>
              <option value="charts">With Charts</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
          </div>
          <Button variant="luxury">
            <Download className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </motion.div>

      {/* Quick Reports */}
      <motion.div
        className="bg-background rounded-2xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-foreground  mb-6">
          Recent Reports
        </h2>
        <div className="space-y-4">
          {quickReports.map((report, index) => (
            <div
              key={report.name}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-gray-100">
                  <FileText className="w-5 h-5 text-foreground " />
                </div>
                <div>
                  <h3 className="font-medium text-foreground ">
                    {report.name}
                  </h3>
                  <p className="text-sm text-foreground ">
                    Generated on{" "}
                    {new Date(report.lastGenerated).toLocaleDateString()} •{" "}
                    {report.size}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Report Preview */}
      <motion.div
        className="bg-background rounded-2xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-foreground  mb-6">
          Report Preview
        </h2>
        <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Report Preview
            </h3>
            <p className="text-foreground  mb-4">
              Select report type and configure options to see preview
            </p>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Generate Preview
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
