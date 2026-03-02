"use client";

import { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ValidationResponse {
  status?: string;
  message?: string;
  isValid?: boolean;
  error?: string;
  [key: string]: any;
}

export default function Home() {
  const [email, setEmail] = useState("");
  // populate the URL field with any configured default from environment
  const [url, setUrl] = useState(process.env.NEXT_PUBLIC_URL_ENDPOINT || "");
  const [result, setResult] = useState<ValidationResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    try {
      // Use our server-side proxy to avoid CORS issues when calling
      // the Supabase validation endpoint from the browser.
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, email }),
      });

      const data: ValidationResponse = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error("fetch error", err);
      setResult({
        error: `Request failed: ${err?.message || "unknown"}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-black font-sans">
      <main className="w-full max-w-lg">
        <Card className="shadow-xl border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Bonus Task: API Tester</CardTitle>
            <CardDescription>
              Validate your endpoint against the Supabase test function.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold">Email Address</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="your-email@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="bg-white dark:bg-zinc-950"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url" className="font-semibold">Your API Endpoint URL</Label>
                <Input 
                  id="url"
                  type="text" 
                  placeholder="https://your-deployed-api.com/" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required 
                  className="bg-white dark:bg-zinc-950"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 text-base font-bold transition-all active:scale-[0.98]" 
                disabled={loading}
              >
                {loading ? "Validating..." : "Submit Test"}
              </Button>
            </form>
          </CardContent>

          {result && (
            <CardFooter className="flex flex-col items-start bg-zinc-100 dark:bg-zinc-900/50 p-6 border-t rounded-b-xl">
              <div className="flex items-center justify-between w-full mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Validation Response
                </span>
                {result.isValid !== undefined && (
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${result.isValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {result.isValid ? "PASSED" : "FAILED"}
                  </span>
                )}
              </div>
              <div className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-4">
                <pre className="text-xs font-mono text-zinc-800 dark:text-zinc-200 overflow-auto max-h-64 leading-relaxed">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </CardFooter>
          )}
        </Card>
      </main>
    </div>
  );
}