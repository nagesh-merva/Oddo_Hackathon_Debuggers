import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import RichTextEditor from '../components/RichTextEditor';
import TagSelector from '../components/TagSelector';
import Breadcrumb from '../components/Breadcrumb';
import LoginModal from '../components/LoginModel';
import { HelpCircle } from 'lucide-react';

export default function AskQuestion() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const breadcrumbItems = [
    { label: 'Ask Question' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }

    if (!formData.description.trim() || formData.description === '<p><br></p>') {
      newErrors.description = 'Description is required';
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state.user.isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newQuestion = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      tags: formData.tags,
      votes: 0,
      answers: 0,
      timestamp: 'just now',
      author: state.user.name,
      authorId: state.user.id,
      accepted: false
    };

    dispatch({ type: 'ADD_QUESTION', payload: newQuestion });
    navigate(`/question/${newQuestion.id}`);
  };

  const isFormValid = formData.title.trim() &&
    formData.description.trim() &&
    formData.description !== '<p><br></p>' &&
    formData.tags.length > 0;

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Ask a Question</h1>
            <p className="text-gray-600 mt-1">
              Get help from the community by asking a clear, detailed question
            </p>
            {!state.user.isLoggedIn && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  You need to sign in to ask a question.
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="ml-1 text-yellow-900 underline hover:no-underline"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What's your programming question? Be specific."
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Be specific and imagine you're asking a question to another person
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <div className={`border rounded-md ${errors.description ? 'border-red-300' : 'border-gray-300'}`}>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                  placeholder="Provide details about your question. Include code snippets, error messages, and what you've tried so far..."
                />
              </div>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Include all the information someone would need to answer your question
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags *
              </label>
              <TagSelector
                selectedTags={formData.tags}
                onTagsChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
              />
              {errors.tags && (
                <p className="mt-1 text-sm text-red-600">{errors.tags}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Add up to 5 tags to describe what your question is about
              </p>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <HelpCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Tips for getting good answers:
                  </h3>
                  <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                    <li>Make sure your question is clear and specific</li>
                    <li>Include relevant code snippets and error messages</li>
                    <li>Describe what you've already tried</li>
                    <li>Use proper formatting and tags</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting || !state.user.isLoggedIn}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {!state.user.isLoggedIn ? 'Sign In Required' : isSubmitting ? 'Posting...' : 'Post Question'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}