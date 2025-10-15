import { motion } from 'framer-motion';
import Image from 'next/image';


export default function HYBadge({ size = 80 }: { size?: number }) {
  return (
    <>
      {/* Header with HY Logo */}
      < motion.div
        initial={{ opacity: 0, scale: 0.8 }
        }
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex justify-center mb-8"
      >
        <Image
          src="/HY.svg"
          alt="Hel & Ylana"
          width={size}
          height={size}
          className="opacity-80"
          style={{
            filter: 'brightness(0) saturate(100%)',
            color: 'var(--decorative)'
          }}
        />
      </motion.div >
    </>
  )
}
