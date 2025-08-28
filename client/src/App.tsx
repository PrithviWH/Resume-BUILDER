import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Homepage from "@/pages/homepage";
import ImportFlow from "@/pages/import-flow";
import PersonalInfoStep from "@/pages/build-flow/personal-info";
import WorkExperienceStep from "@/pages/build-flow/work-experience";
import EducationStep from "@/pages/build-flow/education";
import SkillsStep from "@/pages/build-flow/skills";
import ReviewStep from "@/pages/build-flow/review";
import ResumeEditor from "@/pages/resume-editor";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Homepage} />
      <Route path="/import" component={ImportFlow} />
      <Route path="/build/personal-info" component={PersonalInfoStep} />
      <Route path="/build/work-experience" component={WorkExperienceStep} />
      <Route path="/build/education" component={EducationStep} />
      <Route path="/build/skills" component={SkillsStep} />
      <Route path="/build/review" component={ReviewStep} />
      <Route path="/editor" component={ResumeEditor} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
