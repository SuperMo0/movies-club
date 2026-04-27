import { Search } from 'lucide-react'
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

                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 items-center">

                    <div className="flex items-center gap-2 text-foreground md:border-r md:border-white/10 md:pr-6 mr-2">
                        <div className="bg-primary/10 p-2 rounded-full text-primary">
                            <Search className="w-5 h-5" />
                        </div>
                        <p className="text-lg font-bold whitespace-nowrap hidden lg:block">Choose Your Cinema</p>
                    </div>

                    <CinemaSelector onChange={onChange} value={cinema} placeholder='Select Cinema' values={Object.keys(cinemas)} />

                    <Button
                        variant='default'
                        size="lg"
                        className=""
                        onClick={() => { onChange(null) }}
                        disabled={!cinema}
                    >
                        Reset Search
                    </Button>

                </div>
            </div>
        </div>
    )
}