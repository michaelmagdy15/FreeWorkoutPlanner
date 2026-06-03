import { NextRequest, NextResponse } from 'next/server'
import { planStore } from '@/lib/stores'

// Admin user ID - only this account can access trainer features
const ADMIN_EMAIL = 'michaelmitry13@gmail.com'

// In-memory member registry (in production, this would be a database)
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

// Simulated members store - persists during server runtime
const membersStore = new Map<string, Member>()

// Seed some initial members
if (membersStore.size === 0) {
  const seedMembers: Member[] = [
    {
      id: 'member-001',
      name: 'Mirna AbdelShahid',
      email: 'mirna@mitrixoworkouts.com',
      joinedAt: '2026-01-15',
      status: 'active',
      assignedRoutine: 'Plateau-Breaker Split',
      assignedDiet: 'Plateau-Breaker Recovery Diet',
      lastActive: 'Today',
      notes: 'Focus on glute and hamstring development. Current plateau phase.'
    },
    {
      id: 'member-002',
      name: 'Ahmed Hassan',
      email: 'ahmed.h@gmail.com',
      joinedAt: '2026-02-20',
      status: 'active',
      assignedRoutine: null,
      assignedDiet: null,
      lastActive: 'Yesterday',
      notes: 'New member. Interested in calisthenics and bodyweight training.'
    },
    {
      id: 'member-003',
      name: 'Sarah El-Maghraby',
      email: 'sarah.m@outlook.com',
      joinedAt: '2026-03-05',
      status: 'active',
      assignedRoutine: null,
      assignedDiet: null,
      lastActive: '2 days ago',
      notes: 'Wants to lose weight. Prefers low-impact workouts.'
    },
    {
      id: 'member-004',
      name: 'Omar Farid',
      email: 'omar.farid@yahoo.com',
      joinedAt: '2026-03-18',
      status: 'active',
      assignedRoutine: null,
      assignedDiet: null,
      lastActive: 'Today',
      notes: 'Experienced lifter. Looking for advanced powerlifting programming.'
    },
    {
      id: 'member-005',
      name: 'Nour Ibrahim',
      email: 'nour.i@gmail.com',
      joinedAt: '2026-04-01',
      status: 'inactive',
      assignedRoutine: null,
      assignedDiet: null,
      lastActive: '1 week ago',
      notes: 'Interested in yoga and flexibility work. Has back issues.'
    },
    {
      id: 'member-006',
      name: 'Karim Mostafa',
      email: 'karim.m@hotmail.com',
      joinedAt: '2026-04-22',
      status: 'active',
      assignedRoutine: null,
      assignedDiet: null,
      lastActive: 'Today',
      notes: 'CrossFit background. Wants hybrid conditioning program.'
    },
    {
      id: 'member-007',
      name: 'Layla Abdou',
      email: 'layla.a@gmail.com',
      joinedAt: '2026-05-10',
      status: 'active',
      assignedRoutine: null,
      assignedDiet: null,
      lastActive: 'Yesterday',
      notes: 'Postpartum recovery. Needs gentle re-introduction to training.'
    },
    {
      id: 'member-008',
      name: 'Youssef Nabil',
      email: 'youssef.n@gmail.com',
      joinedAt: '2026-05-25',
      status: 'active',
      assignedRoutine: null,
      assignedDiet: null,
      lastActive: 'Today',
      notes: 'Competitive swimmer. Needs sport-specific conditioning.'
    }
  ]
  seedMembers.forEach(m => membersStore.set(m.id, m))
}

// GET - List all members
export async function GET() {
  const members = Array.from(membersStore.values())
  return NextResponse.json({ members, total: members.length })
}

// POST - Assign program to member or add new member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'assign-routine') {
      const { memberId, routineTitle } = body
      const member = membersStore.get(memberId)
      if (!member) {
        return NextResponse.json({ error: 'Member not found' }, { status: 404 })
      }
      member.assignedRoutine = routineTitle
      membersStore.set(memberId, member)
      return NextResponse.json({ success: true, member })
    }

    if (action === 'assign-diet') {
      const { memberId, dietTitle } = body
      const member = membersStore.get(memberId)
      if (!member) {
        return NextResponse.json({ error: 'Member not found' }, { status: 404 })
      }
      member.assignedDiet = dietTitle
      membersStore.set(memberId, member)
      return NextResponse.json({ success: true, member })
    }

    if (action === 'update-notes') {
      const { memberId, notes } = body
      const member = membersStore.get(memberId)
      if (!member) {
        return NextResponse.json({ error: 'Member not found' }, { status: 404 })
      }
      member.notes = notes
      membersStore.set(memberId, member)
      return NextResponse.json({ success: true, member })
    }

    if (action === 'add-member') {
      const { name, email, notes } = body
      const id = `member-${String(membersStore.size + 1).padStart(3, '0')}`
      const newMember: Member = {
        id,
        name,
        email,
        joinedAt: new Date().toISOString().split('T')[0],
        status: 'active',
        assignedRoutine: null,
        assignedDiet: null,
        lastActive: 'Just now',
        notes: notes || ''
      }
      membersStore.set(id, newMember)
      return NextResponse.json({ success: true, member: newMember })
    }

    if (action === 'remove-member') {
      const { memberId } = body
      membersStore.delete(memberId)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })

  } catch (error) {
    console.error('Members API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
