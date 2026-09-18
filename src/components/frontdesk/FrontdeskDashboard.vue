<template>
  <div class="space-y-6">
    <!-- Top Summary Stats (KPI Cards) -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <!-- Arrivals KPI -->
      <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Today's Arrivals</p>
          <h3 class="text-2xl font-black text-blue-600 mt-1">{{ stats.arrivalsCount }}</h3>
          <p class="text-[11px] text-gray-400 mt-0.5">{{ stats.arrivalsPending }} pending check-in</p>
        </div>
        <div class="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <PhUserCheck class="w-6 h-6" />
        </div>
      </div>

      <!-- In-House KPI -->
      <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">In-House Guests</p>
          <h3 class="text-2xl font-black text-emerald-600 mt-1">{{ stats.inHouseCount }}</h3>
          <p class="text-[11px] text-gray-400 mt-0.5">{{ stats.inHouseRooms }} rooms occupied</p>
        </div>
        <div class="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
          <PhBed class="w-6 h-6" />
        </div>
      </div>

      <!-- Departures KPI -->
      <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Today's Departures</p>
          <h3 class="text-2xl font-black text-amber-600 mt-1">{{ stats.departuresCount }}</h3>
          <p class="text-[11px] text-gray-400 mt-0.5">{{ stats.departuresPending }} awaiting check-out</p>
        </div>
        <div class="p-3 bg-amber-50 text-amber-600 rounded-xl">
          <PhSignOut class="w-6 h-6" />
        </div>
      </div>

      <!-- Group Bookings KPI -->
      <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Group Blocks</p>
          <h3 class="text-2xl font-black text-purple-600 mt-1">{{ stats.groupsCount }}</h3>
          <p class="text-[11px] text-gray-400 mt-0.5">{{ stats.groupRoomsCount }} rooms blocked</p>
        </div>
        <div class="p-3 bg-purple-50 text-purple-600 rounded-xl">
          <PhUsers class="w-6 h-6" />
        </div>
      </div>

      <!-- Occupancy KPI -->
      <div class="col-span-2 md:col-span-4 lg:col-span-1 bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Occupancy Rate</p>
          <h3 class="text-2xl font-black text-gray-900 mt-1">{{ stats.occupancyPct }}%</h3>
          <p class="text-[11px] text-gray-400 mt-0.5">{{ stats.totalRooms }} total rooms</p>
        </div>
        <div class="p-3 bg-gray-100 text-gray-700 rounded-xl">
          <PhHouseLine class="w-6 h-6" />
        </div>
      </div>
    </div>

    <!-- Filter & Date Selection Bar -->
    <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Target Operating Date -->
        <div class="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-700">
          <PhCalendar class="w-4 h-4 text-gray-500" />
          <span class="font-medium text-gray-500">Target Date:</span>
          <input
            type="date"
            v-model="targetDate"
            class="bg-transparent focus:outline-none font-semibold text-gray-900"
          />
        </div>

        <button
          @click="targetDate = todayDateStr"
          class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition"
        >
          Reset Today
        </button>
      </div>

      <div class="flex items-center gap-3">
        <!-- Search Field -->
        <div class="relative flex-1 md:w-64">
          <PhMagnifyingGlass class="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search guest, room #, group..."
            class="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>
    </div>

    <!-- Frontdesk Tabs Navigation -->
    <div class="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
      <div class="border-b border-gray-200 bg-gray-50/50 px-4 pt-2 overflow-x-auto">
        <nav class="flex space-x-6 min-w-max" aria-label="Frontdesk Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 font-bold bg-white shadow-xs'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300 font-medium',
              'whitespace-nowrap py-3 px-4 border-b-2 text-xs flex items-center gap-2 rounded-t-lg transition-all'
            ]"
          >
            <component :is="tab.icon" class="w-4 h-4" />
            <span>{{ tab.label }}</span>
            <span
              :class="[
                activeTab === tab.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-600',
                'ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold'
              ]"
            >
              {{ getTabCount(tab.id) }}
            </span>
          </button>
        </nav>
      </div>

      <!-- TAB 1: Arrival List -->
      <div v-if="activeTab === 'arrivals'" class="p-4 space-y-4">
        <div class="flex items-center justify-between px-2 pt-2">
          <div>
            <h3 class="text-base font-bold text-gray-900">Expected Arrivals</h3>
            <p class="text-xs text-gray-500">Guests arriving on {{ targetDate }}</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-gray-600">
            <thead class="bg-gray-100 text-gray-700 uppercase font-bold text-[10px] tracking-wider border-y border-gray-200">
              <tr>
                <th class="px-4 py-3">Guest Name</th>
                <th class="px-4 py-3">Room Assigned</th>
                <th class="px-4 py-3">Check-In / Out</th>
                <th class="px-4 py-3">Booking Type</th>
                <th class="px-4 py-3">Total Rate</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="res in filteredArrivals" :key="res.id" class="hover:bg-gray-50 transition">
                <td class="px-4 py-3.5 font-bold text-gray-900">
                  {{ res.guest_name }}
                  <p class="text-[10px] text-gray-400 font-normal truncate max-w-xs">{{ res.notes || 'No special requests' }}</p>
                </td>
                <td class="px-4 py-3.5">
                  <span class="font-bold text-gray-800">Room {{ res.room_number || getRoomNumber(res.room_id) }}</span>
                  <span class="text-[10px] text-gray-500 block">{{ getRoomTypeName(res.room_id) }}</span>
                </td>
                <td class="px-4 py-3.5 font-medium text-gray-700">
                  <div>{{ res.check_in_date }} &rarr; {{ res.check_out_date }}</div>
                  <span class="text-[10px] text-gray-400 font-mono">{{ getStayNights(res) }} Night(s)</span>
                </td>
                <td class="px-4 py-3.5">
                  <span v-if="res.booking_type === 'group'" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                    Group: {{ res.group_name || 'Group' }}
                  </span>
                  <span v-else class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700">
                    Individual
                  </span>
                </td>
                <td class="px-4 py-3.5 font-bold text-emerald-600">
                  ${{ Number(res.total_amount || 0).toFixed(2) }}
                </td>
                <td class="px-4 py-3.5">
                  <span
                    :class="[
                      res.status === 'checked_in' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800',
                      'px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase'
                    ]"
                  >
                    {{ res.status }}
                  </span>
                </td>
                <td class="px-4 py-3.5 text-right space-x-2">
                  <button
                    v-if="res.status === 'confirmed'"
                    @click="openCheckInModal(res)"
                    class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-2xs transition"
                  >
                    Check-In
                  </button>
                  <button
                    @click="openFolioModal(res)"
                    class="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs transition border border-blue-200"
                  >
                    Folio
                  </button>
                  <button
                    @click="editReservation(res)"
                    class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg text-xs transition"
                  >
                    Edit
                  </button>
                </td>
              </tr>
              <tr v-if="filteredArrivals.length === 0">
                <td colspan="7" class="px-4 py-8 text-center text-gray-400 italic bg-gray-50/50">
                  No expected arrivals for {{ targetDate }}.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 2: In-House List -->
      <div v-if="activeTab === 'in_house'" class="p-4 space-y-4">
        <div class="flex items-center justify-between px-2 pt-2">
          <div>
            <h3 class="text-base font-bold text-gray-900">In-House Guests</h3>
            <p class="text-xs text-gray-500">Currently checked-in guests in property</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-gray-600">
            <thead class="bg-gray-100 text-gray-700 uppercase font-bold text-[10px] tracking-wider border-y border-gray-200">
              <tr>
                <th class="px-4 py-3">Room #</th>
                <th class="px-4 py-3">Guest Name</th>
                <th class="px-4 py-3">Stay Dates</th>
                <th class="px-4 py-3">Occupants</th>
                <th class="px-4 py-3">Total Amount</th>
                <th class="px-4 py-3">Paid / Folio Balance</th>
                <th class="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="res in filteredInHouse" :key="res.id" class="hover:bg-gray-50 transition">
                <td class="px-4 py-3.5 font-black text-gray-900 text-sm">
                  Room {{ res.room_number || getRoomNumber(res.room_id) }}
                  <span class="text-[10px] text-gray-400 font-normal block">{{ getRoomTypeName(res.room_id) }}</span>
                </td>
                <td class="px-4 py-3.5 font-bold text-gray-900">
                  {{ res.guest_name }}
                  <span v-if="res.booking_type === 'group'" class="text-[10px] text-purple-600 block font-semibold">
                    {{ res.group_name }}
                  </span>
                </td>
                <td class="px-4 py-3.5 font-medium text-gray-700">
                  <div>{{ res.check_in_date }} &rarr; {{ res.check_out_date }}</div>
                  <span class="text-[10px] text-gray-400 font-mono">{{ getStayNights(res) }} Night(s)</span>
                </td>
                <td class="px-4 py-3.5">
                  {{ res.adults || 1 }} Adult(s), {{ res.children || 0 }} Child
                </td>
                <td class="px-4 py-3.5 font-bold text-gray-900">
                  ${{ Number(res.total_amount || 0).toFixed(2) }}
                </td>
                <td class="px-4 py-3.5">
                  <span class="font-semibold text-emerald-600">${{ Number(res.paid_amount || 0).toFixed(2) }} Paid</span>
                  <span
                    v-if="Number(res.total_amount || 0) - Number(res.paid_amount || 0) > 0"
                    class="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 block w-fit mt-0.5"
                  >
                    Due: ${{ (Number(res.total_amount || 0) - Number(res.paid_amount || 0)).toFixed(2) }}
                  </span>
                </td>
                <td class="px-4 py-3.5 text-right space-x-2">
                  <button
                    @click="openCheckOutModal(res)"
                    class="px-3 py-1.5 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg text-xs shadow-2xs transition"
                  >
                    Check-Out
                  </button>
                  <button
                    @click="openFolioModal(res)"
                    class="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs transition border border-blue-200"
                  >
                    Folio
                  </button>
                  <button
                    @click="editReservation(res)"
                    class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg text-xs transition"
                  >
                    Edit
                  </button>
                </td>
              </tr>
              <tr v-if="filteredInHouse.length === 0">
                <td colspan="7" class="px-4 py-8 text-center text-gray-400 italic bg-gray-50/50">
                  No currently in-house guests found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 3: Departure List -->
      <div v-if="activeTab === 'departures'" class="p-4 space-y-4">
        <div class="flex items-center justify-between px-2 pt-2">
          <div>
            <h3 class="text-base font-bold text-gray-900">Expected Departures</h3>
            <p class="text-xs text-gray-500">Guests departing on {{ targetDate }}</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-gray-600">
            <thead class="bg-gray-100 text-gray-700 uppercase font-bold text-[10px] tracking-wider border-y border-gray-200">
              <tr>
                <th class="px-4 py-3">Room #</th>
                <th class="px-4 py-3">Guest Name</th>
                <th class="px-4 py-3">Stay Period</th>
                <th class="px-4 py-3">Total Charge</th>
                <th class="px-4 py-3">Folio Clearance</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="res in filteredDepartures" :key="res.id" class="hover:bg-gray-50 transition">
                <td class="px-4 py-3.5 font-bold text-gray-900 text-sm">
                  Room {{ res.room_number || getRoomNumber(res.room_id) }}
                </td>
                <td class="px-4 py-3.5 font-bold text-gray-900">
                  {{ res.guest_name }}
                </td>
                <td class="px-4 py-3.5 font-medium text-gray-700">
                  {{ res.check_in_date }} &rarr; {{ res.check_out_date }} ({{ getStayNights(res) }} nights)
                </td>
                <td class="px-4 py-3.5 font-bold text-gray-900">
                  ${{ Number(res.total_amount || 0).toFixed(2) }}
                </td>
                <td class="px-4 py-3.5">
                  <span
                    v-if="Number(res.paid_amount || 0) >= Number(res.total_amount || 0)"
                    class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800"
                  >
                    Fully Settled
                  </span>
                  <span v-else class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                    Balance Pending: ${{ (Number(res.total_amount || 0) - Number(res.paid_amount || 0)).toFixed(2) }}
                  </span>
                </td>
                <td class="px-4 py-3.5">
                  <span
                    :class="[
                      res.status === 'checked_out' ? 'bg-gray-200 text-gray-800' : 'bg-emerald-100 text-emerald-800',
                      'px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase'
                    ]"
                  >
                    {{ res.status }}
                  </span>
                </td>
                <td class="px-4 py-3.5 text-right space-x-2">
                  <button
                    v-if="res.status !== 'checked_out'"
                    @click="openCheckOutModal(res)"
                    class="px-3 py-1.5 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg text-xs shadow-2xs transition"
                  >
                    Express Check-Out
                  </button>
                  <button
                    @click="openFolioModal(res)"
                    class="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs transition border border-blue-200"
                  >
                    Folio
                  </button>
                  <button
                    @click="editReservation(res)"
                    class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg text-xs transition"
                  >
                    Edit
                  </button>
                </td>
              </tr>
              <tr v-if="filteredDepartures.length === 0">
                <td colspan="7" class="px-4 py-8 text-center text-gray-400 italic bg-gray-50/50">
                  No expected departures for {{ targetDate }}.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 4: Group Bookings -->
      <div v-if="activeTab === 'groups'" class="p-4 space-y-6">
        <div class="flex items-center justify-between px-2 pt-2">
          <div>
            <h3 class="text-base font-bold text-gray-900">Group Bookings & Corporate Blocks</h3>
            <p class="text-xs text-gray-500">Manage multi-room group allocation blocks</p>
          </div>
        </div>

        <div class="space-y-4">
          <div
            v-for="group in groupBlocks"
            :key="group.group_name"
            class="border border-purple-200 rounded-xl bg-purple-50/30 overflow-hidden shadow-2xs"
          >
            <!-- Group Block Header -->
            <div class="bg-purple-900 text-white p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span class="text-[10px] uppercase tracking-wider font-extrabold text-purple-200 block">Group Block</span>
                <h4 class="text-lg font-bold">{{ group.group_name }}</h4>
                <p class="text-xs text-purple-200 mt-0.5">
                  {{ group.members.length }} Room(s) Blocked &bull; Total Value: ${{ group.totalValue.toFixed(2) }}
                </p>
              </div>

              <div class="flex items-center gap-2">
                <button
                  @click="checkInAllGroup(group)"
                  class="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition"
                >
                  Group Check-In
                </button>
              </div>
            </div>

            <!-- Group Members Table -->
            <div class="overflow-x-auto bg-white">
              <table class="w-full text-left text-xs text-gray-600">
                <thead class="bg-purple-50 text-purple-900 uppercase font-bold text-[10px]">
                  <tr>
                    <th class="px-4 py-2.5">Room</th>
                    <th class="px-4 py-2.5">Guest Name</th>
                    <th class="px-4 py-2.5">Dates</th>
                    <th class="px-4 py-2.5">Status</th>
                    <th class="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="res in group.members" :key="res.id" class="hover:bg-gray-50">
                    <td class="px-4 py-2.5 font-bold text-gray-900">Room {{ res.room_number || getRoomNumber(res.room_id) }}</td>
                    <td class="px-4 py-2.5 font-medium text-gray-800">{{ res.guest_name }}</td>
                    <td class="px-4 py-2.5 text-gray-600">{{ res.check_in_date }} &rarr; {{ res.check_out_date }}</td>
                    <td class="px-4 py-2.5">
                      <span
                        :class="[
                          res.status === 'checked_in' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800',
                          'px-2 py-0.5 rounded text-[10px] font-bold uppercase'
                        ]"
                      >
                        {{ res.status }}
                      </span>
                    </td>
                    <td class="px-4 py-2.5 text-right">
                      <button @click="selectReservation(res)" class="text-blue-600 hover:text-blue-800 font-semibold text-xs">
                        Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-if="groupBlocks.length === 0" class="py-8 text-center text-gray-400 italic bg-gray-50 rounded-xl">
            No active group booking blocks found.
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: Check-In Action Modal -->
    <div v-if="checkInTarget" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100">
        <div class="p-5 bg-emerald-700 text-white flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold">Process Guest Check-In</h3>
            <p class="text-xs text-emerald-100">Confirm room key issue and arrival</p>
          </div>
          <button @click="checkInTarget = null" class="p-1 text-emerald-100 hover:text-white transition">
            <PhX class="w-6 h-6" />
          </button>
        </div>

        <div class="p-6 space-y-4 text-sm text-gray-700">
          <div class="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-1">
            <p class="font-bold text-gray-900 text-base">{{ checkInTarget.guest_name }}</p>
            <p class="text-xs text-gray-600">
              Assigned: <strong class="text-gray-900">Room {{ checkInTarget.room_number || getRoomNumber(checkInTarget.room_id) }}</strong>
            </p>
            <p class="text-xs text-gray-600">
              Stay: {{ checkInTarget.check_in_date }} &rarr; {{ checkInTarget.check_out_date }} ({{ getStayNights(checkInTarget) }} nights)
            </p>
            <p class="text-xs text-emerald-800 font-bold mt-1">
              Total Rate: ${{ Number(checkInTarget.total_amount || 0).toFixed(2) }}
            </p>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-semibold text-gray-700">Room Key Card Status</label>
            <div class="p-3 bg-gray-50 border rounded-lg text-xs text-gray-600 flex items-center justify-between">
              <span>RFID Key Card Programmed</span>
              <span class="text-emerald-600 font-bold">Ready</span>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button @click="checkInTarget = null" class="px-4 py-2 border rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button
              @click="confirmCheckIn"
              class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
            >
              Complete Check-In
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: Check-Out Action Modal -->
    <div v-if="checkOutTarget" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100">
        <div class="p-5 bg-gray-900 text-white flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold">Process Guest Check-Out</h3>
            <p class="text-xs text-gray-400">Folio clearance & key return</p>
          </div>
          <button @click="checkOutTarget = null" class="p-1 text-gray-400 hover:text-white transition">
            <PhX class="w-6 h-6" />
          </button>
        </div>

        <div class="p-6 space-y-4 text-sm text-gray-700">
          <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1">
            <p class="font-bold text-gray-900 text-base">{{ checkOutTarget.guest_name }}</p>
            <p class="text-xs text-gray-600">
              Room {{ checkOutTarget.room_number || getRoomNumber(checkOutTarget.room_id) }}
            </p>
            <div class="flex items-center justify-between pt-2 border-t border-gray-200 mt-2">
              <span class="text-xs text-gray-500">Folio Balance Due:</span>
              <span class="font-extrabold text-emerald-600 text-base">
                ${{ (Number(checkOutTarget.total_amount || 0) - Number(checkOutTarget.paid_amount || 0)).toFixed(2) }}
              </span>
            </div>
          </div>

          <p class="text-xs text-gray-500 italic">
            * Check-out will update room housekeeping status to dirty for cleaning inspection.
          </p>

          <div class="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button @click="checkOutTarget = null" class="px-4 py-2 border rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button
              @click="confirmCheckOut"
              class="px-5 py-2 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-bold shadow-xs transition"
            >
              Confirm Express Check-Out
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Standalone Modal Components -->
    <ReservationModal
      v-model="showReservationModal"
      :reservation="modalReservation"
      @saved="handleReservationSaved"
    />

    <FolioModal
      v-model="showFolioModal"
      :reservation="modalReservation"
      @checkout="handleFolioCheckout"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoomStore } from '../../stores/useRoomStore.js'
import { useReservationStore } from '../../stores/useReservationStore.js'
import ReservationModal from '../modals/ReservationModal.vue'
import FolioModal from '../modals/FolioModal.vue'
import {
  PhUserCheck,
  PhBed,
  PhSignOut,
  PhUsers,
  PhHouseLine,
  PhCalendar,
  PhMagnifyingGlass,
  PhX
} from '@phosphor-icons/vue'

const roomStore = useRoomStore()
const reservationStore = useReservationStore()

const showReservationModal = ref(false)
const showFolioModal = ref(false)
const modalReservation = ref(null)

function getLocalDateStr(offsetDays = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const todayDateStr = getLocalDateStr(0)
const targetDate = ref(todayDateStr)

const activeTab = ref('arrivals')
const searchQuery = ref('')

const selectedRes = ref(null)
const checkInTarget = ref(null)
const checkOutTarget = ref(null)

const tabs = [
  { id: 'arrivals', label: 'Arrival List', icon: PhUserCheck },
  { id: 'in_house', label: 'In-House List', icon: PhBed },
  { id: 'departures', label: 'Departure List', icon: PhSignOut },
  { id: 'groups', label: 'Group Bookings', icon: PhUsers }
]

onMounted(async () => {
  await Promise.allSettled([
    roomStore.fetchRooms(),
    roomStore.fetchRoomTypes(),
    reservationStore.fetchReservations()
  ])
})

// KPI Calculations
const stats = computed(() => {
  const allRes = reservationStore.reservations
  const totalRooms = roomStore.rooms.length || 6

  const arrivalsCount = allRes.filter(r => r.check_in_date === targetDate.value && r.status !== 'cancelled').length
  const arrivalsPending = allRes.filter(r => r.check_in_date === targetDate.value && r.status === 'confirmed').length

  const inHouseRes = allRes.filter(r => r.status === 'checked_in')
  const inHouseCount = inHouseRes.length
  const inHouseRooms = new Set(inHouseRes.map(r => r.room_id)).size

  const departuresCount = allRes.filter(r => r.check_out_date === targetDate.value && r.status !== 'cancelled').length
  const departuresPending = allRes.filter(r => r.check_out_date === targetDate.value && r.status === 'checked_in').length

  const groupRes = allRes.filter(r => r.booking_type === 'group' || r.group_id)
  const uniqueGroups = new Set(groupRes.map(r => r.group_name || r.group_id)).size

  const occupancyPct = totalRooms > 0 ? Math.round((inHouseRooms / totalRooms) * 100) : 0

  return {
    arrivalsCount,
    arrivalsPending,
    inHouseCount,
    inHouseRooms,
    departuresCount,
    departuresPending,
    groupsCount: uniqueGroups,
    groupRoomsCount: groupRes.length,
    occupancyPct,
    totalRooms
  }
})

// Filtered Lists for Tabs
const filteredArrivals = computed(() => {
  return reservationStore.reservations.filter(r => {
    if (r.check_in_date !== targetDate.value || r.status === 'cancelled') return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      const guestMatch = r.guest_name?.toLowerCase().includes(q)
      const roomMatch = String(r.room_number || getRoomNumber(r.room_id)).includes(q)
      const groupMatch = r.group_name?.toLowerCase().includes(q)
      return guestMatch || roomMatch || groupMatch
    }
    return true
  })
})

const filteredInHouse = computed(() => {
  return reservationStore.reservations.filter(r => {
    if (r.status !== 'checked_in') return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      const guestMatch = r.guest_name?.toLowerCase().includes(q)
      const roomMatch = String(r.room_number || getRoomNumber(r.room_id)).includes(q)
      const groupMatch = r.group_name?.toLowerCase().includes(q)
      return guestMatch || roomMatch || groupMatch
    }
    return true
  })
})

const filteredDepartures = computed(() => {
  return reservationStore.reservations.filter(r => {
    if (r.check_out_date !== targetDate.value || r.status === 'cancelled') return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      const guestMatch = r.guest_name?.toLowerCase().includes(q)
      const roomMatch = String(r.room_number || getRoomNumber(r.room_id)).includes(q)
      return guestMatch || roomMatch
    }
    return true
  })
})

const groupBlocks = computed(() => {
  const groupsMap = {}
  const groupRes = reservationStore.reservations.filter(r => r.booking_type === 'group' || r.group_id)

  for (const r of groupRes) {
    const key = r.group_name || r.group_id || 'Group Booking'
    if (!groupsMap[key]) {
      groupsMap[key] = {
        group_name: key,
        members: [],
        totalValue: 0
      }
    }
    groupsMap[key].members.push(r)
    groupsMap[key].totalValue += Number(r.total_amount || 0)
  }

  let list = Object.values(groupsMap)
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(g => g.group_name.toLowerCase().includes(q) || g.members.some(m => m.guest_name.toLowerCase().includes(q)))
  }
  return list
})

function getTabCount(tabId) {
  switch (tabId) {
    case 'arrivals': return filteredArrivals.value.length
    case 'in_house': return filteredInHouse.value.length
    case 'departures': return filteredDepartures.value.length
    case 'groups': return groupBlocks.value.length
    default: return 0
  }
}

// Helpers
function getRoomTypeName(roomId) {
  const room = roomStore.rooms.find(r => r.id === roomId)
  if (!room) return 'Standard'
  const rt = roomStore.room_types.find(r => r.id === room.room_type_id)
  return rt ? rt.name : 'Standard'
}

function getRoomNumber(roomId) {
  const room = roomStore.rooms.find(r => r.id === roomId)
  return room ? room.room_number : ''
}

function getStayNights(res) {
  if (!res.check_in_date || !res.check_out_date) return 1
  const [inY, inM, inD] = res.check_in_date.split('-').map(Number)
  const [outY, outM, outD] = res.check_out_date.split('-').map(Number)
  const dIn = new Date(inY, inM - 1, inD)
  const dOut = new Date(outY, outM - 1, outD)
  return Math.max(1, Math.round((dOut - dIn) / (1000 * 60 * 60 * 24)))
}

function editReservation(res) {
  modalReservation.value = res
  showReservationModal.value = true
}

function openFolioModal(res) {
  modalReservation.value = res
  showFolioModal.value = true
}

function handleReservationSaved() {
  reservationStore.fetchReservations()
}

function handleFolioCheckout() {
  reservationStore.fetchReservations()
}

function openCheckInModal(res) {
  checkInTarget.value = res
}

async function confirmCheckIn() {
  if (!checkInTarget.value) return
  await reservationStore.updateReservation(checkInTarget.value.id, {
    status: 'checked_in',
    paid_amount: checkInTarget.value.total_amount
  })
  checkInTarget.value = null
}

function openCheckOutModal(res) {
  checkOutTarget.value = res
}

async function confirmCheckOut() {
  if (!checkOutTarget.value) return
  await reservationStore.updateReservation(checkOutTarget.value.id, {
    status: 'checked_out',
    paid_amount: checkOutTarget.value.total_amount
  })
  // Update room housekeeping status to dirty
  if (checkOutTarget.value.room_id) {
    await roomStore.updateRoom(checkOutTarget.value.room_id, { housekeeping_status: 'dirty' })
  }
  checkOutTarget.value = null
}

async function checkInAllGroup(group) {
  for (const m of group.members) {
    if (m.status === 'confirmed') {
      await reservationStore.updateReservation(m.id, {
        status: 'checked_in',
        paid_amount: m.total_amount
      })
    }
  }
}
</script>
