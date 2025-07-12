import React, { useState } from 'react';
import { Bold, Italic, List, Link, Image, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export default function RichTextEditor({ value, onChange, placeholder = "Write your content here..." }) {
  const [isPreview, setIsPreview] = useState(false);

  const insertFormatting = (before, after = '') => {
    const textarea = document.getElementById('rich-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const formatText = (type) => {
    switch (type) {
      case 'bold':
        insertFormatting('**', '**');
        break;
      case 'italic':
        insertFormatting('*', '*');
        break;
      case 'list':
        insertFormatting('\n- ');
        break;
      case 'link':
        insertFormatting('[', '](url)');
        break;
      case 'image':
        insertFormatting('![alt text](', ')');
        break;
      default:
        break;
    }
  };

  const renderPreview = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded" />')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex items-center space-x-2">
        <button
          type="button"
          onClick={() => formatText('bold')}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText('italic')}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText('list')}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
          title="List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText('link')}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
          title="Link"
        >
          <Link className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText('image')}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
          title="Image"
        >
          <Image className="h-4 w-4" />
        </button>

        <div className="flex-1"></div>

        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={`px-3 py-1 text-sm rounded transition-colors ${isPreview
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          {isPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {/* Editor/Preview Area */}
      <div className="min-h-[200px]">
        {isPreview ? (
          <div
            className="p-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
          />
        ) : (
          <textarea
            id="rich-editor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-48 p-4 border-none resize-none focus:outline-none"
          />
        )}
      </div>

      {!isPreview && (
        <div className="bg-gray-50 border-t border-gray-300 p-2 text-xs text-gray-500">
          <span>Use **bold**, *italic*, - for lists, [text](url) for links, ![alt](url) for images</span>
        </div>
      )}
    </div>
  );
}