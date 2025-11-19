import Spline from '@splinetool/react-spline'

function Hero() {
  return (
    <section className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-900">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/VJLoxp84lCdVfdZu/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative h-full flex items-center pointer-events-none">
        <div className="w-full px-6 sm:px-10 lg:px-14">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3">
              Dev Links Hub
            </h1>
            <p className="text-blue-100/90 text-sm sm:text-base lg:text-lg">
              Save your favorite developer tools, label them, track popularity, and keep your team in sync.
            </p>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/0 to-slate-950/20"></div>
    </section>
  )
}

export default Hero
