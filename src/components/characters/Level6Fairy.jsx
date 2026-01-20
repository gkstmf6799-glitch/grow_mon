import React from 'react';

const Level6Fairy = () => {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* 날개들 */}
      <g opacity="0.8">
        {/* 왼쪽 날개 */}
        <ellipse cx="70" cy="90" rx="25" ry="35" fill="#E1BEE7" stroke="#9C27B0" strokeWidth="2" transform="rotate(-20 70 90)"/>
        <ellipse cx="72" cy="88" rx="18" ry="28" fill="#F3E5F5" opacity="0.7" transform="rotate(-20 72 88)"/>
        <ellipse cx="65" cy="75" rx="15" ry="20" fill="#CE93D8" stroke="#9C27B0" strokeWidth="1.5" transform="rotate(-30 65 75)"/>
        <ellipse cx="67" cy="73" rx="10" ry="15" fill="#F3E5F5" opacity="0.7" transform="rotate(-30 67 73)"/>

        {/* 오른쪽 날개 */}
        <ellipse cx="130" cy="90" rx="25" ry="35" fill="#E1BEE7" stroke="#9C27B0" strokeWidth="2" transform="rotate(20 130 90)"/>
        <ellipse cx="128" cy="88" rx="18" ry="28" fill="#F3E5F5" opacity="0.7" transform="rotate(20 128 88)"/>
        <ellipse cx="135" cy="75" rx="15" ry="20" fill="#CE93D8" stroke="#9C27B0" strokeWidth="1.5" transform="rotate(30 135 75)"/>
        <ellipse cx="133" cy="73" rx="10" ry="15" fill="#F3E5F5" opacity="0.7" transform="rotate(30 133 73)"/>
      </g>

      {/* 몸통 */}
      <ellipse cx="100" cy="100" rx="20" ry="28" fill="#FFE082" stroke="#FFA000" strokeWidth="2"/>
      <ellipse cx="100" cy="95" rx="18" ry="25" fill="#FFF9C4" opacity="0.6"/>

      {/* 머리 */}
      <circle cx="100" cy="70" r="22" fill="#FFD700" stroke="#FFA000" strokeWidth="2"/>
      <ellipse cx="100" cy="68" rx="20" ry="18" fill="#FFECB3" opacity="0.5"/>

      {/* 머리카락/꽃잎 장식 */}
      <g>
        <ellipse cx="85" cy="60" rx="8" ry="10" fill="#FF6B9D" stroke="#E91E63" strokeWidth="1.5" transform="rotate(-30 85 60)"/>
        <ellipse cx="115" cy="60" rx="8" ry="10" fill="#FF6B9D" stroke="#E91E63" strokeWidth="1.5" transform="rotate(30 115 60)"/>
        <ellipse cx="92" cy="55" rx="6" ry="8" fill="#FFB3D9" stroke="#E91E63" strokeWidth="1" transform="rotate(-15 92 55)"/>
        <ellipse cx="108" cy="55" rx="6" ry="8" fill="#FFB3D9" stroke="#E91E63" strokeWidth="1" transform="rotate(15 108 55)"/>
        <circle cx="100" cy="52" r="5" fill="#FF6B9D" stroke="#E91E63" strokeWidth="1.5"/>
      </g>

      {/* 얼굴 */}
      <circle cx="93" cy="68" r="3.5" fill="#000"/>
      <circle cx="107" cy="68" r="3.5" fill="#000"/>
      <circle cx="94.5" cy="66.5" r="2" fill="#FFF"/>
      <circle cx="108.5" cy="66.5" r="2" fill="#FFF"/>

      {/* 큰 미소 */}
      <path d="M 92 75 Q 100 82, 108 75" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

      {/* 볼 홍조 */}
      <ellipse cx="85" cy="72" rx="5" ry="4" fill="#FFB3D9" opacity="0.7"/>
      <ellipse cx="115" cy="72" rx="5" ry="4" fill="#FFB3D9" opacity="0.7"/>

      {/* 팔 */}
      <g stroke="#FFA000" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M 82 95 Q 70 100, 65 110"/>
        <path d="M 118 95 Q 130 100, 135 110"/>
      </g>

      {/* 손 */}
      <circle cx="65" cy="110" r="4" fill="#FFD700" stroke="#FFA000" strokeWidth="1.5"/>
      <circle cx="135" cy="110" r="4" fill="#FFD700" stroke="#FFA000" strokeWidth="1.5"/>

      {/* 다리 */}
      <g stroke="#FFA000" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M 95 125 L 90 140"/>
        <path d="M 105 125 L 110 140"/>
      </g>

      {/* 발 */}
      <ellipse cx="90" cy="142" rx="5" ry="3" fill="#FFD700" stroke="#FFA000" strokeWidth="1.5"/>
      <ellipse cx="110" cy="142" rx="5" ry="3" fill="#FFD700" stroke="#FFA000" strokeWidth="1.5"/>

      {/* 마법 지팡이 */}
      <g transform="translate(135, 110)">
        <line x1="0" y1="0" x2="20" y2="-25" stroke="#9C27B0" strokeWidth="2"/>
        <path d="M 20 -25 L 22 -28 L 25 -25 L 22 -22 Z" fill="#FFD700" stroke="#FFA000" strokeWidth="1.5">
          <animateTransform attributeName="transform" type="rotate" from="0 20 -25" to="360 20 -25" dur="3s" repeatCount="indefinite"/>
        </path>
        <circle cx="20" cy="-25" r="5" fill="#FFD700" opacity="0.5">
          <animate attributeName="r" values="5;7;5" dur="1.5s" repeatCount="indefinite"/>
        </circle>
      </g>

      {/* 마법 효과 */}
      <g opacity="0.9">
        <circle cx="155" cy="85" r="3" fill="#FF6B9D">
          <animate attributeName="cy" values="85;75;85" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="160" cy="90" r="2" fill="#FFD700">
          <animate attributeName="cy" values="90;82;90" dur="2.3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0.3;1" dur="2.3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="150" cy="80" r="2.5" fill="#E1BEE7">
          <animate attributeName="cy" values="80;72;80" dur="1.8s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite"/>
        </circle>
      </g>

      {/* 반짝이들 */}
      <g opacity="0.8">
        <path d="M 50 70 L 52 74 L 56 74 L 53 77 L 54 81 L 50 78 L 46 81 L 47 77 L 44 74 L 48 74 Z" fill="#FFD700">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
        </path>
        <path d="M 145 50 L 146 53 L 149 53 L 147 55 L 148 58 L 145 56 L 142 58 L 143 55 L 141 53 L 144 53 Z" fill="#FFD700">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
        </path>
        <path d="M 100 35 L 101 38 L 104 38 L 102 40 L 103 43 L 100 41 L 97 43 L 98 40 L 96 38 L 99 38 Z" fill="#FFD700">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="1.8s" repeatCount="indefinite"/>
        </path>
        <path d="M 70 120 L 71 122 L 73 122 L 72 124 L 72.5 126 L 70 124.5 L 67.5 126 L 68 124 L 67 122 L 69 122 Z" fill="#FF6B9D">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2.2s" repeatCount="indefinite"/>
        </path>
      </g>
    </svg>
  );
};

export default Level6Fairy;
