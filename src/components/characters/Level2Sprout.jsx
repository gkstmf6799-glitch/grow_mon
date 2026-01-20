export default function Level2Sprout({ className = "w-32 h-32" }) {
  return (
    <svg className={className} viewBox="0 0 120 140">
      {/* Ground */}
      <ellipse cx="60" cy="125" rx="50" ry="12" fill="#8B7355" opacity="0.3"/>

      {/* Seed cracking */}
      <path d="M 40 95 Q 40 70 50 60" stroke="#A5D6A7" strokeWidth="3" fill="none"/>
      <path d="M 80 95 Q 80 70 70 60" stroke="#A5D6A7" strokeWidth="3" fill="none"/>

      {/* Main body (sprouting) */}
      <ellipse cx="60" cy="100" rx="30" ry="35" fill="#C8E6C9"/>

      {/* Two small leaves sprouting */}
      <ellipse cx="45" cy="70" rx="15" ry="20" fill="#81C784" transform="rotate(-30 45 70)"/>
      <ellipse cx="75" cy="70" rx="15" ry="20" fill="#81C784" transform="rotate(30 75 70)"/>

      {/* Leaf veins */}
      <path d="M 45 60 L 45 80" stroke="#66BB6A" strokeWidth="1.5"/>
      <path d="M 75 60 L 75 80" stroke="#66BB6A" strokeWidth="1.5"/>

      {/* Cute face */}
      <circle cx="52" cy="95" r="4" fill="#333"/>
      <circle cx="68" cy="95" r="4" fill="#333"/>
      <path d="M 52 105 Q 60 110 68 105" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

      {/* Rosy cheeks */}
      <circle cx="42" cy="100" r="6" fill="#FFB6C1" opacity="0.4"/>
      <circle cx="78" cy="100" r="6" fill="#FFB6C1" opacity="0.4"/>

      {/* Dewdrops */}
      <circle cx="40" cy="65" r="3" fill="#B3E5FC" opacity="0.7"/>
      <circle cx="80" cy="65" r="3" fill="#B3E5FC" opacity="0.7"/>
    </svg>
  );
}
