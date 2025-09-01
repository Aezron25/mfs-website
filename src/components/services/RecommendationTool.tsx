"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { recommendService, type AIServiceRecommendationOutput } from "@/ai/flows/ai-service-recommendation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  inquiry: z.string().min(20, {
    message: "Please describe your financial needs in at least 20 characters.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export function RecommendationTool() {
  const [recommendation, setRecommendation] = useState<AIServiceRecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inquiry: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setRecommendation(null);
    try {
      const result = await recommendService(data);
      setRecommendation(result);
    } catch (error) {
      console.error("AI recommendation failed:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with our AI service. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card id="recommendation-tool" className="w-full max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
          <Wand2 className="h-8 w-8" />
        </div>
        <CardTitle className="text-3xl font-headline">AI-Powered Service Recommendation</CardTitle>
        <CardDescription>
          Describe your financial situation or question below, and our AI will suggest the best service for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="inquiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="inquiry">Your Financial Inquiry</FormLabel>
                  <FormControl>
                    <Textarea
                      id="inquiry"
                      placeholder="For example: 'I'm starting a new business and I'm not sure how to handle my accounting and taxes.' or 'I need a loan to purchase a new car.'"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Get Recommendation"
              )}
            </Button>
          </form>
        </Form>

        {recommendation && (
          <div className="mt-8 animate-fade-in-up">
            <Alert className="bg-accent/20 border-accent text-foreground">
              <Sparkles className="h-4 w-4" />
              <AlertTitle className="font-headline text-lg">Here is your recommendation:</AlertTitle>
              <AlertDescription className="mt-2">
                <h4 className="font-bold text-lg capitalize mt-2 text-primary">{recommendation.recommendedService}</h4>
                <p className="mt-1">{recommendation.reason}</p>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
