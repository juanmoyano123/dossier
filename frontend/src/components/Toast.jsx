import { motion } from 'framer-motion'
import { Check, X, AlertTriangle, Info } from 'lucide-react'

const icons = {
  success: Check,
  error: X,
  warning: AlertTriangle,
  info: Info,
}

const styles = {
  success: 'bg-emerald-500 text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-amber-500 text-white',
  info: 'bg-blue-500 text-white',
}

function Toast({ message, type = 'success', onClose }) {
  const Icon = icons[type] || icons.info
  const style = styles[type] || styles.info

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl ${style}`}
    >
      <div className="p-1.5 rounded-lg bg-white/20">
        <Icon className="w-5 h-5" />
      </div>
      <p className="font-medium pr-2">{message}</p>
      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-white/20 transition-colors ml-2"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

export default Toast
