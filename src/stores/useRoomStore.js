import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../composables/useSupabase.js'

const isPlaceholder = Boolean(import.meta.env?.VITE_SUPABASE_URL?.includes('placeholder'))

export const useRoomStore = defineStore('room', () => {
  const properties = ref([])
  const bed_types = ref([])
  const room_types = ref([])
  const rooms = ref([])
  const meal_plans = ref([])
  const extra_charges = ref([])
  const tax_settings = ref({
    sales_tax: 10,
    city_tax: 3.5,
    service_charge: 5,
    tax_inclusive: false
  })
  const payment_methods = ref([])
  const invoice_settings = ref({
    company_name: 'Grand Horizon Resort & Spa',
    address: '777 Ocean Drive, Suite 100, Miami, FL 33139',
    phone: '+1 (305) 555-0199',
    email: 'billing@grandhorizon.com',
    tax_id: 'US-987654321',
    invoice_prefix: 'INV-',
    next_number: 10042,
    currency: 'USD',
    notes: 'Thank you for choosing Grand Horizon Resort. Payment is due upon receipt.'
  })
  const loading = ref(false)
  const error = ref(null)

  // Default seed helpers for fallback UI state when DB tables are unpopulated or Supabase is placeholder
  function seedDefaultBedTypes() {
    if (bed_types.value.length === 0) {
      bed_types.value = [
        { id: 'bt_1', name: 'King Bed', code: 'KING', capacity: 2, description: '1 Large King Mattress' },
        { id: 'bt_2', name: 'Queen Bed', code: 'QUEEN', capacity: 2, description: '1 Queen Mattress' },
        { id: 'bt_3', name: 'Twin Beds', code: 'TWIN', capacity: 2, description: '2 Single Twin Mattresses' },
        { id: 'bt_4', name: 'Single Bed', code: 'SINGLE', capacity: 1, description: '1 Single Mattress' }
      ]
    }
  }

  function seedDefaultRoomTypes() {
    if (room_types.value.length === 0) {
      room_types.value = [
        { id: 'rt_1', name: 'Standard King', code: 'STDK', base_price: 150, max_occupancy: 2, bed_type_id: 'bt_1', description: 'Comfortable standard room with king bed' },
        { id: 'rt_2', name: 'Deluxe Double Queen', code: 'DLXQ', base_price: 220, max_occupancy: 4, bed_type_id: 'bt_2', description: 'Spacious deluxe room with two queen beds' },
        { id: 'rt_3', name: 'Executive Suite', code: 'EXSU', base_price: 380, max_occupancy: 4, bed_type_id: 'bt_1', description: 'Luxury suite with ocean view and separate living area' }
      ]
    }
  }

  function seedDefaultRooms() {
    if (rooms.value.length === 0) {
      rooms.value = [
        { id: 'r_101', room_number: '101', floor: 1, room_type_id: 'rt_1', housekeeping_status: 'clean', maintenance_status: 'operational', maintenance_notes: '' },
        { id: 'r_102', room_number: '102', floor: 1, room_type_id: 'rt_1', housekeeping_status: 'dirty', maintenance_status: 'operational', maintenance_notes: '' },
        { id: 'r_103', room_number: '103', floor: 1, room_type_id: 'rt_2', housekeeping_status: 'clean', maintenance_status: 'under_maintenance', maintenance_notes: 'AC unit repair in progress' },
        { id: 'r_201', room_number: '201', floor: 2, room_type_id: 'rt_2', housekeeping_status: 'clean', maintenance_status: 'operational', maintenance_notes: '' },
        { id: 'r_202', room_number: '202', floor: 2, room_type_id: 'rt_3', housekeeping_status: 'inspected', maintenance_status: 'operational', maintenance_notes: '' },
        { id: 'r_203', room_number: '203', floor: 2, room_type_id: 'rt_3', housekeeping_status: 'dirty', maintenance_status: 'out_of_order', maintenance_notes: 'Plumbing leakage inspection needed' }
      ]
    }
  }

  function seedDefaultMealPlans() {
    if (meal_plans.value.length === 0) {
      meal_plans.value = [
        { id: 'mp_1', code: 'RO', name: 'Room Only', price_adult: 0, price_child: 0, breakfast: 0, lunch: 0, dinner: 0, active: true, description: 'No meals included' },
        { id: 'mp_2', code: 'BB', name: 'Bed & Breakfast', price_adult: 25, price_child: 15, breakfast: 25, lunch: 0, dinner: 0, active: true, description: 'Daily breakfast buffet included' },
        { id: 'mp_3', code: 'HB', name: 'Half Board', price_adult: 60, price_child: 35, breakfast: 20, lunch: 0, dinner: 40, active: true, description: 'Breakfast and dinner included' },
        { id: 'mp_4', code: 'FB', name: 'Full Board', price_adult: 90, price_child: 50, breakfast: 20, lunch: 30, dinner: 40, active: true, description: 'Breakfast, lunch and dinner included' },
        { id: 'mp_5', code: 'AI', name: 'All Inclusive', price_adult: 130, price_child: 75, breakfast: 25, lunch: 35, dinner: 50, active: true, description: 'All meals, snacks and unlimited local beverages' }
      ]
    }
  }

  function seedDefaultExtraCharges() {
    if (extra_charges.value.length === 0) {
      extra_charges.value = [
        { id: 'ec_1', name: 'Airport Transfer (One Way)', price: 50, pricing_type: 'fixed', category: 'Transportation', active: true, description: 'Private sedan pickup/dropoff' },
        { id: 'ec_2', name: 'Extra Rollaway Bed', price: 30, pricing_type: 'per_night', category: 'Room Amenities', active: true, description: 'Additional comfortable single bed' },
        { id: 'ec_3', name: 'Late Check-out (until 3 PM)', price: 45, pricing_type: 'fixed', category: 'Room Amenities', active: true, description: 'Extended room stay' },
        { id: 'ec_4', name: 'Spa Day Pass', price: 120, pricing_type: 'per_guest', category: 'Wellness', active: true, description: 'Full access to sauna, pool, and massage facility' },
        { id: 'ec_5', name: 'Daily Valet Parking', price: 25, pricing_type: 'per_night', category: 'Parking', active: true, description: 'Secure underground parking' }
      ]
    }
  }

  function seedDefaultPaymentMethods() {
    if (payment_methods.value.length === 0) {
      payment_methods.value = [
        { id: 'pm_1', name: 'Credit Card (Visa / Mastercard)', fee_percentage: 2.5, is_default: true, active: true, description: 'Standard card terminal processing' },
        { id: 'pm_2', name: 'Cash', fee_percentage: 0, is_default: false, active: true, description: 'Direct cash payment at frontdesk' },
        { id: 'pm_3', name: 'Bank Transfer / Wire', fee_percentage: 0, is_default: false, active: true, description: 'Direct wire transfer to hotel account' },
        { id: 'pm_4', name: 'Corporate Billing / City Ledger', fee_percentage: 0, is_default: false, active: true, description: 'Direct invoice to corporate partner' },
        { id: 'pm_5', name: 'Digital Wallet (Apple / Google Pay)', fee_percentage: 1.5, is_default: false, active: true, description: 'Contactless mobile payment' }
      ]
    }
  }

  // Properties CRUD
  async function fetchProperties() {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('properties').select('*')
      if (err) throw err
      properties.value = data || []
      return data
    } catch (err) {
      error.value = err.message
      return properties.value
    } finally {
      loading.value = false
    }
  }

  async function createProperty(propertyData) {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('properties').insert(propertyData).select()
      if (err) throw err
      if (data && data.length > 0) {
        properties.value.push(data[0])
        return data
      }
    } catch (err) {
      error.value = err.message
      const newItem = { id: 'prop_' + Date.now(), ...propertyData }
      properties.value.push(newItem)
      return [newItem]
    } finally {
      loading.value = false
    }
  }

  async function updateProperty(id, updates) {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('properties').update(updates).eq('id', id).select()
      if (err) throw err
      if (data && data.length > 0) {
        const index = properties.value.findIndex(p => p.id === id)
        if (index !== -1) properties.value[index] = data[0]
        return data
      }
    } catch (err) {
      error.value = err.message
      const index = properties.value.findIndex(p => p.id === id)
      if (index !== -1) {
        properties.value[index] = { ...properties.value[index], ...updates }
      }
      return [properties.value[index]]
    } finally {
      loading.value = false
    }
  }

  async function deleteProperty(id) {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { error: err } = await supabase.from('properties').delete().eq('id', id)
      if (err) throw err
      properties.value = properties.value.filter(p => p.id !== id)
    } catch (err) {
      error.value = err.message
      properties.value = properties.value.filter(p => p.id !== id)
    } finally {
      loading.value = false
    }
  }

  // Bed Types CRUD
  async function fetchBedTypes() {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('bed_types').select('*')
      if (err) throw err
      if (data && data.length > 0) {
        bed_types.value = data
      } else {
        seedDefaultBedTypes()
      }
      return bed_types.value
    } catch (err) {
      error.value = err.message
      seedDefaultBedTypes()
      return bed_types.value
    } finally {
      loading.value = false
    }
  }

  async function createBedType(bedTypeData) {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('bed_types').insert(bedTypeData).select()
      if (err) throw err
      if (data && data.length > 0) {
        bed_types.value.push(data[0])
        return data
      }
    } catch (err) {
      error.value = err.message
      const newItem = { id: 'bt_' + Date.now(), ...bedTypeData }
      bed_types.value.push(newItem)
      return [newItem]
    } finally {
      loading.value = false
    }
  }

  async function updateBedType(id, updates) {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('bed_types').update(updates).eq('id', id).select()
      if (err) throw err
      if (data && data.length > 0) {
        const index = bed_types.value.findIndex(b => b.id === id)
        if (index !== -1) bed_types.value[index] = data[0]
        return data
      }
    } catch (err) {
      error.value = err.message
      const index = bed_types.value.findIndex(b => b.id === id)
      if (index !== -1) {
        bed_types.value[index] = { ...bed_types.value[index], ...updates }
      }
      return [bed_types.value[index]]
    } finally {
      loading.value = false
    }
  }

  async function deleteBedType(id) {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { error: err } = await supabase.from('bed_types').delete().eq('id', id)
      if (err) throw err
      bed_types.value = bed_types.value.filter(b => b.id !== id)
    } catch (err) {
      error.value = err.message
      bed_types.value = bed_types.value.filter(b => b.id !== id)
    } finally {
      loading.value = false
    }
  }

  // Room Types CRUD
  async function fetchRoomTypes() {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('room_types').select('*')
      if (err) throw err
      if (data && data.length > 0) {
        room_types.value = data
      } else {
        seedDefaultRoomTypes()
      }
      return room_types.value
    } catch (err) {
      error.value = err.message
      seedDefaultRoomTypes()
      return room_types.value
    } finally {
      loading.value = false
    }
  }

  async function createRoomType(roomTypeData) {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('room_types').insert(roomTypeData).select()
      if (err) throw err
      if (data && data.length > 0) {
        room_types.value.push(data[0])
        return data
      }
    } catch (err) {
      error.value = err.message
      const newItem = { id: 'rt_' + Date.now(), ...roomTypeData }
      room_types.value.push(newItem)
      return [newItem]
    } finally {
      loading.value = false
    }
  }

  async function updateRoomType(id, updates) {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('room_types').update(updates).eq('id', id).select()
      if (err) throw err
      if (data && data.length > 0) {
        const index = room_types.value.findIndex(r => r.id === id)
        if (index !== -1) room_types.value[index] = data[0]
        return data
      }
    } catch (err) {
      error.value = err.message
      const index = room_types.value.findIndex(r => r.id === id)
      if (index !== -1) {
        room_types.value[index] = { ...room_types.value[index], ...updates }
      }
      return [room_types.value[index]]
    } finally {
      loading.value = false
    }
  }

  async function deleteRoomType(id) {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { error: err } = await supabase.from('room_types').delete().eq('id', id)
      if (err) throw err
      room_types.value = room_types.value.filter(r => r.id !== id)
    } catch (err) {
      error.value = err.message
      room_types.value = room_types.value.filter(r => r.id !== id)
    } finally {
      loading.value = false
    }
  }

  // Rooms CRUD
  async function fetchRooms() {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('rooms').select('*')
      if (err) throw err
      if (data && data.length > 0) {
        rooms.value = data
      } else {
        seedDefaultRooms()
      }
      return rooms.value
    } catch (err) {
      error.value = err.message
      seedDefaultRooms()
      return rooms.value
    } finally {
      loading.value = false
    }
  }

  async function createRoom(roomData) {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('rooms').insert(roomData).select()
      if (err) throw err
      if (data && data.length > 0) {
        rooms.value.push(data[0])
        return data
      }
    } catch (err) {
      error.value = err.message
      const newItem = { id: 'r_' + Date.now(), ...roomData }
      rooms.value.push(newItem)
      return [newItem]
    } finally {
      loading.value = false
    }
  }

  async function updateRoom(id, updates) {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('rooms').update(updates).eq('id', id).select()
      if (err) throw err
      if (data && data.length > 0) {
        const index = rooms.value.findIndex(r => r.id === id)
        if (index !== -1) rooms.value[index] = data[0]
        return data
      }
    } catch (err) {
      error.value = err.message
      const index = rooms.value.findIndex(r => r.id === id)
      if (index !== -1) {
        rooms.value[index] = { ...rooms.value[index], ...updates }
      }
      return [rooms.value[index]]
    } finally {
      loading.value = false
    }
  }

  async function deleteRoom(id) {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { error: err } = await supabase.from('rooms').delete().eq('id', id)
      if (err) throw err
      rooms.value = rooms.value.filter(r => r.id !== id)
    } catch (err) {
      error.value = err.message
      rooms.value = rooms.value.filter(r => r.id !== id)
    } finally {
      loading.value = false
    }
  }

  // Meal Plans CRUD
  async function fetchMealPlans() {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('meal_plans').select('*')
      if (err) throw err
      if (data && data.length > 0) {
        meal_plans.value = data
      } else {
        seedDefaultMealPlans()
      }
      return meal_plans.value
    } catch (err) {
      error.value = err.message
      seedDefaultMealPlans()
      return meal_plans.value
    } finally {
      loading.value = false
    }
  }

  async function createMealPlan(planData) {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('meal_plans').insert(planData).select()
      if (err) throw err
      if (data && data.length > 0) {
        meal_plans.value.push(data[0])
        return data
      }
    } catch (err) {
      error.value = err.message
      const newItem = { id: 'mp_' + Date.now(), ...planData }
      meal_plans.value.push(newItem)
      return [newItem]
    } finally {
      loading.value = false
    }
  }

  async function updateMealPlan(id, updates) {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('meal_plans').update(updates).eq('id', id).select()
      if (err) throw err
      if (data && data.length > 0) {
        const index = meal_plans.value.findIndex(m => m.id === id)
        if (index !== -1) meal_plans.value[index] = data[0]
        return data
      }
    } catch (err) {
      error.value = err.message
      const index = meal_plans.value.findIndex(m => m.id === id)
      if (index !== -1) {
        meal_plans.value[index] = { ...meal_plans.value[index], ...updates }
      }
      return [meal_plans.value[index]]
    } finally {
      loading.value = false
    }
  }

  async function deleteMealPlan(id) {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { error: err } = await supabase.from('meal_plans').delete().eq('id', id)
      if (err) throw err
      meal_plans.value = meal_plans.value.filter(m => m.id !== id)
    } catch (err) {
      error.value = err.message
      meal_plans.value = meal_plans.value.filter(m => m.id !== id)
    } finally {
      loading.value = false
    }
  }

  // Extra Charges CRUD
  async function fetchExtraCharges() {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('extra_charges').select('*')
      if (err) throw err
      if (data && data.length > 0) {
        extra_charges.value = data
      } else {
        seedDefaultExtraCharges()
      }
      return extra_charges.value
    } catch (err) {
      error.value = err.message
      seedDefaultExtraCharges()
      return extra_charges.value
    } finally {
      loading.value = false
    }
  }

  async function createExtraCharge(chargeData) {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('extra_charges').insert(chargeData).select()
      if (err) throw err
      if (data && data.length > 0) {
        extra_charges.value.push(data[0])
        return data
      }
    } catch (err) {
      error.value = err.message
      const newItem = { id: 'ec_' + Date.now(), ...chargeData }
      extra_charges.value.push(newItem)
      return [newItem]
    } finally {
      loading.value = false
    }
  }

  async function updateExtraCharge(id, updates) {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('extra_charges').update(updates).eq('id', id).select()
      if (err) throw err
      if (data && data.length > 0) {
        const index = extra_charges.value.findIndex(e => e.id === id)
        if (index !== -1) extra_charges.value[index] = data[0]
        return data
      }
    } catch (err) {
      error.value = err.message
      const index = extra_charges.value.findIndex(e => e.id === id)
      if (index !== -1) {
        extra_charges.value[index] = { ...extra_charges.value[index], ...updates }
      }
      return [extra_charges.value[index]]
    } finally {
      loading.value = false
    }
  }

  async function deleteExtraCharge(id) {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { error: err } = await supabase.from('extra_charges').delete().eq('id', id)
      if (err) throw err
      extra_charges.value = extra_charges.value.filter(e => e.id !== id)
    } catch (err) {
      error.value = err.message
      extra_charges.value = extra_charges.value.filter(e => e.id !== id)
    } finally {
      loading.value = false
    }
  }

  // Tax Settings CRUD
  async function fetchTaxSettings() {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('tax_settings').select('*').single()
      if (err) throw err
      if (data) {
        tax_settings.value = data
      }
      return tax_settings.value
    } catch (err) {
      error.value = err.message
      return tax_settings.value
    } finally {
      loading.value = false
    }
  }

  async function updateTaxSettings(updates) {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('tax_settings').upsert({ id: 1, ...updates }).select()
      if (err) throw err
      if (data && data.length > 0) {
        tax_settings.value = data[0]
        return data[0]
      }
    } catch (err) {
      error.value = err.message
      tax_settings.value = { ...tax_settings.value, ...updates }
      return tax_settings.value
    } finally {
      loading.value = false
    }
  }

  // Payment Methods CRUD
  async function fetchPaymentMethods() {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('payment_methods').select('*')
      if (err) throw err
      if (data && data.length > 0) {
        payment_methods.value = data
      } else {
        seedDefaultPaymentMethods()
      }
      return payment_methods.value
    } catch (err) {
      error.value = err.message
      seedDefaultPaymentMethods()
      return payment_methods.value
    } finally {
      loading.value = false
    }
  }

  async function createPaymentMethod(methodData) {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('payment_methods').insert(methodData).select()
      if (err) throw err
      if (data && data.length > 0) {
        payment_methods.value.push(data[0])
        return data
      }
    } catch (err) {
      error.value = err.message
      const newItem = { id: 'pm_' + Date.now(), ...methodData }
      payment_methods.value.push(newItem)
      return [newItem]
    } finally {
      loading.value = false
    }
  }

  async function updatePaymentMethod(id, updates) {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('payment_methods').update(updates).eq('id', id).select()
      if (err) throw err
      if (data && data.length > 0) {
        const index = payment_methods.value.findIndex(p => p.id === id)
        if (index !== -1) payment_methods.value[index] = data[0]
        return data
      }
    } catch (err) {
      error.value = err.message
      const index = payment_methods.value.findIndex(p => p.id === id)
      if (index !== -1) {
        payment_methods.value[index] = { ...payment_methods.value[index], ...updates }
      }
      return [payment_methods.value[index]]
    } finally {
      loading.value = false
    }
  }

  async function deletePaymentMethod(id) {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { error: err } = await supabase.from('payment_methods').delete().eq('id', id)
      if (err) throw err
      payment_methods.value = payment_methods.value.filter(p => p.id !== id)
    } catch (err) {
      error.value = err.message
      payment_methods.value = payment_methods.value.filter(p => p.id !== id)
    } finally {
      loading.value = false
    }
  }

  // Invoice Settings CRUD
  async function fetchInvoiceSettings() {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('invoice_settings').select('*').single()
      if (err) throw err
      if (data) {
        invoice_settings.value = data
      }
      return invoice_settings.value
    } catch (err) {
      error.value = err.message
      return invoice_settings.value
    } finally {
      loading.value = false
    }
  }

  async function updateInvoiceSettings(updates) {
    loading.value = true
    error.value = null
    try {
      if (isPlaceholder) throw new Error('Placeholder Supabase Endpoint')
      const { data, error: err } = await supabase.from('invoice_settings').upsert({ id: 1, ...updates }).select()
      if (err) throw err
      if (data && data.length > 0) {
        invoice_settings.value = data[0]
        return data[0]
      }
    } catch (err) {
      error.value = err.message
      invoice_settings.value = { ...invoice_settings.value, ...updates }
      return invoice_settings.value
    } finally {
      loading.value = false
    }
  }

  return {
    properties,
    bed_types,
    room_types,
    rooms,
    meal_plans,
    extra_charges,
    tax_settings,
    payment_methods,
    invoice_settings,
    loading,
    error,
    fetchProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    fetchBedTypes,
    createBedType,
    updateBedType,
    deleteBedType,
    fetchRoomTypes,
    createRoomType,
    updateRoomType,
    deleteRoomType,
    fetchRooms,
    createRoom,
    updateRoom,
    deleteRoom,
    fetchMealPlans,
    createMealPlan,
    updateMealPlan,
    deleteMealPlan,
    fetchExtraCharges,
    createExtraCharge,
    updateExtraCharge,
    deleteExtraCharge,
    fetchTaxSettings,
    updateTaxSettings,
    fetchPaymentMethods,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    fetchInvoiceSettings,
    updateInvoiceSettings
  }
})
