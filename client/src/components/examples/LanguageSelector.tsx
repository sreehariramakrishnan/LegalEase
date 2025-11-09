import { LanguageSelector } from "../LanguageSelector";
import { useState } from "react";

export default function LanguageSelectorExample() {
  const [language, setLanguage] = useState("en");
  return (
    <div className="p-8">
      <LanguageSelector value={language} onValueChange={setLanguage} />
    </div>
  );
}
