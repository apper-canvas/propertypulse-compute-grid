import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import agentService from "@/services/api/agentService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
const ContactPage = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredAgents = agents.filter(agent => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      agent.agent_name_c?.toLowerCase().includes(search) ||
      agent.specialties_c?.toLowerCase().includes(search) ||
      agent.bio_c?.toLowerCase().includes(search)
    );
  });

  const featuredAgents = filteredAgents.slice(0, 3);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAgents} />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Contact Our Agents
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with our experienced real estate professionals who can help you find your perfect home or sell your current property.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="Phone" className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600">(555) 123-HOMES</p>
                    <p className="text-sm text-gray-500">Monday - Sunday, 8AM - 8PM</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="Mail" className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">hello@propertypulse.com</p>
                    <p className="text-sm text-gray-500">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="MapPin" className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Office</h3>
                    <p className="text-gray-600">123 Real Estate Blvd</p>
                    <p className="text-gray-600">Los Angeles, CA 90210</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Services</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <ApperIcon name="Home" className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900 text-sm">Buying</h3>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <ApperIcon name="DollarSign" className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900 text-sm">Selling</h3>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <ApperIcon name="Key" className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900 text-sm">Rentals</h3>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <ApperIcon name="TrendingUp" className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900 text-sm">Investment</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Agent Directory */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Our Agents</h2>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/agents')}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="Users" className="h-4 w-4" />
                  View All Agents
                </Button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search agents by name, specialty, or expertise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Agent Cards */}
              <div className="space-y-4">
                {featuredAgents.length === 0 ? (
                  <div className="text-center py-8">
                    <ApperIcon name="Users" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No agents found matching your search.</p>
                  </div>
                ) : (
                  featuredAgents.map((agent) => (
                    <div key={agent.Id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {agent.photo_url_c ? (
                            <img
                              src={agent.photo_url_c}
                              alt={agent.agent_name_c}
                              className="w-16 h-16 rounded-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-16 h-16 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-xl ${agent.photo_url_c ? 'hidden' : 'flex'}`}>
                            {agent.agent_name_c?.split(' ').map(n => n[0]).join('') || 'A'}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{agent.agent_name_c}</h3>
                          {agent.specialties_c && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {agent.specialties_c.split(',').slice(0, 2).map((specialty, index) => (
                                <Badge key={index} variant="primary" className="text-xs">
                                  {specialty.trim()}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {agent.ratings_c && (
                            <div className="flex items-center gap-1 mt-1">
                              <ApperIcon name="Star" className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm text-gray-600">{Number(agent.ratings_c).toFixed(1)}</span>
                            </div>
                          )}
                          {agent.phone_c && (
                            <p className="text-sm text-primary-600">{agent.phone_c}</p>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/agents/${agent.Id}`)}
                        >
                          Contact
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {agents.length > 3 && (
                <div className="mt-6 text-center">
                  <Button 
                    onClick={() => navigate('/agents')}
                    className="w-full sm:w-auto"
                  >
                    <ApperIcon name="Users" className="h-4 w-4 mr-2" />
                    Browse All {agents.length} Agents
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;