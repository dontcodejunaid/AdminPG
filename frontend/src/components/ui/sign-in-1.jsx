import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * A reusable authentication form component built with shadcn/ui.
 * It supports various providers, a customizable header, and animations.
 */
const AuthForm = React.forwardRef(
  (
    {
      className,
      logoSrc = "/logo.png",
      logoAlt = "KeralaPG Logo",
      title = "Welcome Back",
      description,
      primaryAction,
      secondaryActions,
      skipAction,
      footerContent,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("flex flex-col items-center justify-center", className)}>
        <Card
          ref={ref}
          className={cn(
            "w-full max-w-sm border border-slate-200/80 dark:border-slate-800/80 shadow-2xl rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl",
            // Entrance Animation
            "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-500"
          )}
          {...props}
        >
          <CardHeader className="text-center pt-8 pb-4">
            {/* Logo rendered from src */}
            <div className="mb-4 flex justify-center">
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 p-1 flex items-center justify-center shadow-lg border border-brand-200/60 dark:border-slate-700">
                <img src={logoSrc} alt={logoAlt} className="h-full w-full object-contain" />
              </div>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{title}</CardTitle>
            {description && <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</CardDescription>}
          </CardHeader>

          <CardContent className="grid gap-4 px-6 sm:px-8">
            {/* Primary Action Button */}
            {primaryAction && (
              <Button onClick={primaryAction.onClick} className="w-full py-2.5 rounded-xl font-bold bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white shadow-md shadow-brand-600/20 transition-transform hover:scale-[1.02]">
                {primaryAction.icon}
                <span className="ml-2">{primaryAction.label}</span>
              </Button>
            )}

            {/* "OR" separator */}
            {secondaryActions && secondaryActions.length > 0 && (
              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-bold tracking-widest">or continue with</span>
                </div>
              </div>
            )}

            {/* Secondary Action Buttons */}
            <div className="grid gap-2.5">
              {secondaryActions?.map((action, index) => (
                <Button 
                  key={index} 
                  variant="secondary" 
                  className="w-full py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 transition-transform hover:scale-[1.02] flex items-center justify-center gap-2" 
                  onClick={action.onClick}
                >
                  {action.icon}
                  <span>{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>

          {/* Skip Action Button */}
          {skipAction && (
            <CardFooter className="flex flex-col px-6 sm:px-8 pb-6 pt-2">
              <Button variant="outline" className="w-full rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-transform hover:scale-[1.02]" onClick={skipAction.onClick}>
                {skipAction.label}
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Footer */}
        {footerContent && (
          <div className="mt-6 w-full max-w-sm px-6 text-center text-xs text-slate-400 dark:text-slate-500 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-500 [animation-delay:200ms]">
            {footerContent}
          </div>
        )}
      </div>
    );
  }
);
AuthForm.displayName = "AuthForm";

export { AuthForm };
export default AuthForm;
