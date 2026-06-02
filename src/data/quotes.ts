export type QuoteType = "teacher" | "parent" | "general";

export interface Quote {
  type: QuoteType;
  text: string;
}

export const quotes: Quote[] = [
  {
    type: "teacher",
    text: "오늘의 수업은 내일 누군가의 인생이 됩니다.",
  },
  {
    type: "teacher",
    text: "한 명의 아이를 믿어주는 일은 세상을 바꾸는 시작입니다.",
  },
  {
    type: "teacher",
    text: "오늘 아이에게 건넨 한마디가 평생의 힘이 될 수 있습니다.",
  },
  {
    type: "teacher",
    text: "좋은 교사는 완벽한 사람이 아니라 다시 사랑을 표현하는 사람입니다.",
  },
  {
    type: "parent",
    text: "오늘의 포옹은 내일의 자신감을 만듭니다.",
  },
  {
    type: "parent",
    text: "아이의 속도가 아니라 성장을 바라보세요.",
  },
  {
    type: "parent",
    text: "좋은 부모는 완벽한 사람이 아니라 다시 사랑을 표현하는 사람입니다.",
  },
  {
    type: "parent",
    text: "오늘도 충분히 잘하고 있습니다.",
  },
  {
    type: "general",
    text: "작은 실천이 큰 변화를 만듭니다.",
  },
  {
    type: "general",
    text: "오늘도 한 걸음 성장했습니다.",
  },
  {
    type: "general",
    text: "지금도 충분히 잘하고 있습니다.",
  },
  {
    type: "general",
    text: "수고하셨습니다. 오늘도 의미 있는 하루였습니다.",
  },
];
