import React from 'react';

const Level5Fruit = () => {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* 줄기 */}
      <path d="M100 140 Q95 110, 100 90 Q105 110, 100 140" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2"/>

      {/* 잎사귀들 */}
      <ellipse cx="80" cy="110" rx="15" ry="10" fill="#81C784" stroke="#2E7D32" strokeWidth="1.5" transform="rotate(-25 80 110)"/>
      <ellipse cx="120" cy="115" rx="15" ry="10" fill="#81C784" stroke="#2E7D32" strokeWidth="1.5" transform="rotate(25 120 115)"/>
      <ellipse cx="75" cy="95" rx="13" ry="8" fill="#66BB6A" stroke="#2E7D32" strokeWidth="1.5" transform="rotate(-40 75 95)"/>
      <ellipse cx="125" cy="98" rx="13" ry="8" fill="#66BB6A" stroke="#2E7D32" strokeWidth="1.5" transform="rotate(40 125 98)"/>

      {/* 열매들 */}
      <g>
        {/* 왼쪽 열매 */}
        <circle cx="85" cy="80" r="18" fill="#FF6B6B" stroke="#C92A2A" strokeWidth="2"/>
        <ellipse cx="82" cy="77" rx="6" ry="8" fill="#FF8787" opacity="0.6"/>
        <path d="M 85 62 Q 83 67, 85 70" stroke="#4CAF50" strokeWidth="2" fill="none"/>
        <ellipse cx="85" cy="61" rx="4" ry="3" fill="#81C784" stroke="#2E7D32" strokeWidth="1"/>

        {/* 오른쪽 열매 */}
        <circle cx="115" cy="85" r="18" fill="#FF6B6B" stroke="#C92A2A" strokeWidth="2"/>
        <ellipse cx="112" cy="82" rx="6" ry="8" fill="#FF8787" opacity="0.6"/>
        <path d="M 115 67 Q 113 72, 115 75" stroke="#4CAF50" strokeWidth="2" fill="none"/>
        <ellipse cx="115" cy="66" rx="4" ry="3" fill="#81C784" stroke="#2E7D32" strokeWidth="1"/>

        {/* 중앙 열매 (가장 큼) */}
        <circle cx="100" cy="75" r="22" fill="#FF5252" stroke="#C92A2A" strokeWidth="2"/>
        <ellipse cx="96" cy="70" rx="8" ry="10" fill="#FF8787" opacity="0.6"/>
        <path d="M 100 53 Q 98 60, 100 65" stroke="#4CAF50" strokeWidth="2.5" fill="none"/>
        <ellipse cx="100" cy="52" rx="5" ry="4" fill="#81C784" stroke="#2E7D32" strokeWidth="1"/>

        {/* 중앙 열매에 얼굴 */}
        <circle cx="94" cy="73" r="3" fill="#000"/>
        <circle cx="106" cy="73" r="3" fill="#000"/>
        <circle cx="95" cy="72" r="1.5" fill="#FFF"/>
        <circle cx="107" cy="72" r="1.5" fill="#FFF"/>

        {/* 미소 */}
        <path d="M 94 80 Q 100 84, 106 80" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round"/>

        {/* 볼 홍조 */}
        <ellipse cx="87" cy="77" rx="4" ry="3" fill="#FFB3D9" opacity="0.7"/>
        <ellipse cx="113" cy="77" rx="4" ry="3" fill="#FFB3D9" opacity="0.7"/>
      </g>

      {/* 꽃들 */}
      <g>
        <circle cx="130" cy="70" r="4" fill="#FFD700"/>
        <circle cx="127" cy="67" r="2.5" fill="#FFE082"/>
        <circle cx="133" cy="67" r="2.5" fill="#FFE082"/>
        <circle cx="127" cy="73" r="2.5" fill="#FFE082"/>
        <circle cx="133" cy="73" r="2.5" fill="#FFE082"/>

        <circle cx="70" cy="85" r="4" fill="#FFD700"/>
        <circle cx="67" cy="82" r="2.5" fill="#FFE082"/>
        <circle cx="73" cy="82" r="2.5" fill="#FFE082"/>
        <circle cx="67" cy="88" r="2.5" fill="#FFE082"/>
        <circle cx="73" cy="88" r="2.5" fill="#FFE082"/>
      </g>

      {/* 나비들 */}
      <g transform="translate(145, 100)">
        <ellipse cx="0" cy="0" rx="6" ry="8" fill="#FFE082" stroke="#FFA000" strokeWidth="1"/>
        <ellipse cx="9" cy="0" rx="6" ry="8" fill="#FFE082" stroke="#FFA000" strokeWidth="1"/>
        <ellipse cx="-1" cy="-1" rx="4" ry="6" fill="#FF6B9D" stroke="#E91E63" strokeWidth="0.5"/>
        <ellipse cx="10" cy="-1" rx="4" ry="6" fill="#FF6B9D" stroke="#E91E63" strokeWidth="0.5"/>
        <line x1="4.5" y1="-4" x2="3" y2="-8" stroke="#000" strokeWidth="0.8"/>
        <line x1="4.5" y1="-4" x2="6" y2="-8" stroke="#000" strokeWidth="0.8"/>
      </g>

      {/* 반짝이 효과 */}
      <g opacity="0.8">
        <path d="M 55 60 L 57 64 L 61 64 L 58 67 L 59 71 L 55 68 L 51 71 L 52 67 L 49 64 L 53 64 Z" fill="#FFD700">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite"/>
        </path>
        <path d="M 140 55 L 141 58 L 144 58 L 142 60 L 143 63 L 140 61 L 137 63 L 138 60 L 136 58 L 139 58 Z" fill="#FFD700">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2.2s" repeatCount="indefinite"/>
        </path>
        <path d="M 100 40 L 101 43 L 104 43 L 102 45 L 103 48 L 100 46 L 97 48 L 98 45 L 96 43 L 99 43 Z" fill="#FFD700">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
        </path>
      </g>
    </svg>
  );
};

export default Level5Fruit;
