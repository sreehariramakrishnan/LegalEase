import { CountrySelector } from "../CountrySelector";
import { useState } from "react";

export default function CountrySelectorExample() {
  const [country, setCountry] = useState("IN");
  return (
    <div className="p-8">
      <CountrySelector value={country} onValueChange={setCountry} />
    </div>
  );
}
