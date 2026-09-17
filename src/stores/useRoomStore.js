import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../composables/useSupabase.js'

export const useRoomStore = defineStore('room', () => {
  const properties = ref([])
  const bed_types = ref([])
  const room_types = ref([])
  const rooms = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Properties CRUD
  async function fetchProperties() {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('properties').select('*')
      if (err) throw err
      properties.value = data || []
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createProperty(propertyData) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('properties').insert(propertyData).select()
      if (err) throw err
      if (data && data.length > 0) {
        properties.value.push(data[0])
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProperty(id, updates) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('properties').update(updates).eq('id', id).select()
      if (err) throw err
      if (data && data.length > 0) {
        const index = properties.value.findIndex(p => p.id === id)
        if (index !== -1) properties.value[index] = data[0]
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteProperty(id) {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase.from('properties').delete().eq('id', id)
      if (err) throw err
      properties.value = properties.value.filter(p => p.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Bed Types CRUD
  async function fetchBedTypes() {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('bed_types').select('*')
      if (err) throw err
      bed_types.value = data || []
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createBedType(bedTypeData) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('bed_types').insert(bedTypeData).select()
      if (err) throw err
      if (data && data.length > 0) {
        bed_types.value.push(data[0])
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateBedType(id, updates) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('bed_types').update(updates).eq('id', id).select()
      if (err) throw err
      if (data && data.length > 0) {
        const index = bed_types.value.findIndex(b => b.id === id)
        if (index !== -1) bed_types.value[index] = data[0]
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteBedType(id) {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase.from('bed_types').delete().eq('id', id)
      if (err) throw err
      bed_types.value = bed_types.value.filter(b => b.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Room Types CRUD
  async function fetchRoomTypes() {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('room_types').select('*')
      if (err) throw err
      room_types.value = data || []
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createRoomType(roomTypeData) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('room_types').insert(roomTypeData).select()
      if (err) throw err
      if (data && data.length > 0) {
        room_types.value.push(data[0])
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateRoomType(id, updates) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('room_types').update(updates).eq('id', id).select()
      if (err) throw err
      if (data && data.length > 0) {
        const index = room_types.value.findIndex(r => r.id === id)
        if (index !== -1) room_types.value[index] = data[0]
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteRoomType(id) {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase.from('room_types').delete().eq('id', id)
      if (err) throw err
      room_types.value = room_types.value.filter(r => r.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Rooms CRUD
  async function fetchRooms() {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('rooms').select('*')
      if (err) throw err
      rooms.value = data || []
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createRoom(roomData) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('rooms').insert(roomData).select()
      if (err) throw err
      if (data && data.length > 0) {
        rooms.value.push(data[0])
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateRoom(id, updates) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('rooms').update(updates).eq('id', id).select()
      if (err) throw err
      if (data && data.length > 0) {
        const index = rooms.value.findIndex(r => r.id === id)
        if (index !== -1) rooms.value[index] = data[0]
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteRoom(id) {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase.from('rooms').delete().eq('id', id)
      if (err) throw err
      rooms.value = rooms.value.filter(r => r.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    properties,
    bed_types,
    room_types,
    rooms,
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
  }
})
