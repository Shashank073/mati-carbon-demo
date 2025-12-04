import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Leaf, ArrowRight } from "lucide-react";

export default function WelcomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-900">
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Card className="w-full border-zinc-200 dark:border-zinc-800 shadow-lg">
          <CardHeader className="flex flex-col items-center space-y-4 pb-2">
            <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
              <Globe className="h-12 w-12 text-mati-gold" />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-zinc-900 dark:text-zinc-50">
              Mati Carbon
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed min-h-[60px]">
              Removing 100 million tonnes of CO₂ through Enhanced Rock Weathering, while restoring soil.
            </p>

            <div className="flex justify-center pt-4">
              <Link href="/signin" className="w-full">
                <Button className="w-full bg-mati-gold hover:bg-yellow-600 text-white font-medium transition-colors">
                  Proceed <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full border-zinc-200 dark:border-zinc-800 shadow-lg">
          <CardHeader className="flex flex-col items-center space-y-4 pb-2">
            <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
              <Leaf className="h-12 w-12 text-[#556B2F]" />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-zinc-900 dark:text-zinc-50">
              Mati Harvest
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed min-h-[60px]">
              Trace your rice back to the farmer. See the journey, the impact, and the story behind your food.
            </p>

            <div className="flex justify-center pt-4">
              <Link href="/harvest" className="w-full">
                <Button className="w-full bg-[#556B2F] hover:bg-[#435624] text-white font-medium transition-colors">
                  Visit Harvest Site <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 w-full max-w-4xl">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm text-center relative overflow-hidden group cursor-pointer hover:shadow-md transition-all">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-mati-gold to-[#556B2F]" />
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">What's Your Carbon Curiosity?</h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">Take a 30-second quiz to discover your regenerative impact profile.</p>
          <span className="inline-flex items-center text-sm font-medium text-[#556B2F] hover:underline">
            Start Quiz <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2 text-xs text-zinc-400">
        <Leaf className="h-3 w-3" />
        <span>Powered by Nature</span>
      </div>
    </main>
  );
}
