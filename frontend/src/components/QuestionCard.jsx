import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown, MessageSquare, Clock, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import VoteButtons from './VoteButtons';
import LoginModal from './LoginModel';

export default function QuestionCard({ question }) {
  const { state } = useApp();
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  const { id, title, description, tags, votes, answers, timestamp, author, accepted } = question;

  const handleLoginRequired = () => {
    setIsLoginModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start space-x-4">
          {/* Vote Section */}
          <VoteButtons
            votes={votes}
            type="question"
            id={id}
            onLoginRequired={handleLoginRequired}
          />

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <Link
              to={`/question/${id}`}
              className="block group"
            >
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {title}
              </h3>
            </Link>

            <p className="text-gray-600 mt-2 line-clamp-3 text-sm leading-relaxed">
              {description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Meta Information */}
            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span className={`font-medium ${answers > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                    {answers} {answers === 1 ? 'answer' : 'answers'}
                  </span>
                  {accepted && (
                    <span className="text-green-600 font-medium">(accepted)</span>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{timestamp}</span>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span className="font-medium text-gray-700">{author}</span>
              </div>
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