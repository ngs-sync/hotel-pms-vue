import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../composables/useSupabase.js'

export const useFolioStore = defineStore('folio', () => {
  const folio_transactions = ref([])
  const master_folios = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Folio Transactions CRUD
  async function fetchFolioTransactions() {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('folio_transactions').select('*')
      if (err) throw err
      folio_transactions.value = data || []
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createFolioTransaction(transactionData) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('folio_transactions').insert(transactionData).select()
      if (err) throw err
      if (data && data.length > 0) {
        folio_transactions.value.push(data[0])
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateFolioTransaction(id, updates) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('folio_transactions').update(updates).eq('id', id).select()
      if (err) throw err
      if (data && data.length > 0) {
        const index = folio_transactions.value.findIndex(t => t.id === id)
        if (index !== -1) folio_transactions.value[index] = data[0]
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteFolioTransaction(id) {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase.from('folio_transactions').delete().eq('id', id)
      if (err) throw err
      folio_transactions.value = folio_transactions.value.filter(t => t.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Master Folios CRUD
  async function fetchMasterFolios() {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('master_folios').select('*')
      if (err) throw err
      master_folios.value = data || []
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createMasterFolio(folioData) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('master_folios').insert(folioData).select()
      if (err) throw err
      if (data && data.length > 0) {
        master_folios.value.push(data[0])
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateMasterFolio(id, updates) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('master_folios').update(updates).eq('id', id).select()
      if (err) throw err
      if (data && data.length > 0) {
        const index = master_folios.value.findIndex(f => f.id === id)
        if (index !== -1) master_folios.value[index] = data[0]
      }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteMasterFolio(id) {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase.from('master_folios').delete().eq('id', id)
      if (err) throw err
      master_folios.value = master_folios.value.filter(f => f.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    folio_transactions,
    master_folios,
    loading,
    error,
    fetchFolioTransactions,
    createFolioTransaction,
    updateFolioTransaction,
    deleteFolioTransaction,
    fetchMasterFolios,
    createMasterFolio,
    updateMasterFolio,
    deleteMasterFolio,
  }
})
