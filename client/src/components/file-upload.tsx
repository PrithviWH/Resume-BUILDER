import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parsePDFText, extractResumeData } from '@/lib/pdf-utils';
import { useResumeStore } from '@/store/resume-store';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onUploadComplete?: (data: any) => void;
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { importResumeData, setLoading } = useResumeStore();
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setLoading(true);
    
    try {
      // Validate file type and size
      if (file.type !== 'application/pdf') {
        throw new Error('Please upload a PDF file.');
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('File size must be less than 10MB.');
      }

      setUploadedFile(file);
      
      // Parse PDF and extract data
      const pdfText = await parsePDFText(file);
      const extractedData = await extractResumeData(pdfText);
      
      // Import the extracted data
      importResumeData(extractedData);
      
      toast({
        title: "Resume uploaded successfully!",
        description: "We've extracted your information. Please review and edit as needed.",
      });
      
      onUploadComplete?.(extractedData);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : 'An error occurred while uploading the file.',
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setLoading(false);
    }
  }, [importResumeData, setLoading, toast, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6">
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/30 hover:bg-muted/50",
            isUploading && "pointer-events-none opacity-50"
          )}
          data-testid="file-upload-dropzone"
        >
          <input {...getInputProps()} data-testid="file-upload-input" />
          
          <div className="flex flex-col items-center space-y-4">
            {uploadedFile ? (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">File uploaded successfully!</h3>
                  <p className="text-muted-foreground">
                    {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)} KB)
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {isDragActive ? "Drop your resume here" : "Upload your resume"}
                  </h3>
                  <p className="text-muted-foreground">
                    {isDragActive ? "Release to upload" : "Drag and drop or click to browse files"}
                  </p>
                </div>
              </>
            )}
            
            {!uploadedFile && (
              <Button 
                variant="default" 
                disabled={isUploading}
                data-testid="button-choose-file"
              >
                {isUploading ? "Uploading..." : "Choose File"}
              </Button>
            )}
            
            <p className="text-sm text-muted-foreground">
              Supports PDF files up to 10MB
            </p>
          </div>
        </div>
        
        {uploadedFile && !isUploading && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Resume data extracted successfully
                </p>
                <p className="text-sm text-green-700">
                  Please review the extracted information in the resume editor and make any necessary adjustments.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
