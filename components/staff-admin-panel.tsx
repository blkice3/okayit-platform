'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Users,
  Shield
} from 'lucide-react';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  funFact: string;
  favoriteQuote: string;
  whenToTalkTo: string;
  contact: string;
  color: string;
  isActive: boolean;
  displayOrder: number;
}

interface StaffAdminPanelProps {
  onBack: () => void;
}

const HOMES = [
  { value: 'claudius', label: 'Claudius' },
  { value: 'winchester', label: 'Winchester Close' },
  { value: 'kingsnorth', label: 'Kingsnorth' }
];

const SHIFTS = [
  { value: 'day', label: 'Day Shift' }
];

const GRADIENT_COLORS = [
  { value: 'from-purple-500 to-pink-500', label: 'Purple-Pink' },
  { value: 'from-blue-500 to-cyan-500', label: 'Blue-Cyan' },
  { value: 'from-green-500 to-emerald-500', label: 'Green-Emerald' },
  { value: 'from-orange-500 to-red-500', label: 'Orange-Red' },
  { value: 'from-yellow-500 to-orange-500', label: 'Yellow-Orange' },
  { value: 'from-pink-500 to-rose-500', label: 'Pink-Rose' },
  { value: 'from-indigo-500 to-purple-500', label: 'Indigo-Purple' },
  { value: 'from-teal-500 to-green-500', label: 'Teal-Green' },
  { value: 'from-cyan-500 to-blue-500', label: 'Cyan-Blue' }
];

const emptyStaff: Omit<StaffMember, 'id'> = {
  name: '',
  role: '',
  shift: 'day',
  home: 'claudius',
  photo: '',
  description: '',
  interests: [],
  funFact: '',
  favoriteQuote: '',
  whenToTalkTo: '',
  contact: '',
  color: 'from-blue-500 to-cyan-500',
  isActive: true,
  displayOrder: 0
};

export function StaffAdminPanel({ onBack }: StaffAdminPanelProps) {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHome, setSelectedHome] = useState<string>('claudius');
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [interestsInput, setInterestsInput] = useState('');

  useEffect(() => {
    fetchStaff();
  }, [selectedHome]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/staff?home=${selectedHome}&includeInactive=true`);
      const data = await response.json();
      setStaff(data.staff || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Failed to load staff members');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingStaff) return;

    // Validation
    if (!editingStaff.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!editingStaff.role.trim()) {
      toast.error('Role is required');
      return;
    }
    if (!editingStaff.description.trim()) {
      toast.error('Description is required');
      return;
    }

    try {
      const isNew = !('id' in editingStaff) || !editingStaff.id;
      const url = '/api/staff';
      const method = isNew ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStaff)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save staff member');
      }

      toast.success(isNew ? 'Staff member added!' : 'Staff member updated!');
      setIsDialogOpen(false);
      setEditingStaff(null);
      fetchStaff();
    } catch (error) {
      console.error('Error saving staff:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save staff member');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/staff?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete staff member');
      }

      toast.success('Staff member removed');
      setDeleteConfirm(null);
      fetchStaff();
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete staff member');
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const index = staff.findIndex(s => s.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= staff.length) return;

    const newStaff = [...staff];
    [newStaff[index], newStaff[newIndex]] = [newStaff[newIndex], newStaff[index]];

    // Update display orders
    newStaff.forEach((s, i) => {
      s.displayOrder = i;
    });

    setStaff(newStaff);

    // Save to backend
    try {
      await Promise.all(
        newStaff.map(s =>
          fetch('/api/staff', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: s.id, displayOrder: s.displayOrder })
          })
        )
      );
      toast.success('Order updated');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
      fetchStaff(); // Revert on error
    }
  };

  const openAddDialog = () => {
    setEditingStaff({
      ...emptyStaff,
      home: selectedHome,
      displayOrder: staff.length
    } as StaffMember);
    setInterestsInput('');
    setIsDialogOpen(true);
  };

  const openEditDialog = (member: StaffMember) => {
    setEditingStaff({ ...member });
    setInterestsInput(member.interests.join(', '));
    setIsDialogOpen(true);
  };

  const updateInterests = (value: string) => {
    setInterestsInput(value);
    if (editingStaff) {
      setEditingStaff({
        ...editingStaff,
        interests: value.split(',').map(i => i.trim()).filter(i => i)
      });
    }
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: `linear-gradient(135deg, #F3E8FF, #DBEAFE)` }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              className="font-semibold"
              style={{
                borderColor: okayitTheme.colors.purple,
                color: okayitTheme.colors.purple
              }}
            >
              ← Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2" style={{ color: okayitTheme.colors.purple }}>
                <Shield className="h-8 w-8" />
                Staff Management
              </h1>
              <p className="text-sm mt-1 text-gray-900">
                Admin Panel - Add, edit, or remove team members
              </p>
            </div>
          </div>
          <Button
            onClick={openAddDialog}
            className="font-semibold"
            style={{
              background: `linear-gradient(135deg, ${okayitTheme.colors.purple}, ${okayitTheme.colors.blue})`,
              color: '#fff'
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Staff Member
          </Button>
        </div>

        {/* Home Selector */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Label>Select Home:</Label>
              <Tabs value={selectedHome} onValueChange={setSelectedHome}>
                <TabsList>
                  {HOMES.map(home => (
                    <TabsTrigger key={home.value} value={home.value}>
                      {home.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Staff List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg" style={{ color: okayitTheme.colors.purple }}>
              Loading staff members...
            </div>
          </div>
        ) : staff.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-900" />
              <p className="text-lg mb-2 text-gray-700">
                No staff members yet
              </p>
              <p className="text-sm mb-4 text-gray-900">
                Click "Add Staff Member" to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {staff.map((member, index) => (
              <Card key={member.id} className={!member.isActive ? 'opacity-50' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br ${member.color} shadow-md`}>
                      {member.photo && member.photo.trim() !== '' ? (
                        <span className="text-3xl">{member.photo}</span>
                      ) : (
                        <span className="text-2xl">
                          {(() => {
                            const words = member.name.trim().split(' ');
                            if (words.length === 1) {
                              return words[0].substring(0, 2).toUpperCase();
                            }
                            return (words[0][0] + words[words.length - 1][0]).toUpperCase();
                          })()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold" style={{ color: okayitTheme.colors.purple }}>
                            {member.name}
                          </h3>
                          <p className="text-sm text-gray-900">
                            {member.role}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge>{member.shift === 'both' ? 'Day & Night' : member.shift === 'day' ? 'Day Shift' : 'Night Shift'}</Badge>
                            {!member.isActive && <Badge variant="secondary">Inactive</Badge>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReorder(member.id, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReorder(member.id, 'down')}
                            disabled={index === staff.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(member)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteConfirm(member.id)}
                            style={{ color: '#ef4444' }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-700">
                        {member.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit/Add Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingStaff?.id ? 'Edit Staff Member' : 'Add Staff Member'}
              </DialogTitle>
              <DialogDescription>
                Fill in the details below to {editingStaff?.id ? 'update' : 'add'} a staff member
              </DialogDescription>
            </DialogHeader>

            {editingStaff && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name *</Label>
                    <Input
                      value={editingStaff.name}
                      onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <Label>Role *</Label>
                    <Input
                      value={editingStaff.role}
                      onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value })}
                      placeholder="e.g., Registered Manager"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Home</Label>
                    <Select value={editingStaff.home} onValueChange={(value) => setEditingStaff({ ...editingStaff, home: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {HOMES.map(home => (
                          <SelectItem key={home.value} value={home.value}>
                            {home.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Shift</Label>
                    <Select value={editingStaff.shift} onValueChange={(value) => setEditingStaff({ ...editingStaff, shift: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SHIFTS.map(shift => (
                          <SelectItem key={shift.value} value={shift.value}>
                            {shift.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select value={editingStaff.isActive ? 'active' : 'inactive'} onValueChange={(value) => setEditingStaff({ ...editingStaff, isActive: value === 'active' })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Color Theme</Label>
                  <Select value={editingStaff.color} onValueChange={(value) => setEditingStaff({ ...editingStaff, color: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GRADIENT_COLORS.map(color => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded bg-gradient-to-r ${color.value}`} />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-900 mt-1">
                    This color theme will be used for the staff member profile card and avatar background
                  </p>
                </div>

                <div>
                  <Label>Description *</Label>
                  <Textarea
                    value={editingStaff.description}
                    onChange={(e) => setEditingStaff({ ...editingStaff, description: e.target.value })}
                    placeholder="A brief introduction to this staff member..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Interests (comma-separated)</Label>
                  <Input
                    value={interestsInput}
                    onChange={(e) => updateInterests(e.target.value)}
                    placeholder="e.g., Reading 📚, Gaming 🎮, Cooking 🍳"
                  />
                </div>

                <div>
                  <Label>Fun Fact</Label>
                  <Textarea
                    value={editingStaff.funFact}
                    onChange={(e) => setEditingStaff({ ...editingStaff, funFact: e.target.value })}
                    placeholder="Something interesting about this person..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Favorite Quote</Label>
                  <Textarea
                    value={editingStaff.favoriteQuote}
                    onChange={(e) => setEditingStaff({ ...editingStaff, favoriteQuote: e.target.value })}
                    placeholder="An inspiring quote they like..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label>When to Talk to Me</Label>
                  <Textarea
                    value={editingStaff.whenToTalkTo}
                    onChange={(e) => setEditingStaff({ ...editingStaff, whenToTalkTo: e.target.value })}
                    placeholder="Best times and situations to approach this person..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Where to Find Me</Label>
                  <Textarea
                    value={editingStaff.contact}
                    onChange={(e) => setEditingStaff({ ...editingStaff, contact: e.target.value })}
                    placeholder="Office location, usual spots..."
                    rows={2}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this staff member? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                style={{ background: '#ef4444', color: '#fff' }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
