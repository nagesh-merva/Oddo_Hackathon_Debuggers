import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import QuestionCard from '../components/QuestionCard';
import Pagination from '../components/Pagination';
import { Filter, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const { state, dispatch } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  const filters = [
    { key: 'recent', label: 'Recent' },
    { key: 'unanswered', label: 'Unanswered' },
    { key: 'popular', label: 'Popular' },
    { key: 'my-questions', label: 'My Questions' }
  ];

  const getFilteredQuestions = () => {
    let filtered = [...state.questions];

    // Apply tag filter first
    if (state.selectedTag) {
      filtered = filtered.filter(q => q.tags.includes(state.selectedTag));
    }

    // Then apply other filters
    if (state.currentFilter !== 'tag') {
      switch (state.currentFilter) {
        case 'unanswered':
          filtered = filtered.filter(q => q.answers === 0);
          break;
        case 'popular':
          filtered = filtered.sort((a, b) => b.votes - a.votes);
          break;
        case 'my-questions':
          filtered = filtered.filter(q => q.authorId === state.user.id);
          break;
        default: // recent
          filtered = filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      }
    }

    return filtered;
  };

  const filteredQuestions = getFilteredQuestions();
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + questionsPerPage);

  const handleFilterChange = (filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
    dispatch({ type: 'CLEAR_TAG_FILTER' });
    setCurrentPage(1);
  };

  const handleTagFilter = (tag) => {
    dispatch({ type: 'SET_TAG_FILTER', payload: tag });
    setCurrentPage(1);
  };

  const clearTagFilter = () => {
    dispatch({ type: 'CLEAR_TAG_FILTER' });
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Questions</h1>
              <p className="text-gray-600 mt-1">
                {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
              </p>
            </div>

            <Link
              to="/ask"
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ask Question
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-gray-200">
            <Filter className="h-4 w-4 text-gray-500 mr-2" />

            {/* Tag Filter Display */}
            {state.selectedTag && (
              <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1.5 rounded-md text-sm font-medium mr-2">
                <span>Tag: {state.selectedTag}</span>
                <button
                  onClick={clearTagFilter}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => handleFilterChange(filter.key)}
                disabled={filter.key === 'my-questions' && !state.user.isLoggedIn}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${state.currentFilter === filter.key && !state.selectedTag
                  ? 'bg-blue-600 text-white'
                  : filter.key === 'my-questions' && !state.user.isLoggedIn
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Questions List */}
          {paginatedQuestions.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No questions found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {state.currentFilter === 'my-questions'
                    ? "You haven't asked any questions yet."
                    : "Try adjusting your filters or ask the first question!"
                  }
                </p>
                <div className="mt-6">
                  <Link
                    to="/ask"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ask Question
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="mt-8"
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-80">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {['react', 'javascript', 'python', 'css', 'node.js', 'html', 'java', 'git'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagFilter(tag)}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${state.selectedTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Questions</span>
                <span className="text-sm font-medium">{state.questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Unanswered</span>
                <span className="text-sm font-medium">
                  {state.questions.filter(q => q.answers === 0).length}
                </span>
              </div>
              {state.user.isLoggedIn && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Your Questions</span>
                  <span className="text-sm font-medium">
                    {state.questions.filter(q => q.authorId === state.user.id).length}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}