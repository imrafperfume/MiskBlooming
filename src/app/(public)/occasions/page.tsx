"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Grid3X3, List, ChevronDown } from "lucide-react";
import { Button } from "../../../components/ui/Button";

type Occasion = {
  id: number;
  name: string;
  description: string;
  category: string;
};

const initialOccasions: Occasion[] = [
  {
    id: 1,
    name: "Birthday",
    description: "Celebrate birthdays with joy!",
    category: "Celebration",
  },
  {
    id: 2,
    name: "Anniversary",
    description: "Mark your special day.",
    category: "Romantic",
  },
  {
    id: 3,
    name: "Graduation",
    description: "Congratulate achievements.",
    category: "Achievement",
  },
  {
    id: 4,
    name: "Wedding",
    description: "Celebrate love and union.",
    category: "Romantic",
  },
];

export default function OccasionsPage() {
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    // Simulate fetching occasions
    setOccasions(initialOccasions);
  }, []);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Celebration", label: "Celebration" },
    { value: "Romantic", label: "Romantic" },
    { value: "Achievement", label: "Achievement" },
  ];

  const sortOptions = [
    { value: "name", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
  ];

  const filteredAndSortedOccasions = useMemo(() => {
    let filtered = occasions;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((occasion) =>
        occasion.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (occasion) => occasion.category === selectedCategory
      );
    }

    // Sort occasions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [occasions, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen mt-10 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-cormorant text-4xl md:text-5xl font-bold text-primary  mb-4">
            Occasions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore occasions to celebrate with joy and love.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-background rounded-2xl p-6 shadow">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search occasions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-border  rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4 items-center">
                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none bg-background border border-border  rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>

                {/* Sort Filter */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-background border border-border  rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {filteredAndSortedOccasions.length} occasions found
                </span>
                <div className="flex items-center border border-border  rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-foreground 0 text-foreground "
                        : "text-muted-foreground hover:text-foreground "
                    } transition-colors`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-foreground 0 text-foreground "
                        : "text-muted-foreground hover:text-foreground "
                    } transition-colors`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Occasions Grid/List */}
        <motion.div
          className={`grid gap-8 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filteredAndSortedOccasions.map((occasion) => (
            <div
              key={occasion.id}
              className="bg-background rounded-2xl p-6 shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-lg text-primary  mb-2">
                {occasion.name}
              </h3>
              <p className="text-muted-foreground">{occasion.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
