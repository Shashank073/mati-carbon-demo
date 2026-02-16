import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Table as TableIcon, MessageSquare } from "lucide-react";

export default function LayoutsPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center space-x-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Layouts Library</h1>
                </div>

                <section className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                        <TableIcon className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
                        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Table Layouts</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="hover:shadow-md transition-shadow group cursor-pointer border-zinc-200 dark:border-zinc-800">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-md group-hover:bg-mati-gold/10 transition-colors">
                                        <TableIcon className="h-5 w-5 text-zinc-700 dark:text-zinc-300 group-hover:text-mati-gold" />
                                    </div>
                                    <CardTitle className="text-lg">Table Layout</CardTitle>
                                </div>
                                <CardDescription className="line-clamp-2">
                                    Explore a variety of table layout patterns, headers, and cell components for different data types.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href="/layouts/table-layouts" className="block">
                                    <Button className="w-full group-hover:bg-zinc-900 group-hover:text-zinc-50 dark:group-hover:bg-zinc-50 dark:group-hover:text-zinc-900" variant="outline">
                                        View All Variants <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Engagement Layout Card */}
                        <Card className="hover:shadow-md transition-shadow group cursor-pointer border-zinc-200 dark:border-zinc-800">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-md group-hover:bg-mati-gold/10 transition-colors">
                                        <MessageSquare className="h-5 w-5 text-zinc-700 dark:text-zinc-300 group-hover:text-mati-gold" />
                                    </div>
                                    <CardTitle className="text-lg">Engagement Layout</CardTitle>
                                </div>
                                <CardDescription className="line-clamp-2">
                                    Interactive table and list views for managing farmer engagement feedback and interactions.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href="/layouts/engagement" className="block">
                                    <Button className="w-full group-hover:bg-zinc-900 group-hover:text-zinc-50 dark:group-hover:bg-zinc-50 dark:group-hover:text-zinc-900" variant="outline">
                                        View Engagement <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    );
}
