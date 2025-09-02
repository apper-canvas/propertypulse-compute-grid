import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import agentService from "@/services/api/agentService";
import { toast } from "react-toastify";

const AgentListPage = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    setLoading(true);
    try {
      const agentData = await agentService.getAll();
      setAgents(agentData || []);
    } catch (err) {
      setError(err.message);
      console.error("Error loading agents:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const specialties = [
    "Residential", "Commercial", "Rentals", "Sales", 
    "Property Management", "Luxury Homes", "First-Time Buyers", "Investors"
  ];

  const filteredAndSortedAgents = agents
    .filter(agent => {
      if (!searchTerm && !selectedSpecialty) return true;
      
      let matchesSearch = true;
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        matchesSearch = (
          agent.agent_name_c?.toLowerCase().includes(search) ||
          agent.specialties_c?.toLowerCase().includes(search) ||
          agent.bio_c?.toLowerCase().includes(search)
        );
      }

      let matchesSpecialty = true;
      if (selectedSpecialty) {
        matchesSpecialty = agent.specialties_c?.includes(selectedSpecialty) || false;
      }

      return matchesSearch && matchesSpecialty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.agent_name_c || "").localeCompare(b.agent_name_c || "");
        case "rating":
          return (Number(b.ratings_c) || 0) - (Number(a.ratings_c) || 0);
        default:
          return 0;
      }
    });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAgents} />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Real Estate Agents</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Meet our experienced team of real estate professionals. Each agent brings unique expertise and local market knowledge to help you achieve your property goals.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, specialty, or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Specialty Filter */}
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Specialties</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedSpecialty) && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <Badge variant="primary" className="flex items-center gap-1">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-red-600">
                    <ApperIcon name="X" className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedSpecialty && (
                <Badge variant="primary" className="flex items-center gap-1">
                  {selectedSpecialty}
                  <button onClick={() => setSelectedSpecialty("")} className="ml-1 hover:text-red-600">
                    <ApperIcon name="X" className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialty("");
                }}
                className="text-sm text-primary-600 hover:text-primary-700 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredAndSortedAgents.length} of {agents.length} agents
          </p>
        </div>

        {/* Agent Grid */}
        {filteredAndSortedAgents.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="Users" className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No agents found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedAgents.map((agent) => (
              <div key={agent.Id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Agent Photo */}
                <div className="aspect-w-3 aspect-h-2 bg-gray-100">
                  {agent.photo_url_c ? (
                    <img
                      src={agent.photo_url_c}
                      alt={agent.agent_name_c}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-48 bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center text-white text-4xl font-bold ${agent.photo_url_c ? 'hidden' : 'flex'}`}>
                    {agent.agent_name_c?.split(' ').map(n => n[0]).join('') || 'A'}
                  </div>
                </div>

                {/* Agent Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{agent.agent_name_c}</h3>
                  
                  {/* Rating */}
                  {agent.ratings_c && (
                    <div className="flex items-center gap-1 mb-3">
                      <ApperIcon name="Star" className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{Number(agent.ratings_c).toFixed(1)}</span>
                      <span className="text-sm text-gray-500">rating</span>
                    </div>
                  )}

                  {/* Specialties */}
                  {agent.specialties_c && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {agent.specialties_c.split(',').slice(0, 3).map((specialty, index) => (
                          <Badge key={index} variant="primary" className="text-xs">
                            {specialty.trim()}
                          </Badge>
                        ))}
                        {agent.specialties_c.split(',').length > 3 && (
                          <Badge variant="default" className="text-xs">
                            +{agent.specialties_c.split(',').length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bio Preview */}
                  {agent.bio_c && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {agent.bio_c}
                    </p>
                  )}

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4 text-sm">
                    {agent.phone_c && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <ApperIcon name="Phone" className="h-4 w-4" />
                        <span>{agent.phone_c}</span>
                      </div>
                    )}
                    {agent.email_c && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <ApperIcon name="Mail" className="h-4 w-4" />
                        <span>{agent.email_c}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/agents/${agent.Id}`)}
                    >
                      View Profile
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/agents/${agent.Id}`)}
                    >
                      <ApperIcon name="MessageSquare" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentListPage;