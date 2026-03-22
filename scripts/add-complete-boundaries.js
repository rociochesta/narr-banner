#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
  console.error("Usage: node add-complete-boundaries.js input.json output.json");
  process.exit(1);
}

function startsMidParagraph(text) {
  if (!text || typeof text !== "string") return false;
  const trimmed = text.trim();
  if (!trimmed) return false;
  const firstChar = trimmed[0];
  if (/^[a-zà-ÿ]/u.test(firstChar)) return true;
  if (/^[,;:)\]\-—]/u.test(firstChar)) return true;
  return false;
}

function endsMidParagraph(text) {
  if (!text || typeof text !== "string") return false;
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (/[.!?"'"')]$/.test(trimmed)) return false;
  return true;
}

function getLastParagraph(text) {
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return paragraphs.length ? paragraphs[paragraphs.length - 1] : "";
}

function getFirstParagraph(text) {
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return paragraphs.length ? paragraphs[0] : "";
}

function extractTrailingFragment(text) {
  const lastParagraph = getLastParagraph(text);
  if (!lastParagraph) return null;
  if (!endsMidParagraph(lastParagraph)) return null;
  const pieces = lastParagraph.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
  if (pieces.length === 0) return lastParagraph.trim();
  return pieces[pieces.length - 1].trim();
}

function extractLeadingFragment(text) {
  const firstParagraph = getFirstParagraph(text);
  if (!firstParagraph) return null;
  if (!startsMidParagraph(firstParagraph)) return null;
  const match = firstParagraph.match(/^(.+?[.!?])(?:\s|$)/);
  if (match) return match[1].trim().replace(/[.!?]$/, "");
  return firstParagraph.trim();
}

function processNode(node) {
  if (Array.isArray(node)) return node.map(processNode);
  if (!node || typeof node !== "object") return node;

  const output = { ...node };

  if (Array.isArray(output.pages)) {
    output.pages = output.pages.map((p) => ({ ...p, complete_beginning: null, complete_finish: null }));

    for (let i = 0; i < output.pages.length; i++) {
      const current = output.pages[i];
      const prev = i > 0 ? output.pages[i - 1] : null;
      const next = i < output.pages.length - 1 ? output.pages[i + 1] : null;

      if (startsMidParagraph(current.text) && prev) {
        current.complete_beginning = extractTrailingFragment(prev.text);
      }
      if (endsMidParagraph(current.text) && next) {
        current.complete_finish = extractLeadingFragment(next.text);
      }
    }

    output.pages = output.pages.map(processNode);
  }

  for (const key of Object.keys(output)) {
    if (key !== "pages") output[key] = processNode(output[key]);
  }

  return output;
}

function main() {
  const raw = fs.readFileSync(path.resolve(inputPath), "utf8");
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error("Invalid JSON input:", err.message);
    process.exit(1);
  }
  const processed = processNode(data);
  fs.writeFileSync(path.resolve(outputPath), JSON.stringify(processed, null, 2), "utf8");
  console.log(`Done. Wrote: ${outputPath}`);
}

main();
