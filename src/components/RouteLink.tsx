import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { navigate } from "../lib/router";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

// Client-side navigation for internal page routes (e.g. "/status"),
// without a full page reload. Hash-only links (e.g. "#home") and
// external/new-tab links fall through untouched as plain anchors.
export default function RouteLink({ href, onClick, children, ...rest }: Props) {
  const isInternalRoute = href.startsWith("/") && !href.startsWith("//");

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (!isInternalRoute || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    e.preventDefault();
    navigate(href);
    if (!href.includes("#")) window.scrollTo({ top: 0 });
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
