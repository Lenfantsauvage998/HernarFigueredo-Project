import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'

const WORDS = ['construir', 'transformar', 'alcanzar']

const HeroSection: React.FC = () => {
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((i) => (i + 1) % WORDS.length)
    }, 2800)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1f1d1d]">
      {/* Dot texture */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Orange atmospheric glow */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[#f26822] opacity-[0.045] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#f26822] opacity-[0.025] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">

        {/* Eyebrow with flanking lines */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ originX: 1 }}
            className="h-px w-10 bg-[#f26822]/70"
          />
          <p className="text-[#f26822] text-xs font-bold uppercase tracking-[0.3em]">
            Autor · Pensador · Guía
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ originX: 0 }}
            className="h-px w-10 bg-[#f26822]/70"
          />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl lg:text-[96px] font-bold text-white leading-none tracking-tight mb-6"
        >
          Hernan
          <br />
          <span className="text-[#f26822]">Figueredo</span>
        </motion.h1>

        {/* Animated divider line that draws in */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: 0.5 }}
          className="h-px bg-gradient-to-r from-transparent via-[#f26822]/50 to-transparent max-w-sm mx-auto mb-10"
        />

        {/* Animated subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-3 font-light"
        >
          <span>Escritos que te empujan a </span>
          {/* Cycling animated word */}
          <span className="relative inline-block">
            <span className="relative z-10 text-white font-normal inline-block overflow-hidden text-center align-bottom">
              {WORDS.map((word, i) => (
                <motion.span
                  key={word}
                  className="absolute inset-0 flex items-end justify-center pb-0.5"
                  initial={{ opacity: 0, y: 18 }}
                  animate={
                    i === wordIndex
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: i < wordIndex ? -18 : 18 }
                  }
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                </motion.span>
              ))}
              {/* Invisible spacer — sets width to longest word */}
              <span className="invisible select-none">
                {WORDS.reduce((a, b) => (a.length > b.length ? a : b))}
              </span>
            </span>
          </span>
          <span> la vida que mereces.</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-white/25 text-sm tracking-wider uppercase mb-12"
        >
          Sin filtros. Sin excusas.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/libros"
            className="group inline-flex items-center gap-3 bg-[#f26822] hover:bg-[#d45c1a] text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base shadow-xl shadow-[#f26822]/20 hover:shadow-[#f26822]/35"
          >
            Ver todos los libros
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
          <a
            href="#about"
            className="inline-flex items-center gap-2 border border-white/15 text-white/65 hover:border-white/35 hover:text-white font-medium px-8 py-4 rounded-xl transition-all duration-200 text-base"
          >
            Conoce al autor
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto border-t border-white/[0.07] pt-10"
        >
          {[
            { value: '5+', label: 'Libros publicados' },
            { value: '10k+', label: 'Lectores' },
            { value: '15+', label: 'Años de experiencia' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 + i * 0.08 }}
            >
              <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
              <p className="text-white/30 text-[10px] mt-1.5 uppercase tracking-[0.15em]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator — animated pulse */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent"
        />
      </motion.div>
    </section>
  )
}

export default HeroSection
