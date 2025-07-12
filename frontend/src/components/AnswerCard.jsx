import React from 'react';
import { Check, Clock, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import VoteButtons from './VoteButtons';
import LoginModal from './LoginModel';

export default function AnswerCard({ answer, questionId, isOwner }) {
  const { state, dispatch } = useApp();
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  const { id, content, author, votes, timestamp, accepted } = answer;

  const handleMarkAccepted = () => {
    if (!state.user.isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    dispatch({
      type: 'MARK_ACCEPTED',
      payload: { questionId, answerId: id }
    });
  };

  const handleLoginRequired = () => {
    setIsLoginModalOpen(true);
  };

  return (
    <>
      <div className={`bg-white border rounded-lg p-6 ${accepted ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
        <div className="flex items-start space-x-4">
          {/* Vote Section */}
          <VoteButtons
            votes={votes}
            type="answer"
            questionId={questionId}
            answerId={id}
            onLoginRequired={handleLoginRequired}
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            {accepted && (
              <div className="flex items-center space-x-2 mb-3">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">Accepted Answer</span>
              </div>
            )}

            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Actions and Meta */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{timestamp}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span className="font-medium text-gray-700">{author}</span>
                </div>
              </div>

              {isOwner && !accepted && (
                <button
                  onClick={handleMarkAccepted}
                  className="inline-flex items-center px-3 py-1 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Mark as Accepted
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}