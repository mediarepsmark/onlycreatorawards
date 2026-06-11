import { Flag, MessageSquare, Send } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { CommentPreview } from "@/lib/onlycreatorawards/types";

type CommentSectionProps = {
  targetType: "creator" | "award" | "ranking";
  targetSlug: string;
  comments: CommentPreview[];
};

export function CommentSection({ targetType, targetSlug, comments }: CommentSectionProps) {
  const approvedComments = comments.filter((comment) => comment.status === "APPROVED");

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-brand-blue" aria-hidden="true" />
        <h2 className="text-2xl font-black text-ink">Comments</h2>
      </div>
      <div className="grid gap-4">
        {approvedComments.length > 0 ? (
          approvedComments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-black text-ink">{comment.authorName}</p>
                    <p className="text-sm font-bold text-muted">{comment.createdAt}</p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-line px-3 text-sm font-bold text-muted hover:bg-slate-50"
                  >
                    <Flag className="h-4 w-4" aria-hidden="true" />
                    Report
                  </button>
                </div>
                <p className="leading-7 text-muted">{comment.body}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent>
              <p className="text-muted">No approved comments yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
      <Card>
        <CardContent>
          <form action="/api/comments" method="post" className="space-y-3">
            <input type="hidden" name="targetType" value={targetType} />
            <input type="hidden" name="targetSlug" value={targetSlug} />
            <label className="block text-sm font-black text-ink" htmlFor={`${targetSlug}-comment`}>
              Add a comment
            </label>
            <textarea
              id={`${targetSlug}-comment`}
              name="body"
              required
              minLength={12}
              maxLength={1200}
              rows={4}
              className="w-full rounded-lg border border-line bg-white p-3 text-ink outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              placeholder="Comments go through moderation before they appear."
            />
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-ink px-4 font-extrabold text-white transition hover:bg-brand-green"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Submit for review
            </button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
