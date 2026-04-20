const defaultBanner = "https://wallpapercave.com/wp/wp10021077.jpg";

export default function ProfileBanner() {
    return (
        <div className='h-48 md:h-64 w-full bg-slate-800 overflow-hidden relative'>
            <img src={defaultBanner} alt="Banner" className='w-full h-full object-cover opacity-60' />
            <div className='absolute inset-0 bg-linear-to-t from-slate-950/90 via-transparent to-transparent'></div>
        </div>
    )
}
