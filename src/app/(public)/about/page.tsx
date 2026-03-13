import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: "About the Veritas Forum at Johns Hopkins University",
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <h1 className="font-serif text-3xl md:text-5xl font-bold text-charcoal">About</h1>

      <div className="mt-8 prose prose-lg max-w-none">
        <p>
          The <strong>Veritas Forum at Johns Hopkins University</strong> is a student-led community
          dedicated to exploring life&apos;s hardest questions — questions of truth, meaning, identity,
          and faith — through thoughtful dialogue and writing.
        </p>

        <h2>Our Mission</h2>
        <p>
          We believe that the university is a place where the deepest questions of human existence
          deserve serious exploration. Through published essays, reflections, and reviews, we invite
          the Hopkins community to engage with ideas that matter — across disciplines, traditions,
          and perspectives.
        </p>

        <h2>What We Publish</h2>
        <p>
          Our writers contribute pieces spanning theology and philosophy, personal essays, arts and
          culture reviews, explorations of science and faith, book reviews, and reflections on campus
          life. Every piece is written by a member of the JHU community and reviewed by our editorial team.
        </p>

        <h2>Part of a Larger Movement</h2>
        <p>
          The Veritas Forum is a national organization that partners with universities to put life&apos;s
          hardest questions at the center of university life. Our JHU chapter — also part of the
          Augustine Collective — carries this mission forward through the written word.
        </p>

        <h2>Get Involved</h2>
        <p>
          Interested in writing for us or joining the conversation? Reach out to our team or subscribe
          to our newsletter to stay updated on new pieces and events.
        </p>
      </div>
    </div>
  )
}
