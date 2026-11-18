import { Check } from 'lucide-react'

export default function LocationCard({ location, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(location)}
      className={`w-full text-left p-4 rounded-xl border transition-all relative ${
        selected
          ? 'border-blue-500 bg-blue-500/10 shadow-md shadow-blue-500/10'
          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
      }`}
    >
      {selected && (
        <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
          <Check size={11} className="text-white" />
        </div>
      )}
      <div className="text-3xl mb-2.5">{location.flag_emoji}</div>
      <div className="font-semibold text-white text-sm">{location.city}</div>
      <div className="text-xs text-gray-500 mt-0.5">{location.country}</div>
      {location.name && (
        <div className="text-xs text-gray-600 mt-1 font-mono">{location.name}</div>
      )}
    </button>
  )
}
