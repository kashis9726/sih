import React, { useState } from 'react';
import { FileText, Flag, Eye, Trash2, Check, X } from 'lucide-react';

const ContentModeration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('posts');

  const reportedContent = {
    posts: [
      { id: 1, content: 'Inappropriate content example...', author: 'John Doe', reports: 3, status: 'pending' },
      { id: 2, content: 'Spam content example...', author: 'Jane Smith', reports: 5, status: 'pending' },
    ],
    comments: [
      { id: 1, content: 'Offensive comment example...', author: 'Mike Johnson', reports: 2, status: 'pending' },
    ],
    blogs: [
      { id: 1, title: 'Controversial blog post', author: 'Sarah Wilson', reports: 1, status: 'pending' },
    ]
  };

  const handleApprove = (type: string, id: number) => {
    console.log(`Approved ${type} with id ${id}`);
  };

  const handleReject = (type: string, id: number) => {
    console.log(`Rejected ${type} with id ${id}`);
  };

  const ContentItem = ({ item, type }: { item: any; type: string }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium text-gray-900">
            {type === 'blogs' ? item.title : item.content.substring(0, 100) + '...'}
          </h4>
          <p className="text-sm text-gray-600">By: {item.author}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <Flag className="h-3 w-3 mr-1" />
            {item.reports} reports
          </span>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => handleApprove(type, item.id)}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <Check className="h-4 w-4 mr-1" />
          Approve
        </button>
        <button
          onClick={() => handleReject(type, item.id)}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
        >
          <X className="h-4 w-4 mr-1" />
          Reject
        </button>
        <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          <Eye className="h-4 w-4 mr-1" />
          View Full
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center mb-6">
          <FileText className="h-7 w-7 mr-3 text-purple-600" />
          Content Moderation
        </h1>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {['posts', 'comments', 'blogs'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab} ({reportedContent[tab as keyof typeof reportedContent].length})
              </button>
            ))}
          </nav>
        </div>

        {/* Content List */}
        <div>
          {reportedContent[activeTab as keyof typeof reportedContent].map((item) => (
            <ContentItem key={item.id} item={item} type={activeTab} />
          ))}
          
          {reportedContent[activeTab as keyof typeof reportedContent].length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No reported {activeTab} to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentModeration;