import { motion } from 'framer-motion';
import { Loader2, GraduationCap, Brain } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  variant?: 'default' | 'minimal' | 'full';
}

export const LoadingSpinner = ({ 
  size = 'md', 
  message = 'Loading...', 
  variant = 'default' 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48
  };

  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6">
          {/* Animated Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative flex items-center justify-center"
          >
            {/* Outer rotating ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 w-32 h-32 border-4 border-primary/20 border-t-primary rounded-full"
            />
            
            {/* Middle rotating ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-2 w-28 h-28 border-4 border-primary/30 border-r-primary rounded-full"
            />
            
            {/* Inner pulsing icon */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative z-10 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <GraduationCap className="w-10 h-10 text-primary" />
            </motion.div>
          </motion.div>

          {/* Loading text with gradient */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {message}
            </h3>
            
            {/* Animated dots */}
            <div className="flex items-center justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
              ))}
            </div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full overflow-hidden"
          >
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="h-full w-1/3 bg-gradient-to-r from-transparent via-background to-transparent"
            />
          </motion.div>
        </div>
      </div>
    );
  }

  // Default variant - compact but attractive
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      {/* Spinning rings with icon */}
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className={`absolute ${sizeClasses[size]} border-3 border-primary/20 border-t-primary rounded-full`}
        />
        
        {/* Inner ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className={`absolute ${sizeClasses[size]} scale-75 border-3 border-primary/30 border-b-primary rounded-full`}
        />
        
        {/* Center icon */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Brain className="text-primary" size={iconSizes[size] * 0.5} />
        </motion.div>
      </div>

      {/* Loading text */}
      {message && (
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-sm text-muted-foreground font-medium"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};
