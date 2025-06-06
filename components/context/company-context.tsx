"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CompanyContext = createContext<any>(null);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [companyName, setCompanyName] = useState("Company Logo");
  const [companyLogo, setCompanyLogo] = useState("");

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("companyName");
      const storedLogo = localStorage.getItem("companyLogo");
      if (storedName) setCompanyName(storedName);
      if (storedLogo) setCompanyLogo(storedLogo);
    }
  }, []);

  // Update localStorage when changed
  const updateCompany = (name: string, logo: string) => {
    setCompanyName(name);
    setCompanyLogo(logo);
    if (typeof window !== "undefined") {
      localStorage.setItem("companyName", name);
      localStorage.setItem("companyLogo", logo);
    }
  };

  return (
    <CompanyContext.Provider value={{ companyName, companyLogo, updateCompany }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  return useContext(CompanyContext);
}