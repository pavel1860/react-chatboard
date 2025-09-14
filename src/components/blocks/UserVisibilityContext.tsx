import React, { createContext, useContext, useState, ReactNode } from "react";

type VisibilityCtx = {
  visible: Set<string>;
  show: (tag: string) => void;
  hide: (tag: string) => void;
  isVisible: (tags?: string[]) => boolean;
  setVisibleTags: (tags: string[]) => void;
};

const VisibilityContext = createContext<VisibilityCtx | null>(null);

export function UserVisibilityProvider({
  children,
  defaultVisibleTags = [],
  showAll = false,
}: {
  children: ReactNode;
  defaultVisibleTags?: string[];
  showAll?: boolean;
}) {
  const [visible, setVisible] = useState<Set<string>>(
    new Set(defaultVisibleTags)
  );

  const show = (tag: string) => {
    setVisible((prev) => new Set(prev).add(tag));
  };

  const hide = (tag: string) => {
    setVisible((prev) => {
      const next = new Set(prev);
      next.delete(tag);
      return next;
    });
  };

  const isVisible = (tags?: string[]) => {
    if (showAll) return true;
    if (!tags || tags.length === 0) return false; // nothing is visible by default
    return tags.some((t) => visible.has(t));
  };

  const setVisibleTags = (tags: string[]) => {
    setVisible(new Set(tags));
  };

  return (
    <VisibilityContext.Provider
      value={{ visible, show, hide, isVisible, setVisibleTags }}
    >
      {children}
    </VisibilityContext.Provider>
  );
}

export function useVisibility() {
  const ctx = useContext(VisibilityContext);
  if (!ctx) throw new Error("useVisibility must be used inside UserVisibilityProvider");
  return ctx;
}





