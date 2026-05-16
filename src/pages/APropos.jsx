import PageHeader from '../components/PageHeader'

function APropos() {
  return (
    <>
      <PageHeader
        eyebrow="Module 5"
        title="À propos"
        intro="Le texte de présentation et la photo de Céline seront intégrés ici."
      />
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center text-ink-700">
        <p className="italic font-display text-xl text-rose-500">
          Contenu à venir.
        </p>
      </section>
    </>
  )
}

export default APropos
