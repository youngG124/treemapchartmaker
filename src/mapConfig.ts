// 화면/레이아웃 같은 고정 설정
export const CANVAS = {
  width: 800,
  height: 600,
};

// 아이템을 어떤 식으로 그룹핑할지 (인덱스 기반)
// 예: [5,4] | [3,2,1] → 아이템 배열의 0,1번을 그룹A, 2,3,4번을 그룹B
export const GROUP_INDEXES: number[][] = [
  [0, 1],     // group A
  [2, 3, 4],  // group B
];
