export default function Level3Plant({ className = "w-32 h-32" }) {
  return (
    <svg className={className} viewBox="0 0 120 140">
      {/* Ground */}
      <ellipse cx="60" cy="125" rx="50" ry="12" fill="#8B7355" opacity="0.3"/>

      {/* Main stem */}
      <rect x="55" y="70" width="10" height="55" fill="#66BB6A" rx="5"/>

      {/* Leaves - multiple pairs */}
      <ellipse cx="35" cy="100" rx="18" ry="24" fill="#4CAF50" transform="rotate(-25 35 100)"/>
      <ellipse cx="85" cy="100" rx="18" ry="24" fill="#4CAF50" transform="rotate(25 85 100)"/>

      <ellipse cx="30" cy="85" rx="16" ry="22" fill="#66BB6A" transform="rotate(-30 30 85)"/>
      <ellipse cx="90" cy="85" rx="16" ry="22" fill="#66BB6A" transform="rotate(30 90 85)"/>

      <ellipse cx="38" cy="70" rx="15" ry="20" fill="#81C784" transform="rotate(-20 38 70)"/>
      <ellipse cx="82" cy="70" rx="15" ry="20" fill="#81C784" transform="rotate(20 82 70)"/>

      {/* Leaf veins */}
      <path d="M 35 88 L 35 112" stroke="#2E7D32" strokeWidth="1.5"/>
      <path d="M 85 88 L 85 112" stroke="#2E7D32" strokeWidth="1.5"/>

      {/* Face on top leaf area */}
      <ellipse cx="60" cy="55" rx="20" ry="22" fill="#A5D6A7"/>
      <circle cx="53" cy="52" r="4" fill="#333"/>
      <circle cx="67" cy="52" r="4" fill="#333"/>
      <path d="M 53 60 Q 60 65 67 60" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

      {/* Rosy cheeks */}
      <circle cx="45" cy="57" r="5" fill="#FFB6C1" opacity="0.4"/>
      <circle cx="75" cy="57" r="5" fill="#FFB6C1" opacity="0.4"/>

      {/* Small butterfly friend */}
      <ellipse cx="95" cy="60" rx="4" ry="6" fill="#FFB3BA" transform="rotate(-20 95 60)"/>
      <ellipse cx="103" cy="60" rx="4" ry="6" fill="#FFB3BA" transform="rotate(20 103 60)"/>
      <circle cx="99" cy="60" r="2" fill="#333"/>
    </svg>
  );
}
