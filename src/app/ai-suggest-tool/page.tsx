'use client';

import { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, ListChecks, Loader2, AlertTriangle, FileText } from 'lucide-react';
import { suggestToolsFromUpload, SuggestToolsFromUploadOutput } from '@/ai/flows/suggest-tool-from-upload';
import { useToast } from '@/hooks/use-toast';

const AiSuggestToolPage = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Basic validation for text-based files (can be expanded)
      if (selectedFile.type.startsWith('text/') || 
          selectedFile.type === 'application/msword' || // .doc
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || // .docx
          selectedFile.type === 'application/pdf') { // PDF - Note: PDF parsing is complex, simple text extraction might not work well.
        setFile(selectedFile);
        setSuggestions([]);
        setError(null);

        const reader = new FileReader();
        reader.onload = (e) => {
          setFileContent(e.target?.result as string);
        };
        reader.onerror = () => {
          setError('Failed to read file content.');
          setFileContent('');
        }
        reader.readAsText(selectedFile); // This will only work well for plain text files.
                                        // For .doc, .docx, .pdf, server-side parsing (e.g., with Mammoth, pdf-parse) is usually needed.
                                        // For this example, we'll proceed with client-side text extraction as a simplification.
      } else {
        setError('Unsupported file type. Please upload a text, DOC, DOCX, or PDF file.');
        setFile(null);
        setFileContent('');
        toast({ title: "Unsupported File", description: "Please upload a document file (TXT, DOC, DOCX, PDF).", variant: "destructive" });
      }
    }
  };

  const handleSubmit = async () => {
    if (!file || !fileContent) {
      setError('Please select a file and ensure its content can be read.');
      toast({ title: "No File Content", description: "Please select a file with readable content.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const result: SuggestToolsFromUploadOutput = await suggestToolsFromUpload({ documentContent: fileContent });
      if (result && result.suggestedTools) {
        setSuggestions(result.suggestedTools);
      } else {
        setError('AI could not suggest tools based on this document.');
        toast({ title: "Suggestion Error", description: "AI could not process the document for suggestions.", variant: "destructive" });
      }
    } catch (err) {
      console.error("AI suggestion error:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred with the AI service.';
      setError(`Failed to get suggestions: ${errorMessage}`);
      toast({ title: "AI Service Error", description: `Failed to get suggestions: ${errorMessage}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-headline">AI Tool Suggester</CardTitle>
          <CardDescription>Upload a document describing your project, and our AI will suggest suitable tools.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="project-document" className="block text-sm font-medium mb-2">Project Document</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md hover:border-primary transition-colors">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="flex text-sm text-muted-foreground">
                    <Label
                      htmlFor="project-document-input"
                      className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                    >
                      <span>Upload a file</span>
                      <Input id="project-document-input" name="project-document" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.doc,.docx,.pdf" />
                    </Label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-muted-foreground">TXT, DOC, DOCX, PDF files up to 5MB</p>
                </div>
              </div>
            {file && (
              <div className="mt-3 p-3 border rounded-md bg-secondary/50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { setFile(null); setFileContent(''); setSuggestions([]); setError(null); }}>Clear</Button>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <Button onClick={handleSubmit} disabled={!file || isLoading || !fileContent} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ListChecks className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Analyzing Document...' : 'Suggest Tools'}
          </Button>

          {suggestions.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-3 font-headline">Suggested Tools:</h3>
              <ul className="list-disc list-inside space-y-1 bg-secondary/30 p-4 rounded-md">
                {suggestions.map((tool, index) => (
                  <li key={index} className="text-sm">{tool}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Note: AI suggestions are based on the provided document content. For complex projects, professional consultation is recommended.
            Document content is processed for suggestions and not stored long-term.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AiSuggestToolPage;
