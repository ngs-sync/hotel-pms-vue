import { test, describe, beforeEach, mock } from 'node:test'
import assert from 'node:assert/strict'
import { setActivePinia, createPinia } from 'pinia'
import { supabase } from '../src/composables/useSupabase.js'
import { useRoomStore } from '../src/stores/useRoomStore.js'
import { useReservationStore } from '../src/stores/useReservationStore.js'
import { useFolioStore } from '../src/stores/useFolioStore.js'

describe('Pinia Stores Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('useRoomStore', () => {
    test('initial state', () => {
      const store = useRoomStore()
      assert.deepEqual(store.properties, [])
      assert.deepEqual(store.bed_types, [])
      assert.deepEqual(store.room_types, [])
      assert.deepEqual(store.rooms, [])
      assert.equal(store.loading, false)
      assert.equal(store.error, null)
    })

    test('fetchProperties populates properties state', async () => {
      const mockProperties = [{ id: '1', name: 'Grand Hotel' }]
      supabase.from = () => ({
        select: () => Promise.resolve({ data: mockProperties, error: null })
      })

      const store = useRoomStore()
      await store.fetchProperties()
      assert.deepEqual(store.properties, mockProperties)
      assert.equal(store.loading, false)
    })

    test('createProperty inserts and appends property', async () => {
      const newProperty = { id: '2', name: 'Beach Resort' }
      supabase.from = () => ({
        insert: () => ({
          select: () => Promise.resolve({ data: [newProperty], error: null })
        })
      })

      const store = useRoomStore()
      await store.createProperty({ name: 'Beach Resort' })
      assert.deepEqual(store.properties, [newProperty])
    })

    test('updateProperty updates property in state', async () => {
      const store = useRoomStore()
      store.properties = [{ id: '1', name: 'Old Name' }]

      const updatedProperty = { id: '1', name: 'New Name' }
      supabase.from = () => ({
        update: () => ({
          eq: () => ({
            select: () => Promise.resolve({ data: [updatedProperty], error: null })
          })
        })
      })

      await store.updateProperty('1', { name: 'New Name' })
      assert.equal(store.properties[0].name, 'New Name')
    })

    test('deleteProperty removes property from state', async () => {
      const store = useRoomStore()
      store.properties = [{ id: '1', name: 'Hotel' }]

      supabase.from = () => ({
        delete: () => ({
          eq: () => Promise.resolve({ error: null })
        })
      })

      await store.deleteProperty('1')
      assert.deepEqual(store.properties, [])
    })

    test('bed_types CRUD', async () => {
      const store = useRoomStore()
      const bedType = { id: 'bt1', name: 'King' }

      // Fetch
      supabase.from = () => ({ select: () => Promise.resolve({ data: [bedType], error: null }) })
      await store.fetchBedTypes()
      assert.deepEqual(store.bed_types, [bedType])

      // Delete
      supabase.from = () => ({ delete: () => ({ eq: () => Promise.resolve({ error: null }) }) })
      await store.deleteBedType('bt1')
      assert.deepEqual(store.bed_types, [])
    })

    test('room_types CRUD', async () => {
      const store = useRoomStore()
      const roomType = { id: 'rt1', name: 'Suite' }

      // Fetch
      supabase.from = () => ({ select: () => Promise.resolve({ data: [roomType], error: null }) })
      await store.fetchRoomTypes()
      assert.deepEqual(store.room_types, [roomType])
    })

    test('rooms CRUD', async () => {
      const store = useRoomStore()
      const room = { id: 'r1', room_number: '101' }

      // Fetch
      supabase.from = () => ({ select: () => Promise.resolve({ data: [room], error: null }) })
      await store.fetchRooms()
      assert.deepEqual(store.rooms, [room])
    })
  })

  describe('useReservationStore', () => {
    test('initial state', () => {
      const store = useReservationStore()
      assert.deepEqual(store.reservations, [])
      assert.deepEqual(store.guest_profiles, [])
      assert.deepEqual(store.reservation_daily_rates, [])
      assert.equal(store.loading, false)
      assert.equal(store.error, null)
    })

    test('reservations CRUD', async () => {
      const store = useReservationStore()
      const res = { id: 'res1', status: 'confirmed' }

      supabase.from = () => ({ select: () => Promise.resolve({ data: [res], error: null }) })
      await store.fetchReservations()
      assert.deepEqual(store.reservations, [res])
    })

    test('guest_profiles CRUD', async () => {
      const store = useReservationStore()
      const guest = { id: 'g1', first_name: 'John', last_name: 'Doe' }

      supabase.from = () => ({ select: () => Promise.resolve({ data: [guest], error: null }) })
      await store.fetchGuestProfiles()
      assert.deepEqual(store.guest_profiles, [guest])
    })

    test('reservation_daily_rates CRUD', async () => {
      const store = useReservationStore()
      const rate = { id: 'rdr1', rate: 150 }

      supabase.from = () => ({ select: () => Promise.resolve({ data: [rate], error: null }) })
      await store.fetchReservationDailyRates()
      assert.deepEqual(store.reservation_daily_rates, [rate])
    })
  })

  describe('useFolioStore', () => {
    test('initial state', () => {
      const store = useFolioStore()
      assert.deepEqual(store.folio_transactions, [])
      assert.deepEqual(store.master_folios, [])
      assert.equal(store.loading, false)
      assert.equal(store.error, null)
    })

    test('folio_transactions CRUD', async () => {
      const store = useFolioStore()
      const tx = { id: 'tx1', amount: 100 }

      supabase.from = () => ({ select: () => Promise.resolve({ data: [tx], error: null }) })
      await store.fetchFolioTransactions()
      assert.deepEqual(store.folio_transactions, [tx])
    })

    test('master_folios CRUD', async () => {
      const store = useFolioStore()
      const folio = { id: 'mf1', status: 'open' }

      supabase.from = () => ({ select: () => Promise.resolve({ data: [folio], error: null }) })
      await store.fetchMasterFolios()
      assert.deepEqual(store.master_folios, [folio])
    })
  })
})
