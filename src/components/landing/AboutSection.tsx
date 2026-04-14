import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-32 bg-[#1f1d1d]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="h-px w-8 bg-[#c4501a]" />
          <p className="text-[#c4501a] text-xs font-bold uppercase tracking-[0.3em]">
            Sobre el autor
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          {/* Author photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[3/4] bg-[#2c2b2b] rounded-2xl overflow-hidden">
              <img
                src="/assets/hernan.png"
                alt="Hernan Figueredo"
                className="w-full h-full object-cover object-top"
              />
            </div>
            {/* Decorative accents */}
            <div className="absolute -bottom-5 -right-5 w-28 h-28 border-2 border-[#c4501a]/18 rounded-2xl -z-10" />
            <div className="absolute -top-4 -left-4 w-16 h-16 border border-white/[0.05] rounded-xl -z-10" />
            {/* Floating label */}
            <div className="absolute bottom-5 left-5 right-5 bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3">
              <p className="text-white text-sm font-semibold">Hernan Figueredo</p>
              <p className="text-white/45 text-xs mt-0.5">Escritor · Emprendedor · Mentor</p>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="pt-2"
          >
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              Hernan<br />
              <span className="text-[#c4501a]">Figueredo</span>
            </h2>

            {/* Pull quote */}
            <motion.blockquote
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="relative mb-8 pl-5 border-l-2 border-[#c4501a]/50"
            >
              <p className="text-white/80 text-lg font-light italic leading-relaxed">
                "No escribo para motivarte.
                <br />
                Escribo para sacudirte."
              </p>
            </motion.blockquote>

            <div className="space-y-4 text-white/50 leading-[1.8] text-[15px]">
              <p>
                Hernan Figueredo es escritor, emprendedor y guía de crecimiento personal con más
                de quince años ayudando a personas a desbloquear su máximo potencial.
              </p>
              <p>
                Sus libros combinan experiencias de vida reales con principios probados de
                psicología, liderazgo y filosofía práctica — sin jerga académica, sin rodeos.
              </p>
              <p>
                Con miles de lectores en toda Latinoamérica, su misión es simple: darte las
                herramientas para construir la vida que realmente quieres vivir.
              </p>
            </div>

            {/* Stats mini-row */}
            <div className="mt-10 mb-10 grid grid-cols-3 gap-4">
              {[
                { value: '5+', label: 'Libros' },
                { value: '10k+', label: 'Lectores' },
                { value: '15+', label: 'Años' },
              ].map((s) => (
                <div key={s.label} className="text-center bg-white/[0.03] border border-white/[0.06] rounded-xl py-3">
                  <p className="text-xl font-bold text-[#c4501a]">{s.value}</p>
                  <p className="text-white/30 text-[10px] uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/libros"
                className="inline-flex items-center justify-center gap-2 bg-[#c4501a] hover:bg-[#d45c1a] text-white font-semibold px-7 py-3.5 rounded-xl transition-colors text-sm shadow-lg shadow-[#c4501a]/20"
              >
                Ver libros
              </Link>
              <a
                href="#"
                className="text-white/35 hover:text-white text-sm transition-colors"
              >
                @hernanfigueredo →
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
