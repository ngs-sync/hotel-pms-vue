<template>
  <div class="space-y-6">
    <!-- Top Control Bar -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
      <!-- Date Controls -->
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            @click="navigateDays(-14)"
            class="p-2 rounded-md hover:bg-white text-gray-700 hover:text-gray-900 transition text-xs font-semibold flex items-center gap-1 shadow-xs"
            title="Previous 14 Days"
          >
            <PhCaretLeft class="w-4 h-4" />
            <span class="hidden sm:inline">Prev 14 Days</span>
          </button>

          <button
            @click="goToToday"
            class="px-3 py-1.5 rounded-md hover:bg-white text-gray-800 transition text-xs font-bold shadow-xs"
          >
            Today
          </button>

          <button
            @click="navigateDays(14)"
            class="p-2 rounded-md hover:bg-white text-gray-700 hover:text-gray-900 transition text-xs font-semibold flex items-center gap-1 shadow-xs"
            title="Next 14 Days"
          >
            <span class="hidden sm:inline">Next 14 Days</span>
            <PhCaretRight class="w-4 h-4" />
          </button>
        </div>

        <!-- Jump to Date Picker -->
        <div class="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-700">
          <PhCalendar class="w-4 h-4 text-gray-500" />
          <span class="font-medium text-gray-500 hidden sm:inline">Start Date:</span>
          <input
            type="date"
            :value="startDateStr"
            @change="handleDateSelect"
            class="bg-transparent focus:outline-none font-medium text-gray-800"
          />
        </div>

        <span class="text-xs font-semibold text-gray-500 hidden xl:inline">
          {{ dateRangeLabel }}
        </span>
      </div>

      <!-- Search & Filters & New Booking -->
      <div class="flex flex-wrap items-center gap-3">
        <!-- Search input -->
        <div class="relative min-w-[180px] sm:w-48">
          <PhMagnifyingGlass class="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search guest or room..."
            class="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Filter Room Type -->
        <select
          v-model="selectedRoomType"
          class="bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-700 font-medium focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Room Types</option>
          <option v-for="rt in roomStore.room_types" :key="rt.id" :value="rt.id">
            {{ rt.name }}
          </option>
        </select>

        <!-- New Reservation Button -->
        <button
          @click="openNewReservationModal()"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5"
        >
          <PhPlus class="w-4 h-4" />
          <span>New Reservation</span>
        </button>
      </div>
    </div>

    <!-- Status Color Legend -->
    <div class="flex flex-wrap items-center justify-between gap-4 text-xs bg-white px-4 py-3 rounded-lg border border-gray-200">
      <div class="flex flex-wrap items-center gap-4 font-medium text-gray-600">
        <span class="text-gray-400 font-semibold">Status Legend:</span>
        <span class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-xs bg-blue-600 inline-block"></span> Confirmed
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-xs bg-emerald-600 inline-block"></span> Checked-In
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-xs bg-purple-600 inline-block"></span> Group Booking
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-xs bg-gray-500 inline-block"></span> Checked-Out
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-xs bg-rose-500 inline-block"></span> Cancelled
        </span>
      </div>

      <div class="text-gray-400 font-normal hidden md:block">
        Showing {{ filteredRooms.length }} rooms &bull; {{ matrixReservationsCount }} allocations
      </div>
    </div>

    <!-- 14-Day Room Allocation Matrix Grid -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      <div class="overflow-x-auto relative">
        <div class="min-w-max flex flex-col">
          <!-- Calendar Header Rows -->
          <div class="flex border-b border-gray-200 bg-gray-900 text-white font-semibold sticky top-0 z-20">
            <!-- Fixed Left Header: Room Info Column -->
            <div class="w-56 shrink-0 px-4 py-3 border-r border-gray-800 bg-gray-950 flex items-center justify-between">
              <span class="text-xs uppercase tracking-wider font-bold text-gray-300">Room Unit</span>
              <span class="text-[10px] text-gray-400 font-normal">Type / Status</span>
            </div>

            <!-- 14 Days Date Columns -->
            <div
              v-for="day in days"
              :key="day.dateStr"
              class="shrink-0 border-r border-gray-800 text-center py-2 transition-colors flex flex-col justify-center"
              :style="{ width: dayWidth + 'px' }"
              :class="day.isToday ? 'bg-blue-900/80 text-blue-200' : 'bg-gray-900 text-gray-300'"
            >
              <div class="text-[10px] uppercase font-bold tracking-wider opacity-80">{{ day.dayName }}</div>
              <div class="text-sm font-extrabold" :class="day.isToday ? 'text-blue-300 underline underline-offset-2' : 'text-white'">
                {{ day.dayNum }} <span class="text-[10px] font-normal opacity-70">{{ day.monthName }}</span>
              </div>
            </div>
          </div>

          <!-- Room Rows & Reservation Allocation Matrix -->
          <div class="divide-y divide-gray-200">
            <div
              v-for="room in filteredRooms"
              :key="room.id"
              class="flex relative hover:bg-gray-50/80 transition-colors"
              :style="{ height: rowHeight + 'px' }"
            >
              <!-- Left Sidebar Column: Room Details -->
              <div class="w-56 shrink-0 px-4 py-2 border-r border-gray-200 bg-gray-50 flex items-center justify-between z-10">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-sm text-gray-900">Room {{ room.room_number }}</span>
                    <span
                      class="text-[10px] px-1.5 py-0.5 rounded font-semibold border"
                      :class="getHousekeepingBadge(room.housekeeping_status)"
                    >
                      {{ room.housekeeping_status }}
                    </span>
                  </div>
                  <div class="text-[11px] text-gray-500 truncate max-w-[140px] mt-0.5">
                    {{ getRoomTypeName(room.room_type_id) }}
                  </div>
                </div>

                <div v-if="room.maintenance_status !== 'operational'" class="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-bold" :title="room.maintenance_notes">
                  Maint
                </div>
              </div>

              <!-- Day Grid Cells Background -->
              <div class="flex shrink-0 relative">
                <div
                  v-for="day in days"
                  :key="day.dateStr"
                  class="shrink-0 border-r border-gray-100 h-full cursor-pointer hover:bg-blue-50/30 transition-colors"
                  :style="{ width: dayWidth + 'px' }"
                  :class="day.isToday ? 'bg-blue-50/20' : ''"
                  @click="openNewReservationModal(room, day.dateStr)"
                  title="Click to add reservation for this room"
                ></div>

                <!-- Dynamic CSS Positioned Reservation Bars -->
                <div
                  v-for="res in getRoomReservations(room.id)"
                  :key="res.id"
                  class="absolute top-2 bottom-2 rounded-lg px-2.5 py-1 text-xs font-semibold flex items-center justify-between shadow-md cursor-pointer border transition-all hover:scale-[1.01] hover:z-20 overflow-hidden select-none"
                  :style="getReservationStyle(res)"
                  :class="getReservationColorClass(res)"
                  @click.stop="selectReservation(res)"
                >
                  <div class="flex items-center gap-1.5 truncate">
                    <PhUsers v-if="res.booking_type === 'group'" class="w-3.5 h-3.5 shrink-0 opacity-90" />
                    <PhUser v-else class="w-3.5 h-3.5 shrink-0 opacity-90" />
                    <span class="truncate font-bold tracking-tight">{{ res.guest_name }}</span>
                  </div>

                  <div class="text-[10px] opacity-85 ml-2 font-mono shrink-0 hidden sm:block">
                    {{ getStayNights(res) }}n
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredRooms.length === 0" class="py-12 text-center text-gray-400 italic bg-gray-50">
              No rooms match your filter parameters.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: Reservation Details & Actions -->
    <div v-if="selectedRes" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
        <!-- Modal Header -->
        <div class="p-5 text-white flex items-center justify-between" :class="getModalHeaderBg(selectedRes.status, selectedRes.booking_type)">
          <div>
            <span class="text-xs uppercase tracking-wider font-bold opacity-80">Reservation Details</span>
            <h3 class="text-xl font-bold mt-0.5">{{ selectedRes.guest_name }}</h3>
          </div>
          <button @click="selectedRes = null" class="p-1 rounded-lg hover:bg-white/20 text-white transition">
            <PhX class="w-6 h-6" />
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6 space-y-4 text-sm text-gray-700">
          <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>
              <span class="text-xs text-gray-500 font-medium block">Room Assigned</span>
              <span class="font-bold text-gray-900 text-base">Room {{ selectedRes.room_number || getRoomNumber(selectedRes.room_id) }}</span>
              <span class="text-xs text-gray-500 block">{{ getRoomTypeNameByRoomId(selectedRes.room_id) }}</span>
            </div>

            <div>
              <span class="text-xs text-gray-500 font-medium block">Status & Type</span>
              <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase mt-1" :class="getStatusBadgeClass(selectedRes.status)">
                {{ selectedRes.status }}
              </span>
              <span v-if="selectedRes.booking_type === 'group'" class="text-xs text-purple-700 font-semibold block mt-1">
                Group: {{ selectedRes.group_name || 'Group Booking' }}
              </span>
            </div>

            <div>
              <span class="text-xs text-gray-500 font-medium block">Check-In Date</span>
              <span class="font-semibold text-gray-900">{{ selectedRes.check_in_date }}</span>
            </div>

            <div>
              <span class="text-xs text-gray-500 font-medium block">Check-Out Date</span>
              <span class="font-semibold text-gray-900">{{ selectedRes.check_out_date }} ({{ getStayNights(selectedRes) }} nights)</span>
            </div>

            <div>
              <span class="text-xs text-gray-500 font-medium block">Total Amount</span>
              <span class="font-bold text-emerald-600 text-base">${{ Number(selectedRes.total_amount || 0).toFixed(2) }}</span>
            </div>

            <div>
              <span class="text-xs text-gray-500 font-medium block">Guests</span>
              <span class="font-semibold text-gray-900">{{ selectedRes.adults || 1 }} Adult(s), {{ selectedRes.children || 0 }} Child</span>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="selectedRes.notes" class="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-800">
            <span class="font-bold block mb-0.5">Special Requests / Notes:</span>
            {{ selectedRes.notes }}
          </div>

          <!-- Quick Action Buttons -->
          <div class="space-y-2 pt-2 border-t border-gray-100">
            <span class="text-xs font-semibold text-gray-500 block">Quick Operational Actions:</span>
            <div class="flex flex-wrap gap-2">
              <button
                v-if="selectedRes.status === 'confirmed'"
                @click="updateStatus('checked_in')"
                class="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition"
              >
                Check-In Guest
              </button>

              <button
                v-if="selectedRes.status === 'checked_in'"
                @click="updateStatus('checked_out')"
                class="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-lg text-xs transition"
              >
                Check-Out Guest
              </button>

              <button
                v-if="selectedRes.status !== 'cancelled'"
                @click="updateStatus('cancelled')"
                class="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg text-xs border border-rose-200 transition"
              >
                Cancel Reservation
              </button>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button @click="selectedRes = null" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-xs font-semibold transition">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: New Reservation -->
    <div v-if="showNewModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
        <div class="p-5 bg-gray-900 text-white flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold">New Allocation / Reservation</h3>
            <p class="text-xs text-gray-400">Assign guest room stay onto tape chart</p>
          </div>
          <button @click="showNewModal = false" class="p-1 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition">
            <PhX class="w-6 h-6" />
          </button>
        </div>

        <form @submit.prevent="handleCreateReservation" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Guest Full Name</label>
            <input v-model="newForm.guest_name" type="text" required placeholder="e.g. John Smith" class="w-full border border-gray-300 rounded-lg p-2 text-sm" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Room Assignment</label>
              <select v-model="newForm.room_id" required class="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white">
                <option value="">Select Room</option>
                <option v-for="rm in roomStore.rooms" :key="rm.id" :value="rm.id">
                  Room {{ rm.room_number }} ({{ getRoomTypeName(rm.room_type_id) }})
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Booking Type</label>
              <select v-model="newForm.booking_type" class="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white">
                <option value="individual">Individual</option>
                <option value="group">Group Booking</option>
              </select>
            </div>
          </div>

          <div v-if="newForm.booking_type === 'group'" class="space-y-1">
            <label class="block text-xs font-medium text-gray-700">Group / Corporate Name</label>
            <input v-model="newForm.group_name" type="text" placeholder="e.g. Acme Tech Summit" class="w-full border border-gray-300 rounded-lg p-2 text-sm" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Check-In Date</label>
              <input v-model="newForm.check_in_date" type="date" required class="w-full border border-gray-300 rounded-lg p-2 text-sm" />
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Check-Out Date</label>
              <input v-model="newForm.check_out_date" type="date" required class="w-full border border-gray-300 rounded-lg p-2 text-sm" />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Adults</label>
              <input v-model.number="newForm.adults" type="number" min="1" required class="w-full border border-gray-300 rounded-lg p-2 text-sm" />
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Children</label>
              <input v-model.number="newForm.children" type="number" min="0" class="w-full border border-gray-300 rounded-lg p-2 text-sm" />
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Total Rate ($)</label>
              <input v-model.number="newForm.total_amount" type="number" step="0.01" min="0" required class="w-full border border-gray-300 rounded-lg p-2 text-sm" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Special Notes / Requests</label>
            <textarea v-model="newForm.notes" rows="2" class="w-full border border-gray-300 rounded-lg p-2 text-sm" placeholder="Optional notes..."></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button type="button" @click="showNewModal = false" class="px-4 py-2 border rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs">
              Create Allocation
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoomStore } from '../../stores/useRoomStore.js'
import { useReservationStore } from '../../stores/useReservationStore.js'
import {
  PhCalendar,
  PhCaretLeft,
  PhCaretRight,
  PhMagnifyingGlass,
  PhPlus,
  PhUser,
  PhUsers,
  PhX
} from '@phosphor-icons/vue'

const roomStore = useRoomStore()
const reservationStore = useReservationStore()

// Matrix Grid Dimensions
const dayWidth = 120 // px width per day column
const rowHeight = 56 // px height per room row

// Date Matrix State
const startDate = ref(new Date()) // defaults to current date
startDate.value.setHours(0, 0, 0, 0)

const searchQuery = ref('')
const selectedRoomType = ref('all')

// Selected Reservation Modal State
const selectedRes = ref(null)

// New Reservation Modal State
const showNewModal = ref(false)
const newForm = reactive({
  guest_name: '',
  room_id: '',
  booking_type: 'individual',
  group_name: '',
  check_in_date: '',
  check_out_date: '',
  adults: 2,
  children: 0,
  total_amount: 500,
  notes: ''
})

onMounted(async () => {
  await Promise.allSettled([
    roomStore.fetchRooms(),
    roomStore.fetchRoomTypes(),
    reservationStore.fetchReservations()
  ])
})

// Format startDate to YYYY-MM-DD for date input
const startDateStr = computed(() => {
  const d = startDate.value
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
})

// Generate 14 day objects array
const days = computed(() => {
  const list = []
  const todayStr = new Date().toISOString().split('T')[0]

  for (let i = 0; i < 14; i++) {
    const d = new Date(startDate.value)
    d.setDate(d.getDate() + i)

    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const dateNum = String(d.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${dateNum}`

    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
    const monthName = d.toLocaleDateString('en-US', { month: 'short' })

    list.push({
      dateObj: d,
      dateStr,
      dayName,
      dayNum: d.getDate(),
      monthName,
      isToday: dateStr === todayStr
    })
  }
  return list
})

// Label for date range span
const dateRangeLabel = computed(() => {
  if (days.value.length === 0) return ''
  const start = days.value[0]
  const end = days.value[days.value.length - 1]
  return `${start.monthName} ${start.dayNum} - ${end.monthName} ${end.dayNum}, ${start.dateObj.getFullYear()}`
})

// Filtered Rooms
const filteredRooms = computed(() => {
  return roomStore.rooms.filter(room => {
    // Room Type Filter
    if (selectedRoomType.value !== 'all' && room.room_type_id !== selectedRoomType.value) {
      return false
    }

    // Search Query (Room Number or Room Type)
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      const roomNum = String(room.room_number).toLowerCase()
      const roomTypeName = getRoomTypeName(room.room_type_id).toLowerCase()

      // Also check if any reservation assigned to this room matches search
      const hasMatchingRes = reservationStore.reservations.some(r =>
        r.room_id === room.id && r.guest_name?.toLowerCase().includes(q)
      )

      return roomNum.includes(q) || roomTypeName.includes(q) || hasMatchingRes
    }

    return true
  })
})

const matrixReservationsCount = computed(() => {
  let count = 0
  for (const r of filteredRooms.value) {
    count += getRoomReservations(r.id).length
  }
  return count
})

// Navigation Handlers
function navigateDays(offset) {
  const d = new Date(startDate.value)
  d.setDate(d.getDate() + offset)
  startDate.value = d
}

function goToToday() {
  const t = new Date()
  t.setHours(0, 0, 0, 0)
  startDate.value = t
}

function handleDateSelect(e) {
  if (e.target.value) {
    const [y, m, d] = e.target.value.split('-').map(Number)
    startDate.value = new Date(y, m - 1, d)
  }
}

// Helpers
function getRoomTypeName(typeId) {
  const rt = roomStore.room_types.find(r => r.id === typeId)
  return rt ? rt.name : 'Standard'
}

function getRoomTypeNameByRoomId(roomId) {
  const room = roomStore.rooms.find(r => r.id === roomId)
  if (!room) return 'Standard'
  return getRoomTypeName(room.room_type_id)
}

function getRoomNumber(roomId) {
  const room = roomStore.rooms.find(r => r.id === roomId)
  return room ? room.room_number : ''
}

function getHousekeepingBadge(status) {
  switch (status) {
    case 'clean': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'dirty': return 'bg-rose-100 text-rose-800 border-rose-200'
    case 'inspected': return 'bg-blue-100 text-blue-800 border-blue-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

// Get reservations assigned to specific room
function getRoomReservations(roomId) {
  return reservationStore.reservations.filter(res => res.room_id === roomId)
}

// Dynamic CSS Positioning calculation (`:style="{ left: leftPx + 'px', width: widthPx + 'px' }"`)
function getReservationStyle(res) {
  if (!res.check_in_date || !res.check_out_date) return { display: 'none' }

  const startGridDate = startDate.value.getTime()

  // Parse YYYY-MM-DD
  const [inY, inM, inD] = res.check_in_date.split('-').map(Number)
  const checkInDate = new Date(inY, inM - 1, inD).getTime()

  const [outY, outM, outD] = res.check_out_date.split('-').map(Number)
  const checkOutDate = new Date(outY, outM - 1, outD).getTime()

  // Difference in days relative to startDate
  const offsetDays = (checkInDate - startGridDate) / (1000 * 60 * 60 * 24)
  const nights = Math.max(1, (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))

  const leftPx = offsetDays * dayWidth
  const widthPx = nights * dayWidth

  // Hide if completely outside current 14 days grid window
  const gridEndPx = 14 * dayWidth
  if (leftPx + widthPx < 0 || leftPx > gridEndPx) {
    return { display: 'none' }
  }

  return {
    left: `${leftPx}px`,
    width: `${widthPx}px`
  }
}

function getStayNights(res) {
  if (!res.check_in_date || !res.check_out_date) return 1
  const [inY, inM, inD] = res.check_in_date.split('-').map(Number)
  const [outY, outM, outD] = res.check_out_date.split('-').map(Number)
  const dIn = new Date(inY, inM - 1, inD)
  const dOut = new Date(outY, outM - 1, outD)
  return Math.max(1, Math.round((dOut - dIn) / (1000 * 60 * 60 * 24)))
}

function getReservationColorClass(res) {
  if (res.booking_type === 'group') {
    return 'bg-purple-600 border-purple-700 text-white'
  }
  switch (res.status) {
    case 'checked_in': return 'bg-emerald-600 border-emerald-700 text-white'
    case 'confirmed': return 'bg-blue-600 border-blue-700 text-white'
    case 'checked_out': return 'bg-gray-500 border-gray-600 text-white'
    case 'cancelled': return 'bg-rose-500 border-rose-600 text-white'
    default: return 'bg-amber-600 border-amber-700 text-white'
  }
}

function getModalHeaderBg(status, bookingType) {
  if (bookingType === 'group') return 'bg-purple-700'
  switch (status) {
    case 'checked_in': return 'bg-emerald-700'
    case 'confirmed': return 'bg-blue-700'
    case 'checked_out': return 'bg-gray-700'
    case 'cancelled': return 'bg-rose-700'
    default: return 'bg-gray-900'
  }
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'checked_in': return 'bg-emerald-100 text-emerald-800'
    case 'confirmed': return 'bg-blue-100 text-blue-800'
    case 'checked_out': return 'bg-gray-100 text-gray-800'
    case 'cancelled': return 'bg-rose-100 text-rose-800'
    default: return 'bg-amber-100 text-amber-800'
  }
}

function selectReservation(res) {
  selectedRes.value = res
}

async function updateStatus(newStatus) {
  if (!selectedRes.value) return
  await reservationStore.updateReservation(selectedRes.value.id, { status: newStatus })
  selectedRes.value.status = newStatus
}

function openNewReservationModal(room = null, dateStr = null) {
  newForm.guest_name = ''
  newForm.room_id = room ? room.id : (roomStore.rooms[0]?.id || '')
  newForm.booking_type = 'individual'
  newForm.group_name = ''

  const checkIn = dateStr || startDateStr.value
  newForm.check_in_date = checkIn

  // Default 3 nights stay
  const [y, m, d] = checkIn.split('-').map(Number)
  const dOut = new Date(y, m - 1, d + 3)
  const outY = dOut.getFullYear()
  const outM = String(dOut.getMonth() + 1).padStart(2, '0')
  const outD = String(dOut.getDate()).padStart(2, '0')
  newForm.check_out_date = `${outY}-${outM}-${outD}`

  newForm.adults = 2
  newForm.children = 0
  newForm.total_amount = 450
  newForm.notes = ''

  showNewModal.value = true
}

async function handleCreateReservation() {
  const room = roomStore.rooms.find(r => r.id === newForm.room_id)
  await reservationStore.createReservation({
    ...newForm,
    room_number: room ? room.room_number : '',
    status: 'confirmed'
  })
  showNewModal.value = false
}
</script>
