function PageHeader({ eyebrow, title, intro }) {
  return (
    <header className="border-b border-nude-200 bg-gradient-to-b from-nude-100/60 to-nude-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        {eyebrow && (
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gold-500">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 font-display text-4xl sm:text-5xl text-ink-900">
          {title}
        </h1>
        {intro && (
          <p className="mt-5 text-base sm:text-lg text-ink-700 max-w-2xl mx-auto">
            {intro}
          </p>
        )}
      </div>
    </header>
  )
}

export default PageHeader
