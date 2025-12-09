import React, { useState, useEffect } from 'react';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  User, Phone, AlertTriangle, FileText, Save, 
  X, Plus, Camera, Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    allergies: [],
    notes: '',
    avatar_url: ''
  });
  const [newAllergy, setNewAllergy] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
        setFormData({
          full_name: userData.full_name || '',
          phone_number: userData.phone_number || '',
          allergies: userData.allergies || [],
          notes: userData.notes || '',
          avatar_url: userData.avatar_url || ''
        });
      } catch (e) {
        base44.auth.redirectToLogin();
      }
    };
    loadUser();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    
    await base44.auth.updateMe({
      phone_number: formData.phone_number,
      allergies: formData.allergies,
      notes: formData.notes,
      avatar_url: formData.avatar_url
    });
    
    toast.success('Profile updated successfully!');
    setIsSaving(false);
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, newAllergy.trim()]
      });
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergy) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter(a => a !== allergy)
    });
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData({ ...formData, avatar_url: file_url });
    setIsUploading(false);
    toast.success('Avatar uploaded!');
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-40 rounded-3xl" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-600 to-indigo-700 text-white overflow-hidden mb-6">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="w-24 h-24 border-4 border-white/20">
                  <AvatarImage src={formData.avatar_url} />
                  <AvatarFallback className="bg-white/20 text-white text-2xl">
                    {formData.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <input 
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                  {isUploading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-6 h-6 text-white" />
                  )}
                </label>
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">{formData.full_name || 'Your Profile'}</h1>
                <p className="text-violet-200">{user.email}</p>
                <Badge className="mt-2 bg-white/20 text-white border-0">
                  {user.role === 'admin' ? 'Admin' : 'Member'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-violet-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-slate-700">Full Name</Label>
              <Input 
                id="full_name"
                value={formData.full_name}
                disabled
                className="bg-slate-50"
              />
              <p className="text-xs text-slate-500">Name cannot be changed here</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-700 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input 
                id="phone"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-slate-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Allergies & Dietary Restrictions
              </Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.allergies.map((allergy, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary"
                    className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 flex items-center gap-1"
                  >
                    {allergy}
                    <button onClick={() => removeAllergy(allergy)} className="hover:text-amber-900">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="Add allergy (e.g., peanuts, gluten)"
                  className="rounded-xl flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && addAllergy()}
                />
                <Button 
                  type="button" 
                  onClick={addAllergy}
                  variant="outline"
                  className="rounded-xl"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-slate-700 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Additional Notes
              </Label>
              <Textarea 
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any health conditions, preferences, or important information others should know..."
                className="rounded-xl min-h-[120px] resize-none"
              />
            </div>

            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-violet-600 hover:bg-violet-700 rounded-xl py-6 text-lg"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
