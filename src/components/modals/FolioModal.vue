<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    @click.self="close"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
      <!-- Modal Header -->
      <div class="px-6 py-4 bg-gray-900 text-white flex items-center justify-between shrink-0">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-bold tracking-tight">Billing Folio & Invoice</h2>
            <span
              :class="[
                reservation?.status === 'checked_in' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-gray-700 text-gray-300',
                'px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-extrabold border'
              ]"
            >
              {{ reservation?.status || 'Active' }}
            </span>
          </div>
          <p class="text-xs text-gray-400 mt-0.5">
            Guest: <strong class="text-white">{{ reservation?.guest_name || 'Guest' }}</strong>
            &bull; Room {{ reservation?.room_number || '101' }}
            &bull; Stay: {{ reservation?.check_in_date }} &rarr; {{ reservation?.check_out_date }}
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

      <!-- Main Folio Content -->
      <div class="p-6 space-y-6 overflow-y-auto flex-1 bg-gray-50/50">
        <!-- Top Financial Summary KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <!-- Expected Total Card -->
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div class="flex items-center justify-between">
              <p class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Expected Total</p>
              <div class="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <PhReceipt class="w-4 h-4" />
              </div>
            </div>
            <h3 class="text-xl font-black text-gray-900 mt-2 font-mono">
              ${{ expectedTotal.toFixed(2) }}
            </h3>
            <p class="text-[10px] text-gray-400 mt-0.5">Room & baseline charges</p>
          </div>

          <!-- Total Posted Charges Card -->
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div class="flex items-center justify-between">
              <p class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Charges</p>
              <div class="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <PhPlusCircle class="w-4 h-4" />
              </div>
            </div>
            <h3 class="text-xl font-black text-amber-600 mt-2 font-mono">
              ${{ totalCharges.toFixed(2) }}
            </h3>
            <p class="text-[10px] text-gray-400 mt-0.5">{{ chargesList.length }} line items</p>
          </div>

          <!-- Total Payments Received Card -->
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div class="flex items-center justify-between">
              <p class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Payments</p>
              <div class="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <PhCheckCircle class="w-4 h-4" />
              </div>
            </div>
            <h3 class="text-xl font-black text-emerald-600 mt-2 font-mono">
              ${{ totalPayments.toFixed(2) }}
            </h3>
            <p class="text-[10px] text-gray-400 mt-0.5">{{ paymentsList.length }} payments received</p>
          </div>

          <!-- Current Balance Card -->
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div class="flex items-center justify-between">
              <p class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Current Balance</p>
              <div
                :class="[
                  currentBalance > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600',
                  'p-1.5 rounded-lg'
                ]"
              >
                <PhScales class="w-4 h-4" />
              </div>
            </div>
            <h3
              :class="[
                currentBalance > 0 ? 'text-red-600' : 'text-emerald-600',
                'text-xl font-black mt-2 font-mono'
              ]"
            >
              ${{ currentBalance.toFixed(2) }}
            </h3>
            <p class="text-[10px] text-gray-400 mt-0.5">
              {{ currentBalance > 0 ? 'Balance due at check-out' : 'Folio fully cleared' }}
            </p>
          </div>
        </div>

        <!-- Action Control Buttons (+Add Charge, +Add Payment, Check-out) -->
        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <button
              @click="activeAction = activeAction === 'charge' ? null : 'charge'"
              :class="[
                activeAction === 'charge' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100',
                'px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition'
              ]"
            >
              <PhPlusCircle class="w-4 h-4" />
              <span>+ Add Charge</span>
            </button>

            <button
              @click="activeAction = activeAction === 'payment' ? null : 'payment'"
              :class="[
                activeAction === 'payment' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
                'px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition'
              ]"
            >
              <PhCreditCard class="w-4 h-4" />
              <span>+ Add Payment</span>
            </button>
          </div>

          <button
            v-if="reservation?.status !== 'checked_out'"
            @click="handleCheckOut"
            :disabled="loading"
            class="px-5 py-2 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-bold shadow-2xs transition flex items-center gap-1.5"
          >
            <PhSignOut class="w-4 h-4" />
            <span>Process Check-Out</span>
          </button>
        </div>

        <!-- Inline Action Forms -->
        <!-- Add Charge Form -->
        <div v-if="activeAction === 'charge'" class="bg-amber-50/60 border border-amber-200 rounded-xl p-4 space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <PhPlusCircle class="w-4 h-4 text-amber-600" />
              <span>Post New Folio Charge</span>
            </h4>
            <button @click="activeAction = null" class="text-amber-700 hover:text-amber-900 text-xs font-bold">
              Cancel
            </button>
          </div>

          <form @submit.prevent="submitCharge" class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-[11px] font-semibold text-amber-900 mb-1">Category</label>
              <select
                v-model="chargeForm.category"
                required
                class="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs text-gray-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="Room Night">Room Night</option>
                <option value="Restaurant & Bar">Restaurant & Bar</option>
                <option value="Room Service">Room Service</option>
                <option value="Spa & Wellness">Spa & Wellness</option>
                <option value="Laundry">Laundry</option>
                <option value="Mini Bar">Mini Bar</option>
                <option value="Parking & Transport">Parking & Transport</option>
                <option value="Miscellaneous Charge">Miscellaneous Charge</option>
              </select>
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-amber-900 mb-1">Description <span class="text-red-500">*</span></label>
              <input
                type="text"
                v-model="chargeForm.description"
                required
                placeholder="e.g. Dinner at Ocean Grill"
                class="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs text-gray-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div class="flex gap-2 items-end">
              <div class="flex-1">
                <label class="block text-[11px] font-semibold text-amber-900 mb-1">Amount ($) <span class="text-red-500">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  v-model.number="chargeForm.amount"
                  required
                  placeholder="0.00"
                  class="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-bold text-gray-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs shadow-2xs transition shrink-0"
              >
                Post Charge
              </button>
            </div>
          </form>
        </div>

        <!-- Add Payment Form -->
        <div v-if="activeAction === 'payment'" class="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <PhCreditCard class="w-4 h-4 text-emerald-600" />
              <span>Record Payment Receipt</span>
            </h4>
            <button @click="activeAction = null" class="text-emerald-700 hover:text-emerald-900 text-xs font-bold">
              Cancel
            </button>
          </div>

          <form @submit.prevent="submitPayment" class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-[11px] font-semibold text-emerald-900 mb-1">Payment Method</label>
              <select
                v-model="paymentForm.method"
                required
                class="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Credit Card">Credit Card (Visa / MC)</option>
                <option value="Cash">Cash</option>
                <option value="Bank Wire">Bank Wire Transfer</option>
                <option value="Corporate Invoice">Corporate Ledger</option>
              </select>
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-emerald-900 mb-1">Reference / Note</label>
              <input
                type="text"
                v-model="paymentForm.reference"
                placeholder="e.g. Auth Code #9842"
                class="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div class="flex gap-2 items-end">
              <div class="flex-1">
                <label class="block text-[11px] font-semibold text-emerald-900 mb-1">Amount ($) <span class="text-red-500">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  v-model.number="paymentForm.amount"
                  required
                  placeholder="0.00"
                  class="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-2xs transition shrink-0"
              >
                Record Payment
              </button>
            </div>
          </form>
        </div>

        <!-- Folio Transaction History List Table -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
          <div class="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-xs font-bold text-gray-800 uppercase tracking-wider">Folio Itemized Statement</h3>
            <span class="text-[11px] text-gray-500">{{ reservationTransactions.length }} Transactions</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-gray-600">
              <thead class="bg-gray-100 text-gray-700 uppercase font-bold text-[10px] tracking-wider border-b border-gray-200">
                <tr>
                  <th class="px-4 py-3">Date & Time</th>
                  <th class="px-4 py-3">Type</th>
                  <th class="px-4 py-3">Category</th>
                  <th class="px-4 py-3">Description</th>
                  <th class="px-4 py-3 text-right">Amount</th>
                  <th class="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="tx in reservationTransactions" :key="tx.id" class="hover:bg-gray-50 transition">
                  <td class="px-4 py-3 font-mono text-[11px] text-gray-500">
                    {{ tx.created_at || tx.date || getTodayDateStr() }}
                  </td>
                  <td class="px-4 py-3">
                    <span
                      :class="[
                        tx.type === 'payment' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800',
                        'px-2 py-0.5 rounded text-[10px] font-extrabold uppercase'
                      ]"
                    >
                      {{ tx.type }}
                    </span>
                  </td>
                  <td class="px-4 py-3 font-semibold text-gray-800">
                    {{ tx.category || 'General' }}
                  </td>
                  <td class="px-4 py-3 text-gray-800 font-medium">
                    {{ tx.description }}
                  </td>
                  <td
                    :class="[
                      tx.type === 'payment' ? 'text-emerald-600' : 'text-gray-900',
                      'px-4 py-3 text-right font-bold font-mono text-xs'
                    ]"
                  >
                    {{ tx.type === 'payment' ? '-' : '+' }}${{ Number(tx.amount || 0).toFixed(2) }}
                  </td>
                  <td class="px-4 py-3 text-right">
                    <button
                      @click="deleteTransaction(tx.id)"
                      class="text-red-500 hover:text-red-700 text-[11px] font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                <tr v-if="reservationTransactions.length === 0">
                  <td colspan="6" class="px-4 py-8 text-center text-gray-400 italic bg-gray-50/50">
                    No custom folio transactions posted yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 bg-gray-100 border-t border-gray-200 flex items-center justify-between shrink-0">
        <div class="text-xs text-gray-600">
          <span>Net Balance Due: </span>
          <strong
            :class="[
              currentBalance > 0 ? 'text-red-600' : 'text-emerald-600',
              'font-mono text-sm ml-1'
            ]"
          >
            ${{ currentBalance.toFixed(2) }}
          </strong>
        </div>

        <button
          type="button"
          @click="close"
          class="px-5 py-2 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-bold shadow-2xs transition"
        >
          Close Folio
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useFolioStore } from '../../stores/useFolioStore.js'
import { useReservationStore } from '../../stores/useReservationStore.js'
import { useRoomStore } from '../../stores/useRoomStore.js'
import {
  PhX,
  PhReceipt,
  PhPlusCircle,
  PhCheckCircle,
  PhScales,
  PhCreditCard,
  PhSignOut
} from '@phosphor-icons/vue'

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

const emit = defineEmits(['update:modelValue', 'checkout', 'close'])

const folioStore = useFolioStore()
const reservationStore = useReservationStore()
const roomStore = useRoomStore()

const loading = ref(false)
const activeAction = ref(null) // 'charge' | 'payment' | null

const chargeForm = ref({
  category: 'Room Night',
  description: '',
  amount: ''
})

const paymentForm = ref({
  method: 'Credit Card',
  reference: '',
  amount: ''
})

function getTodayDateStr() {
  const d = new Date()
  return d.toISOString().split('T')[0]
}

onMounted(async () => {
  await Promise.allSettled([
    folioStore.fetchFolioTransactions()
  ])
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    activeAction.value = null
    chargeForm.value = { category: 'Room Night', description: '', amount: '' }
    paymentForm.value = { method: 'Credit Card', reference: '', amount: '' }
  }
})

// Transactions for current reservation
const reservationTransactions = computed(() => {
  if (!props.reservation) return []
  return folioStore.folio_transactions.filter(t => t.reservation_id === props.reservation.id)
})

const expectedTotal = computed(() => {
  return Number(props.reservation?.total_amount || 0)
})

const totalCharges = computed(() => {
  const customCharges = reservationTransactions.value
    .filter(t => t.type === 'charge')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)

  return expectedTotal.value + customCharges
})

const totalPayments = computed(() => {
  const directPaid = Number(props.reservation?.paid_amount || 0)
  const folioPayments = reservationTransactions.value
    .filter(t => t.type === 'payment')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)

  return directPaid + folioPayments
})

const currentBalance = computed(() => {
  return Math.max(0, totalCharges.value - totalPayments.value)
})

const chargesList = computed(() => {
  return reservationTransactions.value.filter(t => t.type === 'charge')
})

const paymentsList = computed(() => {
  return reservationTransactions.value.filter(t => t.type === 'payment')
})

function close() {
  emit('update:modelValue', false)
  emit('close')
}

async function submitCharge() {
  if (!props.reservation || !chargeForm.value.description || !chargeForm.value.amount) return
  loading.value = true
  try {
    const txData = {
      reservation_id: props.reservation.id,
      type: 'charge',
      category: chargeForm.value.category,
      description: chargeForm.value.description,
      amount: Number(chargeForm.value.amount),
      date: getTodayDateStr()
    }
    await folioStore.createFolioTransaction(txData)

    chargeForm.value = { category: 'Room Night', description: '', amount: '' }
    activeAction.value = null
  } catch (err) {
    console.error('Failed to post charge:', err)
  } finally {
    loading.value = false
  }
}

async function submitPayment() {
  if (!props.reservation || !paymentForm.value.amount) return
  loading.value = true
  try {
    const txData = {
      reservation_id: props.reservation.id,
      type: 'payment',
      category: 'Payment',
      description: `Payment via ${paymentForm.value.method}${paymentForm.value.reference ? ' (' + paymentForm.value.reference + ')' : ''}`,
      amount: Number(paymentForm.value.amount),
      date: getTodayDateStr()
    }
    await folioStore.createFolioTransaction(txData)

    // Update reservation paid amount
    const newPaidAmount = totalPayments.value
    await reservationStore.updateReservation(props.reservation.id, {
      paid_amount: newPaidAmount
    })

    paymentForm.value = { method: 'Credit Card', reference: '', amount: '' }
    activeAction.value = null
  } catch (err) {
    console.error('Failed to record payment:', err)
  } finally {
    loading.value = false
  }
}

async function deleteTransaction(id) {
  loading.value = true
  try {
    await folioStore.deleteFolioTransaction(id)
  } catch (err) {
    console.error('Failed to delete transaction:', err)
  } finally {
    loading.value = false
  }
}

async function handleCheckOut() {
  if (!props.reservation) return
  loading.value = true
  try {
    // Settle paid amount to totalCharges and update status to checked_out
    const newTotalPaid = totalCharges.value
    await reservationStore.updateReservation(props.reservation.id, {
      status: 'checked_out',
      paid_amount: newTotalPaid
    })

    // Update room housekeeping status to dirty
    if (props.reservation.room_id) {
      await roomStore.updateRoom(props.reservation.room_id, {
        housekeeping_status: 'dirty'
      })
    }

    emit('checkout', props.reservation)
    close()
  } catch (err) {
    console.error('Failed to process check-out:', err)
  } finally {
    loading.value = false
  }
}
</script>
