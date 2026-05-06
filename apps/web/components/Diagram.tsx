'use client';

interface DiagramProps { kind: string; color: string }

export default function Diagram({ kind, color }: DiagramProps) {
  const stroke = color;
  const fill = color + '22';

  if (kind === 'octopus') return (
    <svg viewBox="0 0 240 70" width="100%" height="70" style={{ display: 'block' }}>
      <ellipse cx="60" cy="32" rx="22" ry="18" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      <circle cx="55" cy="28" r="2" fill={stroke}/>
      <circle cx="68" cy="28" r="2" fill={stroke}/>
      {[0,1,2,3,4].map(i => (
        <path key={i} d={`M${42+i*9} 46 Q ${44+i*9} ${56+(i%2)*6} ${48+i*9} ${62+(i%2)*4}`}
          stroke={stroke} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      ))}
      {[0,1,2].map(i => (
        <g key={i} transform={`translate(${130+i*32}, 32)`}>
          <path d="M0 -3 C -3 -7 -10 -7 -10 0 C -10 5 0 11 0 11 C 0 11 10 5 10 0 C 10 -7 3 -7 0 -3 Z"
            fill={i < 2 ? 'none' : fill} stroke={stroke} strokeWidth="1.2"/>
          <text x="0" y="22" fontSize="8" fill={stroke} textAnchor="middle"
            fontFamily="ui-monospace, Menlo, monospace">{i < 2 ? 'gill' : 'sys'}</text>
        </g>
      ))}
    </svg>
  );

  if (kind === 'silk-road') return (
    <svg viewBox="0 0 240 70" width="100%" height="70">
      <path d="M15 50 Q 60 10 110 40 T 225 30" stroke={stroke} strokeWidth="1.4" strokeDasharray="3 3" fill="none"/>
      {([
        { x: 15,  y: 50, l: "Chang'an"  },
        { x: 75,  y: 25, l: 'Samarkand' },
        { x: 145, y: 38, l: 'Baghdad'   },
        { x: 225, y: 30, l: 'Rome'      },
      ] as {x:number;y:number;l:string}[]).map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill={stroke}/>
          <text x={p.x} y={p.y+14} fontSize="8" fill={stroke} textAnchor="middle"
            fontFamily="ui-monospace, Menlo, monospace">{p.l}</text>
        </g>
      ))}
      <text x="120" y="65" fontSize="8" fill={stroke+'99'} textAnchor="middle"
        fontFamily="ui-monospace, Menlo, monospace">≈ 4,000 mi · 130 BCE → 1453 CE</text>
    </svg>
  );

  if (kind === 'cell') return (
    <svg viewBox="0 0 240 70" width="100%" height="70">
      <ellipse cx="60" cy="35" rx="34" ry="26" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      <circle cx="60" cy="35" r="11" fill={stroke+'33'} stroke={stroke} strokeWidth="1.2"/>
      <path d="M55 30 Q 60 25 65 30 M55 38 Q 60 43 65 38" stroke={stroke} strokeWidth="1" fill="none"/>
      <line x1="100" y1="20" x2="115" y2="20" stroke={stroke} strokeWidth="0.8"/>
      <line x1="100" y1="35" x2="115" y2="35" stroke={stroke} strokeWidth="0.8"/>
      <line x1="100" y1="50" x2="115" y2="50" stroke={stroke} strokeWidth="0.8"/>
      <text x="120" y="23" fontSize="8" fill={stroke} fontFamily="ui-monospace, Menlo, monospace">3B base pairs</text>
      <text x="120" y="38" fontSize="8" fill={stroke} fontFamily="ui-monospace, Menlo, monospace">23 chromosome pairs</text>
      <text x="120" y="53" fontSize="8" fill={stroke} fontFamily="ui-monospace, Menlo, monospace">2m unspooled</text>
    </svg>
  );

  if (kind === 'honey') return (
    <svg viewBox="0 0 240 70" width="100%" height="70">
      {[0,1,2,3,4].flatMap(c =>
        [0,1].map(r => {
          const x = 30+c*28+(r%2)*14, y = 18+r*24;
          return <polygon key={`${c}-${r}`} points={`${x},${y} ${x+12},${y} ${x+18},${y+10} ${x+12},${y+20} ${x},${y+20} ${x-6},${y+10}`} fill={fill} stroke={stroke} strokeWidth="1"/>;
        })
      )}
      <text x="195" y="40" fontSize="9" fill={stroke} fontFamily="ui-monospace, Menlo, monospace">pH 3.9</text>
    </svg>
  );

  if (kind === 'banana') return (
    <svg viewBox="0 0 240 70" width="100%" height="70">
      <path d="M30 25 Q 60 65 130 50 Q 80 50 50 30 Z" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      <text x="160" y="32" fontSize="9" fill={stroke} fontFamily="ui-monospace, Menlo, monospace">⁴⁰K</text>
      <text x="160" y="46" fontSize="8" fill={stroke+'99'} fontFamily="ui-monospace, Menlo, monospace">0.1 µSv / banana</text>
      <text x="160" y="58" fontSize="8" fill={stroke+'99'} fontFamily="ui-monospace, Menlo, monospace">lethal: ~10⁷</text>
    </svg>
  );

  if (kind === 'plague') return (
    <svg viewBox="0 0 240 70" width="100%" height="70">
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0 0 L 5 3 L 0 6" fill="none" stroke={stroke} strokeWidth="1"/>
        </marker>
      </defs>
      {(['marmot','flea','rat','human'] as string[]).map((label, i) => (
        <g key={i} transform={`translate(${30+i*55}, 35)`}>
          <circle r="14" fill={fill} stroke={stroke} strokeWidth="1.2"/>
          <text y="3" fontSize="9" fill={stroke} textAnchor="middle" fontFamily="ui-monospace, Menlo, monospace">{label}</text>
        </g>
      ))}
      {[0,1,2].map(i => (
        <path key={i} d={`M${48+i*55} 35 L ${69+i*55} 35`} stroke={stroke} strokeWidth="1.2" markerEnd="url(#arr)"/>
      ))}
    </svg>
  );

  return null;
}
