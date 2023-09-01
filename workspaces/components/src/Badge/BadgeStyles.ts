import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const active = defineStyle({
  background: "component.tag.active.surface",
  color: "component.tag.active.content",
});
const closed = defineStyle({
  background: "component.tag.closed.surface",
  color: "component.tag.closed.content",
});
const pending = defineStyle({
  background: "component.tag.pending.surface",
  color: "component.tag.pending.content",
});
const draft = defineStyle({
  background: "component.tag.draft.surface",
  color: "component.tag.draft.content",
});
const withdrawn = defineStyle({
  background: "component.tag.withdrawn.surface",
  color: "component.tag.withdrawn.content",
});
const last_call = defineStyle({
  background: "component.tag.lastCall.surface",
  color: "component.tag.lastCall.content",
});
const review = defineStyle({
  background: "component.tag.review.surface",
  color: "component.tag.review.content",
});

const idea = defineStyle({
  background: "component.tag.idea.surface",
  color: "component.tag.idea.content",
});
const final = defineStyle({
  background: "component.tag.final.surface",
  color: "component.tag.final.content",
});
const stagnant = defineStyle({
  background: "component.tag.stagnant.surface",
  color: "component.tag.stagnant.content",
});
const living = defineStyle({
  background: "component.tag.living.surface",
  color: "component.tag.living.content",
});

const condensed = defineStyle({
  px: "standard.xs",
  py: "standard.base",
  borderRadius: "standard.base",
  height: "auto",
  fontSize: "10px",
  fontWeight: "600",
  textTransform: "uppercase",
  borderWidth: "0px",
  lineHeight: "7px",
  letterSpacing: "0.5px",
});

export const badgeTheme = defineStyleConfig({
  baseStyle: {
    px: "standard.md",
    py: "8px",
    borderRadius: "standard.round",
    height: "auto",
    fontSize: "10px",
    fontWeight: "600",
    textTransform: "uppercase",
    borderWidth: "0px",
    lineHeight: "7px",
    letterSpacing: "0.5px",
  },
  sizes: { condensed },
  variants: {
    last_call,
    active,
    pending,
    review,
    draft,
    closed,
    withdrawn,
    idea,
    final,
    stagnant,
    living,
  },
});
