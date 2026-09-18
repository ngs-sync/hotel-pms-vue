<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    @click.self="close"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="px-6 py-4 bg-gray-900 text-white flex items-center justify-between shrink-0">
        <div>
          <h2 class="text-xl font-bold tracking-tight">
            {{ isEdit ? 'Edit Reservation' : 'New Reservation' }}
          </h2>
          <p class="text-xs text-gray-400 mt-0.5">
            {{ isEdit ? `Reservation ID: ${form.id}` : 'Complete the 4-card smart form to create a booking' }}
          </p>
        </div>
        <button
          type="button"
          @click="close"
          class="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
        >
          <PhX class="w-5 h-5" />
        </button>
      </div>

      <!-- Form Content with 4 Cards -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6 overflow-y-auto flex-1">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <!-- CARD 1: Guest Info -->
          <div class="bg-gray-50/80 rounded-xl p-5 border border-gray-200 shadow-2xs space-y-4">
            <div class="flex items-center gap-2 pb-2 border-b border-gray-200">
              <div class="p-2 bg-blue-100 text-blue-700 rounded-lg">
                <PhUser class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-gray-900">1. Guest Info</h3>
                <p class="text-[11px] text-gray-500">Contact & VIP profile information</p>
              </div>
            </div>

            <!-- Existing Guest Selector or Manual Entry -->
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Existing Guest Profile</label>
                <select
                  v-model="selectedGuestId"
                  @change="handleGuestSelect"
                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">-- Select Existing Guest (Optional) --</option>
                  <option v-for="g in reservationStore.guest_profiles" :key="g.id" :value="g.id">
                    {{ g.first_name }} {{ g.last_name }} ({{ g.email || g.phone }}) {{ g.vip ? '⭐ VIP' : '' }}
                  </option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">First Name <span class="text-red-500">*</span></label>
                  <input
                    type="text"
                    v-model="form.firstName"
                    required
                    placeholder="e.g. Eleanor"
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Last Name <span class="text-red-500">*</span></label>
                  <input
                    type="text"
                    v-model="form.lastName"
                    required
                    placeholder="e.g. Vance"
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    v-model="form.email"
                    placeholder="guest@example.com"
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    v-model="form.phone"
                    placeholder="+1 555-0101"
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div class="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="vip-check"
                  v-model="form.vip"
                  class="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-400"
                />
                <label for="vip-check" class="text-xs font-semibold text-amber-800 flex items-center gap-1 cursor-pointer">
                  <span>Mark as VIP Guest Profile</span>
                </label>
              </div>
            </div>
          </div>

          <!-- CARD 2: Stay Details -->
          <div class="bg-gray-50/80 rounded-xl p-5 border border-gray-200 shadow-2xs space-y-4">
            <div class="flex items-center gap-2 pb-2 border-b border-gray-200">
              <div class="p-2 bg-purple-100 text-purple-700 rounded-lg">
                <PhCalendar class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-gray-900">2. Stay Details</h3>
                <p class="text-[11px] text-gray-500">Dates, room allocation & occupancy</p>
              </div>
            </div>

            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Check-In Date <span class="text-red-500">*</span></label>
                  <input
                    type="date"
                    v-model="form.checkInDate"
                    required
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Check-Out Date <span class="text-red-500">*</span></label>
                  <input
                    type="date"
                    v-model="form.checkOutDate"
                    required
                    :min="form.checkInDate"
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Room Assignment <span class="text-red-500">*</span></label>
                  <select
                    v-model="form.roomId"
                    @change="handleRoomChange"
                    required
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="">-- Select Room --</option>
                    <option v-for="r in roomStore.rooms" :key="r.id" :value="r.id">
                      Room {{ r.room_number }} ({{ getRoomTypeName(r.room_type_id) }})
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Booking Type</label>
                  <select
                    v-model="form.bookingType"
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="individual">Individual</option>
                    <option value="group">Group / Corporate</option>
                  </select>
                </div>
              </div>

              <div v-if="form.bookingType === 'group'" class="grid grid-cols-1 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Group / Event Name</label>
                  <input
                    type="text"
                    v-model="form.groupName"
                    placeholder="e.g. TechCorp Annual Conference"
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Adults</label>
                  <input
                    type="number"
                    min="1"
                    v-model.number="form.adults"
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Children</label>
                  <input
                    type="number"
                    min="0"
                    v-model.number="form.children"
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- CARD 3: Room & Pricing Core -->
          <div class="bg-gray-50/80 rounded-xl p-5 border border-gray-200 shadow-2xs space-y-4">
            <div class="flex items-center gap-2 pb-2 border-b border-gray-200">
              <div class="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                <PhCurrencyDollar class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-gray-900">3. Room & Pricing Core</h3>
                <p class="text-[11px] text-gray-500">Base rate, meal plans & daily rate breakdown</p>
              </div>
            </div>

            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Base Nightly Rate ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    v-model.number="form.nightlyRate"
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Meal Plan</label>
                  <select
                    v-model="form.mealPlanId"
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="">None (Room Only)</option>
                    <option v-for="mp in roomStore.meal_plans" :key="mp.id" :value="mp.id">
                      {{ mp.name }} (${{ mp.price_adult || 0 }}/adult)
                    </option>
                  </select>
                </div>
              </div>

              <!-- Daily Breakdown Calculation Display -->
              <div class="bg-white p-3 rounded-lg border border-gray-200 space-y-2">
                <div class="flex items-center justify-between text-xs font-bold text-gray-800 border-b pb-1.5">
                  <span>Daily Rate Breakdown</span>
                  <span class="text-gray-500 font-normal">{{ totalNights }} Night(s) Stay</span>
                </div>

                <div v-if="dailyBreakdown.length > 0" class="max-h-28 overflow-y-auto space-y-1 text-[11px]">
                  <div
                    v-for="(day, idx) in dailyBreakdown"
                    :key="idx"
                    class="flex items-center justify-between text-gray-600 hover:bg-gray-50 p-1 rounded"
                  >
                    <span>Night {{ idx + 1 }} ({{ day.date }}):</span>
                    <span class="font-mono font-semibold text-gray-900">${{ day.rate.toFixed(2) }}</span>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-2 border-t border-gray-200 text-xs">
                  <span class="font-bold text-gray-700">Calculated Total Stay Rate:</span>
                  <span class="font-extrabold text-emerald-600 text-sm font-mono">
                    ${{ calculatedTotalAmount.toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- CARD 4: Deposit & Status -->
          <div class="bg-gray-50/80 rounded-xl p-5 border border-gray-200 shadow-2xs space-y-4">
            <div class="flex items-center gap-2 pb-2 border-b border-gray-200">
              <div class="p-2 bg-amber-100 text-amber-700 rounded-lg">
                <PhCreditCard class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-gray-900">4. Deposit & Status</h3>
                <p class="text-[11px] text-gray-500">Booking status, paid deposit & special notes</p>
              </div>
            </div>

            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Reservation Status</label>
                  <select
                    v-model="form.status"
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="checked_in">Checked In</option>
                    <option value="checked_out">Checked Out</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Deposit / Paid Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    v-model.number="form.paidAmount"
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Payment Method</label>
                <select
                  v-model="form.paymentMethod"
                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="">-- Select Payment Method --</option>
                  <option v-for="pm in roomStore.payment_methods" :key="pm.id" :value="pm.name">
                    {{ pm.name }}
                  </option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Special Requests / Notes</label>
                <textarea
                  v-model="form.notes"
                  rows="2"
                  placeholder="e.g. Quiet room requested, early check-in required..."
                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-800 focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </div>

        </div>

        <!-- Action Footer -->
        <div class="flex items-center justify-between pt-4 border-t border-gray-200">
          <div class="text-xs text-gray-500">
            <span class="font-bold text-gray-700">Balance Due:</span>
            <span class="ml-1 font-mono font-bold text-amber-700">
              ${{ Math.max(0, calculatedTotalAmount - (form.paidAmount || 0)).toFixed(2) }}
            </span>
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              @click="close"
              class="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-2"
            >
              <span v-if="loading">Saving...</span>
              <span v-else>{{ isEdit ? 'Update Reservation' : 'Create Reservation' }}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoomStore } from '../../stores/useRoomStore.js'
import { useReservationStore } from '../../stores/useReservationStore.js'
import { PhX, PhUser, PhCalendar, PhCurrencyDollar, PhCreditCard } from '@phosphor-icons/vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  reservation: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'saved', 'close'])

const roomStore = useRoomStore()
const reservationStore = useReservationStore()

const loading = ref(false)
const selectedGuestId = ref('')

function getTodayStr(offset = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const form = ref({
  id: '',
  guestId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  vip: false,
  checkInDate: getTodayStr(0),
  checkOutDate: getTodayStr(2),
  roomId: '',
  roomNumber: '',
  bookingType: 'individual',
  groupName: '',
  adults: 2,
  children: 0,
  nightlyRate: 150,
  mealPlanId: '',
  status: 'confirmed',
  paidAmount: 0,
  paymentMethod: '',
  notes: ''
})

const isEdit = computed(() => Boolean(props.reservation && props.reservation.id))

onMounted(async () => {
  await Promise.allSettled([
    roomStore.fetchRooms(),
    roomStore.fetchRoomTypes(),
    roomStore.fetchMealPlans(),
    roomStore.fetchPaymentMethods(),
    reservationStore.fetchGuestProfiles()
  ])
  resetForm()
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    resetForm()
  }
})

watch(() => props.reservation, () => {
  if (props.modelValue) {
    resetForm()
  }
}, { deep: true })

function resetForm() {
  if (props.reservation && props.reservation.id) {
    const res = props.reservation
    const nameParts = (res.guest_name || '').split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    form.value = {
      id: res.id,
      guestId: res.guest_id || '',
      firstName: firstName,
      lastName: lastName,
      email: res.email || '',
      phone: res.phone || '',
      vip: Boolean(res.vip),
      checkInDate: res.check_in_date || getTodayStr(0),
      checkOutDate: res.check_out_date || getTodayStr(2),
      roomId: res.room_id || '',
      roomNumber: res.room_number || '',
      bookingType: res.booking_type || 'individual',
      groupName: res.group_name || '',
      adults: res.adults ?? 2,
      children: res.children ?? 0,
      nightlyRate: res.nightly_rate || (res.total_amount ? res.total_amount / Math.max(1, getStayNights(res.check_in_date, res.check_out_date)) : 150),
      mealPlanId: res.meal_plan_id || '',
      status: res.status || 'confirmed',
      paidAmount: res.paid_amount || 0,
      paymentMethod: res.payment_method || '',
      notes: res.notes || ''
    }
    selectedGuestId.value = res.guest_id || ''
  } else {
    form.value = {
      id: '',
      guestId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      vip: false,
      checkInDate: getTodayStr(0),
      checkOutDate: getTodayStr(2),
      roomId: roomStore.rooms[0]?.id || '',
      roomNumber: roomStore.rooms[0]?.room_number || '',
      bookingType: 'individual',
      groupName: '',
      adults: 2,
      children: 0,
      nightlyRate: 150,
      mealPlanId: '',
      status: 'confirmed',
      paidAmount: 0,
      paymentMethod: '',
      notes: ''
    }
    selectedGuestId.value = ''
    if (form.value.roomId) {
      handleRoomChange()
    }
  }
}

function handleGuestSelect() {
  if (!selectedGuestId.value) return
  const g = reservationStore.guest_profiles.find(p => p.id === selectedGuestId.value)
  if (g) {
    form.value.guestId = g.id
    form.value.firstName = g.first_name || ''
    form.value.lastName = g.last_name || ''
    form.value.email = g.email || ''
    form.value.phone = g.phone || ''
    form.value.vip = Boolean(g.vip)
  }
}

function handleRoomChange() {
  const room = roomStore.rooms.find(r => r.id === form.value.roomId)
  if (room) {
    form.value.roomNumber = room.room_number
    const rt = roomStore.room_types.find(t => t.id === room.room_type_id)
    if (rt && rt.base_price) {
      form.value.nightlyRate = rt.base_price
    }
  }
}

function getRoomTypeName(roomTypeId) {
  const rt = roomStore.room_types.find(t => t.id === roomTypeId)
  return rt ? rt.name : 'Standard'
}

function getStayNights(startDate, endDate) {
  if (!startDate || !endDate) return 1
  const [inY, inM, inD] = startDate.split('-').map(Number)
  const [outY, outM, outD] = endDate.split('-').map(Number)
  const dIn = new Date(inY, inM - 1, inD)
  const dOut = new Date(outY, outM - 1, outD)
  return Math.max(1, Math.round((dOut - dIn) / (1000 * 60 * 60 * 24)))
}

const totalNights = computed(() => {
  return getStayNights(form.value.checkInDate, form.value.checkOutDate)
})

// Daily breakdown calculation
const dailyBreakdown = computed(() => {
  if (!form.value.checkInDate || !form.value.checkOutDate) return []
  const nights = totalNights.value
  const list = []

  let mealCostPerNight = 0
  if (form.value.mealPlanId) {
    const mp = roomStore.meal_plans.find(m => m.id === form.value.mealPlanId)
    if (mp) {
      const adultPrice = mp.price_adult || 0
      const childPrice = mp.price_child || 0
      mealCostPerNight = (form.value.adults * adultPrice) + (form.value.children * childPrice)
    }
  }

  const [inY, inM, inD] = form.value.checkInDate.split('-').map(Number)
  const currDate = new Date(inY, inM - 1, inD)

  for (let i = 0; i < nights; i++) {
    const y = currDate.getFullYear()
    const m = String(currDate.getMonth() + 1).padStart(2, '0')
    const d = String(currDate.getDate()).padStart(2, '0')
    const dateStr = `${y}-${m}-${d}`

    const dayRate = (Number(form.value.nightlyRate) || 0) + mealCostPerNight

    list.push({
      date: dateStr,
      rate: dayRate
    })

    currDate.setDate(currDate.getDate() + 1)
  }

  return list
})

const calculatedTotalAmount = computed(() => {
  return dailyBreakdown.value.reduce((sum, item) => sum + item.rate, 0)
})

function close() {
  emit('update:modelValue', false)
  emit('close')
}

async function handleSubmit() {
  loading.value = true
  try {
    const fullName = `${form.value.firstName.trim()} ${form.value.lastName.trim()}`

    // Save or create guest profile if needed
    let guestId = form.value.guestId
    if (!guestId) {
      const createdGuest = await reservationStore.createGuestProfile({
        first_name: form.value.firstName,
        last_name: form.value.lastName,
        email: form.value.email,
        phone: form.value.phone,
        vip: form.value.vip
      })
      if (createdGuest && createdGuest[0]) {
        guestId = createdGuest[0].id
      }
    }

    const payload = {
      guest_id: guestId || 'g_' + Date.now(),
      guest_name: fullName,
      room_id: form.value.roomId,
      room_number: form.value.roomNumber,
      check_in_date: form.value.checkInDate,
      check_out_date: form.value.checkOutDate,
      status: form.value.status,
      booking_type: form.value.bookingType,
      group_name: form.value.bookingType === 'group' ? form.value.groupName : null,
      total_amount: calculatedTotalAmount.value,
      paid_amount: form.value.paidAmount,
      adults: form.value.adults,
      children: form.value.children,
      notes: form.value.notes
    }

    if (isEdit.value) {
      await reservationStore.updateReservation(form.value.id, payload)
    } else {
      await reservationStore.createReservation(payload)
    }

    emit('saved')
    close()
  } catch (err) {
    console.error('Error saving reservation:', err)
  } finally {
    loading.value = false
  }
}
</script>
