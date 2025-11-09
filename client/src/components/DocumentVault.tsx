import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Upload,
  Download,
  Lock,
  Search,
  File,
  FileImage,
  FileSpreadsheet,
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: Date;
  encrypted: boolean;
}

export function DocumentVault() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  //todo: remove mock functionality
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Property_Deed.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadDate: new Date("2024-01-15"),
      encrypted: true,
    },
    {
      id: "2",
      name: "Will_Testament.pdf",
      type: "pdf",
      size: "1.8 MB",
      uploadDate: new Date("2024-02-20"),
      encrypted: true,
    },
    {
      id: "3",
      name: "Contract_Agreement.docx",
      type: "docx",
      size: "856 KB",
      uploadDate: new Date("2024-03-10"),
      encrypted: true,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-8 w-8 text-red-500" />;
      case "docx":
        return <File className="h-8 w-8 text-blue-500" />;
      case "jpg":
      case "png":
        return <FileImage className="h-8 w-8 text-green-500" />;
      case "xlsx":
        return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
      default:
        return <File className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'file';
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      
      const newDocument: Document = {
        id: Date.now().toString() + Math.random().toString(),
        name: file.name,
        type: fileExtension,
        size: `${fileSizeInMB} MB`,
        uploadDate: new Date(),
        encrypted: true,
      };

      setDocuments((prev) => [newDocument, ...prev]);
      
      toast({
        title: "Document Uploaded",
        description: `${file.name} has been encrypted and uploaded successfully.`,
      });
    });

    // Reset the input
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
      />
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-documents"
          />
        </div>
        <Button onClick={handleUpload} data-testid="button-upload-document">
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <Card className="border-dashed border-2 hover-elevate transition-all duration-300">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Drag & Drop Files</h3>
          <p className="text-sm text-muted-foreground mb-4">
            or click to browse
          </p>
          <Button onClick={handleUpload} data-testid="button-browse-files">Browse Files</Button>
          <div className="flex items-center gap-2 mt-4">
            <Lock className="h-4 w-4 text-green-500" />
            <span className="text-xs text-muted-foreground">
              AES-256 encrypted before upload
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <Card key={doc.id} className="hover-elevate transition-all duration-300" data-testid={`card-document-${doc.id}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">{getFileIcon(doc.type)}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate mb-1" data-testid={`text-document-name-${doc.id}`}>
                    {doc.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>{doc.uploadDate.toLocaleDateString()}</span>
                  </div>
                  {doc.encrypted && (
                    <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600 border-0">
                      <Lock className="h-3 w-3 mr-1" />
                      Encrypted
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => console.log("Download", doc.name)}
                  data-testid={`button-download-${doc.id}`}
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
