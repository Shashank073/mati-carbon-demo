import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Leaf, ArrowRight } from "lucide-react";

export default function WelcomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-900">
      <Card className="w-full max-w-md border-zinc-200 dark:border-zinc-800 shadow-lg">
        <CardHeader className="flex flex-col items-center space-y-4 pb-2">
          <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
            <Globe className="h-12 w-12 text-mati-gold" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-zinc-900 dark:text-zinc-50">
            Welcome to Mati Carbon
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Removing 100 million tonnes of CO₂ through Enhanced Rock Weathering, while restoring soil and empowering smallholder farmers in the Global South.
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

      <div className="mt-8 flex items-center gap-2 text-xs text-zinc-400">
        <Leaf className="h-3 w-3" />
        <span>Powered by Nature</span>
      </div>
    </main>
  );
}
