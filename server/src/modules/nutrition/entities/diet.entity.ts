export interface Diet {
  id: string
  name: string
  dailyKcalGoal: number
  dailyProteinGoal: number
  dailyCarbGoal: number
  dailyFatGoal: number
  dailyWaterGoal: number
  userId: string
  createdAt: Date
  updatedAt: Date
}
