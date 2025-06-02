
'use client';

import { useState, ChangeEvent } from 'react'; // Removed _ import
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, FileText, Image as ImageIcon, Loader2, CheckCircle, AlertTriangle, X } from 'lucide-react'; // Added X
import Image from 'next/image'; 
import { toast } from 'sonner'; // Changed import

type UploadStatus = 'idle' | 'uploading' | 'success' | 'failure';

const UploadEvidencePage = () => {
  const params = useParams();
  const router = useRouter();
  const rentalId = params.rentalId as string;
  
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles(prevFiles => [...prevFiles, ...selectedFiles].slice(0, 5)); 

      const newPreviews: string[] = [];
      selectedFiles.slice(0, 5 - files.length).forEach(file => {
        if (file.type.startsWith('image/')) {
          newPreviews.push(URL.createObjectURL(file));
        } else {
          newPreviews.push('file_icon'); 
        }
      });
      setPreviews(prevPreviews => [...prevPreviews, ...newPreviews].slice(0,5));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (files.length === 0) {
      toast.error("No files selected", { description: "Please select files to upload." }); // Changed toast
      return;
    }
    setUploadStatus('uploading');
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const isSuccess = Math.random() > 0.2; 
    if (isSuccess) {
      setUploadStatus('success');
      toast.success("Evidence Uploaded!", { description: "Your return evidence has been submitted successfully." }); // Changed toast
      setTimeout(() => router.push(\`/rent-detail/\${rentalId}\`), 2000);
    } else {
      setUploadStatus('failure');
      toast.error("Upload Failed", { description: "Could not upload files. Please try again." }); // Changed toast
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-headline">Upload Return Evidence</CardTitle>
          <CardDescription>For rental ID: {rentalId}. Please upload photos or documents as proof of return condition.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="file-upload" className="block text-sm font-medium mb-2">Select Files (Max 5)</Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md hover:border-primary transition-colors">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="flex text-sm text-muted-foreground">
                    <Label
                      htmlFor="file-upload-input"
                      className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                    >
                      <span>Upload files</span>
                      <Input id="file-upload-input" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} accept="image/*,application/pdf,.doc,.docx" disabled={uploadStatus === 'uploading'} />
                    </Label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB; PDF, DOC up to 5MB</p>
                </div>
              </div>
            </div>

            {previews.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Selected Files:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group border rounded-md p-1 aspect-square">
                      {preview === 'file_icon' || !files[index]?.type.startsWith('image/') ? (
                         <div className="flex flex-col items-center justify-center h-full bg-secondary rounded">
                           <FileText className="h-8 w-8 text-muted-foreground" />
                           <p className="text-xs text-muted-foreground mt-1 truncate px-1" title={files[index]?.name}>{files[index]?.name}</p>
                         </div>
                      ) : (
                        <Image src={preview} alt={\`Preview \${index + 1}\`} layout="fill" objectFit="cover" className="rounded" />
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove file"
                        disabled={uploadStatus === 'uploading'}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {uploadStatus === 'failure' && (
               <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <p className="text-sm font-medium">Upload failed. Please try again.</p>
              </div>
            )}

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={files.length === 0 || uploadStatus === 'uploading' || uploadStatus === 'success'}>
              {uploadStatus === 'uploading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {uploadStatus === 'success' && <CheckCircle className="mr-2 h-4 w-4" />}
              {uploadStatus === 'success' ? 'Uploaded Successfully' : 'Submit Evidence'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default UploadEvidencePage;
