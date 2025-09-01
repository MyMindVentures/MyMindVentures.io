import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Crown, 
  Shield, 
  Edit, 
  Save, 
  X,
  MapPin,
  Calendar,
  Briefcase,
  Zap
} from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { supabaseService as db } from '../../lib/supabase';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  role: string;
  access_level: string;
  location: string;
  joined_date: string;
  company: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: 'hello@mymindventures.io',
    phone: '',
    role: '',
    access_level: '',
    location: '',
    joined_date: '',
    company: 'MyMindVentures.io'
  });
  const [editForm, setEditForm] = useState<UserData>(userData);

  useEffect(() => {
    if (isOpen) {
      loadUserProfile();
    }
  }, [isOpen]);

  const loadUserProfile = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await db.getUserProfile('hello@mymindventures.io');
      if (data) {
        const profileData: UserData = {
          name: data.full_name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          access_level: data.access_level,
          location: data.location,
          company: data.company,
          joined_date: data.created_at.split('T')[0],
        };
        setUserData(profileData);
        setEditForm(profileData);
      }
      if (error) {
        console.error('Error loading user profile:', error);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data, error } = await db.updateUserProfile('hello@mymindventures.io', {
        full_name: editForm.name,
        phone: editForm.phone,
        role: editForm.role,
        access_level: editForm.access_level,
        location: editForm.location,
        company: editForm.company,
      });
      
      if (data) {
        setUserData(editForm);
        setIsEditing(false);
        alert('✅ Profile updated successfully!');
      }
      if (error) {
        console.error('Error updating profile:', error);
        alert('❌ Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('❌ Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm(userData);
    setIsEditing(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900/95 backdrop-blur-xl rounded-xl border border-gray-700/50 max-w-2xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">User Profile</h3>
                <p className="text-gray-400 text-sm">Manage your account information</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing && (
                <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Profile Picture & Basic Info */}
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-white font-bold text-2xl">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-white">{userData.name}</h2>
                  <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full">
                    <Crown className="w-4 h-4 text-white" />
                    <span className="text-white font-semibold text-sm">{userData.role}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-cyan-400">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">{userData.access_level}</span>
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-white font-medium flex items-center">
                  <User className="w-4 h-4 mr-2 text-cyan-400" />
                  Personal Information
                </h4>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      label="Full Name"
                      value={editForm.name}
                      onChange={(value) => setEditForm(prev => ({ ...prev, name: value }))}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={editForm.email}
                      onChange={(value) => setEditForm(prev => ({ ...prev, email: value }))}
                    />
                    <Input
                      label="Phone"
                      value={editForm.phone}
                      onChange={(value) => setEditForm(prev => ({ ...prev, phone: value }))}
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{userData.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{userData.phone}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-medium flex items-center">
                  <Briefcase className="w-4 h-4 mr-2 text-purple-400" />
                  Professional Details
                </h4>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      label="Role"
                      value={editForm.role}
                      onChange={(value) => setEditForm(prev => ({ ...prev, role: value }))}
                    />
                    <Input
                      label="Company"
                      value={editForm.company}
                      onChange={(value) => setEditForm(prev => ({ ...prev, company: value }))}
                    />
                    <Input
                      label="Location"
                      value={editForm.location}
                      onChange={(value) => setEditForm(prev => ({ ...prev, location: value }))}
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{userData.company}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{userData.location}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">Joined {new Date(userData.joined_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-4">
              <h4 className="text-white font-medium">Achievements & Recognition</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'Platform Creator', desc: 'Built revolutionary AI platform', icon: Crown, color: 'from-yellow-400 to-orange-500' },
                  { title: 'ADHD Innovator', desc: 'Unique blueprinting talents', icon: Shield, color: 'from-purple-400 to-pink-500' },
                  { title: 'AI Pioneer', desc: 'Multi-AI orchestration expert', icon: Zap, color: 'from-cyan-400 to-blue-500' },
                ].map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={index} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${achievement.color} flex items-center justify-center mb-3`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h5 className="text-white font-medium text-sm mb-1">{achievement.title}</h5>
                      <p className="text-gray-400 text-xs">{achievement.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          {isEditing && (
            <div className="flex items-center justify-end space-x-2 p-6 border-t border-gray-700/50">
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                {isSaving ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};