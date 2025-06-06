"use client";

import React, { createContext, useContext, useState } from "react";

const CompanyContext = createContext<any>(null);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [companyName, setCompanyName] = useState(
    () => localStorage.getItem("companyName") || "Company Logo"
  );
  const [companyLogo, setCompanyLogo] = useState(
    () => localStorage.getItem("companyLogo") || ""
  );

  // Update localStorage when changed
  const updateCompany = (name: string, logo: string) => {
    setCompanyName(name);
    setCompanyLogo(logo);
    localStorage.setItem("companyName", name);
    localStorage.setItem("companyLogo", logo);
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