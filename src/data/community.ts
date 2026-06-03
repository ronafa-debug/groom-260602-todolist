import type { UserMode } from "../types/task";

export interface CommunityGroup {
  id: string;
  title: string;
  description: string;
  /** 채팅방 URL — 비어 있으면 입장 버튼 비활성 */
  chatUrl: string;
}

export const TEACHER_COMMUNITY_GROUPS: CommunityGroup[] = [
  {
    id: "teacher-daycare",
    title: "어린이집 교사 모임",
    description: "어린이집 현장 교사들과 정보·고민을 나눠요.",
    chatUrl: "",
  },
  {
    id: "teacher-kindergarten",
    title: "유치원 교사 모임",
    description: "유치원 교사들의 수업·육아·소통 공간입니다.",
    chatUrl: "",
  },
  {
    id: "teacher-elementary",
    title: "초등학교 교사 모임",
    description: "초등 교사들이 함께하는 채팅 모임입니다.",
    chatUrl: "",
  },
  {
    id: "teacher-middle",
    title: "중학교 교사 모임",
    description: "중학교 교사들의 교류·정보 공유 모임입니다.",
    chatUrl: "",
  },
  {
    id: "teacher-high",
    title: "고등학교 교사 모임",
    description: "고등학교 교사들과 연결되는 채팅 모임입니다.",
    chatUrl: "",
  },
  {
    id: "teacher-special",
    title: "특수교사 모임",
    description: "특수교육 현장 교사들의 소통·정보 공유 모임입니다.",
    chatUrl: "",
  },
  {
    id: "teacher-health",
    title: "보건교사 모임",
    description: "보건교사들이 함께하는 채팅 모임입니다.",
    chatUrl: "",
  },
  {
    id: "teacher-counselor",
    title: "상담교사 모임",
    description: "상담교사들의 교류·고민 나눔 공간입니다.",
    chatUrl: "",
  },
  {
    id: "teacher-nutrition",
    title: "영양교사 모임",
    description: "영양교사들의 소통·정보 공유 모임입니다.",
    chatUrl: "",
  },
  {
    id: "teacher-librarian",
    title: "사서교사 모임",
    description: "사서교사들이 함께하는 채팅 모임입니다.",
    chatUrl: "",
  },
];

export const PARENT_COMMUNITY_GROUPS: CommunityGroup[] = [
  {
    id: "parent-daycare",
    title: "어린이집 학부모 모임",
    description: "어린이집 학부모들의 소통·정보 공유 모임입니다.",
    chatUrl: "",
  },
  {
    id: "parent-kindergarten",
    title: "유치원 학부모 모임",
    description: "유치원 학부모들이 함께하는 채팅 모임입니다.",
    chatUrl: "",
  },
  {
    id: "parent-elementary",
    title: "초등학교 학부모 모임",
    description: "초등학교 학부모들의 교류 공간입니다.",
    chatUrl: "",
  },
  {
    id: "parent-middle",
    title: "중학교 학부모 모임",
    description: "중학교 학부모들과 연결되는 채팅 모임입니다.",
    chatUrl: "",
  },
  {
    id: "parent-high",
    title: "고등학교 학부모 모임",
    description: "고등학교 학부모들의 소통·정보 공유 모임입니다.",
    chatUrl: "",
  },
];

export function getCommunityGroups(mode: UserMode): CommunityGroup[] {
  return mode === "teacher" ? TEACHER_COMMUNITY_GROUPS : PARENT_COMMUNITY_GROUPS;
}

export function getCommunityMeta(mode: UserMode) {
  if (mode === "teacher") {
    return {
      pageTitle: "교사 커뮤니티",
      pageIcon: "💬",
      subtitle: "교사 모드 · 학교급·전문직별 모임 채팅방으로 이동합니다",
    };
  }
  return {
    pageTitle: "학부모 커뮤니티",
    pageIcon: "👥",
    subtitle: "부모 모드 · 학교급별 모임 채팅방으로 이동합니다",
  };
}
