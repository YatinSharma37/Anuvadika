import { motion } from 'framer-motion';

interface BubbleAnimationProps {
  count?: number;
  size?: number;
  color?: string;
  duration?: number;
}

export const BubbleAnimation = ({
  count = 20,
  size = 2,
  color = 'bg-primary/20',
  duration = 3,
}: BubbleAnimationProps) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute ${color} rounded-full`}
          style={{
            width: size,
            height: size,
          }}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 2 + 1,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50],
            x: [0, Math.random() * 100 - 50],
            scale: [1, Math.random() * 2 + 1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: Math.random() * duration + duration,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}; 