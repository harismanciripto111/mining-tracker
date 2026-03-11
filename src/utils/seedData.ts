import { v4 as uuidv4 } from 'uuid'
import { format, subDays, subMonths } from 'date-fns'
import type { Transaction, MiningRig, MiningLog } from '@/types'

const today = new Date()

function randomBetween(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2))
}

function randomDate(daysBack: number): string {
  const d = subDays(today, Math.floor(Math.random() * daysBack))
  return format(d, 'yyyy-MM-dd')
}

// ---- Seed Transactions (90 days of data) ----
export function getSeedTransactions(): Transaction[] {
  const transactions: Transaction[] = []
  const categories: Array<'mining' | 'trading' | 'staking' | 'airdrop' | 'other'> = [
    'mining', 'trading', 'staking', 'airdrop', 'other'
  ]
  const descriptions: Record<string, string[]> = {
    mining: ['Daily mining reward', 'Pool payout BTC', 'KAS mining reward', 'ETH block reward', 'Mining pool bonus'],
    trading: ['BTC spot trade', 'ETH swing trade', 'SOL scalp profit', 'Futures position closed', 'Arbitrage profit'],
    staking: ['ETH staking reward', 'SOL staking yield', 'DOT staking payout', 'ATOM delegation reward'],
    airdrop: ['Token airdrop claim', 'Retroactive airdrop', 'Community reward', 'Testnet incentive'],
    other: ['Referral bonus', 'Bug bounty', 'Content creation', 'Consulting fee']
  }

  // Generate 90 days of realistic data
  for (let i = 0; i < 90; i++) {
    const date = format(subDays(today, i), 'yyyy-MM-dd')
    const numTransactions = Math.floor(Math.random() * 3) + 1

    for (let j = 0; j < numTransactions; j++) {
      const category = categories[Math.floor(Math.random() * categories.length)]
      const isProfit = Math.random() > 0.35 // 65% win rate
      const amount = isProfit
        ? randomBetween(5, 250)
        : -randomBetween(5, 150)
      const type = amount > 0
        ? (Math.random() > 0.3 ? 'profit' : 'reward')
        : (Math.random() > 0.5 ? 'loss' : 'fee')
      const descList = descriptions[category]
      const description = descList[Math.floor(Math.random() * descList.length)]
      const now = new Date().toISOString()

      transactions.push({
        id: uuidv4(),
        date,
        amount,
        type,
        category,
        description,
        createdAt: now,
        updatedAt: now
      })
    }
  }

  return transactions
}

// ---- Seed Mining Rigs ----
export function getSeedRigs(): MiningRig[] {
  const now = new Date().toISOString()
  return [
    {
      id: uuidv4(),
      name: 'Rig #1 - RTX 4090 x2',
      gpuModel: 'RTX 4090',
      gpuCount: 2,
      hashrate: 260,
      hashrateUnit: 'MH/s' as const,
      powerConsumption: 900,
      electricityCost: 0.08,
      pool: 'NiceHash',
      coin: 'BTC',
      walletAddress: 'bc1q...x7k9',
      status: 'active' as const,
      createdAt: format(subMonths(today, 3), "yyyy-MM-dd'T'HH:mm:ss"),
      updatedAt: now
    },
    {
      id: uuidv4(),
      name: 'Rig #2 - RTX 3080 x4',
      gpuModel: 'RTX 3080',
      gpuCount: 4,
      hashrate: 400,
      hashrateUnit: 'MH/s' as const,
      powerConsumption: 1200,
      electricityCost: 0.08,
      pool: 'F2Pool',
      coin: 'KAS',
      walletAddress: 'kaspa:qr...m3p',
      status: 'active' as const,
      createdAt: format(subMonths(today, 5), "yyyy-MM-dd'T'HH:mm:ss"),
      updatedAt: now
    },
    {
      id: uuidv4(),
      name: 'Rig #3 - RX 6800 XT x3',
      gpuModel: 'RX 6800 XT',
      gpuCount: 3,
      hashrate: 195,
      hashrateUnit: 'MH/s' as const,
      powerConsumption: 750,
      electricityCost: 0.10,
      pool: 'HeroMiners',
      coin: 'ETH',
      walletAddress: '0xAb5...3Fc',
      status: 'idle' as const,
      createdAt: format(subMonths(today, 8), "yyyy-MM-dd'T'HH:mm:ss"),
      updatedAt: now
    },
    {
      id: uuidv4(),
      name: 'ASIC - Antminer S19 Pro',
      gpuModel: 'Antminer S19 Pro',
      gpuCount: 1,
      hashrate: 110,
      hashrateUnit: 'TH/s' as const,
      powerConsumption: 3250,
      electricityCost: 0.06,
      pool: 'Foundry USA',
      coin: 'BTC',
      walletAddress: 'bc1q...p2r8',
      status: 'active' as const,
      createdAt: format(subMonths(today, 2), "yyyy-MM-dd'T'HH:mm:ss"),
      updatedAt: now
    },
    {
      id: uuidv4(),
      name: 'Rig #5 - RTX 3060 Ti x6',
      gpuModel: 'RTX 3060 Ti',
      gpuCount: 6,
      hashrate: 360,
      hashrateUnit: 'MH/s' as const,
      powerConsumption: 1080,
      electricityCost: 0.08,
      pool: 'NiceHash',
      coin: 'BTC',
      walletAddress: 'bc1q...x7k9',
      status: 'maintenance' as const,
      createdAt: format(subMonths(today, 6), "yyyy-MM-dd'T'HH:mm:ss"),
      updatedAt: now
    }
  ]
}

// ---- Seed Mining Logs ----
export function getSeedMiningLogs(rigs: MiningRig[]): MiningLog[] {
  const logs: MiningLog[] = []
  const activeRigs = rigs.filter(r => r.status === 'active' || r.status === 'idle')

  for (const rig of activeRigs) {
    for (let i = 0; i < 30; i++) {
      const date = format(subDays(today, i), 'yyyy-MM-dd')
      const baseCoinsMined = randomBetween(0.0001, 0.005)
      const usdValue = randomBetween(15, 80)
      const poolFee = parseFloat((usdValue * randomBetween(0.01, 0.03)).toFixed(2))
      const powerCost = parseFloat(((rig.powerConsumption / 1000) * 24 * rig.electricityCost).toFixed(2))
      const netProfit = parseFloat((usdValue - poolFee - powerCost).toFixed(2))

      logs.push({
        id: uuidv4(),
        rigId: rig.id,
        date,
        coinsMined: baseCoinsMined,
        usdValue,
        poolFee,
        powerCost,
        netProfit,
        avgHashrate: rig.hashrate * randomBetween(0.9, 1.05),
        notes: '',
        createdAt: new Date().toISOString()
      })
    }
  }

  return logs
}
