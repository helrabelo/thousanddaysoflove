'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HistoriaBackButton() {
  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto text-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Button variant="wedding-outline" size="lg" asChild>
            <Link href="/" className="flex items-center">
              <ArrowLeft className="w-5 h-5 mr-3" />
              Voltar ao Início
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
