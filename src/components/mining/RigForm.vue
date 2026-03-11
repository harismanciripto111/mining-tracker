<script setup lang="ts">
import { ref, watch } from 'vue'
import type { RigFormData, MiningRig, HashrateUnit, RigStatus } from '@/types'

const props = defineProps<{
  rig?: MiningRig | null
}>()

const emit = defineEmits<{
  submit: [data: RigFormData]
  cancel: []
}>()

const defaultForm: RigFormData = {
  name: '',
  gpuModel: '',
  gpuCount: 1,
  hashrate: 0,
  hashrateUnit: 'MH/s',
  powerConsumption: 0,
  electricityCost: 0.08,
  pool: '',
  coin: 'BTC',
  walletAddress: '',
  status: 'active'
}

const form = ref<RigFormData>({ ...defaultForm })

watch(() => props.rig, (val) => {
  if (val) {
    form.value = {
      name: val.name,
      gpuModel: val.gpuModel,
      gpuCount: val.gpuCount,
      hashrate: val.hashrate,
      hashrateUnit: val.hashrateUnit,
      powerConsumption: val.powerConsumption,
      electricityCost: val.electricityCost,
      pool: val.pool,
      coin: val.coin,
      walletAddress: val.walletAddress,
      status: val.status
    }
  } else {
    form.value = { ...defaultForm }
  }
}, { immediate: true })

const hashrateUnits: HashrateUnit[] = ['H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s']
const statuses: RigStatus[] = ['active', 'idle', 'maintenance', 'offline']

function handleSubmit() {
  if (!form.value.name.trim()) return
  emit('submit', { ...form.value })
}
</script>

<template>
  <form class="rig-form" @submit.prevent="handleSubmit">
    <h3 class="rig-form__title">{{ rig ? 'Edit Rig' : 'Add New Rig' }}</h3>

    <div class="rig-form__grid">
      <div class="form-group form-group--full">
        <label class="form-label">Rig Name</label>
        <input v-model="form.name" type="text" class="form-input" placeholder="e.g. Rig #1 - RTX 4090 x2" required />
      </div>

      <div class="form-group">
        <label class="form-label">GPU Model</label>
        <input v-model="form.gpuModel" type="text" class="form-input" placeholder="e.g. RTX 4090" />
      </div>

      <div class="form-group">
        <label class="form-label">GPU Count</label>
        <input v-model.number="form.gpuCount" type="number" class="form-input" min="1" />
      </div>

      <div class="form-group">
        <label class="form-label">Hashrate</label>
        <div class="form-input-group">
          <input v-model.number="form.hashrate" type="number" class="form-input" step="0.01" min="0" />
          <select v-model="form.hashrateUnit" class="form-select form-select--sm">
            <option v-for="unit in hashrateUnits" :key="unit" :value="unit">{{ unit }}</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Power (Watts)</label>
        <input v-model.number="form.powerConsumption" type="number" class="form-input" min="0" />
      </div>

      <div class="form-group">
        <label class="form-label">Electricity ($/kWh)</label>
        <input v-model.number="form.electricityCost" type="number" class="form-input" step="0.01" min="0" />
      </div>

      <div class="form-group">
        <label class="form-label">Mining Pool</label>
        <input v-model="form.pool" type="text" class="form-input" placeholder="e.g. NiceHash" />
      </div>

      <div class="form-group">
        <label class="form-label">Coin</label>
        <input v-model="form.coin" type="text" class="form-input" placeholder="e.g. BTC" />
      </div>

      <div class="form-group form-group--full">
        <label class="form-label">Wallet Address</label>
        <input v-model="form.walletAddress" type="text" class="form-input" placeholder="bc1q..." />
      </div>

      <div class="form-group">
        <label class="form-label">Status</label>
        <select v-model="form.status" class="form-select">
          <option v-for="s in statuses" :key="s" :value="s">{{ s.charAt(0).toUpperCase() + s.slice(1) }}</option>
        </select>
      </div>
    </div>

    <div class="rig-form__actions">
      <button type="button" class="btn btn--ghost" @click="emit('cancel')">Cancel</button>
      <button type="submit" class="btn btn--primary">{{ rig ? 'Update Rig' : 'Add Rig' }}</button>
    </div>
  </form>
</template>

<style scoped>
.rig-form__title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1.25rem;
}

.rig-form__grid {
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

.form-input::placeholder {
  color: var(--text-muted);
}

.form-input-group {
  display: flex;
  gap: 0.5rem;
}

.form-input-group .form-input {
  flex: 1;
}

.form-select--sm {
  width: auto;
  min-width: 80px;
}

.rig-form__actions {
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
  .rig-form__grid {
    grid-template-columns: 1fr;
  }
}
</style>