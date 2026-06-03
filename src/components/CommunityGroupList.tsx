import type { CommunityGroup } from "../data/community";

interface CommunityGroupListProps {
  groups: CommunityGroup[];
}

export function CommunityGroupList({ groups }: CommunityGroupListProps) {
  const openChat = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <ul className="space-y-3">
      {groups.map((group) => {
        const hasLink = group.chatUrl.trim().length > 0;

        return (
          <li
            key={group.id}
            className="rounded-2xl border border-primary/10 bg-white/90 px-4 py-4 shadow-sm flex items-center gap-3"
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-primary">{group.title}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{group.description}</p>
            </div>
            <button
              type="button"
              onClick={() => openChat(group.chatUrl)}
              disabled={!hasLink}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                hasLink
                  ? "bg-primary text-white hover:bg-primary-dark"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              title={hasLink ? "채팅방 열기" : "채팅방 링크 준비 중"}
            >
              {hasLink ? "입장" : "준비 중"}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
