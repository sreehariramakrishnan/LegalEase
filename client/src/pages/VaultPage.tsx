import { DocumentVault } from "@/components/DocumentVault";
import { Shield, Lock, Key } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function VaultPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Secure Document Vault</h1>
        <p className="text-muted-foreground">
          Your legal documents encrypted with AES-256 client-side encryption
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-sm">Zero-Knowledge</p>
              <p className="text-xs text-muted-foreground">Only you have the keys</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-sm">AES-256 Encrypted</p>
              <p className="text-xs text-muted-foreground">Military-grade security</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Key className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-sm">Client-Side</p>
              <p className="text-xs text-muted-foreground">Encrypted before upload</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <DocumentVault />
    </div>
  );
}
