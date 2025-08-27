export type Item = {
  id: string;
  label: string;
  price: number;    // 현재 가격
};

// 가격만 입력하면 됨
export const ITEMS: Item[] = [
  { id: "a", label: "A", price: 123_000 },
  { id: "b", label: "B", price: 98_500 },
  { id: "c", label: "C", price: 77_200 },
  { id: "d", label: "D", price: 55_000 },
  { id: "e", label: "E", price: 12_300 },
];
