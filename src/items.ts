export type Item = {
  id: string;
  label: string;
  price: number;    // 현재 가격
};

// 가격만 입력하면 됨
export const ITEMS: Item[] = [
  { id: "a", label: "NVDA", price: 10000 },
  { id: "b", label: "QLD", price: 6000 },
  { id: "c", label: "ETC stocks", price: 3000 },
  { id: "d", label: "crypto", price: 1000 },
  { id: "e", label: "cash", price: 1000 },
];
