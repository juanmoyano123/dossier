import { motion } from 'framer-motion'
import { Check, X, AlertTriangle } from 'lucide-react'

const icons = {
  success: Check,
  error: X,
  warning: AlertTriangle,
}

function Toast({ message, type = 'success', onClose }) {
  const Icon = icons[type] || icons.success

  const getClassName = () => {
    switch (type) {
      case 'success':
        return 'toast toast-success'
      case 'error':
        return 'toast toast-error'
      case 'warning':
        return 'toast toast-warning'
      default:
        return 'toast toast-success'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={getClassName()}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="flex-1">{message}</p>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

export default Toast
