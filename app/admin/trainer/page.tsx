'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useUser } from '@/lib/auth'
import Link from 'next/link'
import {
  Shield,
  Users,
  Dumbbell,
  Apple,
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  UserPlus,
  ClipboardList,
  Home,
  Activity,
  Crown,
  Send,
  Pencil,
  Trash2,
  AlertCircle
} from 'lucide-react'

interface Member {
  id: string
  name: string
  email: string
  joinedAt: string
  status: 'active' | 'inactive'
  assignedRoutine: string | null
  assignedDiet: string | null
  lastActive: string
  notes: string
}

// Available routines and diets for assignment (synced with library components)
const AVAILABLE_ROUTINES = [
  "Absolute Beginner Full-Body",
  "Beginner Calisthenics Foundation",
  "Beginner Fat Loss Circuit",
  "Beginner Dumbbell-Only Home",
  "Beginner Yoga Flow & Flexibility",
  "Beginner Pilates Core Foundation",
  "Senior Fitness & Joint Mobility",
  "Beginner Swimming & Aqua Fitness",
  "PPL Hypertrophy Classic",
  "Upper/Lower Power Builder",
  "CrossFit WOD Fundamentals",
  "Intermediate Calisthenics Skills",
  "Functional Fitness & Kettlebell",
  "Classic Bodybuilding Bro Split",
  "Athletic Performance & Plyometrics",
  "Boxing & Kickboxing Conditioning",
  "Intermediate Pilates Reformer",
  "Vinyasa Power Yoga",
  "TRX & Suspension Training",
  "Resistance Band Full-Body",
  "Core & Posture Correction",
  "Strength & Conditioning Hybrid",
  "Powerlifting Peaking Program",
  "Advanced Calisthenics Mastery",
  "Olympic Weightlifting Foundation",
  "Extreme HIIT Metabolic Conditioning",
  "Advanced CrossFit Competition Prep",
  "Strongman Training",
  "Martial Arts & MMA Conditioning",
  "Warrior Hybrid Military Training",
  "Barre & Dance Fitness",
  "Running & Sprint Program",
  "Cycling & Spin Conditioning"
]

const AVAILABLE_DIETS = [
  "Aggressive Fat Loss 1200 kcal",
  "Moderate Cut 1500 kcal",
  "Keto Fat Loss 1550 kcal",
  "Intermittent Fasting 16:8 (1800 kcal)",
  "Plant-Based Fat Loss 1600 kcal",
  "Balanced Maintenance 2000 kcal",
  "Mediterranean Diet 2100 kcal",
  "Anti-Inflammatory Recovery 1900 kcal",
  "Vegetarian Balanced 2000 kcal",
  "Clean Lean Bulk 2800 kcal",
  "Mass Gain Power Bulk 3500 kcal",
  "Plant-Based Muscle 2600 kcal",
  "Endurance Athlete Fuel 2400 kcal",
  "Calisthenics Lean Performance 2200 kcal",
  "Combat Sport Recomp 2000 kcal",
  "Pre-Contest Bodybuilding 1700 kcal"
]

export default function TrainerDashboard() {
  const { user, isSignedIn } = useUser()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedMember, setExpandedMember] = useState<string | null>(null)
  const [showAddMember, setShowAddMember] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [newMemberNotes, setNewMemberNotes] = useState('')
  const [assigningId, setAssigningId] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null)
  const [editedNotes, setEditedNotes] = useState('')

  // Fetch members from API
  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members')
      const data = await response.json()
      setMembers(data.members || [])
    } catch (error) {
      console.error('Failed to fetch members:', error)
    } finally {
      setLoading(false)
    }
  }

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg)
    setTimeout(() => setSuccessMessage(null), 3500)
  }

  const handleAssignRoutine = async (memberId: string, routineTitle: string) => {
    setAssigningId(memberId)
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'assign-routine', memberId, routineTitle })
      })
      if (response.ok) {
        const data = await response.json()
        setMembers(prev => prev.map(m => m.id === memberId ? data.member : m))
        showSuccess(`Assigned "${routineTitle}" to ${data.member.name}`)
      }
    } catch (error) {
      console.error('Failed to assign routine:', error)
    } finally {
      setAssigningId(null)
    }
  }

  const handleAssignDiet = async (memberId: string, dietTitle: string) => {
    setAssigningId(memberId)
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'assign-diet', memberId, dietTitle })
      })
      if (response.ok) {
        const data = await response.json()
        setMembers(prev => prev.map(m => m.id === memberId ? data.member : m))
        showSuccess(`Assigned "${dietTitle}" diet to ${data.member.name}`)
      }
    } catch (error) {
      console.error('Failed to assign diet:', error)
    } finally {
      setAssigningId(null)
    }
  }

  const handleUpdateNotes = async (memberId: string) => {
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update-notes', memberId, notes: editedNotes })
      })
      if (response.ok) {
        const data = await response.json()
        setMembers(prev => prev.map(m => m.id === memberId ? data.member : m))
        setEditingNotesId(null)
        showSuccess(`Updated notes for ${data.member.name}`)
      }
    } catch (error) {
      console.error('Failed to update notes:', error)
    }
  }

  const handleAddMember = async () => {
    if (!newMemberName.trim() || !newMemberEmail.trim()) return
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-member',
          name: newMemberName,
          email: newMemberEmail,
          notes: newMemberNotes
        })
      })
      if (response.ok) {
        const data = await response.json()
        setMembers(prev => [...prev, data.member])
        setNewMemberName('')
        setNewMemberEmail('')
        setNewMemberNotes('')
        setShowAddMember(false)
        showSuccess(`Added new member: ${data.member.name}`)
      }
    } catch (error) {
      console.error('Failed to add member:', error)
    }
  }

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove-member', memberId })
      })
      if (response.ok) {
        setMembers(prev => prev.filter(m => m.id !== memberId))
        setExpandedMember(null)
        showSuccess(`Removed ${memberName} from roster`)
      }
    } catch (error) {
      console.error('Failed to remove member:', error)
    }
  }

  // Filter members
  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.assignedRoutine || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeCount = members.filter(m => m.status === 'active').length
  const assignedCount = members.filter(m => m.assignedRoutine).length

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-white selection:bg-primary/30">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-5 sm:space-y-6 pb-24 sm:pb-6">

        {/* HEADER */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-5 sm:pb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center shadow-lg shadow-black/80">
              <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight gradient-text">Trainer Dashboard</h1>
              <p className="text-[10px] sm:text-xs text-slate-400">Manage members, assign workout programs & nutrition plans</p>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Link href="/admin" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full sm:w-auto rounded-xl border-white/5 bg-slate-900/30 hover:bg-slate-900/60 flex items-center justify-center gap-2 text-xs h-9">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                Admin
              </Button>
            </Link>
            <Link href="/" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full sm:w-auto rounded-xl border-white/5 bg-slate-900/30 hover:bg-slate-900/60 flex items-center justify-center gap-2 text-xs h-9">
                <Home className="w-3.5 h-3.5 text-slate-400" />
                App
              </Button>
            </Link>
          </div>
        </header>

        {/* SUCCESS ALERT */}
        {successMessage && (
          <div className="bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 rounded-2xl p-3 sm:p-4 flex items-center gap-3 animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 animate-bounce" />
            <p className="text-xs font-bold">{successMessage}</p>
          </div>
        )}

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass-panel p-3 sm:p-4 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[hsl(var(--primary))]" />
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500">Total Members</div>
              <div className="text-lg sm:text-xl font-bold font-mono">{members.length}</div>
            </div>
          </div>

          <div className="glass-panel p-3 sm:p-4 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500">Active Now</div>
              <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400">{activeCount}</div>
            </div>
          </div>

          <div className="glass-panel p-3 sm:p-4 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5">
              <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-[hsl(var(--secondary))]" />
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500">Programs Assigned</div>
              <div className="text-lg sm:text-xl font-bold font-mono text-[hsl(var(--secondary))]">{assignedCount}</div>
            </div>
          </div>

          <div className="glass-panel p-3 sm:p-4 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5">
              <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500">Available Programs</div>
              <div className="text-lg sm:text-xl font-bold font-mono text-amber-400">{AVAILABLE_ROUTINES.length}</div>
            </div>
          </div>
        </div>

        {/* SEARCH + ADD MEMBER */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search members by name, email, or assigned program..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950/60 border border-white/5 rounded-2xl text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
          <Button
            onClick={() => setShowAddMember(!showAddMember)}
            className="rounded-xl btn-premium h-10 text-xs font-bold flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add Member
          </Button>
        </div>

        {/* ADD MEMBER FORM */}
        {showAddMember && (
          <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-3 animate-in slide-in-from-top duration-300 border border-emerald-500/20">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-400" />
              Add New Member
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="px-3 py-2.5 text-xs bg-slate-950/60 border border-white/5 rounded-xl text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary outline-none"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="px-3 py-2.5 text-xs bg-slate-950/60 border border-white/5 rounded-xl text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <textarea
              placeholder="Training notes (goals, injuries, preferences...)"
              value={newMemberNotes}
              onChange={(e) => setNewMemberNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 text-xs bg-slate-950/60 border border-white/5 rounded-xl text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary outline-none resize-none"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddMember(false)} className="rounded-xl border-white/5 text-xs h-9 bg-transparent hover:bg-white/5">
                Cancel
              </Button>
              <Button onClick={handleAddMember} className="rounded-xl btn-premium text-xs h-9 font-bold">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add to Roster
              </Button>
            </div>
          </div>
        )}

        {/* MEMBERS LIST */}
        <div className="space-y-3">
          {loading ? (
            <div className="glass-panel rounded-3xl py-16 text-center">
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-slate-800 border-t-primary mx-auto mb-3" />
              <p className="text-xs text-slate-400">Loading member roster...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="glass-panel rounded-3xl py-16 text-center">
              <Users className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="text-xs text-slate-500">No members found matching your search.</p>
            </div>
          ) : (
            filteredMembers.map((member) => {
              const isExpanded = expandedMember === member.id
              const isAssigning = assigningId === member.id
              const isEditingNotes = editingNotesId === member.id

              return (
                <div
                  key={member.id}
                  className={cn(
                    "glass-panel rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 border",
                    member.status === 'active'
                      ? "border-white/5 hover:border-white/10"
                      : "border-red-500/10 hover:border-red-500/20 opacity-75"
                  )}
                >
                  {/* Member Summary Row */}
                  <div
                    className="p-4 sm:p-5 cursor-pointer"
                    onClick={() => setExpandedMember(isExpanded ? null : member.id)}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Avatar */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm sm:text-base text-white truncate">{member.name}</h4>
                          <span className={cn(
                            "text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex-shrink-0",
                            member.status === 'active'
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          )}>
                            {member.status}
                          </span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-slate-500 truncate">{member.email}</p>

                        {/* Assigned Programs Tags - Mobile Compact */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {member.assignedRoutine ? (
                            <span className="text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))] border border-[hsl(var(--secondary))]/20 font-bold truncate max-w-[180px]">
                              <Dumbbell className="w-2.5 h-2.5 inline mr-0.5" /> {member.assignedRoutine}
                            </span>
                          ) : (
                            <span className="text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full bg-slate-800/50 text-slate-500 border border-white/5 font-bold">
                              No Workout Assigned
                            </span>
                          )}
                          {member.assignedDiet ? (
                            <span className="text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold truncate max-w-[180px]">
                              <Apple className="w-2.5 h-2.5 inline mr-0.5" /> {member.assignedDiet}
                            </span>
                          ) : (
                            <span className="text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full bg-slate-800/50 text-slate-500 border border-white/5 font-bold">
                              No Diet Assigned
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Expand Toggle */}
                      <div className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Member Management Panel */}
                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-white/5 bg-slate-950/30 space-y-4 pt-4 animate-in slide-in-from-top duration-300">

                      {/* Member Meta Info */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-slate-950/40 rounded-xl p-3 border border-white/5">
                          <div className="text-[9px] font-bold uppercase text-slate-500 mb-1">Joined</div>
                          <div className="font-semibold text-white">{member.joinedAt}</div>
                        </div>
                        <div className="bg-slate-950/40 rounded-xl p-3 border border-white/5">
                          <div className="text-[9px] font-bold uppercase text-slate-500 mb-1">Last Active</div>
                          <div className="font-semibold text-white">{member.lastActive}</div>
                        </div>
                        <div className="bg-slate-950/40 rounded-xl p-3 border border-white/5 col-span-2 sm:col-span-1">
                          <div className="text-[9px] font-bold uppercase text-slate-500 mb-1">Member ID</div>
                          <div className="font-mono font-semibold text-slate-400 text-[10px]">{member.id}</div>
                        </div>
                      </div>

                      {/* Trainer Notes */}
                      <div className="bg-slate-950/40 rounded-xl p-3 sm:p-4 border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Trainer Notes</span>
                          {!isEditingNotes && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditingNotesId(member.id); setEditedNotes(member.notes) }}
                              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                            >
                              <Pencil className="w-3 h-3" /> Edit
                            </button>
                          )}
                        </div>
                        {isEditingNotes ? (
                          <div className="space-y-2">
                            <textarea
                              value={editedNotes}
                              onChange={(e) => setEditedNotes(e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 text-xs bg-slate-900/60 border border-white/5 rounded-lg text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary outline-none resize-none"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex gap-2 justify-end">
                              <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setEditingNotesId(null) }} className="h-7 text-[10px] rounded-lg border-white/5 bg-transparent hover:bg-white/5">
                                Cancel
                              </Button>
                              <Button size="sm" onClick={(e) => { e.stopPropagation(); handleUpdateNotes(member.id) }} className="h-7 text-[10px] rounded-lg btn-premium">
                                Save Notes
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-300 leading-relaxed italic">{member.notes || 'No notes yet...'}</p>
                        )}
                      </div>

                      {/* Assign Workout Program */}
                      <div className="space-y-2">
                        <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                          <Dumbbell className="w-3.5 h-3.5 text-[hsl(var(--secondary))]" />
                          Assign Workout Program
                        </h5>
                        <select
                          className="w-full px-3 py-2.5 text-xs bg-slate-950/60 border border-white/5 rounded-xl text-white focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
                          value={member.assignedRoutine || ''}
                          onChange={(e) => {
                            e.stopPropagation()
                            if (e.target.value) handleAssignRoutine(member.id, e.target.value)
                          }}
                          onClick={(e) => e.stopPropagation()}
                          disabled={isAssigning}
                        >
                          <option value="">-- Select a workout program --</option>
                          {AVAILABLE_ROUTINES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>

                      {/* Assign Diet Plan */}
                      <div className="space-y-2">
                        <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                          <Apple className="w-3.5 h-3.5 text-emerald-400" />
                          Assign Nutrition Plan
                        </h5>
                        <select
                          className="w-full px-3 py-2.5 text-xs bg-slate-950/60 border border-white/5 rounded-xl text-white focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
                          value={member.assignedDiet || ''}
                          onChange={(e) => {
                            e.stopPropagation()
                            if (e.target.value) handleAssignDiet(member.id, e.target.value)
                          }}
                          onClick={(e) => e.stopPropagation()}
                          disabled={isAssigning}
                        >
                          <option value="">-- Select a nutrition plan --</option>
                          {AVAILABLE_DIETS.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-white/5">
                        <Button
                          onClick={(e) => { e.stopPropagation(); handleRemoveMember(member.id, member.name) }}
                          variant="outline"
                          className="flex-1 rounded-xl border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 text-xs h-9"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Remove Member
                        </Button>
                        {isAssigning && (
                          <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
                            <div className="w-4 h-4 animate-spin rounded-full border border-current border-t-transparent" />
                            Updating...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

      </div>
    </div>
  )
}
