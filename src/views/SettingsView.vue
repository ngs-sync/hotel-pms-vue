<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Property Settings & Configuration</h1>
        <p class="text-sm text-gray-500 mt-1">Manage rooms, bed types, meal plans, extra charges, taxes, and invoicing preferences.</p>
      </div>
      <div v-if="roomStore.loading" class="flex items-center text-blue-600 text-sm font-medium gap-2">
        <svg class="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Processing...</span>
      </div>
    </div>

    <!-- Notification / Toast Message -->
    <div v-if="notificationMessage" class="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between">
      <span>{{ notificationMessage }}</span>
      <button @click="notificationMessage = ''" class="text-emerald-600 hover:text-emerald-900 font-bold ml-4">&times;</button>
    </div>

    <!-- Navigation Tabs -->
    <div class="border-b border-gray-200 overflow-x-auto">
      <nav class="flex space-x-8 min-w-max" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            activeTab === tab.id
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium',
            'whitespace-nowrap py-3 px-1 border-b-2 text-sm flex items-center gap-2 transition-colors'
          ]"
        >
          <component :is="tab.icon" class="w-5 h-5" />
          <span>{{ tab.name }}</span>
        </button>
      </nav>
    </div>

    <!-- TAB 1: Room Types & Bed Types -->
    <div v-if="activeTab === 'room_bed_types'" class="space-y-8">
      <!-- Section 1: Room Types -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Room Types</h2>
            <p class="text-xs text-gray-500">Define available categories, pricing, and bed allocation for rooms.</p>
          </div>
          <button
            @click="openRoomTypeModal()"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 self-start sm:self-auto"
          >
            <PhPlus class="w-4 h-4" /> Add Room Type
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-600">
            <thead class="bg-gray-50 text-xs text-gray-700 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th class="px-4 py-3">Code</th>
                <th class="px-4 py-3">Name</th>
                <th class="px-4 py-3">Base Price</th>
                <th class="px-4 py-3">Max Occupancy</th>
                <th class="px-4 py-3">Bed Type</th>
                <th class="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="rt in roomStore.room_types" :key="rt.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 font-mono text-xs font-semibold text-gray-800">{{ rt.code }}</td>
                <td class="px-4 py-3 font-medium text-gray-900">
                  {{ rt.name }}
                  <p class="text-xs text-gray-400 font-normal truncate max-w-xs">{{ rt.description }}</p>
                </td>
                <td class="px-4 py-3 font-semibold text-emerald-600">${{ Number(rt.base_price || 0).toFixed(2) }}</td>
                <td class="px-4 py-3">{{ rt.max_occupancy }} Guests</td>
                <td class="px-4 py-3">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    {{ getBedTypeName(rt.bed_type_id) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right space-x-2">
                  <button @click="openRoomTypeModal(rt)" class="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</button>
                  <button @click="handleDeleteRoomType(rt.id)" class="text-rose-600 hover:text-rose-800 text-xs font-medium">Delete</button>
                </td>
              </tr>
              <tr v-if="roomStore.room_types.length === 0">
                <td colspan="6" class="px-4 py-6 text-center text-gray-400 italic">No room types added yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 2: Bed Types -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Bed Types</h2>
            <p class="text-xs text-gray-500">Configure bed configurations and sleeping capacity standards.</p>
          </div>
          <button
            @click="openBedTypeModal()"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 self-start sm:self-auto"
          >
            <PhPlus class="w-4 h-4" /> Add Bed Type
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-600">
            <thead class="bg-gray-50 text-xs text-gray-700 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th class="px-4 py-3">Code</th>
                <th class="px-4 py-3">Name</th>
                <th class="px-4 py-3">Capacity</th>
                <th class="px-4 py-3">Description</th>
                <th class="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="bt in roomStore.bed_types" :key="bt.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 font-mono text-xs font-semibold text-gray-800">{{ bt.code }}</td>
                <td class="px-4 py-3 font-medium text-gray-900">{{ bt.name }}</td>
                <td class="px-4 py-3">{{ bt.capacity }} Person(s)</td>
                <td class="px-4 py-3 text-xs text-gray-500 max-w-sm truncate">{{ bt.description || '—' }}</td>
                <td class="px-4 py-3 text-right space-x-2">
                  <button @click="openBedTypeModal(bt)" class="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</button>
                  <button @click="handleDeleteBedType(bt.id)" class="text-rose-600 hover:text-rose-800 text-xs font-medium">Delete</button>
                </td>
              </tr>
              <tr v-if="roomStore.bed_types.length === 0">
                <td colspan="5" class="px-4 py-6 text-center text-gray-400 italic">No bed types added yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 2: Rooms Grid & Maintenance Status -->
    <div v-if="activeTab === 'rooms_grid'" class="space-y-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Rooms Grid & Operational Maintenance Status</h2>
            <p class="text-xs text-gray-500">Monitor room availability, change maintenance status, and add new room units.</p>
          </div>
          <button
            @click="openRoomModal()"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 self-start sm:self-auto"
          >
            <PhPlus class="w-4 h-4" /> Add Room
          </button>
        </div>

        <!-- Filter bar -->
        <div class="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100">
          <label class="text-xs font-medium text-gray-500">Filter Status:</label>
          <select v-model="roomFilter" class="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-700">
            <option value="all">All Statuses</option>
            <option value="operational">Operational</option>
            <option value="under_maintenance">Under Maintenance</option>
            <option value="out_of_order">Out of Order</option>
          </select>
        </div>

        <!-- Rooms Grid Display -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="room in filteredRooms"
            :key="room.id"
            class="border rounded-xl p-4 transition shadow-sm hover:shadow-md flex flex-col justify-between space-y-3 bg-white"
            :class="[
              room.maintenance_status === 'operational' ? 'border-gray-200' :
              room.maintenance_status === 'under_maintenance' ? 'border-amber-300 bg-amber-50/20' :
              'border-rose-300 bg-rose-50/20'
            ]"
          >
            <div>
              <div class="flex items-center justify-between">
                <span class="text-xl font-bold text-gray-900">Room {{ room.room_number }}</span>
                <span class="text-xs px-2 py-0.5 rounded-full font-medium" :class="getHousekeepingBadgeClass(room.housekeeping_status)">
                  {{ room.housekeeping_status }}
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-1">Floor {{ room.floor || 1 }} &bull; {{ getRoomTypeName(room.room_type_id) }}</p>
            </div>

            <div class="space-y-2 pt-2 border-t border-gray-100">
              <label class="text-xs font-semibold text-gray-600 block">Maintenance Status:</label>
              <select
                :value="room.maintenance_status || 'operational'"
                @change="handleQuickMaintenanceChange(room, $event.target.value)"
                class="w-full text-xs border rounded-lg p-1.5 font-medium transition"
                :class="[
                  room.maintenance_status === 'operational' ? 'border-emerald-300 text-emerald-800 bg-emerald-50' :
                  room.maintenance_status === 'under_maintenance' ? 'border-amber-300 text-amber-800 bg-amber-50' :
                  'border-rose-300 text-rose-800 bg-rose-50'
                ]"
              >
                <option value="operational">Operational</option>
                <option value="under_maintenance">Under Maintenance</option>
                <option value="out_of_order">Out of Order</option>
              </select>

              <p v-if="room.maintenance_notes" class="text-xs italic text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                "{{ room.maintenance_notes }}"
              </p>
            </div>

            <div class="flex items-center justify-end space-x-2 pt-2 text-xs">
              <button @click="openRoomModal(room)" class="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
              <span class="text-gray-300">&bull;</span>
              <button @click="handleDeleteRoom(room.id)" class="text-rose-600 hover:text-rose-800 font-medium">Delete</button>
            </div>
          </div>

          <div v-if="filteredRooms.length === 0" class="col-span-full py-12 text-center text-gray-400 italic bg-gray-50 rounded-xl">
            No rooms match the selected criteria.
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: Meal Plans & Breakdowns -->
    <div v-if="activeTab === 'meal_plans'" class="space-y-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Meal Plans & Revenue Breakdown</h2>
            <p class="text-xs text-gray-500">Configure board packages, pricing per guest, and accounting breakdown (Breakfast / Lunch / Dinner).</p>
          </div>
          <button
            @click="openMealPlanModal()"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 self-start sm:self-auto"
          >
            <PhPlus class="w-4 h-4" /> Add Meal Plan
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-600">
            <thead class="bg-gray-50 text-xs text-gray-700 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th class="px-4 py-3">Code</th>
                <th class="px-4 py-3">Meal Plan Name</th>
                <th class="px-4 py-3">Adult Price / Day</th>
                <th class="px-4 py-3">Child Price / Day</th>
                <th class="px-4 py-3">Breakdown (B / L / D)</th>
                <th class="px-4 py-3 text-center">Status</th>
                <th class="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="mp in roomStore.meal_plans" :key="mp.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 font-mono text-xs font-bold text-gray-900">{{ mp.code }}</td>
                <td class="px-4 py-3 font-medium text-gray-900">
                  {{ mp.name }}
                  <p class="text-xs text-gray-400 font-normal truncate max-w-xs">{{ mp.description }}</p>
                </td>
                <td class="px-4 py-3 font-semibold text-emerald-600">${{ Number(mp.price_adult || 0).toFixed(2) }}</td>
                <td class="px-4 py-3 font-medium text-gray-700">${{ Number(mp.price_child || 0).toFixed(2) }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2 text-xs font-mono">
                    <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">B: ${{ Number(mp.breakfast || 0).toFixed(0) }}</span>
                    <span class="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">L: ${{ Number(mp.lunch || 0).toFixed(0) }}</span>
                    <span class="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">D: ${{ Number(mp.dinner || 0).toFixed(0) }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-center">
                  <span
                    :class="[
                      mp.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200',
                      'inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border'
                    ]"
                  >
                    {{ mp.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right space-x-2">
                  <button @click="openMealPlanModal(mp)" class="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</button>
                  <button @click="handleDeleteMealPlan(mp.id)" class="text-rose-600 hover:text-rose-800 text-xs font-medium">Delete</button>
                </td>
              </tr>
              <tr v-if="roomStore.meal_plans.length === 0">
                <td colspan="7" class="px-4 py-6 text-center text-gray-400 italic">No meal plans configured yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 4: Extra Charges & Tax/Service Menu -->
    <div v-if="activeTab === 'extra_charges_tax'" class="space-y-8">
      <!-- Section 1: Extra Charges Menu -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Extra Charges Menu</h2>
            <p class="text-xs text-gray-500">Configure ancillary items, transfer services, and add-on charges available on guest folios.</p>
          </div>
          <button
            @click="openExtraChargeModal()"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 self-start sm:self-auto"
          >
            <PhPlus class="w-4 h-4" /> Add Extra Charge
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-600">
            <thead class="bg-gray-50 text-xs text-gray-700 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th class="px-4 py-3">Charge Item</th>
                <th class="px-4 py-3">Category</th>
                <th class="px-4 py-3">Pricing Type</th>
                <th class="px-4 py-3">Rate / Price</th>
                <th class="px-4 py-3 text-center">Status</th>
                <th class="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="ec in roomStore.extra_charges" :key="ec.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 font-medium text-gray-900">
                  {{ ec.name }}
                  <p class="text-xs text-gray-400 font-normal truncate max-w-xs">{{ ec.description }}</p>
                </td>
                <td class="px-4 py-3 text-xs text-gray-600 font-medium">{{ ec.category || 'General' }}</td>
                <td class="px-4 py-3 text-xs capitalize text-gray-500">{{ (ec.pricing_type || 'fixed').replace('_', ' ') }}</td>
                <td class="px-4 py-3 font-semibold text-emerald-600">${{ Number(ec.price || 0).toFixed(2) }}</td>
                <td class="px-4 py-3 text-center">
                  <span
                    :class="[
                      ec.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200',
                      'inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border'
                    ]"
                  >
                    {{ ec.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right space-x-2">
                  <button @click="openExtraChargeModal(ec)" class="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</button>
                  <button @click="handleDeleteExtraCharge(ec.id)" class="text-rose-600 hover:text-rose-800 text-xs font-medium">Delete</button>
                </td>
              </tr>
              <tr v-if="roomStore.extra_charges.length === 0">
                <td colspan="6" class="px-4 py-6 text-center text-gray-400 italic">No extra charges added yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 2: Tax & Service Charge Settings -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Tax & Service Charge Configuration</h2>
          <p class="text-xs text-gray-500">Configure global sales tax percentages, municipal city taxes, and service fees applied to master folios.</p>
        </div>

        <form @submit.prevent="handleSaveTaxSettings" class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">State / VAT Sales Tax (%)</label>
            <div class="relative rounded-md shadow-sm">
              <input
                v-model.number="taxForm.sales_tax"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 text-xs">%</div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">City / Municipal Tourism Tax (%)</label>
            <div class="relative rounded-md shadow-sm">
              <input
                v-model.number="taxForm.city_tax"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 text-xs">%</div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Property Service Charge (%)</label>
            <div class="relative rounded-md shadow-sm">
              <input
                v-model.number="taxForm.service_charge"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 text-xs">%</div>
            </div>
          </div>

          <div class="md:col-span-3 flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <input
              id="tax_inclusive"
              v-model="taxForm.tax_inclusive"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="tax_inclusive" class="text-xs font-medium text-gray-800">
              Tax Inclusive Pricing (Displayed prices already include taxes and service fees)
            </label>
          </div>

          <div class="md:col-span-3">
            <button
              type="submit"
              class="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
            >
              Save Tax & Service Settings
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- TAB 5: Payment Methods & Invoice Settings -->
    <div v-if="activeTab === 'payment_invoice'" class="space-y-8">
      <!-- Section 1: Accepted Payment Methods -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Payment Methods & Gateway Rules</h2>
            <p class="text-xs text-gray-500">Configure accepted payment channels, transaction fee surcharges, and default method.</p>
          </div>
          <button
            @click="openPaymentMethodModal()"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 self-start sm:self-auto"
          >
            <PhPlus class="w-4 h-4" /> Add Payment Method
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-600">
            <thead class="bg-gray-50 text-xs text-gray-700 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th class="px-4 py-3">Payment Method Name</th>
                <th class="px-4 py-3">Fee / Surcharge (%)</th>
                <th class="px-4 py-3 text-center">Default Method</th>
                <th class="px-4 py-3 text-center">Status</th>
                <th class="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="pm in roomStore.payment_methods" :key="pm.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 font-medium text-gray-900">
                  {{ pm.name }}
                  <p class="text-xs text-gray-400 font-normal truncate max-w-xs">{{ pm.description }}</p>
                </td>
                <td class="px-4 py-3 font-mono text-xs text-gray-700">{{ pm.fee_percentage ? pm.fee_percentage + '%' : '0%' }}</td>
                <td class="px-4 py-3 text-center">
                  <span v-if="pm.is_default" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                    Default
                  </span>
                  <span v-else class="text-xs text-gray-400">—</span>
                </td>
                <td class="px-4 py-3 text-center">
                  <span
                    :class="[
                      pm.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200',
                      'inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border'
                    ]"
                  >
                    {{ pm.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right space-x-2">
                  <button @click="openPaymentMethodModal(pm)" class="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</button>
                  <button @click="handleDeletePaymentMethod(pm.id)" class="text-rose-600 hover:text-rose-800 text-xs font-medium">Delete</button>
                </td>
              </tr>
              <tr v-if="roomStore.payment_methods.length === 0">
                <td colspan="5" class="px-4 py-6 text-center text-gray-400 italic">No payment methods configured yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 2: Invoice & Billing Settings -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Invoice Header & Billing Template Settings</h2>
          <p class="text-xs text-gray-500">Configure business address, tax registration number, and default invoice remarks printed on folio receipts.</p>
        </div>

        <form @submit.prevent="handleSaveInvoiceSettings" class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Company / Legal Property Name</label>
            <input
              v-model="invoiceForm.company_name"
              type="text"
              required
              class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Tax ID / Business Registration Number</label>
            <input
              v-model="invoiceForm.tax_id"
              type="text"
              class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Contact Email</label>
            <input
              v-model="invoiceForm.email"
              type="email"
              class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Contact Phone</label>
            <input
              v-model="invoiceForm.phone"
              type="text"
              class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-xs font-medium text-gray-700 mb-1">Physical Business Address</label>
            <input
              v-model="invoiceForm.address"
              type="text"
              class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Invoice Number Prefix</label>
            <input
              v-model="invoiceForm.invoice_prefix"
              type="text"
              required
              class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Currency Code</label>
            <select
              v-model="invoiceForm.currency"
              class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>

          <div class="md:col-span-2">
            <label class="block text-xs font-medium text-gray-700 mb-1">Invoice Footer / Legal Remarks</label>
            <textarea
              v-model="invoiceForm.notes"
              rows="3"
              class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div class="md:col-span-2">
            <button
              type="submit"
              class="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
            >
              Save Invoice Configuration
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODALS -->

    <!-- Modal 1: Room Type Modal -->
    <div v-if="showRoomTypeModal" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
        <h3 class="text-lg font-bold text-gray-900">{{ editingRoomType ? 'Edit Room Type' : 'Add Room Type' }}</h3>
        <form @submit.prevent="handleSaveRoomType" class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Code</label>
            <input v-model="roomTypeForm.code" type="text" required class="w-full border rounded-lg p-2 text-sm" placeholder="e.g. STDK" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Name</label>
            <input v-model="roomTypeForm.name" type="text" required class="w-full border rounded-lg p-2 text-sm" placeholder="Standard King" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Base Price ($)</label>
              <input v-model.number="roomTypeForm.base_price" type="number" step="0.01" required class="w-full border rounded-lg p-2 text-sm" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Max Occupancy</label>
              <input v-model.number="roomTypeForm.max_occupancy" type="number" required class="w-full border rounded-lg p-2 text-sm" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Bed Type</label>
            <select v-model="roomTypeForm.bed_type_id" class="w-full border rounded-lg p-2 text-sm bg-white">
              <option value="">Select Bed Type</option>
              <option v-for="bt in roomStore.bed_types" :key="bt.id" :value="bt.id">{{ bt.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="roomTypeForm.description" rows="2" class="w-full border rounded-lg p-2 text-sm"></textarea>
          </div>
          <div class="flex justify-end gap-2 pt-3">
            <button type="button" @click="showRoomTypeModal = false" class="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 2: Bed Type Modal -->
    <div v-if="showBedTypeModal" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
        <h3 class="text-lg font-bold text-gray-900">{{ editingBedType ? 'Edit Bed Type' : 'Add Bed Type' }}</h3>
        <form @submit.prevent="handleSaveBedType" class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Code</label>
            <input v-model="bedTypeForm.code" type="text" required class="w-full border rounded-lg p-2 text-sm" placeholder="e.g. KING" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Name</label>
            <input v-model="bedTypeForm.name" type="text" required class="w-full border rounded-lg p-2 text-sm" placeholder="King Bed" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Sleeping Capacity</label>
            <input v-model.number="bedTypeForm.capacity" type="number" required min="1" class="w-full border rounded-lg p-2 text-sm" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="bedTypeForm.description" rows="2" class="w-full border rounded-lg p-2 text-sm"></textarea>
          </div>
          <div class="flex justify-end gap-2 pt-3">
            <button type="button" @click="showBedTypeModal = false" class="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 3: Room Modal -->
    <div v-if="showRoomModal" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
        <h3 class="text-lg font-bold text-gray-900">{{ editingRoom ? 'Edit Room Unit' : 'Add New Room Unit' }}</h3>
        <form @submit.prevent="handleSaveRoom" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Room Number</label>
              <input v-model="roomForm.room_number" type="text" required class="w-full border rounded-lg p-2 text-sm" placeholder="e.g. 101" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Floor</label>
              <input v-model.number="roomForm.floor" type="number" required min="1" class="w-full border rounded-lg p-2 text-sm" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Room Type</label>
            <select v-model="roomForm.room_type_id" required class="w-full border rounded-lg p-2 text-sm bg-white">
              <option value="">Select Room Type</option>
              <option v-for="rt in roomStore.room_types" :key="rt.id" :value="rt.id">{{ rt.name }} ({{ rt.code }})</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Housekeeping Status</label>
              <select v-model="roomForm.housekeeping_status" class="w-full border rounded-lg p-2 text-sm bg-white">
                <option value="clean">clean</option>
                <option value="dirty">dirty</option>
                <option value="inspected">inspected</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Maintenance Status</label>
              <select v-model="roomForm.maintenance_status" class="w-full border rounded-lg p-2 text-sm bg-white">
                <option value="operational">operational</option>
                <option value="under_maintenance">under_maintenance</option>
                <option value="out_of_order">out_of_order</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Maintenance Notes / Issues</label>
            <textarea v-model="roomForm.maintenance_notes" rows="2" class="w-full border rounded-lg p-2 text-sm" placeholder="Optional notes regarding maintenance..."></textarea>
          </div>
          <div class="flex justify-end gap-2 pt-3">
            <button type="button" @click="showRoomModal = false" class="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 4: Meal Plan Modal -->
    <div v-if="showMealPlanModal" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
        <h3 class="text-lg font-bold text-gray-900">{{ editingMealPlan ? 'Edit Meal Plan' : 'Add Meal Plan' }}</h3>
        <form @submit.prevent="handleSaveMealPlan" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Code</label>
              <input v-model="mealPlanForm.code" type="text" required class="w-full border rounded-lg p-2 text-sm" placeholder="e.g. BB" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Plan Name</label>
              <input v-model="mealPlanForm.name" type="text" required class="w-full border rounded-lg p-2 text-sm" placeholder="Bed & Breakfast" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Adult Price ($/day)</label>
              <input v-model.number="mealPlanForm.price_adult" type="number" step="0.01" min="0" required class="w-full border rounded-lg p-2 text-sm" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Child Price ($/day)</label>
              <input v-model.number="mealPlanForm.price_child" type="number" step="0.01" min="0" required class="w-full border rounded-lg p-2 text-sm" />
            </div>
          </div>
          <div class="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
            <span class="text-xs font-semibold text-gray-700 block">Meal Revenue Allocations ($)</span>
            <div class="grid grid-cols-3 gap-2">
              <div>
                <label class="block text-[10px] text-gray-500">Breakfast</label>
                <input v-model.number="mealPlanForm.breakfast" type="number" min="0" class="w-full border rounded p-1.5 text-xs" />
              </div>
              <div>
                <label class="block text-[10px] text-gray-500">Lunch</label>
                <input v-model.number="mealPlanForm.lunch" type="number" min="0" class="w-full border rounded p-1.5 text-xs" />
              </div>
              <div>
                <label class="block text-[10px] text-gray-500">Dinner</label>
                <input v-model.number="mealPlanForm.dinner" type="number" min="0" class="w-full border rounded p-1.5 text-xs" />
              </div>
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="mealPlanForm.description" rows="2" class="w-full border rounded-lg p-2 text-sm"></textarea>
          </div>
          <div class="flex items-center gap-2">
            <input id="mp_active" v-model="mealPlanForm.active" type="checkbox" class="rounded border-gray-300 text-blue-600" />
            <label for="mp_active" class="text-xs text-gray-700 font-medium">Active Status</label>
          </div>
          <div class="flex justify-end gap-2 pt-3">
            <button type="button" @click="showMealPlanModal = false" class="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 5: Extra Charge Modal -->
    <div v-if="showExtraChargeModal" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
        <h3 class="text-lg font-bold text-gray-900">{{ editingExtraCharge ? 'Edit Extra Charge' : 'Add Extra Charge' }}</h3>
        <form @submit.prevent="handleSaveExtraCharge" class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Item / Charge Name</label>
            <input v-model="extraChargeForm.name" type="text" required class="w-full border rounded-lg p-2 text-sm" placeholder="e.g. Airport Transfer" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Category</label>
              <input v-model="extraChargeForm.category" type="text" class="w-full border rounded-lg p-2 text-sm" placeholder="Transportation" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Price ($)</label>
              <input v-model.number="extraChargeForm.price" type="number" step="0.01" min="0" required class="w-full border rounded-lg p-2 text-sm" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Pricing Type</label>
            <select v-model="extraChargeForm.pricing_type" class="w-full border rounded-lg p-2 text-sm bg-white">
              <option value="fixed">fixed (Per Request)</option>
              <option value="per_night">per_night (Daily Fee)</option>
              <option value="per_guest">per_guest (Per Person)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="extraChargeForm.description" rows="2" class="w-full border rounded-lg p-2 text-sm"></textarea>
          </div>
          <div class="flex items-center gap-2">
            <input id="ec_active" v-model="extraChargeForm.active" type="checkbox" class="rounded border-gray-300 text-blue-600" />
            <label for="ec_active" class="text-xs text-gray-700 font-medium">Active Status</label>
          </div>
          <div class="flex justify-end gap-2 pt-3">
            <button type="button" @click="showExtraChargeModal = false" class="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 6: Payment Method Modal -->
    <div v-if="showPaymentMethodModal" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
        <h3 class="text-lg font-bold text-gray-900">{{ editingPaymentMethod ? 'Edit Payment Method' : 'Add Payment Method' }}</h3>
        <form @submit.prevent="handleSavePaymentMethod" class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Method Name</label>
            <input v-model="paymentMethodForm.name" type="text" required class="w-full border rounded-lg p-2 text-sm" placeholder="e.g. Credit Card" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Surcharge / Processing Fee (%)</label>
            <input v-model.number="paymentMethodForm.fee_percentage" type="number" step="0.01" min="0" class="w-full border rounded-lg p-2 text-sm" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="paymentMethodForm.description" rows="2" class="w-full border rounded-lg p-2 text-sm"></textarea>
          </div>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <input id="pm_default" v-model="paymentMethodForm.is_default" type="checkbox" class="rounded border-gray-300 text-blue-600" />
              <label for="pm_default" class="text-xs text-gray-700 font-medium">Set as Default Payment Method</label>
            </div>
            <div class="flex items-center gap-2">
              <input id="pm_active" v-model="paymentMethodForm.active" type="checkbox" class="rounded border-gray-300 text-blue-600" />
              <label for="pm_active" class="text-xs text-gray-700 font-medium">Active Status</label>
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-3">
            <button type="button" @click="showPaymentMethodModal = false" class="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoomStore } from '../stores/useRoomStore.js'
import {
  PhBed,
  PhGridFour,
  PhForkKnife,
  PhReceipt,
  PhCreditCard,
  PhPlus
} from '@phosphor-icons/vue'

const roomStore = useRoomStore()

const activeTab = ref('room_bed_types')
const notificationMessage = ref('')
const roomFilter = ref('all')

const tabs = [
  { id: 'room_bed_types', name: 'Room Types & Bed Types', icon: PhBed },
  { id: 'rooms_grid', name: 'Rooms Grid & Maintenance Status', icon: PhGridFour },
  { id: 'meal_plans', name: 'Meal Plans & Breakdowns', icon: PhForkKnife },
  { id: 'extra_charges_tax', name: 'Extra Charges & Tax/Service Menu', icon: PhReceipt },
  { id: 'payment_invoice', name: 'Payment Methods & Invoice Settings', icon: PhCreditCard },
]

// Modal Visibility State
const showRoomTypeModal = ref(false)
const editingRoomType = ref(null)

const showBedTypeModal = ref(false)
const editingBedType = ref(null)

const showRoomModal = ref(false)
const editingRoom = ref(null)

const showMealPlanModal = ref(false)
const editingMealPlan = ref(null)

const showExtraChargeModal = ref(false)
const editingExtraCharge = ref(null)

const showPaymentMethodModal = ref(false)
const editingPaymentMethod = ref(null)

// Forms State
const roomTypeForm = reactive({ code: '', name: '', base_price: 100, max_occupancy: 2, bed_type_id: '', description: '' })
const bedTypeForm = reactive({ code: '', name: '', capacity: 2, description: '' })
const roomForm = reactive({ room_number: '', floor: 1, room_type_id: '', housekeeping_status: 'clean', maintenance_status: 'operational', maintenance_notes: '' })
const mealPlanForm = reactive({ code: '', name: '', price_adult: 0, price_child: 0, breakfast: 0, lunch: 0, dinner: 0, active: true, description: '' })
const extraChargeForm = reactive({ name: '', price: 0, pricing_type: 'fixed', category: 'General', active: true, description: '' })
const paymentMethodForm = reactive({ name: '', fee_percentage: 0, is_default: false, active: true, description: '' })

const taxForm = reactive({ sales_tax: 10, city_tax: 3.5, service_charge: 5, tax_inclusive: false })
const invoiceForm = reactive({ company_name: '', address: '', phone: '', email: '', tax_id: '', invoice_prefix: 'INV-', next_number: 1000, currency: 'USD', notes: '' })

function notify(msg) {
  notificationMessage.value = msg
  setTimeout(() => {
    if (notificationMessage.value === msg) notificationMessage.value = ''
  }, 4000)
}

onMounted(async () => {
  await Promise.allSettled([
    roomStore.fetchBedTypes(),
    roomStore.fetchRoomTypes(),
    roomStore.fetchRooms(),
    roomStore.fetchMealPlans(),
    roomStore.fetchExtraCharges(),
    roomStore.fetchTaxSettings(),
    roomStore.fetchPaymentMethods(),
    roomStore.fetchInvoiceSettings()
  ])

  // Sync loaded tax and invoice settings
  if (roomStore.tax_settings) {
    Object.assign(taxForm, roomStore.tax_settings)
  }
  if (roomStore.invoice_settings) {
    Object.assign(invoiceForm, roomStore.invoice_settings)
  }
})

// Helpers
function getBedTypeName(id) {
  const bt = roomStore.bed_types.find(b => b.id === id)
  return bt ? bt.name : '—'
}

function getRoomTypeName(id) {
  const rt = roomStore.room_types.find(r => r.id === id)
  return rt ? rt.name : 'Unassigned'
}

function getHousekeepingBadgeClass(status) {
  switch (status) {
    case 'clean': return 'bg-emerald-100 text-emerald-800'
    case 'dirty': return 'bg-rose-100 text-rose-800'
    case 'inspected': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const filteredRooms = computed(() => {
  if (roomFilter.value === 'all') return roomStore.rooms
  return roomStore.rooms.filter(r => r.maintenance_status === roomFilter.value)
})

// Handlers for Room Types
function openRoomTypeModal(item = null) {
  editingRoomType.value = item
  if (item) {
    Object.assign(roomTypeForm, item)
  } else {
    Object.assign(roomTypeForm, { code: '', name: '', base_price: 100, max_occupancy: 2, bed_type_id: roomStore.bed_types[0]?.id || '', description: '' })
  }
  showRoomTypeModal.value = true
}

async function handleSaveRoomType() {
  if (editingRoomType.value) {
    await roomStore.updateRoomType(editingRoomType.value.id, { ...roomTypeForm })
    notify('Room type updated successfully.')
  } else {
    await roomStore.createRoomType({ ...roomTypeForm })
    notify('New room type created.')
  }
  showRoomTypeModal.value = false
}

async function handleDeleteRoomType(id) {
  if (confirm('Are you sure you want to delete this room type?')) {
    await roomStore.deleteRoomType(id)
    notify('Room type removed.')
  }
}

// Handlers for Bed Types
function openBedTypeModal(item = null) {
  editingBedType.value = item
  if (item) {
    Object.assign(bedTypeForm, item)
  } else {
    Object.assign(bedTypeForm, { code: '', name: '', capacity: 2, description: '' })
  }
  showBedTypeModal.value = true
}

async function handleSaveBedType() {
  if (editingBedType.value) {
    await roomStore.updateBedType(editingBedType.value.id, { ...bedTypeForm })
    notify('Bed type updated successfully.')
  } else {
    await roomStore.createBedType({ ...bedTypeForm })
    notify('New bed type created.')
  }
  showBedTypeModal.value = false
}

async function handleDeleteBedType(id) {
  if (confirm('Are you sure you want to delete this bed type?')) {
    await roomStore.deleteBedType(id)
    notify('Bed type removed.')
  }
}

// Handlers for Rooms
function openRoomModal(item = null) {
  editingRoom.value = item
  if (item) {
    Object.assign(roomForm, item)
  } else {
    Object.assign(roomForm, {
      room_number: '',
      floor: 1,
      room_type_id: roomStore.room_types[0]?.id || '',
      housekeeping_status: 'clean',
      maintenance_status: 'operational',
      maintenance_notes: ''
    })
  }
  showRoomModal.value = true
}

async function handleSaveRoom() {
  if (editingRoom.value) {
    await roomStore.updateRoom(editingRoom.value.id, { ...roomForm })
    notify(`Room ${roomForm.room_number} updated.`)
  } else {
    await roomStore.createRoom({ ...roomForm })
    notify(`Room ${roomForm.room_number} added.`)
  }
  showRoomModal.value = false
}

async function handleQuickMaintenanceChange(room, newStatus) {
  await roomStore.updateRoom(room.id, { maintenance_status: newStatus })
  notify(`Room ${room.room_number} maintenance status updated to ${newStatus}.`)
}

async function handleDeleteRoom(id) {
  if (confirm('Are you sure you want to delete this room?')) {
    await roomStore.deleteRoom(id)
    notify('Room removed.')
  }
}

// Handlers for Meal Plans
function openMealPlanModal(item = null) {
  editingMealPlan.value = item
  if (item) {
    Object.assign(mealPlanForm, item)
  } else {
    Object.assign(mealPlanForm, { code: '', name: '', price_adult: 0, price_child: 0, breakfast: 0, lunch: 0, dinner: 0, active: true, description: '' })
  }
  showMealPlanModal.value = true
}

async function handleSaveMealPlan() {
  if (editingMealPlan.value) {
    await roomStore.updateMealPlan(editingMealPlan.value.id, { ...mealPlanForm })
    notify('Meal plan updated.')
  } else {
    await roomStore.createMealPlan({ ...mealPlanForm })
    notify('New meal plan created.')
  }
  showMealPlanModal.value = false
}

async function handleDeleteMealPlan(id) {
  if (confirm('Are you sure you want to delete this meal plan?')) {
    await roomStore.deleteMealPlan(id)
    notify('Meal plan deleted.')
  }
}

// Handlers for Extra Charges
function openExtraChargeModal(item = null) {
  editingExtraCharge.value = item
  if (item) {
    Object.assign(extraChargeForm, item)
  } else {
    Object.assign(extraChargeForm, { name: '', price: 0, pricing_type: 'fixed', category: 'General', active: true, description: '' })
  }
  showExtraChargeModal.value = true
}

async function handleSaveExtraCharge() {
  if (editingExtraCharge.value) {
    await roomStore.updateExtraCharge(editingExtraCharge.value.id, { ...extraChargeForm })
    notify('Extra charge updated.')
  } else {
    await roomStore.createExtraCharge({ ...extraChargeForm })
    notify('New extra charge added.')
  }
  showExtraChargeModal.value = false
}

async function handleDeleteExtraCharge(id) {
  if (confirm('Are you sure you want to delete this extra charge item?')) {
    await roomStore.deleteExtraCharge(id)
    notify('Extra charge item deleted.')
  }
}

// Save Tax Settings
async function handleSaveTaxSettings() {
  await roomStore.updateTaxSettings({ ...taxForm })
  notify('Tax and service settings saved successfully.')
}

// Handlers for Payment Methods
function openPaymentMethodModal(item = null) {
  editingPaymentMethod.value = item
  if (item) {
    Object.assign(paymentMethodForm, item)
  } else {
    Object.assign(paymentMethodForm, { name: '', fee_percentage: 0, is_default: false, active: true, description: '' })
  }
  showPaymentMethodModal.value = true
}

async function handleSavePaymentMethod() {
  if (editingPaymentMethod.value) {
    await roomStore.updatePaymentMethod(editingPaymentMethod.value.id, { ...paymentMethodForm })
    notify('Payment method updated.')
  } else {
    await roomStore.createPaymentMethod({ ...paymentMethodForm })
    notify('New payment method added.')
  }
  showPaymentMethodModal.value = false
}

async function handleDeletePaymentMethod(id) {
  if (confirm('Are you sure you want to delete this payment method?')) {
    await roomStore.deletePaymentMethod(id)
    notify('Payment method deleted.')
  }
}

// Save Invoice Settings
async function handleSaveInvoiceSettings() {
  await roomStore.updateInvoiceSettings({ ...invoiceForm })
  notify('Invoice settings updated.')
}
</script>
