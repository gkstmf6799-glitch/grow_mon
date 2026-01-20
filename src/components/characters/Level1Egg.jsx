export default function Level1Egg({ className = "w-32 h-32" }) {
  return (
    <svg className={className} viewBox="0 0 120 140">
      {/* Ground */}
      <ellipse cx="60" cy="125" rx="50" ry="12" fill="#8B7355" opacity="0.3"/>

      {/* Egg body */}
      <ellipse cx="60" cy="90" rx="40" ry="50" fill="#E8F5E9"/>
      <ellipse cx="60" cy="90" rx="35" ry="45" fill="#C8E6C9"/>

      {/* Spots on egg */}
      <circle cx="45" cy="75" r="6" fill="#A5D6A7" opacity="0.6"/>
      <circle cx="75" cy="80" r="5" fill="#A5D6A7" opacity="0.6"/>
      <circle cx="55" cy="100" r="7" fill="#A5D6A7" opacity="0.6"/>

      {/* Cute face */}
      <circle cx="50" cy="85" r="4" fill="#333"/>
      <circle cx="70" cy="85" r="4" fill="#333"/>
      <path d="M 50 95 Q 60 100 70 95" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

      {/* Rosy cheeks */}
      <circle cx="40" cy="90" r="6" fill="#FFB6C1" opacity="0.4"/>
      <circle cx="80" cy="90" r="6" fill="#FFB6C1" opacity="0.4"/>

      {/* Small sparkles */}
      <path d="M 25 50 L 27 52 L 25 54 L 23 52 Z" fill="#FFD700"/>
      <path d="M 95 60 L 97 62 L 95 64 L 93 62 Z" fill="#FFD700"/>
    </svg>
  );
}
