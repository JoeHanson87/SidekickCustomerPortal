interface ProofImageProps {
  productName: string;
  company: string;
  categoryId: string;
}

const PROOF_CONFIGS: Record<string, { bg: string; accent: string; shape: string }> = {
  'stationery': { bg: '#4F46E5', accent: '#818CF8', shape: 'card' },
  'brochures': { bg: '#0284C7', accent: '#38BDF8', shape: 'brochure' },
  'clothing': { bg: '#059669', accent: '#34D399', shape: 'tshirt' },
  'fliers': { bg: '#D97706', accent: '#FCD34D', shape: 'flier' },
  'promotional': { bg: '#BE185D', accent: '#F472B6', shape: 'mug' },
};

export default function ProofImage({ productName, company, categoryId }: ProofImageProps) {
  const cfg = PROOF_CONFIGS[categoryId] ?? { bg: '#374151', accent: '#9CA3AF', shape: 'card' };

  return (
    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shadow-sm">
      <svg
        viewBox="0 0 600 450"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        role="img"
        aria-label={`Proof preview for ${productName}`}
      >
        {/* Background */}
        <rect width="600" height="450" fill="#F9FAFB" />

        {/* Header bar */}
        <rect width="600" height="70" fill={cfg.bg} />

        {/* Logo placeholder in header */}
        <rect x="20" y="18" width="36" height="36" rx="8" fill={cfg.accent} />
        <circle cx="38" cy="29" r="7" fill="white" opacity="0.8" />
        <path d={`M27 42 Q38 34 49 42`} stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />

        {/* Company name in header */}
        <rect x="68" y="24" width="160" height="10" rx="5" fill="white" opacity="0.9" />
        <rect x="68" y="40" width="100" height="7" rx="3.5" fill="white" opacity="0.5" />

        {/* Product name badge */}
        <rect x="450" y="20" width="130" height="30" rx="8" fill={cfg.accent} opacity="0.8" />
        <rect x="462" y="29" width="106" height="8" rx="4" fill="white" opacity="0.9" />

        {/* Main content area */}
        {cfg.shape === 'card' && <BusinessCardPreview accent={cfg.accent} bg={cfg.bg} />}
        {cfg.shape === 'brochure' && <BrochurePreview accent={cfg.accent} bg={cfg.bg} />}
        {cfg.shape === 'tshirt' && <TshirtPreview accent={cfg.accent} bg={cfg.bg} />}
        {cfg.shape === 'flier' && <FlierPreview accent={cfg.accent} bg={cfg.bg} />}
        {cfg.shape === 'mug' && <MugPreview accent={cfg.accent} bg={cfg.bg} />}

        {/* Content placeholder lines */}
        <rect x="30" y="340" width="240" height="8" rx="4" fill="#E5E7EB" />
        <rect x="30" y="355" width="180" height="8" rx="4" fill="#E5E7EB" />
        <rect x="30" y="370" width="210" height="8" rx="4" fill="#E5E7EB" />

        {/* Right side info */}
        <rect x="330" y="340" width="120" height="7" rx="3.5" fill="#E5E7EB" />
        <rect x="330" y="355" width="90" height="7" rx="3.5" fill="#E5E7EB" />
        <rect x="330" y="370" width="140" height="7" rx="3.5" fill="#E5E7EB" />

        {/* PROOF watermark */}
        <text
          x="300"
          y="240"
          fontSize="80"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          fill="#1a1a2e"
          opacity="0.04"
          textAnchor="middle"
          dominantBaseline="middle"
          transform="rotate(-25 300 240)"
        >
          PROOF
        </text>

        {/* Bottom bar */}
        <rect y="430" width="600" height="20" fill={cfg.bg} opacity="0.15" />
        <text x="300" y="443" fontSize="9" fill={cfg.bg} opacity="0.6" textAnchor="middle" fontFamily="Arial, sans-serif">
          {company.toUpperCase()} · {productName.toUpperCase()} · ARTWORK PROOF
        </text>
      </svg>
    </div>
  );
}

function BusinessCardPreview({ accent, bg }: { accent: string; bg: string }) {
  return (
    <g>
      {/* Card shadow */}
      <rect x="118" y="108" width="220" height="135" rx="8" fill="#0000001A" />
      {/* Card face */}
      <rect x="112" y="100" width="220" height="135" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="1" />
      <rect x="112" y="100" width="220" height="42" rx="8" fill={bg} />
      <rect x="112" y="128" width="220" height="14" fill={bg} />
      <circle cx="152" cy="122" r="12" fill={accent} opacity="0.8" />
      <rect x="174" y="115" width="100" height="7" rx="3.5" fill="white" opacity="0.9" />
      <rect x="174" y="128" width="70" height="5" rx="2.5" fill="white" opacity="0.5" />
      <rect x="130" y="158" width="140" height="6" rx="3" fill="#E5E7EB" />
      <rect x="130" y="170" width="110" height="6" rx="3" fill="#E5E7EB" />
      <rect x="130" y="182" width="125" height="6" rx="3" fill="#E5E7EB" />
      <rect x="130" y="194" width="90" height="6" rx="3" fill="#E5E7EB" />
      {/* Back of card */}
      <rect x="358" y="108" width="140" height="88" rx="6" fill={bg} opacity="0.12" />
      <rect x="368" y="108" width="130" height="88" rx="6" fill={bg} />
      <circle cx="433" cy="152" r="22" fill={accent} opacity="0.7" />
      <circle cx="433" cy="142" r="7" fill="white" opacity="0.8" />
      <path d={`M418 162 Q433 154 448 162`} stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
    </g>
  );
}

function BrochurePreview({ accent, bg }: { accent: string; bg: string }) {
  return (
    <g>
      {/* Brochure panels */}
      <rect x="95" y="100" width="140" height="195" rx="4" fill={bg} />
      <rect x="243" y="100" width="140" height="195" rx="4" fill="white" stroke="#E5E7EB" strokeWidth="1" />
      <rect x="391" y="100" width="120" height="195" rx="4" fill={bg} opacity="0.6" />
      {/* Panel 1 content */}
      <circle cx="165" cy="155" r="28" fill={accent} opacity="0.7" />
      <rect x="120" y="195" width="90" height="7" rx="3.5" fill="white" opacity="0.8" />
      <rect x="130" y="208" width="70" height="6" rx="3" fill="white" opacity="0.5" />
      <rect x="110" y="230" width="100" height="5" rx="2.5" fill="white" opacity="0.4" />
      <rect x="110" y="242" width="90" height="5" rx="2.5" fill="white" opacity="0.4" />
      {/* Panel 2 content */}
      <rect x="260" y="120" width="106" height="7" rx="3.5" fill={bg} opacity="0.8" />
      <rect x="260" y="135" width="80" height="6" rx="3" fill={bg} opacity="0.5" />
      <rect x="260" y="155" width="106" height="5" rx="2.5" fill="#E5E7EB" />
      <rect x="260" y="167" width="95" height="5" rx="2.5" fill="#E5E7EB" />
      <rect x="260" y="179" width="100" height="5" rx="2.5" fill="#E5E7EB" />
      <rect x="260" y="210" width="106" height="60" rx="6" fill={accent} opacity="0.15" />
    </g>
  );
}

function TshirtPreview({ accent, bg }: { accent: string; bg: string }) {
  return (
    <g>
      {/* T-shirt shape */}
      <path
        d="M200 110 L160 130 L140 165 L175 160 L175 280 L330 280 L330 160 L365 165 L345 130 L305 110 L285 130 Q265 145 220 130 Z"
        fill={bg}
        opacity="0.9"
      />
      {/* Collar */}
      <path
        d="M220 130 Q252 148 285 130"
        stroke={accent}
        strokeWidth="3"
        fill="none"
        opacity="0.8"
      />
      {/* Logo on chest */}
      <circle cx="252" cy="185" r="22" fill={accent} opacity="0.8" />
      <circle cx="252" cy="175" r="7" fill="white" opacity="0.9" />
      <path d="M237 192 Q252 184 267 192" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
    </g>
  );
}

function FlierPreview({ accent, bg }: { accent: string; bg: string }) {
  return (
    <g>
      {/* Flier */}
      <rect x="160" y="100" width="185" height="265" rx="6" fill="white" stroke="#E5E7EB" strokeWidth="1" />
      <rect x="160" y="100" width="185" height="100" rx="6" fill={bg} />
      <rect x="160" y="168" width="185" height="32" fill={bg} />
      <circle cx="252" cy="148" r="28" fill={accent} opacity="0.8" />
      <circle cx="252" cy="136" r="9" fill="white" opacity="0.8" />
      <path d="M233 158 Q252 148 271 158" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
      <rect x="180" y="220" width="145" height="7" rx="3.5" fill={bg} opacity="0.7" />
      <rect x="185" y="235" width="125" height="6" rx="3" fill="#E5E7EB" />
      <rect x="185" y="248" width="135" height="6" rx="3" fill="#E5E7EB" />
      <rect x="185" y="261" width="110" height="6" rx="3" fill="#E5E7EB" />
      <rect x="185" y="280" width="145" height="24" rx="8" fill={accent} opacity="0.9" />
      <rect x="205" y="289" width="105" height="6" rx="3" fill="white" opacity="0.9" />
    </g>
  );
}

function MugPreview({ accent, bg }: { accent: string; bg: string }) {
  return (
    <g>
      {/* Mug body */}
      <rect x="175" y="130" width="180" height="155" rx="10" fill="white" stroke="#E5E7EB" strokeWidth="2" />
      {/* Handle */}
      <path
        d="M355 165 Q395 165 395 207 Q395 245 355 248"
        stroke="#E5E7EB"
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M355 165 Q385 165 385 207 Q385 245 355 248"
        stroke="white"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      {/* Mug band */}
      <rect x="175" y="130" width="180" height="30" rx="10" fill={bg} />
      <rect x="175" y="148" width="180" height="12" fill={bg} />
      {/* Logo on mug */}
      <circle cx="265" cy="210" r="35" fill={accent} opacity="0.15" />
      <circle cx="265" cy="210" r="22" fill={accent} opacity="0.8" />
      <circle cx="265" cy="200" r="7" fill="white" opacity="0.9" />
      <path d="M250 217 Q265 209 280 217" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
      {/* Mug base */}
      <rect x="175" y="272" width="180" height="13" rx="6" fill="#E5E7EB" />
    </g>
  );
}
