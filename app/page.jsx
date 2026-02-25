"use client"

import Pricing from "@/components/pricing"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowRight,
  Sparkles,
  
  CheckCircle,

  Github,
  Twitter,
  Linkedin
} from "lucide-react"
import { motion } from "framer-motion"
import { features, creditBenefits, testimonials } from "@/lib/data"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } }
}

function Counter({ value }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 1200
    const increment = value / (duration / 16)

    const counter = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        clearInterval(counter)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(counter)
  }, [value])

  return <span>{count}</span>
}

export default function Home() {
  return (
    <div className="bg-slate-950 text-white overflow-hidden">

      {/* HERO */}
      <section className="relative py-32">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute right-0 top-0 w-[500px] h-[500px] bg-blue-600/10 blur-3xl rounded-full"
        />

        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">

            <motion.div variants={fadeUp}>
              <Badge className="bg-blue-600/10 text-blue-400 border-blue-600/20">
               Healthcare Made Simple
              </Badge>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl font-bold leading-tight">
              The Future of <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Intelligent Healthcare
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-slate-400 text-lg max-w-lg">
              Secure, seamless, and AI-driven digital consultations designed for modern healthcare needs.
            </motion.p>

            <motion.div variants={fadeUp} className="flex gap-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all">
                <Link href="/onboarding">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="border-slate-700 hover:bg-slate-800 hover:scale-105 transition-all">
                <Link href="/doctors">Explore Doctors</Link>
              </Button>
            </motion.div>
          </motion.div>

          <div className="relative h-[520px] rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden">
            <Image src="/banner.png" alt="Dashboard" fill className="object-contain p-10" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 border-t border-slate-800 text-center">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-3xl font-bold text-blue-400"><Counter value={15000}/>+</h3>
            <p className="text-slate-400">Appointments</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-400"><Counter value={2000}/>+</h3>
            <p className="text-slate-400">Verified Doctors</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-400"><Counter value={98}/> %</h3>
            <p className="text-slate-400">Satisfaction</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-400">24/7</h3>
            <p className="text-slate-400">Support</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <motion.section initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="py-24 border-t border-slate-800">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Card className="bg-slate-900 border-slate-800 hover:border-blue-600/40 transition-all hover:-translate-y-2">
                <CardHeader>
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-600/10">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>
      

      {/* CREDIT SYSTEM */}
      <section className="py-24 border-t border-slate-800 max-w-3xl mx-auto px-6 space-y-6">
        {creditBenefits.map((benefit, i) => (
          <div key={i} className="flex items-start gap-4 p-6 bg-slate-900 border border-slate-800 rounded-xl">
            <CheckCircle className="text-blue-400 mt-1"/>
            <p className="text-slate-400" dangerouslySetInnerHTML={{ __html: benefit }}/>
          </div>
        ))}
        
      </section>

      {/* TESTIMONIALS */}
       <section className="py-24 bg-slate-950 relative overflow-hidden">
  {/* Background Glow */}
  <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full"></div>

  <div className="container mx-auto px-6 relative">
    <div className="text-center mb-20">
      <Badge
        variant="outline"
        className="bg-blue-600/10 border-blue-600/30 px-4 py-1 text-blue-400 text-sm font-medium mb-4"
      >
        Success Stories
      </Badge>

      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
        What Our Users Say
      </h2>

      <p className="text-slate-400 text-lg max-w-2xl mx-auto">
        Real experiences from patients and doctors using Medigo.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {testimonials.map((testimonial, index) => (
        <Card
          key={index}
          className="bg-slate-900 border border-slate-800 hover:border-blue-600/40 hover:-translate-y-2 transition-all duration-300 shadow-lg"
        >
          <CardContent className="p-8 space-y-6">

            {/* Profile */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-blue-600/10 flex items-center justify-center">
                <span className="text-blue-400 font-bold text-lg">
                  {testimonial.initials}
                </span>
              </div>

              <div>
                <h4 className="font-semibold text-white text-lg">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-slate-400">
                  {testimonial.role}
                </p>
              </div>
            </div>

            {/* Quote */}
            <p className="text-slate-400 leading-relaxed text-sm">
              “{testimonial.quote}”
            </p>

            {/* Subtle bottom accent line */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-blue-600/40 to-transparent"></div>

          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>

      {/* PRICING */}
      <section className="py-24 border-t border-slate-800 text-center">
        <h2 className="text-4xl font-bold mb-12">Flexible Plans</h2>
        <Pricing/>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 border-t border-slate-800 text-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Sparkles className="mx-auto text-blue-400 mb-6" size={40} />
        </motion.div>

        <h2 className="text-4xl font-bold">
          Experience the Future of Healthcare
        </h2>

        <p className="text-slate-400 mt-4 mb-8">
          Join Medigo and redefine how you connect with doctors.
        </p>

        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all">
          <Link href="/sign-up">Create Your Account</Link>
        </Button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-16 mt-20">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Medigo</h3>
            <p className="text-slate-400 text-sm">
              Redefining digital healthcare with intelligence, security, and simplicity.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link href="#">Features</Link></li>
              <li><Link href="#">Pricing</Link></li>
              <li><Link href="#">Doctors</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link href="#">About</Link></li>
              <li><Link href="#">Careers</Link></li>
              <li><Link href="#">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Connect</h4>
            <div className="flex gap-4 text-slate-400">
              <Github/>
              <Twitter/>
              <Linkedin/>
            </div>
          </div>
        </div>

        <div className="text-center text-slate-500 text-sm mt-12">
          © {new Date().getFullYear()} Medigo. All rights reserved.
        </div>
      </footer>

    </div>
  )
}
