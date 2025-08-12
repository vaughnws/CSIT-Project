import React from "react";

const MarkdownRenderer = ({ content }) => {
  // Simple markdown to HTML converter for common formatting
  const formatContent = (text) => {
    if (!text) return "";

    let formattedText = text
      // Headers
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-lg font-semibold text-gray-900 mt-4 mb-2">$1</h3>'
      )
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-xl font-bold text-gray-900 mt-6 mb-3">$1</h2>'
      )
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>'
      )

      // Bold text with **
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-semibold text-gray-900">$1</strong>'
      )

      // Italic text with *
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

      // Code blocks with ```
      .replace(
        /```([\s\S]*?)```/g,
        '<div class="bg-gray-100 rounded-lg p-4 my-3 border"><pre class="whitespace-pre-wrap text-sm font-mono">$1</pre></div>'
      )

      // Inline code with `
      .replace(
        /`(.*?)`/g,
        '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>'
      )

      // Numbered lists
      .replace(/^\d+\.\s+(.*$)/gim, '<li class="ml-4 mb-2">$1</li>')

      // Bullet points
      .replace(/^[\-\*\+]\s+(.*$)/gim, '<li class="ml-4 mb-2">$1</li>')

      // Line breaks
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, "<br/>");

    // Wrap in paragraph tags
    formattedText = '<p class="mb-4">' + formattedText + "</p>";

    // Fix list formatting
    formattedText = formattedText
      .replace(/(<li.*?>.*?<\/li>)/gs, (match, li) => {
        return li;
      })
      .replace(/(<li.*?>.*?<\/li>\s*)+/gs, (match) => {
        return '<ul class="list-disc ml-6 mb-4">' + match + "</ul>";
      });

    // Convert tables
    const tableRegex = /\|(.+?)\|\n\|[-\s\|]+\|\n((?:\|.+?\|\n?)+)/g;
    formattedText = formattedText.replace(tableRegex, (match, header, rows) => {
      const headerCells = header
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell);
      const rowData = rows
        .trim()
        .split("\n")
        .map((row) =>
          row
            .split("|")
            .map((cell) => cell.trim())
            .filter((cell) => cell)
        );

      let tableHTML =
        '<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse border border-gray-300">';

      // Header
      tableHTML += '<thead class="bg-gray-50"><tr>';
      headerCells.forEach((cell) => {
        tableHTML += `<th class="border border-gray-300 px-4 py-2 text-left font-semibold">${cell}</th>`;
      });
      tableHTML += "</tr></thead>";

      // Body
      tableHTML += "<tbody>";
      rowData.forEach((row) => {
        tableHTML += "<tr>";
        row.forEach((cell) => {
          tableHTML += `<td class="border border-gray-300 px-4 py-2">${cell}</td>`;
        });
        tableHTML += "</tr>";
      });
      tableHTML += "</tbody></table></div>";

      return tableHTML;
    });

    return formattedText;
  };

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: formatContent(content) }}
    />
  );
};

export default MarkdownRenderer;
