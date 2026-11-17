export default function LocationCard({ location, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(location)}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg bg-gray-800 ${
        selected
          ? 'border-blue-500 shadow-blue-500/30 shadow-md'
          : 'border-gray-700 hover:border-gray-500'
      }`}
    >
      <div className="text-4xl mb-2">{location.flag_emoji}</div>
      <div className="font-semibold text-white">{location.city}</div>
      <div className="text-sm text-gray-400">{location.country}</div>
      {location.name && (
        <div className="text-xs text-gray-500 mt-1">{location.name}</div>
      )}
    </button>
  )
}
