import React from 'react'
import { Search, MapPin, Film, CalendarDays } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'

export default function Qsearch() {
    return (
        <div className="container mx-auto px-4 relative z-20">
            <div className="bg-background/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 md:p-4">

                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 items-center">


                    <div className="flex items-center gap-2 text-foreground md:border-r md:border-white/10 md:pr-6 mr-2">
                        <div className="bg-primary/10 p-2 rounded-full text-primary">
                            <Search className="w-5 h-5" />
                        </div>
                        <p className="text-lg font-bold whitespace-nowrap hidden lg:block">Quick Search</p>
                    </div>

                    <Select>
                        <SelectTrigger className="w-full h-12 bg-transparent border-white/10 focus:ring-primary/50 text-base">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <SelectValue placeholder="Select Cinema" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="c1">Grand Cinema</SelectItem>
                            <SelectItem value="c2">IMAX Downtown</SelectItem>
                            <SelectItem value="c3">Galaxy Mall</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select>
                        <SelectTrigger className="w-full h-12 bg-transparent border-white/10 focus:ring-primary/50 text-base">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Film className="w-4 h-4" />
                                <SelectValue placeholder="Choose Movie" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="m1">Dune: Part Two</SelectItem>
                            <SelectItem value="m2">Civil War</SelectItem>
                            <SelectItem value="m3">Godzilla x Kong</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select>
                        <SelectTrigger className="w-full h-12 bg-transparent border-white/10 focus:ring-primary/50 text-base">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <CalendarDays className="w-4 h-4" />
                                <SelectValue placeholder="Pick a Date" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="d1">Today, Oct 24</SelectItem>
                            <SelectItem value="d2">Tomorrow, Oct 25</SelectItem>
                            <SelectItem value="d3">Sat, Oct 26</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        size="lg"
                        className="w-full md:w-auto h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-neon-red px-8"
                    >
                        Search Tickets
                    </Button>

                </div>
            </div>
        </div>
    )
}