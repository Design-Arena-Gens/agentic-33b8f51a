"use client";
import React from "react";

type Language = "javascript" | "python" | "vb" | "pascal";

export default function CodeExample({
  language,
  code,
}: {
  language: Language;
  code: string;
}) {
  const label: Record<Language, string> = {
    javascript: "JavaScript (do...while)",
    python: "Python (?????? do...until)",
    vb: "VB (Do...Until)",
    pascal: "Pascal (repeat...until)",
  };

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span className="badge">{label[language]}</span>
      </div>
      <pre className="code" dir="ltr">{code}</pre>
    </div>
  );
}
