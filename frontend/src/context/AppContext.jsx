import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  user: {
    id: null,
    name: null,
    avatar: null,
    reputation: 0,
    isLoggedIn: false
  },
  questions: [
    {
      id: 1,
      title: 'How to implement React Context API properly?',
      description: 'I am trying to understand the best practices for implementing React Context API in a large application. What are the common pitfalls to avoid?',
      tags: ['react', 'javascript', 'context-api'],
      votes: 15,
      answers: 3,
      timestamp: '2 hours ago',
      author: 'John Doe',
      authorId: 1,
      accepted: false
    },
    {
      id: 2,
      title: 'Best practices for CSS Grid vs Flexbox?',
      description: 'When should I use CSS Grid over Flexbox and vice versa? I want to understand the practical differences and use cases.',
      tags: ['css', 'flexbox', 'grid', 'layout'],
      votes: 23,
      answers: 7,
      timestamp: '4 hours ago',
      author: 'Sarah Smith',
      authorId: 2,
      accepted: true
    },
    {
      id: 3,
      title: 'How to optimize React app performance?',
      description: 'My React application is getting slow with large datasets. What are the best strategies for optimization?',
      tags: ['react', 'performance', 'optimization'],
      votes: 8,
      answers: 0,
      timestamp: '1 day ago',
      author: 'Mike Johnson',
      authorId: 3,
      accepted: false
    }
  ],
  answers: {
    1: [
      {
        id: 1,
        content: 'React Context API is great for avoiding prop drilling. Here are the key best practices: 1) Keep context values stable 2) Split contexts by concern 3) Use multiple contexts instead of one large context.',
        author: 'Alice Brown',
        authorId: 4,
        votes: 12,
        timestamp: '1 hour ago',
        accepted: true
      },
      {
        id: 2,
        content: 'Also remember to memoize context values to prevent unnecessary re-renders. Use useMemo and useCallback appropriately.',
        author: 'Bob Wilson',
        authorId: 5,
        votes: 8,
        timestamp: '30 minutes ago',
        accepted: false
      }
    ]
  },
  notifications: [
    {
      id: 1,
      message: 'Alice Brown answered your question',
      timestamp: '1 hour ago',
      read: false,
      type: 'answer'
    },
    {
      id: 2,
      message: 'Your answer was marked as accepted',
      timestamp: '2 hours ago',
      read: false,
      type: 'accepted'
    },
    {
      id: 3,
      message: 'Bob Wilson mentioned you in a comment',
      timestamp: '1 day ago',
      read: true,
      type: 'mention'
    }
  ],
  currentFilter: 'recent',
  selectedTag: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: {
          ...action.payload,
          isLoggedIn: true
        }
      };
    case 'LOGOUT':
      return {
        ...state,
        user: {
          id: null,
          name: null,
          avatar: null,
          reputation: 0,
          isLoggedIn: false
        }
      };
    case 'ADD_QUESTION':
      return {
        ...state,
        questions: [action.payload, ...state.questions]
      };
    case 'ADD_ANSWER':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: [
            ...(state.answers[action.payload.questionId] || []),
            action.payload.answer
          ]
        }
      };
    case 'VOTE_QUESTION':
      return {
        ...state,
        questions: state.questions.map(q =>
          q.id === action.payload.id
            ? { ...q, votes: q.votes + action.payload.delta }
            : q
        )
      };
    case 'VOTE_ANSWER':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: state.answers[action.payload.questionId].map(a =>
            a.id === action.payload.answerId
              ? { ...a, votes: a.votes + action.payload.delta }
              : a
          )
        }
      };
    case 'MARK_ACCEPTED':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: state.answers[action.payload.questionId].map(a =>
            a.id === action.payload.answerId
              ? { ...a, accepted: true }
              : { ...a, accepted: false }
          )
        }
      };
    case 'SET_FILTER':
      return {
        ...state,
        currentFilter: action.payload
      };
    case 'SET_TAG_FILTER':
      return {
        ...state,
        selectedTag: action.payload,
        currentFilter: 'tag'
      };
    case 'CLEAR_TAG_FILTER':
      return {
        ...state,
        selectedTag: null,
        currentFilter: 'recent'
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        )
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}