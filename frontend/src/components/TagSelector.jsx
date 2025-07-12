import React, { useState } from 'react';
import { X } from 'lucide-react';

const POPULAR_TAGS = [
  'javascript', 'react', 'python', 'java', 'css', 'html', 'node.js', 
  'express', 'mongodb', 'sql', 'git', 'docker', 'aws', 'typescript'
];

export default function TagSelector({ selectedTags, onTagsChange, maxTags = 5 }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.trim()) {
      const filtered = POPULAR_TAGS.filter(tag => 
        tag.toLowerCase().includes(value.toLowerCase()) && 
        !selectedTags.includes(tag)
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const addTag = (tag) => {
    if (selectedTags.length < maxTags && !selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
      setInputValue('');
      setSuggestions([]);
    }
  };

  const removeTag = (tagToRemove) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim().toLowerCase());
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={`Add tags (${selectedTags.length}/${maxTags})`}
          disabled={selectedTags.length >= maxTags}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        />
        
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            {suggestions.map((tag) => (
              <button
                key={tag}
                onClick={() => addTag(tag)}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-600">Popular tags:</span>
        {POPULAR_TAGS.slice(0, 8).map((tag) => (
          <button
            key={tag}
            onClick={() => addTag(tag)}
            disabled={selectedTags.includes(tag) || selectedTags.length >= maxTags}
            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}