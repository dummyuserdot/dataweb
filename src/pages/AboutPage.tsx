import React from 'react';
import { ArrowRight } from 'lucide-react';
import { WatchImage } from '../components/WatchImage';
import { useStore } from '../context/StoreContext';
import { ATELIER_IMAGE } from '../data/watches';

export const AboutPage: React.FC = () => {
  const { navigate } = useStore();

  const pillars = [
    {
      index: '01.',
      title: 'COSC Chronometer Precision',
      body: 'Every mechanical Valmont movement is tested across five positions and three thermal bands for fifteen consecutive days before casing.',
    },
    {
      index: '02.',
      title: 'Hand-Finished Architecture',
      body: 'Bridges receive hand-beveled anglage, Geneva stripes, and gold chatons executed by master artisans in our Rue du Rhône workshop.',
    },
    {
      index: '03.',
      title: 'Precious Metallurgy & Sapphire',
      body: 'From 18k yellow and rose gold to grade-5 brushed titanium and forged carbon, every case is sealed behind dual anti-reflective sapphire.',
    },
    {
      index: '04.',
      title: 'Five-Year Geneva Guarantee',
      body: 'Each timepiece carries an individual archival number, insured worldwide delivery, and dedicated five-year manufacture care.',
    },
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 py-10 sm:py-14 space-y-14 sm:space-y-20">
      {/* Intro Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-center">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#D4AF37]">
            Our Heritage · Founded 1924
          </p>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl font-normal leading-tight text-[#FDFBF7] [text-wrap:balance]">
            Sovereign Horology for Modern Connoisseurs
          </h1>
          <p className="mt-4 sm:mt-6 text-sm sm:text-lg font-light leading-relaxed text-[#D0C5AF]">
            Founded in Geneva by master watchmaker Henri Valmont, our Maison was built on a single
            conviction: true luxury is never loud—it is felt in the silent sweep of a balanced
            escapement and the tactile warmth of hand-brushed precious metal.
          </p>
          <p className="mt-4 text-sm sm:text-base font-light leading-relaxed text-[#9CA3AF]">
            Today, Valmont Genève crafts mechanical dress watches, astronomical moonphases,
            300-meter titanium divers, and sapphire hybrid connected watches designed for both men
            and women who expect permanence from every possession.
          </p>
          <div className="mt-7 sm:mt-8">
            <button
              type="button"
              onClick={() => navigate({ name: 'shop' })}
              className="w-full sm:w-auto inline-flex min-h-[44px] items-center justify-center gap-2 rounded bg-gradient-to-r from-[#D4AF37] to-[#C59F2E] px-6 py-3.5 text-xs font-semibold tracking-[0.15em] uppercase text-[#0B0C10] cursor-pointer"
            >
              <span>Explore Our Timepieces</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 overflow-hidden rounded-lg border border-white/[0.08] bg-[#12141A] aspect-[4/3] lg:aspect-auto">
          <WatchImage
            src={ATELIER_IMAGE}
            alt="Valmont Genève master watchmaker assembling a gold movement"
            title="Geneva Atelier Craftsmanship"
            eager
            className="h-full w-full lg:min-h-[340px] object-cover"
          />
        </div>
      </section>

      {/* Mission Banner */}
      <section className="glass-sapphire rounded-lg p-6 sm:p-10 lg:p-12 border border-[#D4AF37]/20">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#E5C158]">
            Our Mission
          </p>
          <blockquote className="mt-3 font-serif text-xl sm:text-3xl font-normal leading-snug text-[#FDFBF7] [text-wrap:balance]">
            &ldquo;To preserve classical Swiss mechanical artistry while embracing contemporary
            materials and human-centered ergonomics—creating watches meant to outlast trends and
            be passed down across generations.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* Why Choose Valmont Genève */}
      <section>
        <div className="border-b border-white/[0.08] pb-6">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#D4AF37]">
            The Valmont Standard
          </p>
          <h2 className="mt-2 font-serif text-2xl sm:text-4xl font-normal text-[#FDFBF7]">
            Why Collectors Choose Valmont Genève
          </h2>
        </div>

        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.index}
              className="rounded-lg border border-white/[0.08] bg-[#12141A] p-5 sm:p-7"
            >
              <h3 className="font-serif text-lg sm:text-xl text-[#FDFBF7]">
                <span className="text-[#D4AF37] mr-2 tabular-nums">{pillar.index}</span>
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#9CA3AF]">{pillar.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
