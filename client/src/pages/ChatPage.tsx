import { ChatInterface } from "@/components/ChatInterface";
import { CountrySelector } from "@/components/CountrySelector";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, FileText } from "lucide-react";
import { useState } from "react";

export default function ChatPage() {
  const [country, setCountry] = useState("IN");
  const [language, setLanguage] = useState("en");

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-chart-2" />
              AI Legal Assistant
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Powered by Gemini 2.5 Flash with country-specific legal knowledge
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CountrySelector value={country} onValueChange={setCountry} />
            <LanguageSelector value={language} onValueChange={setLanguage} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover-elevate transition-all duration-300">
            <CardHeader className="p-4">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="secondary" onClick={() => console.log("Summarize clicked")} data-testid="button-quick-summarize">
                  <FileText className="h-3.5 w-3.5 mr-1" />
                  Summarize Document
                </Button>
                <Button size="sm" variant="secondary" onClick={() => console.log("Explain clicked")} data-testid="button-quick-explain">
                  Explain Clause
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover-elevate transition-all duration-300">
            <CardHeader className="p-4">
              <CardTitle className="text-sm">Context</CardTitle>
              <CardDescription className="text-xs mt-1">
                Currently configured for {country === "IN" ? "Indian" : country} legal system in{" "}
                {language === "en" ? "English" : language}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ChatInterface country={country} language={language} />
      </div>
    </div>
  );
}
