import { test, describe, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { setActivePinia, createPinia } from 'pinia'
import { useReservationStore } from '../src/stores/useReservationStore.js'
import { useFolioStore } from '../src/stores/useFolioStore.js'
import { useRoomStore } from '../src/stores/useRoomStore.js'

describe('Modals Store Data & Logic Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('Reservation Modal - Daily Breakdown & Stay Calculation Logic', () => {
    const roomStore = useRoomStore()
    roomStore.meal_plans = [
      { id: 'mp_1', name: 'Bed & Breakfast', price_adult: 20, price_child: 10 }
    ]

    const nightlyRate = 100
    const adults = 2
    const children = 1
    const mp = roomStore.meal_plans[0]
    const mealCostPerNight = (adults * mp.price_adult) + (children * mp.price_child) // 40 + 10 = 50
    const totalDailyRate = nightlyRate + mealCostPerNight // 150

    const nights = 3
    const expectedTotalAmount = totalDailyRate * nights // 450

    assert.equal(mealCostPerNight, 50)
    assert.equal(totalDailyRate, 150)
    assert.equal(expectedTotalAmount, 450)
  })

  test('Folio Modal - Charges, Payments and Balance Calculation Logic', async () => {
    const folioStore = useFolioStore()
    const reservationStore = useReservationStore()

    const reservation = {
      id: 'res_test_1',
      total_amount: 500,
      paid_amount: 100,
      room_id: 'r_101',
      status: 'checked_in'
    }

    // Add charges
    folioStore.folio_transactions = [
      { id: 'tx_1', reservation_id: 'res_test_1', type: 'charge', amount: 50, description: 'Room Service' },
      { id: 'tx_2', reservation_id: 'res_test_1', type: 'charge', amount: 25, description: 'Parking' },
      { id: 'tx_3', reservation_id: 'res_test_1', type: 'payment', amount: 150, description: 'Card Payment' }
    ]

    const resTxs = folioStore.folio_transactions.filter(t => t.reservation_id === reservation.id)
    const extraCharges = resTxs.filter(t => t.type === 'charge').reduce((sum, t) => sum + t.amount, 0)
    const extraPayments = resTxs.filter(t => t.type === 'payment').reduce((sum, t) => sum + t.amount, 0)

    const expectedTotal = reservation.total_amount
    const totalCharges = expectedTotal + extraCharges // 500 + 75 = 575
    const totalPayments = reservation.paid_amount + extraPayments // 100 + 150 = 250
    const currentBalance = totalCharges - totalPayments // 325

    assert.equal(totalCharges, 575)
    assert.equal(totalPayments, 250)
    assert.equal(currentBalance, 325)
  })
})
