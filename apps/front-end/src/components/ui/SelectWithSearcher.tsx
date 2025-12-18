"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";

interface SelectWithSearcherProps<T> {
  data: T[];
  property: keyof T; // The key to display in the list
  selectedItem: T | null;
  setSelectedItem: (item: T) => void;
  placeholder?: string;
  className?: string;
  onClear?: () => void;
}

export function SelectWithSearcher<T>({
  data,
  property,
  selectedItem,
  setSelectedItem,
  placeholder = "Seleccionar...",
  className = "",
  onClear,
}: SelectWithSearcherProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((item) => {
      const value = item[property];
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [data, searchTerm, property]);

  const handleSelect = (item: T) => {
    setSelectedItem(item);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full px-4 py-3 
          bg-white rounded-xl shadow-md border border-gray-100
          text-left transition-all duration-200
          hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#e85e25]/20
          ${isOpen ? "ring-2 ring-[#e85e25]/20 border-[#e85e25]" : ""}
        `}
      >
        <span
          className={`block truncate ${selectedItem ? "text-[#333333]" : "text-gray-400"}`}
        >
          {selectedItem ? String(selectedItem[property]) : placeholder}
        </span>
        <div className="flex items-center gap-2">
          {selectedItem && onClear && (
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </div>
          )}
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 rounded-lg outline-none focus:bg-gray-100 transition-colors text-[#333333]"
                autoFocus
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto overflow-x-hidden">
            {filteredData.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No se encontraron resultados
              </div>
            ) : (
              <ul>
                {filteredData.map((item, index) => {
                  const isSelected = selectedItem === item; // Simple reference check, might need better comparison if objects are recreated
                  return (
                    <li
                      key={index}
                      onClick={() => handleSelect(item)}
                      className={`
                        px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150 flex items-center justify-between
                        ${isSelected ? "bg-[#e85e25]/10 text-[#e85e25] font-medium" : "text-[#333333] hover:bg-gray-50"}
                      `}
                    >
                      <span className="truncate mr-2">
                        {String(item[property])}
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#e85e25]" />
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
