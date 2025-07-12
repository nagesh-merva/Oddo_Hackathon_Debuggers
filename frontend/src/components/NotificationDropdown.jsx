import React, { useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, MessageCircle, CheckCircle, AtSign } from 'lucide-react';

export default function NotificationDropdown({ onClose }) {
  const { state, dispatch } = useApp();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const getIcon = (type) => {
    switch (type) {
      case 'answer':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'mention':
        return <AtSign className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleNotificationClick = (notificationId) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {state.notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No notifications yet</p>
          </div>
        ) : (
          state.notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification.id)}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                {getIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {state.notifications.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
}