import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Globe, Lock, Plus, Key, Calendar, MapPin, Users, 
  ArrowRight, Sparkles, Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [inviteCode, setInviteCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (e) {
        base44.auth.redirectToLogin();
      }
    };
    loadUser();
  }, []);

  const { data: openCommunities = [], isLoading: loadingOpen } = useQuery({
    queryKey: ['openCommunities'],
    queryFn: () => base44.entities.Community.filter({ type: 'open' }, '-created_date', 4),
    enabled: !!user,
  });

  const { data: allCommunities = [], isLoading: loadingClosed } = useQuery({
    queryKey: ['allCommunities'],
    queryFn: () => base44.entities.Community.list('-created_date'),
    enabled: !!user,
  });

  const myCommunities = allCommunities.filter(c => 
    c.type === 'closed' && (c.created_by === user?.email || c.members?.includes(user?.email))
  );

  const handleJoinWithCode = async () => {
    if (!inviteCode.trim()) return;
    setIsJoining(true);
    
    const communities = await base44.entities.Community.filter({ invitation_code: inviteCode.trim() });
    
    if (communities.length === 0) {
      toast.error('Invalid invitation code');
      setIsJoining(false);
      return;
    }
    
    const community = communities[0];
    const currentMembers = community.members || [];
    
    if (!currentMembers.includes(user.email)) {
      await base44.entities.Community.update(community.id, {
        members: [...currentMembers, user.email]
      });
      toast.success('Successfully joined the community!');
    } else {
      toast.info('You are already a member of this community');
    }
    
    setInviteCode('');
    setIsJoining(false);
    window.location.href = createPageUrl(`CommunityDetail?id=${community.id}`);
  };

  const CommunityCard = ({ community, showBadge }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={createPageUrl(`CommunityDetail?id=${community.id}`)}>
        <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full bg-white">
          <div className="relative h-40 overflow-hidden">
            <img 
              src={community.cover_image || `https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=300&fit=crop`} 
              alt={community.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {showBadge && (
              <Badge className={`absolute top-3 right-3 ${community.type === 'open' ? 'bg-emerald-500' : 'bg-violet-600'}`}>
                {community.type === 'open' ? <Globe className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                {community.type}
              </Badge>
            )}
            <h3 className="absolute bottom-3 left-4 right-4 text-lg font-semibold text-white truncate">
              {community.name}
            </h3>
          </div>
          <CardContent className="p-4 space-y-3">
            {community.event_date && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4 text-violet-500" />
                {format(new Date(community.event_date), 'MMM d, yyyy • h:mm a')}
              </div>
            )}
            {community.location && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-violet-500" />
                <span className="truncate">{community.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Users className="w-4 h-4 text-violet-500" />
              {(community.confirmed_attendees?.length || 0)} attending
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );

  if (!user) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const resetOnboarding = async () => {
    await base44.auth.updateMe({
      phone_number: null,
      allergies: [],
      notes: null
    });
    toast.success('נתוני Onboarding נמחקו - מפנה לדף הרשמה...');
    setTimeout(() => {
      window.location.href = createPageUrl('Onboarding');
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Temporary Reset Button - Remove Later */}
      <div className="flex justify-end">
        <Button 
          onClick={resetOnboarding}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          🔄 צפה בדף Onboarding
        </Button>
      </div>

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 p-8 md:p-10 text-white"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200')] bg-cover bg-center opacity-10" />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {user.full_name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-violet-100 text-lg mb-6">
            Ready to connect with your communities?
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to={createPageUrl('CreateCommunity')}>
              <Button className="bg-white text-violet-700 hover:bg-violet-50 rounded-full px-6">
                <Plus className="w-4 h-4 mr-2" />
                Create Community
              </Button>
            </Link>
            <Link to={createPageUrl('OpenCommunities')}>
              <Button className="bg-white text-violet-700 hover:bg-violet-50 rounded-full px-6">
                <Globe className="w-4 h-4 mr-2" />
                Browse Open Events
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Join with Code */}
      <Card className="border-0 shadow-md bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                <Key className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Have an invitation code?</h3>
                <p className="text-sm text-slate-500">Enter it below to join a private community</p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Input 
                placeholder="Enter code..."
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="rounded-full border-slate-200"
              />
              <Button 
                onClick={handleJoinWithCode}
                disabled={isJoining || !inviteCode.trim()}
                className="bg-violet-600 hover:bg-violet-700 rounded-full px-6"
              >
                Join
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My Communities */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <Lock className="w-5 h-5 text-violet-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">My Private Communities</h2>
          </div>
          <Link to={createPageUrl('MyCommunities')}>
            <Button variant="ghost" className="text-violet-600 hover:text-violet-700">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        
        {loadingClosed ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
          </div>
        ) : myCommunities.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No private communities yet</h3>
              <p className="text-slate-500 mb-4 max-w-sm">Create your own or join one using an invitation code</p>
              <Link to={createPageUrl('CreateCommunity')}>
                <Button className="bg-violet-600 hover:bg-violet-700 rounded-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Community
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {myCommunities.slice(0, 4).map(community => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        )}
      </section>

      {/* Open Communities */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Globe className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Discover Open Events</h2>
          </div>
          <Link to={createPageUrl('OpenCommunities')}>
            <Button variant="ghost" className="text-violet-600 hover:text-violet-700">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        
        {loadingOpen ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
          </div>
        ) : openCommunities.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No open events yet</h3>
              <p className="text-slate-500 max-w-sm">Be the first to create a public community event!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {openCommunities.map(community => (
              <CommunityCard key={community.id} community={community} showBadge />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
