import React, { useEffect, useState } from "react";
import { Activity as ActivityIcon } from "lucide-react";
import toast from "react-hot-toast";
import { getAllActivitiesApi } from "../api/dashboardApi";
import { type IActivity } from "../types";
import Card from "../components/UI/Card";
import Loader from "../components/UI/Loader";
import Badge from "../components/UI/Badge";

const ActivityLog = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllActivitiesApi();
        setActivities((res.data.value as IActivity[]) || []);
      } catch (e: any) {
        toast.error(e?.response?.data?.message || "Could not load activity");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader label="Loading activity" />;

  if (activities.length === 0) {
    return <Card className="text-center text-slate-500 py-12">No activity recorded yet.</Card>;
  }

  return (
    <Card>
      <div className="flex flex-col">
        {activities.map((a, idx) => {
          const userName = typeof a.userId === "object" ? a.userId.name : "Someone";
          return (
            <div
              key={a._id}
              className={`flex items-start gap-3 py-3.5 ${
                idx !== activities.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-500/10 text-teal-300">
                <ActivityIcon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200">
                  <span className="font-medium">{userName}</span> {a.action}
                </p>
                <p className="text-xs text-slate-500">
                  {a.createdAt ? new Date(a.createdAt).toLocaleString("en-IN") : ""}
                </p>
              </div>
              <Badge label={a.entityType} />
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ActivityLog;
