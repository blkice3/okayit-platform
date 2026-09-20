'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Mail, Heart, Sparkles, Building, Clock, Phone, X, Star, ChevronLeft } from 'lucide-react';
import { okayitTheme } from '@/lib/okayit-theme';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import OKAYiTLogo from './okayit-logo';
import { toast } from 'sonner';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  shift: string;
  home: string;
  photo: string;
  description: string;
  interests: string[];
  funFact?: string;
  favoriteQuote?: string;
  whenToTalkTo?: string;
  contact?: string;
  color: string;
  displayOrder: number;
}

interface MeetTheTeamProps {
  onBack: () => void;
  currentHome: string;
}

// Helper function to get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
}

// Staff Avatar Component with better visibility
function StaffAvatar({ staff, size = 'md' }: { staff: StaffMember; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-14 h-14 text-base',
    md: 'w-20 h-20 text-2xl',
    lg: 'w-28 h-28 text-4xl'
  };

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${staff.color} flex items-center justify-center font-black text-white shadow-md border border-white`}
      style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
    >
      {staff.photo || getInitials(staff.name)}
    </div>
  );
}

export default function MeetTheTeam({ onBack, currentHome }: MeetTheTeamProps) {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'roles'>('all');

  const homeNames: { [key: string]: string } = {
    claudius: 'Claudius House',
    winchester: 'Winchester Close',
    kingsnorth: 'Kingsnorth Care Home'
  };

  // Fetch staff for current home
  useEffect(() => {
    async function fetchStaff() {
      try {
        setLoading(true);
        console.log('Fetching staff for home:', currentHome);
        const url = `/api/staff?home=${encodeURIComponent(currentHome)}`;
        console.log('Fetch URL:', url);
        const response = await fetch(url, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        console.log('Response status:', response.status);
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          throw new Error('Failed to fetch staff');
        }
        const data = await response.json();
        console.log('Fetched staff count:', data.length);
        setStaffMembers(data);
      } catch (error) {
        console.error('Error fetching staff:', error);
        toast.error('Could not load staff profiles');
        setStaffMembers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchStaff();
  }, [currentHome]);

  // Group staff by role
  const staffByRole: { [key: string]: StaffMember[] } = {};
  staffMembers.forEach(staff => {
    if (!staffByRole[staff.role]) {
      staffByRole[staff.role] = [];
    }
    staffByRole[staff.role].push(staff);
  });

  const roles = Object.keys(staffByRole).sort((a, b) => {
    const roleOrder = ['Registered Manager', 'Deputy Manager', 'Team Leader', 'Care Support Worker', 'Support Worker & Digital Manager'];
    return roleOrder.indexOf(a) - roleOrder.indexOf(b);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Compact Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-2">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 text-purple-600 text-sm font-bold hover:text-purple-800 flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            Menu
          </button>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-bold text-gray-900">Meet the Team</span>
          </div>
          <OKAYiTLogo width={28} height={28} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Title Section */}
          <div className="text-center mb-2">
            <h1 className="text-xl font-black text-purple-900">
              {homeNames[currentHome] || 'Your Care Home'}
            </h1>
            <p className="text-sm text-gray-600 font-medium">
              The people who are here to support you
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'all' 
                ? 'bg-purple-600 text-white shadow' 
                : 'bg-purple-50 text-purple-700 border border-purple-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setViewMode('roles')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'roles' 
                ? 'bg-blue-600 text-white shadow' 
                : 'bg-blue-50 text-blue-700 border border-blue-200'}`}
            >
              By Role
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Users className="w-10 h-10 text-purple-600 animate-bounce" />
              <p className="mt-2 text-sm font-bold text-purple-800">Loading team...</p>
            </div>
          )}

          {/* Staff Grid - All View */}
          {!loading && viewMode === 'all' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {staffMembers.map((staff, index) => (
                <motion.div
                  key={staff.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => setSelectedStaff(staff)}
                  className="cursor-pointer"
                >
                  <Card className="bg-white border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden">
                    <CardContent className="p-3 flex items-center gap-3">
                      <StaffAvatar staff={staff} size="sm" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 truncate">{staff.name}</h3>
                        <Badge className="mt-0.5 px-2 py-0.5 text-xs font-bold bg-purple-100 text-purple-700 border-0">
                          {staff.role}
                        </Badge>
                        <p className="text-xs text-gray-600 font-medium line-clamp-1 mt-0.5">
                          {staff.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Staff Grid - Roles View */}
          {!loading && viewMode === 'roles' && (
            <div className="space-y-4">
              {roles.map((role, roleIndex) => (
                <motion.div
                  key={role}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: roleIndex * 0.05 }}
                >
                  <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    {role}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {staffByRole[role].map((staff, index) => (
                      <motion.div
                        key={staff.id}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => setSelectedStaff(staff)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-blue-200 hover:border-blue-400 hover:shadow-sm transition-all">
                          <StaffAvatar staff={staff} size="sm" />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-gray-900 truncate">{staff.name}</h3>
                            <p className="text-xs text-gray-600 font-medium line-clamp-1">
                              {staff.description.substring(0, 60)}...
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && staffMembers.length === 0 && (
            <div className="py-8 text-center">
              <Users className="w-10 h-10 text-purple-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-purple-800 mb-1">No Staff Profiles Yet</h3>
              <p className="text-sm text-gray-600">
                Profiles for {homeNames[currentHome]} will be added soon.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Staff Detail Dialog */}
      <AnimatePresence>
        {selectedStaff && (
          <Dialog open={!!selectedStaff} onOpenChange={() => setSelectedStaff(null)}>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-white border border-purple-200 rounded-2xl">
              <DialogHeader>
                <div className="flex items-center gap-3 mb-3 p-3 bg-purple-50 rounded-xl">
                  <StaffAvatar staff={selectedStaff} size="md" />
                  <div>
                    <DialogTitle className="text-lg font-black text-gray-900">
                      {selectedStaff.name}
                    </DialogTitle>
                    <Badge className="mt-1 px-3 py-0.5 text-xs font-bold bg-purple-600 text-white border-0">
                      {selectedStaff.role}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-800 leading-relaxed font-medium">
                    {selectedStaff.description}
                  </p>
                </div>

                {selectedStaff.interests && selectedStaff.interests.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1.5">Interests</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedStaff.interests.map((interest, idx) => (
                        <Badge key={idx} className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 font-bold border-0">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedStaff.funFact && (
                  <div className="bg-pink-50 p-3 rounded-lg">
                    <p className="text-xs font-bold text-pink-700 mb-1">Fun Fact</p>
                    <p className="text-sm text-gray-800 font-medium">{selectedStaff.funFact}</p>
                  </div>
                )}

                {selectedStaff.favoriteQuote && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs font-bold text-blue-700 mb-1">Favourite Quote</p>
                    <p className="text-sm text-gray-800 font-medium italic">&ldquo;{selectedStaff.favoriteQuote}&rdquo;</p>
                  </div>
                )}

                {selectedStaff.whenToTalkTo && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs font-bold text-green-700 mb-1">When to Talk to {selectedStaff.name}</p>
                    <p className="text-sm text-gray-800 font-medium">{selectedStaff.whenToTalkTo}</p>
                  </div>
                )}

                {selectedStaff.contact && (
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-xs font-bold text-orange-700 mb-1">Contact</p>
                    <p className="text-sm text-gray-800 font-medium">{selectedStaff.contact}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="text-sm font-bold text-purple-600 hover:text-purple-800 px-4 py-2"
                >
                  Close
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
