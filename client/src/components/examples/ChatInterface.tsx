import { ChatInterface } from "../ChatInterface";

export default function ChatInterfaceExample() {
  return (
    <div className="h-[600px] max-w-4xl mx-auto p-8">
      <div className="h-full border rounded-lg overflow-hidden">
        <ChatInterface country="IN" language="en" />
      </div>
    </div>
  );
}
