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


const createProposalMarkDown: ParagraphElement[] = [
  {
    type: "paragraph",
    children: [{ text: "Overview" }],
  },
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
  {
    type: "paragraph",
    children: [{ text: "Motivation" }],
  },
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
  {
    type: "paragraph",
    children: [{ text: "Specification" }],
  },
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
  {
    type: "paragraph",
    children: [{ text: "Implementation" }],
  },
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
  {
    type: "paragraph",
    children: [{ text: "Links" }],
  },
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
]

const proposalMarkDown: ParagraphElement[] = [
  {
    type: "paragraph",
    children: [{ text: "Role of the [Name] council" }],
  },
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
  {
    type: "paragraph",
    children: [{ text: "How the [Name] council works" }],
  },
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
  {
    type: "paragraph",
    children: [{ text: "FAQs" }],
  },
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
  {
    type: "paragraph",
    children: [{ text: "Links" }],
  },
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

export { snip, proposal, delegate, council, proposalMarkDown, createProposalMarkDown };
