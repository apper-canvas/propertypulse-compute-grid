import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import agentService from "@/services/api/agentService";
import messageService from "@/services/api/messageService";
import inquiryService from "@/services/api/inquiryService";
import propertyService from "@/services/api/propertyService";
import { toast } from "react-toastify";

const AgentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  
  const { user, isAuthenticated } = useSelector((state) => state.user);
  
  const [agent, setAgent] = useState(null);
  const [property, setProperty] = useState(null);
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Contact form state
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    phone: "",
    email: "",
    name: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAgentData();
    if (propertyId) {
      loadPropertyData();
      setShowContactForm(true);
    }
  }, [id, propertyId]);

  const loadAgentData = async () => {
    setLoading(true);
    try {
      const agentData = await agentService.getById(id);
      if (!agentData) {
        setError("Agent not found");
        return;
      }
      setAgent(agentData);
      
      // Load recent listings for this agent (mock for now)
      const listings = await propertyService.getAll();
      setRecentListings(listings.slice(0, 3)); // Show first 3 as recent listings
    } catch (err) {
      setError(err.message);
      console.error("Error loading agent:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPropertyData = async () => {
    if (!propertyId) return;
    
    try {
      const propertyData = await propertyService.getById(propertyId);
      setProperty(propertyData);
      
      // Pre-fill message with property details
      if (propertyData) {
        setFormData(prev => ({
          ...prev,
          message: `Hi, I'm interested in the property at ${propertyData.address}, ${propertyData.city}, ${propertyData.state}. Could you please provide more information about this listing?`
        }));
      }
    } catch (err) {
      console.error("Error loading property:", err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Please sign in to contact agents");
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    setSubmitting(true);
    try {
      // Create message
      const messageData = {
        agent_id_c: parseInt(id),
        property_id_c: propertyId ? parseInt(propertyId) : null,
        message_content_c: formData.message,
        sender_id_c: user?.userId || null,
        recipient_id_c: null,
        agent_name: agent?.agent_name_c
      };
      
      const message = await messageService.create(messageData);
      
      // Create inquiry
      const inquiryData = {
        Name: `Inquiry about ${property ? `${property.address}` : 'services'}`,
        agent_id_c: parseInt(id),
        property_id_c: propertyId ? parseInt(propertyId) : null,
        user_id_c: user?.userId || null,
        inquiry_status_c: "New",
        agent_name: agent?.agent_name_c
      };
      
      const inquiry = await inquiryService.create(inquiryData);
      
      if (message || inquiry) {
        setFormData({
          message: "",
          phone: "",
          email: "",
          name: ""
        });
        setShowContactForm(false);
        toast.success("Your message has been sent successfully!");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAgentData} />;
  if (!agent) return <Error message="Agent not found" />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ApperIcon name="ArrowLeft" className="h-4 w-4" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Agent Profile */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Photo */}
                  <div className="flex-shrink-0">
                    {agent.photo_url_c ? (
                      <img
                        src={agent.photo_url_c}
                        alt={agent.agent_name_c}
                        className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-32 h-32 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto md:mx-0 ${agent.photo_url_c ? 'hidden' : 'flex'}`}>
                      {agent.agent_name_c?.split(' ').map(n => n[0]).join('') || 'A'}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{agent.agent_name_c}</h1>
                    
                    {/* Rating */}
                    {agent.ratings_c && (
                      <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
                        <ApperIcon name="Star" className="h-5 w-5 text-yellow-500" />
                        <span className="text-lg font-semibold">{Number(agent.ratings_c).toFixed(1)}</span>
                        <span className="text-gray-500">rating</span>
                      </div>
                    )}

                    {/* Specialties */}
                    {agent.specialties_c && (
                      <div className="mb-4">
                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                          {agent.specialties_c.split(',').map((specialty, index) => (
                            <Badge key={index} variant="primary">
                              {specialty.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contact Info */}
                    <div className="space-y-2 text-sm">
                      {agent.phone_c && (
                        <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                          <ApperIcon name="Phone" className="h-4 w-4" />
                          <span>{agent.phone_c}</span>
                        </div>
                      )}
                      {agent.email_c && (
                        <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                          <ApperIcon name="Mail" className="h-4 w-4" />
                          <span>{agent.email_c}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            {agent.bio_c && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {agent.bio_c}
                </p>
              </div>
            )}

            {/* Recent Listings */}
            {recentListings.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Listings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recentListings.map((listing) => (
                    <div key={listing.Id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <img
                        src={listing.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80'}
                        alt={listing.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1">{listing.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{listing.address}</p>
                        <p className="text-lg font-semibold text-primary-600">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(listing.price)}
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full mt-3"
                          onClick={() => navigate(`/property/${listing.Id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Property Context (if coming from property) */}
            {property && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Inquiring About</h3>
                <div className="flex gap-4">
                  <img
                    src={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80'}
                    alt={property.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{property.title}</h4>
                    <p className="text-sm text-gray-600">{property.address}</p>
                    <p className="text-sm font-semibold text-primary-600">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(property.price)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact {agent.agent_name_c}</h3>
              
              {!showContactForm ? (
                <Button 
                  className="w-full mb-4"
                  onClick={() => setShowContactForm(true)}
                >
                  <ApperIcon name="MessageSquare" className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      required
                      placeholder="Tell us about your real estate needs..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Your phone number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your email address"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={submitting} className="flex-1">
                      {submitting ? (
                        <>
                          <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Send" className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowContactForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {/* Direct Contact Options */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Or contact directly:</p>
                <div className="space-y-2">
                  {agent.phone_c && (
                    <a 
                      href={`tel:${agent.phone_c}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600"
                    >
                      <ApperIcon name="Phone" className="h-4 w-4" />
                      {agent.phone_c}
                    </a>
                  )}
                  {agent.email_c && (
                    <a 
                      href={`mailto:${agent.email_c}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600"
                    >
                      <ApperIcon name="Mail" className="h-4 w-4" />
                      {agent.email_c}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailPage;