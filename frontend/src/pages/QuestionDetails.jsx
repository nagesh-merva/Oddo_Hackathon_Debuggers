import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AnswerCard from '../components/AnswerCard';
import VoteButtons from '../components/VoteButtons';
import RichTextEditor from '../components/RichTextEditor';
import Breadcrumb from '../components/Breadcrumb';
import LoginModal from '../components/LoginModel';
import { Clock, User, MessageSquare, ArrowLeft } from 'lucide-react';

export default function QuestionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [answerContent, setAnswerContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const question = state.questions.find(q => q.id === parseInt(id));
  const answers = state.answers[id] || [];
  const isOwner = question?.authorId === state.user.id && state.user.isLoggedIn;

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Question Not Found</h2>
          <p className="text-gray-600 mt-2">The question you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Questions
          </button>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: question.title }
  ];

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    if (!state.user.isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!answerContent.trim() || answerContent === '<p><br></p>') return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newAnswer = {
      id: Date.now(),
      content: answerContent,
      author: state.user.name,
      authorId: state.user.id,
      votes: 0,
      timestamp: 'just now',
      accepted: false
    };

    dispatch({
      type: 'ADD_ANSWER',
      payload: { questionId: parseInt(id), answer: newAnswer }
    });

    setAnswerContent('');
    setIsSubmitting(false);
  };

  const handleLoginRequired = () => {
    setIsLoginModalOpen(true);
  };

  // Sort answers: accepted first, then by votes
  const sortedAnswers = [...answers].sort((a, b) => {
    if (a.accepted && !b.accepted) return -1;
    if (!a.accepted && b.accepted) return 1;
    return b.votes - a.votes;
  });

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />

        {/* Question */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-4">
            <VoteButtons
              votes={question.votes}
              type="question"
              id={question.id}
              onLoginRequired={handleLoginRequired}
            />

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{question.title}</h1>

              <div
                className="prose prose-sm max-w-none text-gray-700 mb-4"
                dangerouslySetInnerHTML={{ __html: question.description }}
              />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      dispatch({ type: 'SET_TAG_FILTER', payload: tag });
                      navigate('/');
                    }}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Question Meta */}
              <div className="flex items-center space-x-4 text-sm text-gray-500 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>asked {question.timestamp}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span className="font-medium text-gray-700">{question.author}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <MessageSquare className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">
              {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
            </h2>
          </div>

          {sortedAnswers.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No answers yet</h3>
              <p className="text-gray-600">Be the first to answer this question!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedAnswers.map((answer) => (
                <AnswerCard
                  key={answer.id}
                  answer={answer}
                  questionId={parseInt(id)}
                  isOwner={isOwner}
                />
              ))}
            </div>
          )}
        </div>

        {/* Answer Form */}
        {state.user.isLoggedIn ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>

            <form onSubmit={handleSubmitAnswer}>
              <div className="mb-4">
                <RichTextEditor
                  value={answerContent}
                  onChange={setAnswerContent}
                  placeholder="Write your answer here. Be clear and helpful..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!answerContent.trim() || answerContent === '<p><br></p>' || isSubmitting}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Posting...' : 'Post Answer'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Want to Answer?</h3>
            <p className="text-gray-600 mb-4">Sign in to post your answer and help the community.</p>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Sign In to Answer
            </button>
          </div>
        )}
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}