import React from 'react';

const Level4Flower = () => {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* 줄기 */}
      <path d="M100 140 Q95 120, 100 100 Q105 120, 100 140" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2"/>

      {/* 잎사귀들 */}
      <ellipse cx="85" cy="120" rx="12" ry="8" fill="#81C784" stroke="#2E7D32" strokeWidth="1.5" transform="rotate(-30 85 120)"/>
      <ellipse cx="115" cy="125" rx="12" ry="8" fill="#81C784" stroke="#2E7D32" strokeWidth="1.5" transform="rotate(30 115 125)"/>

      {/* 꽃잎들 (5개) */}
      <ellipse cx="100" cy="70" rx="15" ry="20" fill="#FF6B9D" stroke="#E91E63" strokeWidth="2"/>
      <ellipse cx="75" cy="85" rx="15" ry="20" fill="#FFB3D9" stroke="#E91E63" strokeWidth="2" transform="rotate(-72 75 85)"/>
      <ellipse cx="82" cy="112" rx="15" ry="20" fill="#FF6B9D" stroke="#E91E63" strokeWidth="2" transform="rotate(-144 82 112)"/>
      <ellipse cx="118" cy="112" rx="15" ry="20" fill="#FFB3D9" stroke="#E91E63" strokeWidth="2" transform="rotate(144 118 112)"/>
      <ellipse cx="125" cy="85" rx="15" ry="20" fill="#FF6B9D" stroke="#E91E63" strokeWidth="2" transform="rotate(72 125 85)"/>

      {/* 꽃 중심 */}
      <circle cx="100" cy="93" r="12" fill="#FFD700" stroke="#FFA000" strokeWidth="2"/>
      <circle cx="97" cy="90" r="2" fill="#FFA000"/>
      <circle cx="103" cy="90" r="2" fill="#FFA000"/>
      <circle cx="95" cy="95" r="2" fill="#FFA000"/>
      <circle cx="100" cy="96" r="2" fill="#FFA000"/>
      <circle cx="105" cy="95" r="2" fill="#FFA000"/>

      {/* 얼굴 */}
      <circle cx="94" cy="88" r="3" fill="#000"/>
      <circle cx="106" cy="88" r="3" fill="#000"/>
      <circle cx="95" cy="87" r="1.5" fill="#FFF"/>
      <circle cx="107" cy="87" r="1.5" fill="#FFF"/>

      {/* 미소 */}
      <path d="M 94 95 Q 100 98, 106 95" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round"/>

      {/* 볼 홍조 */}
      <ellipse cx="88" cy="92" rx="4" ry="3" fill="#FFB3D9" opacity="0.6"/>
      <ellipse cx="112" cy="92" rx="4" ry="3" fill="#FFB3D9" opacity="0.6"/>

      {/* 나비 친구 */}
      <g transform="translate(140, 60)">
        <ellipse cx="0" cy="0" rx="8" ry="10" fill="#FFE082" stroke="#FFA000" strokeWidth="1.5"/>
        <ellipse cx="12" cy="0" rx="8" ry="10" fill="#FFE082" stroke="#FFA000" strokeWidth="1.5"/>
        <ellipse cx="-1" cy="-2" rx="6" ry="8" fill="#FF6B9D" stroke="#E91E63" strokeWidth="1"/>
        <ellipse cx="13" cy="-2" rx="6" ry="8" fill="#FF6B9D" stroke="#E91E63" strokeWidth="1"/>
        <line x1="6" y1="-5" x2="4" y2="-10" stroke="#000" strokeWidth="1"/>
        <line x1="6" y1="-5" x2="8" y2="-10" stroke="#000" strokeWidth="1"/>
        <circle cx="4" cy="-10" r="1" fill="#FFD700"/>
        <circle cx="8" cy="-10" r="1" fill="#FFD700"/>
      </g>

      {/* 반짝이 효과 */}
      <g opacity="0.7">
        <path d="M 60 50 L 62 54 L 66 54 L 63 57 L 64 61 L 60 58 L 56 61 L 57 57 L 54 54 L 58 54 Z" fill="#FFD700">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
        </path>
        <path d="M 135 40 L 136 43 L 139 43 L 137 45 L 138 48 L 135 46 L 132 48 L 133 45 L 131 43 L 134 43 Z" fill="#FFD700">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2.5s" repeatCount="indefinite"/>
        </path>
      </g>
    </svg>
  );
};

export default Level4Flower;
