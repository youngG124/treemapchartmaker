// src/App.tsx
import { FC } from "react";

type Rect = { x: number; y: number; w: number; h: number; weight: number; label: string; id: string };

// 그룹을 먼저 나누고(예: [5,4], [3,2,1]) 긴 변을 따라 그룹 면적 배분 → 각 그룹 내부는 짧은 변을 따라 분할
function treemapTwoGroups(
  width: number,
  height: number,
  groups: number[][]
): Rect[] {
  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  const total = sum(groups.flat());
  const rects: Rect[] = [];

  const alongX = width >= height; // 긴 변 방향

  const groupTotals = groups.map(sum);
  const gFrac = groupTotals.map((gt) => gt / total);

  // 1) 먼저 그룹 영역 배분
  // alongX면 가로로 나누고(세로 전폭), 아니면 세로로 나눔(가로 전폭)
  let anchorX = 0;
  let anchorY = 0;

  for (let g = 0; g < groups.length; g++) {
    let gx = anchorX, gy = anchorY, gw, gh;

    if (alongX) {
      gw = g === groups.length - 1 ? width - anchorX : width * gFrac[g];
      gh = height;
      anchorX += gw;
    } else {
      gw = width;
      gh = g === groups.length - 1 ? height - anchorY : height * gFrac[g];
      anchorY += gh;
    }

    // 2) 그룹 내부 분할: 짧은 변을 따라 쌓기 (정사각형에 더 가깝게 보이도록)
    const innerTotal = groupTotals[g];
    const weights = groups[g];

    if (alongX) {
      // 그룹이 세로로 길어졌으니 내부는 세로로 쌓기 (y방향으로 분할)
      let innerY = gy;
      for (let i = 0; i < weights.length; i++) {
        const frac = weights[i] / innerTotal;
        const ih = i === weights.length - 1 ? gy + gh - innerY : gh * frac;
        rects.push({
          x: gx,
          y: innerY,
          w: gw,
          h: ih,
          weight: weights[i],
          label: String(weights[i]),
          id: `g${g}-${i}`,
        });
        innerY += ih;
      }
    } else {
      // 그룹이 가로로 길어졌으니 내부는 가로로 쌓기 (x방향으로 분할)
      let innerX = gx;
      for (let i = 0; i < weights.length; i++) {
        const frac = weights[i] / innerTotal;
        const iw = i === weights.length - 1 ? gx + gw - innerX : gw * frac;
        rects.push({
          x: innerX,
          y: gy,
          w: iw,
          h: gh,
          weight: weights[i],
          label: String(weights[i]),
          id: `g${g}-${i}`,
        });
        innerX += iw;
      }
    }
  }

  return rects;
}

const Treemap: FC<{
  width: number;
  height: number;
  groupA: number[];
  groupB: number[];
}> = ({ width, height, groupA, groupB }) => {
  const rects = treemapTwoGroups(width, height, [groupA, groupB]);
  const total = [...groupA, ...groupB].reduce((a, b) => a + b, 0);

  const colors = ["#8ecae6", "#219ebc", "#ffb703", "#fb8500", "#adb5bd"];

  return (
    <svg width={width} height={height} style={{ border: "1px solid #ddd", borderRadius: 8 }}>
      {rects.map((r, i) => (
        <g key={r.id}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={colors[i % colors.length]} stroke="#fff" />
          <text
            x={r.x + r.w / 2}
            y={r.y + r.h / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={14}
            fontWeight={700}
          >
            {r.label} ({Math.round((r.weight / total) * 100)}%)
          </text>
        </g>
      ))}
    </svg>
  );
};

export default function App() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8f9fa" }}>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ marginBottom: 12 }}>Treemap (Grouped: [5,4] | [3,2,1]) — 300×400</h2>
        <Treemap width={800} height={600} groupA={[5, 4]} groupB={[3, 2, 1]} />
        <p style={{ color: "#6c757d", marginTop: 8 }}>그룹1: 5,4 / 그룹2: 3,2,1</p>
      </div>
    </div>
  );
}
