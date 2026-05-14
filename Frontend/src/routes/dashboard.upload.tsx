import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload as UploadIcon,
  FileText,
  X,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import { uploadScripts } from "@/services/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

import { subjects, classes } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/upload")({
  component: UploadPage,
});

type UploadFile = {
  file: File;
  name: string;
  size: number;
  progress: number;
};

function UploadPage() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [started, setStarted] = useState(false);

  // =========================
  // Handle File Drop
  // =========================
  const onDrop = useCallback((accepted: File[]) => {

    const next = accepted.map((f) => ({
      file: f,
      name: f.name,
      size: f.size,
      progress: 100,
    }));

    setFiles((prev) => [...prev, ...next]);

  }, []);

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
        "image/*": [".png", ".jpg", ".jpeg"],
      },
    });

  // =========================
  // Remove File
  // =========================
  const remove = (name: string) => {
    setFiles((prev) =>
      prev.filter((f) => f.name !== name)
    );
  };

  // =========================
  // Upload Handler
  // =========================
  const handleEvaluation = async () => {

    try {

      setStarted(true);

      const realFiles = files.map((f) => f.file);

      const result = await uploadScripts(realFiles);

      console.log("Upload success:", result);

      alert("Scripts uploaded successfully!");

    } catch (error) {

      console.error(error);

      alert("Upload failed");

    } finally {

      setStarted(false);

    }
  };

  return (
    <div className="space-y-6 max-w-5xl">

      {/* ========================= */}
      {/* Header */}
      {/* ========================= */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Upload scripts
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Drop PDFs or scanned images.
          We'll OCR, evaluate, and score
          against your rubric.
        </p>
      </div>

      {/* ========================= */}
      {/* Upload Box */}
      {/* ========================= */}
      <Card className="glass shadow-elegant">
        <CardContent className="p-6">

          <div
            {...getRootProps()}
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
              isDragActive
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-border hover:border-primary/60 hover:bg-muted/30"
            }`}
          >

            <input {...getInputProps()} />

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary text-primary-foreground shadow-glow mb-4">
              <UploadIcon className="h-6 w-6" />
            </div>

            <p className="font-semibold">
              {isDragActive
                ? "Drop files here…"
                : "Drag & drop scripts here"}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              or click to browse — PDF, PNG,
              JPG up to 25MB each
            </p>

          </div>

          {/* ========================= */}
          {/* Uploaded Files */}
          {/* ========================= */}
          {files.length > 0 && (

            <div className="mt-6 space-y-3">

              {files.map((f) => (

                <div
                  key={f.name}
                  className="glass rounded-xl p-3 flex items-center gap-3"
                >

                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">

                    <div className="flex justify-between gap-3">

                      <p className="text-sm font-medium truncate">
                        {f.name}
                      </p>

                      <p className="text-xs text-muted-foreground whitespace-nowrap">
                        {(f.size / 1024).toFixed(0)} KB
                      </p>

                    </div>

                    <Progress
                      value={f.progress}
                      className="mt-2 h-1.5"
                    />

                  </div>

                  {f.progress >= 100 ? (

                    <CheckCircle2 className="h-5 w-5 text-success" />

                  ) : (

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(f.name)}
                    >
                      <X className="h-4 w-4" />
                    </Button>

                  )}

                </div>

              ))}

            </div>

          )}

        </CardContent>
      </Card>

      {/* ========================= */}
      {/* Metadata + Rubric */}
      {/* ========================= */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* Class & Subject */}
        <Card className="glass shadow-elegant">

          <CardHeader>
            <CardTitle className="text-base">
              Class & subject
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            <div className="space-y-1.5">

              <Label>Subject</Label>

              <Select defaultValue={subjects[0]}>

                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>

              </Select>

            </div>

            <div className="space-y-1.5">

              <Label>Class</Label>

              <Select defaultValue={classes[0]}>

                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>

              </Select>

            </div>

            <div className="space-y-1.5">

              <Label>Max marks</Label>

              <Select defaultValue="100">

                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {[50, 80, 100, 150, 200].map((n) => (
                    <SelectItem
                      key={n}
                      value={String(n)}
                    >
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>

              </Select>

            </div>

          </CardContent>

        </Card>

        {/* Rubric */}
        <Card className="glass shadow-elegant">

          <CardHeader>
            <CardTitle className="text-base">
              Rubric
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">

            <Label className="text-xs">
              Paste rubric or upload a file
            </Label>

            <Textarea
              placeholder="Q1 — Definition correctness (5 marks)
Q2 — Worked steps shown (10 marks)
Q3 — Diagram labeled (5 marks)…"
              className="min-h-[140px]"
            />

            <Button
              variant="outline"
              className="w-full glass"
            >
              Upload rubric (PDF / DOCX)
            </Button>

          </CardContent>

        </Card>

      </div>

      {/* ========================= */}
      {/* Submit */}
      {/* ========================= */}
      <div className="flex justify-end">

        <Button
          size="lg"
          disabled={files.length === 0 || started}
          onClick={handleEvaluation}
          className="gradient-primary border-0 shadow-glow"
        >

          <Sparkles className="h-4 w-4 mr-1.5" />

          {started
            ? "Evaluation in progress..."
            : "Start evaluation"}

        </Button>

      </div>

    </div>
  );
}
