// 피셔-예이츠 셔플(Fisher-Yates Shuffle)
// 배열의 마지막 원소부터 시작해서 앞쪽의 무작위 원소와 자리를 바꾸며 모든 요소가 완벽하게 균등한 확률(1/n!)로 섞이도록 보장
export function shuffle<T>(array: T[]): T[] {
  // 원본 배열이 변경되지 않도록 얕은 복사
  const result = [...array];

  // 뒤에서부터 앞으로 가면서 요소를 무작위로 바꿈
  for (let i = result.length - 1; i > 0; i--) {
    // 0부터 i 사이의 무작위 인덱스 선택
    const j = Math.floor(Math.random() * (i + 1));

    // 구조 분해 할당을 이용해 두 요소의 위치를 맞바꿈 (Swap)
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
