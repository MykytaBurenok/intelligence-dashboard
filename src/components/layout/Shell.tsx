"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import MobileNavigation from "@/components/layout/MobileNavigation";

type ShellProps = { sidebar: ReactNode; header: ReactNode; rightPanel: ReactNode; children: ReactNode };
type ResizeTarget = "left" | "right";
type ResizeSession = { target: ResizeTarget; startX: number; startWidth: number };

const MIN_SIDEBAR = 208;
const MAX_SIDEBAR = 360;
const MIN_RIGHT_PANEL = 260;
const MAX_RIGHT_PANEL = 440;

export default function Shell({ sidebar, header, rightPanel, children }: ShellProps) {
  const [sidebarWidth, setSidebarWidth] = useState<number | null>(null);
  const [rightPanelWidth, setRightPanelWidth] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const resizeSession = useRef<ResizeSession | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const savedSidebar = Number(window.localStorage.getItem("reality-shift-sidebar-width"));
      const savedRight = Number(window.localStorage.getItem("reality-shift-right-panel-width"));
      if (Number.isFinite(savedSidebar) && savedSidebar >= MIN_SIDEBAR && savedSidebar <= MAX_SIDEBAR) setSidebarWidth(savedSidebar);
      if (Number.isFinite(savedRight) && savedRight >= MIN_RIGHT_PANEL && savedRight <= MAX_RIGHT_PANEL) setRightPanelWidth(savedRight);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const finishResize = useCallback(() => {
    resizeSession.current = null;
    setIsResizing(false);
  }, []);

  const handlePointerDown = (target: ResizeTarget, event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    const currentWidth = target === "left"
      ? sidebarWidth ?? (window.matchMedia("(min-width: 1280px)").matches ? 260 : 88)
      : rightPanelWidth ?? 320;
    resizeSession.current = { target, startX: event.clientX, startWidth: currentWidth };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsResizing(true);
    event.preventDefault();
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const session = resizeSession.current;
    if (!session) return;
    const delta = event.clientX - session.startX;
    if (session.target === "left") {
      const width = Math.min(MAX_SIDEBAR, Math.max(MIN_SIDEBAR, session.startWidth + delta));
      setSidebarWidth(width);
      window.localStorage.setItem("reality-shift-sidebar-width", String(width));
    } else {
      const width = Math.min(MAX_RIGHT_PANEL, Math.max(MIN_RIGHT_PANEL, session.startWidth - delta));
      setRightPanelWidth(width);
      window.localStorage.setItem("reality-shift-right-panel-width", String(width));
    }
  };

  const resetWidth = (target: ResizeTarget) => {
    if (target === "left") {
      setSidebarWidth(null);
      window.localStorage.removeItem("reality-shift-sidebar-width");
    } else {
      setRightPanelWidth(null);
      window.localStorage.removeItem("reality-shift-right-panel-width");
    }
  };

  const gridStyle = {
    ...(sidebarWidth ? { "--sidebar-size": `${sidebarWidth}px` } : {}),
    ...(rightPanelWidth ? { "--right-panel-size": `${rightPanelWidth}px` } : {}),
  } as CSSProperties;

  return (
    <div className={`shell-frame${isResizing ? " is-resizing" : ""}`}>
      <div className="shell-grid" style={gridStyle}>
        <aside className="shell-sidebar" aria-label="Desktop sidebar">
          {sidebar}
          <button type="button" className="shell-resize-handle shell-resize-handle--left"
            aria-label="Resize navigation sidebar. Use arrow keys to adjust, double click to reset."
            aria-orientation="vertical"
            onPointerDown={(event) => handlePointerDown("left", event)} onPointerMove={handlePointerMove}
            onPointerUp={finishResize} onPointerCancel={finishResize} onDoubleClick={() => resetWidth("left")}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault();
                const delta = event.key === "ArrowRight" ? 12 : -12;
                const width = Math.min(MAX_SIDEBAR, Math.max(MIN_SIDEBAR, (sidebarWidth ?? 260) + delta));
                setSidebarWidth(width); window.localStorage.setItem("reality-shift-sidebar-width", String(width));
              }
              if (event.key === "Home") resetWidth("left");
            }} />
        </aside>

        <div className="shell-content flex min-h-screen flex-col">
          <div className="shell-mobile-brand">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-strong)] bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent)]">RS</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--text)]">Reality Shift</p>
                <p className="truncate text-xs text-[var(--text-faint)]">AI intelligence dashboard</p>
              </div>
            </div>
            <MobileNavigation>{sidebar}</MobileNavigation>
          </div>
          <header className="shell-header border-b p-4">{header}</header>
          <main className="shell-main flex-1">{children}</main>
        </div>

        <aside className="shell-right-panel" aria-label="AI briefing and scenario notes">
          <button type="button" className="shell-resize-handle shell-resize-handle--right"
            aria-label="Resize intelligence panel. Use arrow keys to adjust, double click to reset."
            aria-orientation="vertical"
            onPointerDown={(event) => handlePointerDown("right", event)} onPointerMove={handlePointerMove}
            onPointerUp={finishResize} onPointerCancel={finishResize} onDoubleClick={() => resetWidth("right")}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault();
                const delta = event.key === "ArrowLeft" ? 12 : -12;
                const width = Math.min(MAX_RIGHT_PANEL, Math.max(MIN_RIGHT_PANEL, (rightPanelWidth ?? 320) + delta));
                setRightPanelWidth(width); window.localStorage.setItem("reality-shift-right-panel-width", String(width));
              }
              if (event.key === "Home") resetWidth("right");
            }} />
          {rightPanel}
        </aside>
      </div>
    </div>
  );
}
