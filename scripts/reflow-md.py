#!/usr/bin/env python3
"""Re-flow SSR-exported markdown that has headings/fences/paragraphs joined onto
single lines, so markdown-it parses fences, headings, lists and tables correctly.

Line-local rules, content-preserving:
- "```lang" / "```" fence markers always land on their own line
- "text. ## Heading" gets split before the heading
- fenced code bodies are passed through untouched
"""
import glob
import re
import sys

FENCE_MARKER = re.compile(r"^(```+[a-zA-Z0-9_+-]*)(?:\s+(.*))?$")
INLINE_FENCE = re.compile(r"\s(```+[a-zA-Z0-9_+-]*)(\s|$)")
INLINE_HEADING = re.compile(r"\s(#{1,6}\s)")


HEAD = re.compile(r"^(#{1,6})\s+(.*)$")


def split_heading(line: str, out: list) -> None:
    """A heading line that swallowed body text: split at the first sentence/list boundary."""
    m = HEAD.match(line)
    if not m or len(line) < 70:
        out.append(line)
        return
    hashes, rest = m.group(1), m.group(2)
    cuts = [c for c in (rest.find(". "), rest.find(": "), rest.find(" 1. "), rest.find(" - ")) if c > 0]
    pm = re.search(r"\) [A-Z]", rest)
    if pm:
        cuts.append(pm.start() + 1)
    if cuts:
        c = min(cuts)
        if rest[c] in ".:":
            title, body = rest[: c + 1].strip(), rest[c + 1 :].strip()
        else:
            title, body = rest[:c].strip(), rest[c:].strip()
        out.append(f"{hashes} {title}")
        out.append("")
        split_inline(body, out)
        return
    # fallback: Title Case seam / code-command seam / glued table row
    words = rest.split(" ")
    fallback = None
    if " | " in rest and rest.count("|") >= 3:
        i2 = rest.index(" | ")
        if len(rest[:i2]) <= 60 and len(rest[i2:]) >= 40:
            fallback = (rest[:i2].strip(), rest[i2 + 1 :].strip())
    if fallback is None:
        for i2 in range(1, len(words)):
            prev, nxt = words[i2 - 1], words[i2]
            nxt_cmp = nxt.lstrip("*")
            seamA = nxt_cmp[:1].isupper() and (prev[-1:].islower() or prev[-1:] in ").0123456789`?\"")
            seamB = prev.endswith(")") and nxt in ("curl", "cd", "docker", "git", "sudo")
            seamC = nxt.lower() in ("docker", "curl", "cd", "systemctl", "sudo", "git", "npm", "bash", "sh") and not prev.endswith((",", ":"))
            seamD = i2 == 1 and prev.lower() == nxt.lower()
            seamE = i2 >= 4 and prev[-1:].isupper() and nxt_cmp[:1].isupper()
            seamF = prev.endswith("`") and (i2 >= 4 or prev.startswith("`"))
            seamG = bool(re.fullmatch(r"[a-z_][a-z0-9_-]*:", nxt)) and len(" ".join(words[:i2])) <= 60
            if not (seamA or seamB or seamC or seamD or seamE or seamF or seamG):
                continue
            head, body = " ".join(words[:i2]), " ".join(words[i2:])
            if len(head.split()) >= 1 and len(head) <= 60 and len(body) >= 40 and not head.endswith((".", ":")):
                fallback = (head, body)
                break
    if fallback is None:
        out.append(line)
        return
    title, body = fallback
    out.append(f"{hashes} {title}")
    out.append("")
    split_inline(body, out)



def split_inline(text: str, out: list) -> None:
    """Split a non-fence line at inline fence markers and inline headings."""
    while True:
        fm = INLINE_FENCE.search(text)
        hm = INLINE_HEADING.search(text)
        # take whichever marker comes first
        if fm and (not hm or fm.start() < hm.start()):
            before = text[: fm.start()].rstrip()
            if before:
                split_inline(before, out)  # heading splits inside the prefix
            rest = text[fm.start() + 1:]
            mm = FENCE_MARKER.match(rest)
            if not mm:  # shouldn't happen; bail to avoid loops
                out.append(text)
                return
            out.append(mm.group(1))  # fence marker on its own line
            in_fence = bool(re.match(r"^```[a-zA-Z0-9_+-]*\s*$", mm.group(1)))
            body = (mm.group(2) or "").strip()
            if body:
                if in_fence:
                    out.append(body)  # glued fence body continues; marker for close comes later in stream
                else:
                    split_inline(body, out)
            if in_fence and body:
                # the matching closer is somewhere later in this same original line;
                # hand the remainder back through the fence-aware path
                text = ""
                return
            text = ""
            return
        if hm:
            before = text[: hm.start() + 1].rstrip()
            if before:
                out.append(before)
            out.append("")
            text = text[hm.start() + 1:].strip()
            continue
        break
    if text.strip():
        split_heading(text.strip(), out)


def reflow(text: str) -> str:
    out: list = []
    in_fence = False
    for raw in text.split("\n"):
        stripped = raw.strip()
        if in_fence:
            m = FENCE_MARKER.match(stripped)
            if m and m.group(1).strip("`") == "" or (m and set(m.group(1)) == {"`}"} | set(m.group(1)[3:]) and m.group(1).startswith("```") and len(m.group(1)) - m.group(1).count("`") == 0):
                pass  # fall through to simple handling below
            if stripped.startswith("```"):
                # closing fence; trailing glued text (if any) is content
                m2 = FENCE_MARKER.match(stripped)
                if m2 and m2.group(2):
                    out.append(m2.group(1))
                    split_inline(m2.group(2), out)
                else:
                    out.append(stripped)
                in_fence = False
                continue
            out.append(raw)  # fence body untouched
            continue

        m = FENCE_MARKER.match(stripped)
        if m:
            out.append(m.group(1))
            in_fence = not _is_closer(m.group(1), out)
            body = (m.group(2) or "").strip()
            if body:
                if in_fence:
                    out.append(body)
                else:
                    split_inline(body, out)
            continue

        split_inline(raw.strip(), out)

    return "\n".join(out) + ("\n" if text.endswith("\n") else "")


def _is_closer(marker: str, out: list) -> bool:
    """A bare ``` (no lang) is a closer; with a lang it is an opener."""
    return re.fullmatch(r"`{3,}", marker) is not None


def main() -> int:
    changed = 0
    for f in sorted(glob.glob("content/**/*.md", recursive=True)):
        s = open(f, encoding="utf-8").read()
        s2 = reflow(s)
        if s2 != s:
            open(f, "w", encoding="utf-8").write(s2)
            changed += 1
            print("reflowed", f)
    print("files changed:", changed)
    return 0


if __name__ == "__main__":
    sys.exit(main())
