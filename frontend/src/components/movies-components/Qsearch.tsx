import { Search, X } from 'lucide-react'
import { Button } from '../ui/button'
import { useTodayCinemas } from '@/hooks/use-movies-query'
import CinemaSelector from './cinema-selector'

type QsearchProps = {
    onChange: (cinema: string | null) => void
    cinema: string | null
}
export default function Qsearch({ onChange, cinema }: QsearchProps) {

    const { data: cinemas } = useTodayCinemas();

    return (
        <div className="container mx-auto px-4 relative z-20">
            <div className="bg-background/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 md:p-4">

                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 items-center">

                    <div className="flex items-center gap-2 text-foreground md:border-r md:border-white/10 md:pr-6 mr-2">
                        <div className="bg-primary/10 p-2 rounded-full text-primary">
                            <Search className="w-5 h-5" />
                        </div>
                        <p className="text-base md:text-lg font-bold whitespace-nowrap">Choose Your Cinema</p>
                    </div>

                    <CinemaSelector
                        onChange={(value) => onChange(value || null)}
                        value={cinema}
                        placeholder='Select Cinema'
                        values={Object.keys(cinemas)}
                    />

                </div>

                {cinema && (
                    <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="relative flex size-2 shrink-0">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                                <span className="relative inline-flex size-2 rounded-full bg-primary" />
                            </span>
                            <span>
                                Showing movies at <span className="font-semibold text-foreground">{cinema}</span>
                            </span>
                        </p>

                        <Button
                            variant='ghost'
                            size="sm"
                            className="self-start border-white/20 text-muted-foreground hover:text-foreground sm:self-auto"
                            onClick={() => onChange(null)}
                        >
                            <X className="size-4" />
                            Show all in Egypt
                        </Button>
                    </div>
                )}

            </div>
        </div>
    )
}
