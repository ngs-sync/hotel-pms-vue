import { test, describe, beforeEach } from 'node:test'
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
      assert.deepEqual(store.meal_plans, [])
      assert.deepEqual(store.extra_charges, [])
      assert.deepEqual(store.payment_methods, [])
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

    test('createRoomType sanitizes payload and attaches property_id', async () => {
      const store = useRoomStore()
      let insertedPayload = null
      let fetchCalled = false

      supabase.from = (table) => {
        if (table === 'room_types') {
          return {
            insert: (payload) => {
              insertedPayload = payload
              return {
                select: () => Promise.resolve({ data: [{ id: 'rt_new', ...payload }], error: null })
              }
            },
            select: (cols) => {
              fetchCalled = true
              return Promise.resolve({ data: [{ id: 'rt_new', name: 'Deluxe Suite' }], error: null })
            }
          }
        }
      }

      const validBedTypeId = '123e4567-e89b-12d3-a456-426614174000'
      const formData = {
        name: '   Deluxe Suite   ',
        base_price: '250.50',
        bed_type_id: `  ${validBedTypeId}  `
      }

      await store.createRoomType(formData)

      assert.equal(insertedPayload.property_id, store.activePropertyId)
      assert.equal(insertedPayload.name, 'Deluxe Suite')
      assert.equal(insertedPayload.base_price, 250.5)
      assert.equal(insertedPayload.bed_type_id, validBedTypeId)
      assert.equal(fetchCalled, true)
    })

    test('createRoomType throws error if bed_type_id is invalid/missing', async () => {
      const store = useRoomStore()

      // Invalid bed_type_id
      await assert.rejects(
        async () => {
          await store.createRoomType({ name: 'Standard', base_price: 100, bed_type_id: 'invalid-uuid' })
        },
        /Valid Bed Type selection \(UUID\) is required/
      )

      // Missing bed_type_id
      await assert.rejects(
        async () => {
          await store.createRoomType({ name: 'Standard', base_price: 100, bed_type_id: '' })
        },
        /Valid Bed Type selection \(UUID\) is required/
      )
    })

    test('rooms CRUD and maintenance status update', async () => {
      const store = useRoomStore()
      const room = { id: 'r1', room_number: '101', maintenance_status: 'operational' }

      // Fetch
      supabase.from = () => ({ select: () => Promise.resolve({ data: [room], error: null }) })
      await store.fetchRooms()
      assert.deepEqual(store.rooms, [room])

      // Update maintenance status
      const updatedRoom = { id: 'r1', room_number: '101', maintenance_status: 'under_maintenance' }
      supabase.from = () => ({
        update: () => ({
          eq: () => ({
            select: () => Promise.resolve({ data: [updatedRoom], error: null })
          })
        })
      })
      await store.updateRoom('r1', { maintenance_status: 'under_maintenance' })
      assert.equal(store.rooms[0].maintenance_status, 'under_maintenance')
    })

    test('meal_plans CRUD', async () => {
      const store = useRoomStore()
      const plan = { id: 'mp1', name: 'Bed & Breakfast', code: 'BB' }

      supabase.from = () => ({ select: () => Promise.resolve({ data: [plan], error: null }) })
      await store.fetchMealPlans()
      assert.deepEqual(store.meal_plans, [plan])

      supabase.from = () => ({ delete: () => ({ eq: () => Promise.resolve({ error: null }) }) })
      await store.deleteMealPlan('mp1')
      assert.deepEqual(store.meal_plans, [])
    })

    test('extra_charges CRUD', async () => {
      const store = useRoomStore()
      const charge = { id: 'ec1', name: 'Spa Pass', price: 50 }

      supabase.from = () => ({ select: () => Promise.resolve({ data: [charge], error: null }) })
      await store.fetchExtraCharges()
      assert.deepEqual(store.extra_charges, [charge])
    })

    test('tax_settings update', async () => {
      const store = useRoomStore()
      const newSettings = { sales_tax: 12, city_tax: 4, service_charge: 6, tax_inclusive: true }

      supabase.from = () => ({
        upsert: () => ({
          select: () => Promise.resolve({ data: [newSettings], error: null })
        })
      })
      await store.updateTaxSettings(newSettings)
      assert.equal(store.tax_settings.sales_tax, 12)
      assert.equal(store.tax_settings.tax_inclusive, true)
    })

    test('payment_methods CRUD', async () => {
      const store = useRoomStore()
      const pm = { id: 'pm1', name: 'Credit Card', fee_percentage: 2.5 }

      supabase.from = () => ({ select: () => Promise.resolve({ data: [pm], error: null }) })
      await store.fetchPaymentMethods()
      assert.deepEqual(store.payment_methods, [pm])
    })

    test('invoice_settings update', async () => {
      const store = useRoomStore()
      const newInvoice = { company_name: 'Sunset Resort', invoice_prefix: 'SR-' }

      supabase.from = () => ({
        upsert: () => ({
          select: () => Promise.resolve({ data: [{ ...store.invoice_settings, ...newInvoice }], error: null })
        })
      })
      await store.updateInvoiceSettings(newInvoice)
      assert.equal(store.invoice_settings.company_name, 'Sunset Resort')
      assert.equal(store.invoice_settings.invoice_prefix, 'SR-')
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
