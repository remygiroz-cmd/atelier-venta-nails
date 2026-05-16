import PageHeader from '../components/PageHeader'

function Galerie() {
  return (
    <>
      <PageHeader
        eyebrow="Module 3"
        title="Galerie"
        intro="Les photos seront chargées depuis le bucket Supabase photos-ongles."
      />
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center text-ink-700">
        <p className="italic font-display text-xl text-rose-500">
          Contenu à venir.
        </p>
      </section>
    </>
  )
}

export default Galerie
