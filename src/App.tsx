// src/App.tsx
import { FC, useMemo } from "react";
import { CANVAS, GROUP_INDEXES } from "./mapConfig";
import { ITEMS, type Item } from "./items";

type Rect = {
  x: number; y: number; w: number; h: number;
  item: Item;
  weight: number;  // price 기반
  id: string;
};

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

// 그룹 나눔 함수 (정렬/토글 기능 없음)
function treemapTwoGroups(
  width: number,
  height: number,
  items: Item[],
  groupIndexes: number[][]
): Rect[] {
  // weight = price
  const weights = items.map(i => i.price);
  const totalWeight = sum(weights);
  const alongX = width >= height;
  const rects: Rect[] = [];

  const groupWeights = groupIndexes.map(g => sum(g.map(i => weights[i])));
  const groupFracs = groupWeights.map(gw => gw / totalWeight);

  let anchorX = 0, anchorY = 0;

  for (let g = 0; g < groupIndexes.length; g++) {
    let gx = anchorX, gy = anchorY, gw: number, gh: number;

    if (alongX) {
      gw = (g === groupIndexes.length - 1) ? (width - anchorX) : width * groupFracs[g];
      gh = height;
      anchorX += gw;
    } else {
      gw = width;
      gh = (g === groupIndexes.length - 1) ? (height - anchorY) : height * groupFracs[g];
      anchorY += gh;
    }

    // 그룹 내부: 주어진 순서 그대로 배치
    const innerItems = groupIndexes[g].map(idx => items[idx]);
    const innerTotal = sum(innerItems.map(i => i.price));

    if (alongX) {
      // 세로 쌓기
      let innerY = gy;
      innerItems.forEach((item, i) => {
        const frac = item.price / innerTotal;
        const ih = (i === innerItems.length - 1) ? (gy + gh - innerY) : gh * frac;
        rects.push({ x: gx, y: innerY, w: gw, h: ih, item, weight: item.price, id: `g${g}-${item.id}` });
        innerY += ih;
      });
    } else {
      // 가로 쌓기
      let innerX = gx;
      innerItems.forEach((item, i) => {
        const frac = item.price / innerTotal;
        const iw = (i === innerItems.length - 1) ? (gx + gw - innerX) : gw * frac;
        rects.push({ x: innerX, y: gy, w: iw, h: gh, item, weight: item.price, id: `g${g}-${item.id}` });
        innerX += iw;
      });
    }
  }

  return rects;
}

const Treemap: FC<{
  width: number;
  height: number;
  items: Item[];
  groupIndexes: number[][];
}> = ({ width, height, items, groupIndexes }) => {
  const rects = useMemo(
    () => treemapTwoGroups(width, height, items, groupIndexes),
    [width, height, items, groupIndexes]
  );

  const total = useMemo(() => sum(items.map(i => i.price)), [items]);
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
            fontSize={12}
            fontWeight={700}
          >
            {`${r.item.label} ₩${r.item.price.toLocaleString()} (${Math.round((r.weight / total) * 100)}%)`}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default function App() {
  const btnStyle: React.CSSProperties = {
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid #ddd",
    background: "#fff",
    fontWeight: 600,
    cursor: "not-allowed",
    opacity: 0.7,
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8f9fa" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>Treemap — Price 기반</h2>
          <button style={btnStyle} disabled aria-disabled="true">정렬</button>
          <button style={btnStyle} disabled aria-disabled="true">표시형식</button>
        </div>

        <Treemap
          width={CANVAS.width}
          height={CANVAS.height}
          items={ITEMS}
          groupIndexes={GROUP_INDEXES}
        />
      </div>
    </div>
  );
}
