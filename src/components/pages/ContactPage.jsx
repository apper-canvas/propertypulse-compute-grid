import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Contact Our Agents
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with our experienced real estate professionals who can help you find your perfect home or sell your current property.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Methods */}
          <div className="space-y-6">
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

          {/* Agent Directory Placeholder */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Featured Agents</h2>
            
            <div className="space-y-6">
              {/* Agent Cards */}
              {[
                { name: "Sarah Johnson", title: "Senior Agent", phone: "(555) 123-4567" },
                { name: "Michael Chen", title: "Listing Specialist", phone: "(555) 123-4568" },
                { name: "Emily Rodriguez", title: "Buyer's Agent", phone: "(555) 123-4569" }
              ].map((agent, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xl">
                        {agent.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{agent.name}</h3>
                      <p className="text-sm text-gray-600">{agent.title}</p>
                      <p className="text-sm text-primary-600">{agent.phone}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Contact
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-primary-50 rounded-lg text-center">
              <p className="text-sm text-primary-700 mb-3">
                Ready to get started?
              </p>
              <Button className="w-full">
                <ApperIcon name="MessageSquare" className="h-4 w-4 mr-2" />
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;