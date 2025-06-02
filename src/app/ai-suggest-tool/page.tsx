
'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, ListChecks, Loader2, AlertTriangle, FileText as FileTextIcon, Type } from 'lucide-react';
import { suggestToolsFromUpload, SuggestToolsFromUploadOutput } from '@/ai/flows/suggest-tool-from-upload';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';

const AiSuggestToolPage = () => {
  const { toast } = useToast();
  const [inputType, setInputType] = useState<'text' | 'file'>('text');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('text/') ||
          selectedFile.type === 'application/msword' ||
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          selectedFile.type === 'application/pdf') {
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
        reader.readAsText(selectedFile);
      } else {
        setError('Unsupported file type. Please upload a text, DOC, DOCX, or PDF file.');
        setFile(null);
        setFileContent('');
        toast({ title: "Unsupported File", description: "Please upload a document file (TXT, DOC, DOCX, PDF).", variant: "destructive" });
      }
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    let documentInput = '';

    if (inputType === 'text') {
      if (!projectDescription.trim()) {
        setError('Please enter a project description.');
        toast({ title: "No Description", description: "Please enter your project description.", variant: "destructive" });
        return;
      }
      documentInput = projectDescription;
    } else { // inputType === 'file'
      if (!file || !fileContent) {
        setError('Please select a file and ensure its content can be read.');
        toast({ title: "No File Content", description: "Please select a file with readable content.", variant: "destructive" });
        return;
      }
      documentInput = fileContent;
    }

    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const result: SuggestToolsFromUploadOutput = await suggestToolsFromUpload({ documentContent: documentInput });
      if (result && result.suggestedTools) {
        setSuggestions(result.suggestedTools);
      } else {
        setError('AI could not suggest tools based on this input.');
        toast({ title: "Suggestion Error", description: "AI could not process the input for suggestions.", variant: "destructive" });
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

  const isSubmitDisabled = () => {
    if (isLoading) return true;
    if (inputType === 'text') return !projectDescription.trim();
    if (inputType === 'file') return !file || !fileContent;
    return true;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-headline">AI Tool Suggester</CardTitle>
          <CardDescription>Describe your project or upload a document, and our AI will suggest suitable tools.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <Accordion type="single" collapsible defaultValue="text" value={inputType} onValueChange={(value) => setInputType(value as 'text' | 'file')}>
              <AccordionItem value="text">
                <AccordionTrigger className="text-base">
                  <div className="flex items-center">
                    <Type className="mr-2 h-5 w-5 text-primary" />
                    Project Description (Text)
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <Label htmlFor="project-description-text" className="block text-sm font-medium mb-2">Enter your project details</Label>
                  <Textarea
                    id="project-description-text"
                    placeholder="E.g., I'm planning to build a wooden deck in my backyard, approximately 3x4 meters..."
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    rows={5}
                    className="min-h-[100px]"
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="file">
                <AccordionTrigger className="text-base">
                  <div className="flex items-center">
                     <UploadCloud className="mr-2 h-5 w-5 text-primary" />
                    Project Document (Upload)
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <Label htmlFor="project-document-input" className="block text-sm font-medium mb-2">Upload your project plan or brief</Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md hover:border-primary transition-colors">
                      <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
                        <div className="flex text-sm text-muted-foreground">
                          <Label
                            htmlFor="project-document-input-inner"
                            className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                          >
                            <span>Upload a file</span>
                            <Input id="project-document-input-inner" name="project-document" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.doc,.docx,.pdf" />
                          </Label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-muted-foreground">TXT, DOC, DOCX, PDF files up to 5MB</p>
                      </div>
                    </div>
                  {file && (
                    <div className="mt-3 p-3 border rounded-md bg-secondary/50 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileTextIcon className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => { setFile(null); setFileContent(''); setError(null); }}>Clear</Button>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <Button type="submit" disabled={isSubmitDisabled()} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ListChecks className="mr-2 h-4 w-4" />
              )}
              {isLoading ? 'Analyzing...' : 'Suggest Tools'}
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
        </form>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Note: AI suggestions are based on the provided input. For complex projects, professional consultation is recommended.
            Input content is processed for suggestions and not stored long-term.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AiSuggestToolPage;
