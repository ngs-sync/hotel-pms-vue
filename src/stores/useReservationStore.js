import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../composables/useSupabase.js'

function getOffsetDateStr(offsetDays) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const isPlaceholder = Boolean(import.meta.env?.VITE_SUPABASE_URL?.includes('placeholder'))

export const useReservationStore = defineStore('reservation', () => {
  const reservations = ref([])
  const guest_profiles = ref([])
  const reservation_daily_rates = ref([])
  const loading = ref(false)
  const error = ref(null)

  function seedDefaultGuestProfiles() {
    if (guest_profiles.value.length === 0) {
      guest_profiles.value = [
        { id: 'g_1', first_name: 'Eleanor', last_name: 'Vance', email: 'eleanor@example.com', phone: '+1 555-0101', vip: true },
        { id: 'g_2', first_name: 'Liam', last_name: 'Hemsworth', email: 'liam@example.com', phone: '+1 555-0102', vip: false },
        { id: 'g_3', first_name: 'Sophia', last_name: 'Martinez', email: 'sophia@example.com', phone: '+1 555-0103', vip: true },
        { id: 'g_4', first_name: 'Marcus', last_name: 'Brody', email: 'marcus@example.com', phone: '+1 555-0104', vip: false },
        { id: 'g_5', first_name: 'Olivia', last_name: 'Chen', email: 'olivia@example.com', phone: '+1 555-0105', vip: true },
        { id: 'g_6', first_name: 'David', last_name: 'Miller', email: 'david@example.com', phone: '+1 555-0106', vip: false },
      ]
    }
  }

  function seedDefaultReservations() {
    if (reservations.value.length === 0) {
      reservations.value = [
        {
          id: 'res_1',
          guest_id: 'g_1',
          guest_name: 'Eleanor Vance',
          room_id: 'r_101',
          room_number: '101',
          check_in_date: getOffsetDateStr(-2),
          check_out_date: getOffsetDateStr(3),
          status: 'checked_in',
          booking_type: 'individual',
          total_amount: 750,
          paid_amount: 750,
          adults: 2,
          children: 0,
          notes: 'VIP Guest, requested extra pillows and quiet room'
        },
        {
          id: 'res_2',
          guest_id: 'g_2',
          guest_name: 'Liam Hemsworth',
          room_id: 'r_102',
          room_number: '102',
          check_in_date: getOffsetDateStr(0),
          check_out_date: getOffsetDateStr(4),
          status: 'confirmed',
          booking_type: 'individual',
          total_amount: 600,
          paid_amount: 150,
          adults: 1,
          children: 0,
          notes: 'Late arrival expected at 8:00 PM'
        },
        {
          id: 'res_3',
          guest_id: 'g_3',
          guest_name: 'Sophia Martinez',
          room_id: 'r_103',
          room_number: '103',
          check_in_date: getOffsetDateStr(-4),
          check_out_date: getOffsetDateStr(0),
          status: 'checked_in',
          booking_type: 'individual',
          total_amount: 880,
          paid_amount: 880,
          adults: 2,
          children: 1,
          notes: 'Express departure requested today'
        },
        {
          id: 'res_4',
          guest_id: 'g_4',
          guest_name: 'Marcus Brody',
          room_id: 'r_201',
          room_number: '201',
          check_in_date: getOffsetDateStr(1),
          check_out_date: getOffsetDateStr(6),
          status: 'confirmed',
          booking_type: 'individual',
          total_amount: 1100,
          paid_amount: 220,
          adults: 2,
          children: 0,
          notes: 'Honeymoon arrangement'
        },
        {
          id: 'res_5',
          guest_id: 'g_5',
          guest_name: 'Olivia Chen',
          room_id: 'r_202',
          room_number: '202',
          check_in_date: getOffsetDateStr(-1),
          check_out_date: getOffsetDateStr(5),
          status: 'checked_in',
          booking_type: 'individual',
          total_amount: 2280,
          paid_amount: 1000,
          adults: 3,
          children: 0,
          notes: 'Executive Suite stay'
        },
        {
          id: 'res_6',
          guest_id: 'g_6',
          guest_name: 'David Miller',
          room_id: 'r_203',
          room_number: '203',
          check_in_date: getOffsetDateStr(4),
          check_out_date: getOffsetDateStr(8),
          status: 'confirmed',
          booking_type: 'individual',
          total_amount: 1520,
          paid_amount: 0,
          adults: 2,
          children: 0,
          notes: 'Airport transfer needed'
        },
        {
          id: 'res_grp_1',
          guest_id: 'g_7',
          guest_name: 'Alex Rivera (TechCorp)',
          room_id: 'r_101',
          room_number: '101',
          check_in_date: getOffsetDateStr(0),
          check_out_date: getOffsetDateStr(5),
          status: 'confirmed',
          booking_type: 'group',
          group_id: 'grp_101',
          group_name: 'TechCorp Annual Conference',
          total_amount: 1250,
          paid_amount: 1250,
          adults: 1,
          children: 0,
          notes: 'Part of TechCorp Group Block'
        },
        {
          id: 'res_grp_2',
          guest_id: 'g_8',
          guest_name: 'Sarah Jenkins (TechCorp)',
          room_id: 'r_102',
          room_number: '102',
          check_in_date: getOffsetDateStr(0),
          check_out_date: getOffsetDateStr(5),
          status: 'confirmed',
          booking_type: 'group',
          group_id: 'grp_101',
          group_name: 'TechCorp Annual Conference',
          total_amount: 1250,
          paid_amount: 1250,
          adults: 1,
          children: 0,
          notes: 'Part of TechCorp Group Block'
        },
        {
          id: 'res_grp_3',
          guest_id: 'g_9',
          guest_name: 'Michael Vance (Logistics)',
          room_id: 'r_201',
          room_number: '201',
          check_in_date: getOffsetDateStr(-3),
          check_out_date: getOffsetDateStr(2),
          status: 'checked_in',
          booking_type: 'group',
          group_id: 'grp_102',
          group_name: 'Global Logistics Leaders Summit',
          total_amount: 1850,
          paid_amount: 1850,
          adults: 2,
          children: 0,
          notes: 'Direct corporate invoice'
        }
      ]
    }
  }

  // Reservations CRUD
  async function fetchReservations() {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('reservations').select('*')
      if (err) throw err
      if (data && data.length > 0) {
        reservations.value = data
      } else {
        seedDefaultReservations()
      }
      return reservations.value
    } catch (err) {
      error.value = err.message
      seedDefaultReservations()
      return reservations.value
    } finally {
      loading.value = false
    }
  }

  async function createReservation(reservationData) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('reservations').insert(reservationData).select()
      if (err) throw err
      if (data && data.length > 0) {
        reservations.value.push(data[0])
        return data
      }
    } catch (err) {
      error.value = err.message
      const newItem = { id: 'res_' + Date.now(), ...reservationData }
      reservations.value.push(newItem)
      return [newItem]
    } finally {
      loading.value = false
    }
  }

  async function updateReservation(id, updates) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('reservations').update(updates).eq('id', id).select()
      if (err) throw err
      if (data && data.length > 0) {
        const index = reservations.value.findIndex(r => r.id === id)
        if (index !== -1) reservations.value[index] = data[0]
        return data
      }
    } catch (err) {
      error.value = err.message
      const index = reservations.value.findIndex(r => r.id === id)
      if (index !== -1) {
        reservations.value[index] = { ...reservations.value[index], ...updates }
      }
      return [reservations.value[index]]
    } finally {
      loading.value = false
    }
  }

  async function deleteReservation(id) {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase.from('reservations').delete().eq('id', id)
      if (err) throw err
      reservations.value = reservations.value.filter(r => r.id !== id)
    } catch (err) {
      error.value = err.message
      reservations.value = reservations.value.filter(r => r.id !== id)
    } finally {
      loading.value = false
    }
  }

  // Guest Profiles CRUD
  async function fetchGuestProfiles() {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('guest_profiles').select('*')
      if (err) throw err
      if (data && data.length > 0) {
        guest_profiles.value = data
      } else {
        seedDefaultGuestProfiles()
      }
      return guest_profiles.value
    } catch (err) {
      error.value = err.message
      seedDefaultGuestProfiles()
      return guest_profiles.value
    } finally {
      loading.value = false
    }
  }

  async function createGuestProfile(guestProfileData) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('guest_profiles').insert(guestProfileData).select()
      if (err) throw err
      if (data && data.length > 0) {
        guest_profiles.value.push(data[0])
        return data
      }
    } catch (err) {
      error.value = err.message
      const newItem = { id: 'g_' + Date.now(), ...guestProfileData }
      guest_profiles.value.push(newItem)
      return [newItem]
    } finally {
      loading.value = false
    }
  }

  async function updateGuestProfile(id, updates) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('guest_profiles').update(updates).eq('id', id).select()
      if (err) throw err
      if (data && data.length > 0) {
        const index = guest_profiles.value.findIndex(g => g.id === id)
        if (index !== -1) guest_profiles.value[index] = data[0]
        return data
      }
    } catch (err) {
      error.value = err.message
      const index = guest_profiles.value.findIndex(g => g.id === id)
      if (index !== -1) {
        guest_profiles.value[index] = { ...guest_profiles.value[index], ...updates }
      }
      return [guest_profiles.value[index]]
    } finally {
      loading.value = false
    }
  }

  async function deleteGuestProfile(id) {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase.from('guest_profiles').delete().eq('id', id)
      if (err) throw err
      guest_profiles.value = guest_profiles.value.filter(g => g.id !== id)
    } catch (err) {
      error.value = err.message
      guest_profiles.value = guest_profiles.value.filter(g => g.id !== id)
    } finally {
      loading.value = false
    }
  }

  // Reservation Daily Rates CRUD
  async function fetchReservationDailyRates() {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('reservation_daily_rates').select('*')
      if (err) throw err
      reservation_daily_rates.value = data || []
      return data
    } catch (err) {
      error.value = err.message
      return reservation_daily_rates.value
    } finally {
      loading.value = false
    }
  }

  async function createReservationDailyRate(rateData) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('reservation_daily_rates').insert(rateData).select()
      if (err) throw err
      if (data && data.length > 0) {
        reservation_daily_rates.value.push(data[0])
        return data
      }
    } catch (err) {
      error.value = err.message
      const newItem = { id: 'rdr_' + Date.now(), ...rateData }
      reservation_daily_rates.value.push(newItem)
      return [newItem]
    } finally {
      loading.value = false
    }
  }

  async function updateReservationDailyRate(id, updates) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('reservation_daily_rates').update(updates).eq('id', id).select()
      if (err) throw err
      if (data && data.length > 0) {
        const index = reservation_daily_rates.value.findIndex(r => r.id === id)
        if (index !== -1) reservation_daily_rates.value[index] = data[0]
        return data
      }
    } catch (err) {
      error.value = err.message
      const index = reservation_daily_rates.value.findIndex(r => r.id === id)
      if (index !== -1) {
        reservation_daily_rates.value[index] = { ...reservation_daily_rates.value[index], ...updates }
      }
      return [reservation_daily_rates.value[index]]
    } finally {
      loading.value = false
    }
  }

  async function deleteReservationDailyRate(id) {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase.from('reservation_daily_rates').delete().eq('id', id)
      if (err) throw err
      reservation_daily_rates.value = reservation_daily_rates.value.filter(r => r.id !== id)
    } catch (err) {
      error.value = err.message
      reservation_daily_rates.value = reservation_daily_rates.value.filter(r => r.id !== id)
    } finally {
      loading.value = false
    }
  }

  return {
    reservations,
    guest_profiles,
    reservation_daily_rates,
    loading,
    error,
    fetchReservations,
    createReservation,
    updateReservation,
    deleteReservation,
    fetchGuestProfiles,
    createGuestProfile,
    updateGuestProfile,
    deleteGuestProfile,
    fetchReservationDailyRates,
    createReservationDailyRate,
    updateReservationDailyRate,
    deleteReservationDailyRate,
  }
})
