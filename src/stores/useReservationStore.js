import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../composables/useSupabase.js'

export const useReservationStore = defineStore('reservation', () => {
  const reservations = ref([])
  const guest_profiles = ref([])
  const reservation_daily_rates = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Reservations CRUD
  async function fetchReservations() {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('reservations').select('*')
      if (err) throw err
      reservations.value = data || []
      return data
    } catch (err) {
      error.value = err.message
      throw err
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
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
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
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
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
      throw err
    } finally {
      loading.value = false
    }
  }

  // Guest Profiles CRUD
  async function fetchGuestProfiles() {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('guest_profiles').select('*')
      if (err) throw err
      guest_profiles.value = data || []
      return data
    } catch (err) {
      error.value = err.message
      throw err
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
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
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
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
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
      throw err
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
      throw err
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
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
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
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
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
      throw err
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
