import { ParagraphElement } from "./initialValue";

const snip = `
<p>#Preamble</p>
<p>#Abstract</p>
<p>#Motivation (optional)</p>
<p>#Specification</p>
<p>#Rationale</p>
<p>#Backwards compatibility</p>
<p>#Test cases</p>
<p>#Reference implementation</p>
<p>#Security considerations</p>
  `;

const proposal = `
<p>#Preamble</p>
<p>#Abstract</p>
<p>#Motivation (optional)</p>
<p>#Specification</p>
<p>#Rationale</p>
<p>#Backwards compatibility</p>
<p>#Test cases</p>
<p>#Reference implementation</p>
<p>#Security considerations</p>
  `;

const delegate = `
<p>#Brief intro and background</p>
<p>#Why you want to be a delegate</p>
<p>#Areas of interest</p>
  `;

const council = `
<p>#The role of the council</p>
<p>#How the Council works</p>
<p>#Council members</p>
`;

/* Markdown */

// const proposalMarkDown = `
// #Preamble
// #Abstract
// #Motivation (optional
// #Specification
// #Rationale
// #Backwards compatibility
// #Test cases
// #Reference implementation
// #Security considerations
// `;

const proposalMarkDown: ParagraphElement[] = [
  {
    type: "paragraph",
    children: [{ text: "#Preamble" }],
  },
  {
    type: "paragraph",
    children: [{ text: "#Abstract" }],
  },
  {
    type: "paragraph",
    children: [{ text: "#Motivation (optional)" }],
  },
  {
    type: "paragraph",
    children: [{ text: "#Specification" }],
  },
  {
    type: "paragraph",
    children: [{ text: "#Rationale" }],
  },
  {
    type: "paragraph",
    children: [{ text: "#Preamble" }],
  },
  {
    type: "paragraph",
    children: [{ text: "#Backwards compatibility" }],
  },
  {
    type: "paragraph",
    children: [{ text: "#Test cases" }],
  },
  {
    type: "paragraph",
    children: [{ text: "#Reference implementation" }],
  },
  {
    type: "paragraph",
    children: [{ text: "#Security considerations" }],
  },
];

export { snip, proposal, delegate, council, proposalMarkDown };
