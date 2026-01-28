export const GENDER_OPTIONS = ["MALE","FEMALE"] as const

export type Gender = typeof GENDER_OPTIONS[number];