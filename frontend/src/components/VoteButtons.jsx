import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function VoteButtons({ votes, type, id, questionId, answerId, onLoginRequired }) {
  const { state, dispatch } = useApp();

  const handleVote = (delta) => {
    if (!state.user.isLoggedIn) {
      onLoginRequired();
      return;
    }

    if (type === 'question') {
      dispatch({ type: 'VOTE_QUESTION', payload: { id, delta } });
    } else if (type === 'answer') {
      dispatch({
        type: 'VOTE_ANSWER',
        payload: { questionId, answerId, delta }
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-1 bg-gray-50 rounded-lg p-2">
      <button
        onClick={() => handleVote(1)}
        className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
        aria-label="Upvote"
      >
        <ChevronUp className="h-6 w-6" />
      </button>

      <span className={`text-lg font-semibold px-2 ${votes > 0 ? 'text-green-600' : votes < 0 ? 'text-red-600' : 'text-gray-600'
        }`}>
        {votes}
      </span>

      <button
        onClick={() => handleVote(-1)}
        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
        aria-label="Downvote"
      >
        <ChevronDown className="h-6 w-6" />
      </button>
    </div>
  );
}