import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { 
  Users, Globe, Lock, Calendar, MessageCircle, 
  ListTodo, Sparkles, ArrowRight, Check
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await base44.auth.isAuthenticated();
      setIsAuthenticated(auth);
    };
    checkAuth();
  }, []);

  const features = [
    { icon: Globe, title: 'Open Communities', desc: 'Browse and join public events freely' },
    { icon: Lock, title: 'Closed Communities', desc: 'Create private groups with invitation codes' },
    { icon: Calendar, title: 'Event Management', desc: 'Organize events with RSVP tracking' },
    { icon: MessageCircle, title: 'Real-time Chat', desc: 'Communicate with your community' },
    { icon: ListTodo, title: 'Smart Lists', desc: 'Manage tasks, food, and equipment' },
    { icon: Sparkles, title: 'AI Assistant', desc: 'Get smart suggestions for your events' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <nav className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Communify</span>
            </div>
            
            {isAuthenticated ? (
              <Link to={createPageUrl('Dashboard')}>
                <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-6">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <Button 
                onClick={() => base44.auth.redirectToLogin()}
                className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-6"
              >
                Sign In
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </nav>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 leading-tight">
              Build Communities,
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Create Memories
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              The all-in-one platform for organizing events, managing groups, and bringing people together with AI-powered insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => isAuthenticated ? window.location.href = createPageUrl('Dashboard') : base44.auth.redirectToLogin()}
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-full px-8 py-6 text-lg shadow-xl shadow-violet-500/25"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Link to={createPageUrl('OpenCommunities')}>
                <Button 
                  size="lg"
                  className="bg-white/10 border border-white/30 text-white hover:bg-white/20 hover:border-white rounded-full px-8 py-6 text-lg backdrop-blur-sm"
                >
                  Browse Communities
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful features to help you build and manage thriving communities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 rounded-3xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build Your Community?
          </h2>
          <p className="text-xl text-violet-100 mb-10">
            Join thousands of organizers creating amazing experiences
          </p>
          <Button 
            onClick={() => isAuthenticated ? window.location.href = createPageUrl('Dashboard') : base44.auth.redirectToLogin()}
            size="lg"
            className="bg-white text-violet-700 hover:bg-slate-100 rounded-full px-10 py-6 text-lg font-semibold shadow-xl"
          >
            Start for Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-white">Communify</span>
          </div>
          <p className="text-slate-400">© 2024 Communify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
