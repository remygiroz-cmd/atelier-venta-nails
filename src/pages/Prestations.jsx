import PageHeader from '../components/PageHeader'

function Prestations() {
  return (
    <>
      <PageHeader
        eyebrow="Module 2"
        title="Prestations & Tarifs"
        intro="La liste des prestations sera alimentée depuis la table Supabase prestations."
      />
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center text-ink-700">
        <p className="italic font-display text-xl text-rose-500">
          Contenu à venir.
        </p>
      </section>
    </>
  )
}

export default Prestations
