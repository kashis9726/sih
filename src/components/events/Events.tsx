import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { 
  Calendar, 
  Plus, 
  MapPin, 
  Users, 
  Video,
  Presentation,
  Coffee,
  GraduationCap
} from 'lucide-react';

const Events: React.FC = () => {
  const { user } = useAuth();
  const { events, addEvent, joinEvent, updateUserPoints, users } = useApp();
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'seminar' | 'webinar' | 'reunion' | 'workshop'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'seminar' as 'seminar' | 'webinar' | 'reunion' | 'workshop',
    maxAttendees: ''
  });

  const handleCreateEvent = () => {
    if (!user || !newEvent.title.trim() || !newEvent.date || !newEvent.time) return;

    const author = users.find(u => u.id === user.id) || user;
    const eventDate = new Date(`${newEvent.date}T${newEvent.time}`);
    
    addEvent({
      organizerId: user.id,
      organizer: author,
      title: newEvent.title,
      description: newEvent.description,
      date: eventDate,
      location: newEvent.location,
      type: newEvent.type,
      attendees: [],
      maxAttendees: newEvent.maxAttendees ? parseInt(newEvent.maxAttendees) : undefined
    });

    // Award points for organizing event
    updateUserPoints(user.id, 20);

    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      type: 'seminar',
      maxAttendees: ''
    });
    setShowCreateEvent(false);
  };

  const handleJoinEvent = (eventId: string) => {
    if (!user) return;
    joinEvent(eventId, user.id);
    
    // Award points for attending event
    const event = events.find(e => e.id === eventId);
    if (event && !event.attendees.includes(user.id)) {
      updateUserPoints(user.id, 5);
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'webinar':
        return <Video className="h-5 w-5" />;
      case 'workshop':
        return <Presentation className="h-5 w-5" />;
      case 'reunion':
        return <Coffee className="h-5 w-5" />;
      default:
        return <GraduationCap className="h-5 w-5" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'webinar':
        return 'bg-blue-100 text-blue-800';
      case 'workshop':
        return 'bg-green-100 text-green-800';
      case 'reunion':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  const byFilter = (e: any) => (filterType === 'all' ? true : e.type === filterType);
  const bySearch = (e: any) =>
    searchQuery
      ? e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.organizer.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

  const upcomingEvents = events
    .filter(event => new Date(event.date) > new Date())
    .filter(byFilter)
    .filter(bySearch)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = events
    .filter(event => new Date(event.date) <= new Date())
    .filter(byFilter)
    .filter(bySearch)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Events Hub 📅</h1>
        <p className="text-gray-600">Join seminars, webinars, and networking events</p>
      </div>

      {/* Create Event */}
      {(user?.role === 'alumni' || user?.role === 'admin') && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          {!showCreateEvent ? (
            <button
              onClick={() => setShowCreateEvent(true)}
              className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Event
            </button>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Create New Event</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="e.g., Tech Career Fair 2024"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="seminar">Seminar</option>
                    <option value="webinar">Webinar</option>
                    <option value="workshop">Workshop</option>
                    <option value="reunion">Reunion</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="e.g., Auditorium A or Zoom Link"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Attendees (Optional)
                  </label>
                  <input
                    type="number"
                    value={newEvent.maxAttendees}
                    onChange={(e) => setNewEvent({ ...newEvent, maxAttendees: e.target.value })}
                    placeholder="e.g., 100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Describe the event, what attendees can expect, and any requirements..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateEvent(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEvent}
                  disabled={!newEvent.title.trim() || !newEvent.date || !newEvent.time}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Event
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="inline-flex bg-gray-100 rounded-lg p-1 w-full md:w-auto">
            {[{id:'all',label:'All'},{id:'seminar',label:'Seminars'},{id:'webinar',label:'Webinars'},{id:'workshop',label:'Workshops'},{id:'reunion',label:'Reunions'}].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`flex-1 md:flex-none px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filterType === (tab.id as any) ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events or organizers..."
              className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
              {(() => {
                const keyword = `${event.type || 'Event'} ${event.title || ''}`.trim();
                const cover = `https://placehold.co/1200x400?text=${encodeURIComponent(keyword)}`;
                return (
                  <img src={cover} alt={event.title} className="w-full h-36 object-cover" />
                );
              })()}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white">
                      {getEventTypeIcon(event.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                      <p className="text-gray-600 text-sm">Organized by {event.organizer.name}</p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.type)}`}>
                    {getEventTypeIcon(event.type)}
                    <span className="capitalize">{event.type}</span>
                  </div>
                </div>

                {event.description && (
                  <p className="text-gray-700 mb-4 line-clamp-2">{event.description}</p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>
                      {event.attendees.length} attending
                      {event.maxAttendees && ` / ${event.maxAttendees} max`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    {new Date(event.date).getTime() - new Date().getTime() > 0 && (
                      <span>
                        {Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days to go
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleJoinEvent(event.id)}
                    disabled={!!(event.maxAttendees && event.attendees.length >= (event.maxAttendees || 0))}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      event.attendees.includes(user?.id || '') 
                        ? 'bg-gray-100 text-gray-600' 
                        : event.maxAttendees && event.attendees.length >= event.maxAttendees
                        ? 'bg-red-100 text-red-600 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {event.attendees.includes(user?.id || '')
                      ? 'Registered'
                      : event.maxAttendees && event.attendees.length >= event.maxAttendees
                      ? 'Full'
                      : 'Register'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {upcomingEvents.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
          <p className="text-gray-600">
            {user?.role === 'alumni' || user?.role === 'admin'
              ? 'Create the first event to get the community engaged!'
              : 'Check back soon for new events from alumni and the institute.'
            }
          </p>
        </div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Past Events</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pastEvents.slice(0, 4).map((event) => (
              <div key={event.id} className="bg-gray-50 rounded-xl border border-gray-200 opacity-75 overflow-hidden">
                {(() => {
                  const keyword = `${event.type || 'Event'} ${event.title || ''}`.trim();
                  const cover = `https://placehold.co/1200x400?text=${encodeURIComponent(keyword)}`;
                  return (
                    <img src={cover} alt={event.title} className="w-full h-32 object-cover" />
                  );
                })()}
                <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white">
                      {getEventTypeIcon(event.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                      <p className="text-gray-600 text-sm">by {event.organizer.name}</p>
                    </div>
                  </div>
                  
                  <div className="px-2 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                    Completed
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{event.attendees.length} attended</span>
                  </div>
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;