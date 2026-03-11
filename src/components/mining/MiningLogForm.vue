<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { format } from 'date-fns'
import { useMiningStore } from '@/stores/mining'
import type { MiningLogFormData } from '@/types'

const props = defineProps<{
  preselectedRigId?: string
}>()

const emit = defineEmits<{
  submit: [data: MiningLogFormData]
  cancel: []
}>()

const miningStore = useMiningStore()

const form = ref<MiningLogFormData>({
  rigId: props.preselectedRigId || '',
  date: format(new Date(), 'yyyy-MM-dd'),
  coinsMined: 0,
  usdValue: 0,
  poolFee: 0,
  powerCost: 0,
  avgHashrate: 0,
  notes: ''
})

// Auto-calculate power cost when rig is selected
const selectedRig = computed(() => {
  return miningStore.getRigById(form.value.rigId)
})

watch(() => form.value.rigId, (rigId) => {
  const rig = miningStore.getRigById(rigId)
  if (rig) {
    form.value.powerCost = parseFloat(((rig.powerConsumption / 1000) * 24 * rig.electricityCost).toFixed(2))
    form.value.avgHashrate = rig.hashrate
  }
})

const netProfit = computed(() => {
  return parseFloat((form.value.usdValue - form.value.poolFee - form.value.powerCost).toFixed(2))
})

function handleSubmit() {
  if (!form.value.rigId) return
  emit('submit', { ...form.value })
  // Reset form
  form.value = {
    rigId: props.preselectedRigId || form.value.rigId,
    date: format(new Date(), 'yyyy-MM-dd'),
    coinsMined: 0,
    usdValue: 0,
    poolFee: 0,
    powerCost: form.value.powerCost,
    avgHashrate: form.value.avgHashrate,
    notes: ''
  }
}
</script>

<template>
  <form class="log-form" @submit.prevent="handleSubmit">
    <h3 class="log-form__title">Add Mining Log</h3>

    <div class="log-form__grid">
      <div class="form-group">
        <label class="form-label">Rig</label>
        <select v-model="form.rigId" class="form-select" required>
          <option value="" disabled>Select a rig</option>
          <option v-for="rig in miningStore.rigs" :key="rig.id" :value="rig.id">
            {{ rig.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Date</label>
        <input v-model="form.date" type="date" class="form-input" required />
      </div>

      <div class="form-group">
        <label class="form-label">Coins Mined</label>
        <input v-model.number="form.coinsMined" type="number" class="form-input" step="0.000001" min="0" />
      </div>

      <div class="form-group">
        <label class="form-label">USD Value</label>
        <input v-model.number="form.usdValue" type="number" class="form-input" step="0.01" min="0" />
      </div>

      <div class="form-group">
        <label class="form-label">Pool Fee ($)</label>
        <input v-model.number="form.poolFee" type="number" class="form-input" step="0.01" min="0" />
      </div>

      <div class="form-group">
        <label class="form-label">Power Cost ($)</label>
        <input v-model.number="form.powerCost" type="number" class="form-input" step="0.01" min="0" />
      </div>

      <div class="form-group">
        <label class="form-label">Avg Hashrate</label>
        <div class="form-input-group">
          <input v-model.number="form.avgHashrate" type="number" class="form-input" step="0.1" min="0" />
          <span class="form-unit">{{ selectedRig?.hashrateUnit || 'MH/s' }}</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Net Profit</label>
        <div class="net-profit" :class="netProfit >= 0 ? 'net-profit--positive' : 'net-profit--negative'">
          ${{ netProfit.toFixed(2) }}
        </div>
      </div>

      <div class="form-group form-group--full">
        <label class="form-label">Notes</label>
        <input v-model="form.notes" type="text" class="form-input" placeholder="Optional notes..." />
      </div>
    </div>

    <div class="log-form__actions">
      <button type="button" class="btn btn--ghost" @click="emit('cancel')">Cancel</button>
      <button type="submit" class="btn btn--primary">Add Log Entry</button>
    </div>
  </form>
</template>

<style scoped>
.log-form__title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1.25rem;
}

.log-form__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-group--full {
  grid-column: 1 / -1;
}

.form-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.35rem;
}

.form-input, .form-select {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--border-primary);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-primary);
  font-size: 0.875rem;
  font-family: inherit;
  transition: all 0.2s ease;
  outline: none;
}

.form-input:focus, .form-select:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
}

.form-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-input-group .form-input {
  flex: 1;
}

.form-unit {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
  white-space: nowrap;
}

.net-profit {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.25rem;
  font-weight: 700;
  padding: 0.5rem 0;
}

.net-profit--positive { color: var(--profit-green); }
.net-profit--negative { color: var(--loss-red); }

.log-form__actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-primary);
}

.btn {
  padding: 0.55rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn--ghost {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  border: 1px solid var(--border-primary);
}

.btn--ghost:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn--primary {
  background: var(--accent-primary);
  color: #fff;
}

.btn--primary:hover {
  background: var(--accent-light);
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .log-form__grid {
    grid-template-columns: 1fr;
  }
}
</style>