import React from 'react'
import { motion } from 'motion/react'
import { TestimonialsColumn, type Testimonial } from '../ui/testimonials-columns-1'

const testimonials: Testimonial[] = [
  {
    text: 'El Arte de Construir tu Destino cambió completamente mi perspectiva. Dejé de esperar el momento perfecto y empecé a actuar. En tres meses renuncié a un trabajo que odiaba y lancé mi emprendimiento.',
    image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=80&h=80&fit=crop&crop=face',
    name: 'Valentina Torres',
    role: 'Emprendedora, Bogotá',
  },
  {
    text: 'Disciplina Radical me enseñó que la motivación es efímera — los sistemas son eternos. Llevo seis meses con mis hábitos intactos por primera vez en mi vida.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    name: 'Andrés Morales',
    role: 'Gerente de Proyectos, Medellín',
  },
  {
    text: 'Liderazgo desde Adentro debería ser lectura obligatoria en cualquier empresa. Mi equipo notó el cambio en mí antes de que yo lo hiciera. Hernan escribe con una claridad brutal y necesaria.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face',
    name: 'Carolina Ríos',
    role: 'Directora Comercial, Cali',
  },
  {
    text: 'La Mente del Emprendedor fue el empujón que necesitaba. Hernan desmonta los miedos uno a uno. No hay relleno, no hay motivación vacía — solo verdades que duelen y transforman.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    name: 'Felipe Gutiérrez',
    role: 'Fundador de startup, Cartagena',
  },
  {
    text: 'Conexión Humana me ayudó a reconstruir relaciones que creía perdidas. Apliqué los principios con mi equipo y con mi familia — el resultado fue inmediato y poderoso.',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face',
    name: 'Natalia Vargas',
    role: 'Coach de vida, Barranquilla',
  },
  {
    text: 'Pensé que era otro libro de autoayuda más. Me equivoqué. Hernan va al hueso desde la primera página. Sin clichés, sin frases motivacionales vacías. Solo trabajo real.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face',
    name: 'Sebastián Peña',
    role: 'Consultor independiente, Bogotá',
  },
  {
    text: 'Compré Disciplina Radical para un colega y terminé releyéndolo yo tres veces. Los capítulos sobre diseño de entorno son los más prácticos que he leído en cualquier libro de hábitos.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    name: 'Mariana López',
    role: 'Psicóloga organizacional, Medellín',
  },
  {
    text: 'Lo que más valoro de Hernan es que escribe desde la experiencia real, no desde la teoría. Cada capítulo de Liderazgo desde Adentro tiene aplicación inmediata en el día a día.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    name: 'Diego Hernández',
    role: 'CEO, empresa familiar, Cúcuta',
  },
  {
    text: 'El Arte de Construir tu Destino me lo regalaron en un momento muy difícil. No exagero al decir que me ayudó a salir de la parálisis y tomar decisiones que cambié mi vida.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face',
    name: 'Juliana Restrepo',
    role: 'Diseñadora, freelance',
  },
]

const firstColumn = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn = testimonials.slice(6, 9)

const Testimonials: React.FC = () => {
  return (
    <section className="bg-[#2c2b2b] py-24 relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#f26822] opacity-[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center max-w-xl mx-auto text-center mb-16"
        >
          <div className="border border-[#f26822]/30 text-[#f26822] text-xs font-semibold uppercase tracking-widest py-1.5 px-4 rounded-full mb-5">
            Testimonios
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Lo que dicen los lectores
          </h2>
          <p className="text-white/50 text-base leading-relaxed">
            Miles de personas en toda Latinoamérica han transformado su vida con los libros de Hernan Figueredo.
          </p>
        </motion.div>

        {/* Scrolling columns */}
        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={18} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={22} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={16} />
        </div>
      </div>
    </section>
  )
}

export default Testimonials
