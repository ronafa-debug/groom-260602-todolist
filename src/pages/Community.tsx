import { CommunityGroupList } from "../components/CommunityGroupList";
import { getCommunityGroups, getCommunityMeta } from "../data/community";
import { useTaskStore } from "../store/useTaskStore";

export function Community() {
  const userMode = useTaskStore((s) => s.userMode);
  const meta = getCommunityMeta(userMode);
  const groups = getCommunityGroups(userMode);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
          <span>{meta.pageIcon}</span>
          {meta.pageTitle}
        </h2>
        <p className="text-xs text-gray-500 mt-1">{meta.subtitle}</p>
      </div>

      <CommunityGroupList groups={groups} />
    </div>
  );
}
