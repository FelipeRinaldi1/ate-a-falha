import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','role','name','birthDate','gender','createdAt','updatedAt']);

export const AuthScalarFieldEnumSchema = z.enum(['id','email','password','userId']);

export const BodyMetricScalarFieldEnumSchema = z.enum(['id','weight','height','activityLevel','bodyFat','muscleRate','userId','createdAt','updatedAt']);

export const DietScalarFieldEnumSchema = z.enum(['id','name','dailyKcalGoal','dailyProteinGoal','dailyCarbGoal','dailyFatGoal','dailyWaterGoal','userId','createdAt','updatedAt']);

export const MealScalarFieldEnumSchema = z.enum(['id','name','time','orderIndex','dietId','createdAt','updatedAt']);

export const FoodInMealScalarFieldEnumSchema = z.enum(['id','quantity','mealId','foodId','createdAt','updatedAt']);

export const FoodScalarFieldEnumSchema = z.enum(['id','name','baseUnit','baseAmount','calories','carbohydrate','protein','fat','fiber','userId','createdAt','updatedAt']);

export const WorkoutPlanScalarFieldEnumSchema = z.enum(['id','name','isActive','userId','createdAt','updatedAt']);

export const WorkoutScalarFieldEnumSchema = z.enum(['id','name','day','workoutPlanId','createdAt','updatedAt']);

export const WorkoutExerciseScalarFieldEnumSchema = z.enum(['id','orderIndex','workoutId','exerciseId','createdAt','updatedAt']);

export const WorkoutSetScalarFieldEnumSchema = z.enum(['id','setNumber','repetitions','weight','restTimeSeconds','workoutExerciseId','createdAt','updatedAt']);

export const ExerciseScalarFieldEnumSchema = z.enum(['id','name','muscleGroup','description','imageUrl','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const ROLESchema = z.enum(['USER','ADMIN']);

export type ROLEType = `${z.infer<typeof ROLESchema>}`

export const GENDERSchema = z.enum(['MALE','FEMALE','OTHER']);

export type GENDERType = `${z.infer<typeof GENDERSchema>}`

export const WORKOUT_DAYSchema = z.enum(['A','B','C','D','E','F']);

export type WORKOUT_DAYType = `${z.infer<typeof WORKOUT_DAYSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: ROLESchema,
  gender: GENDERSchema,
  id: z.uuid(),
  name: z.string(),
  birthDate: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// AUTH SCHEMA
/////////////////////////////////////////

export const AuthSchema = z.object({
  id: z.uuid(),
  email: z.string(),
  password: z.string(),
  userId: z.string(),
})

export type Auth = z.infer<typeof AuthSchema>

/////////////////////////////////////////
// BODY METRIC SCHEMA
/////////////////////////////////////////

export const BodyMetricSchema = z.object({
  id: z.uuid(),
  weight: z.number(),
  height: z.number().int(),
  activityLevel: z.number().int(),
  bodyFat: z.number().nullable(),
  muscleRate: z.number().nullable(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type BodyMetric = z.infer<typeof BodyMetricSchema>

/////////////////////////////////////////
// DIET SCHEMA
/////////////////////////////////////////

export const DietSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  dailyKcalGoal: z.number().int(),
  dailyProteinGoal: z.number().int(),
  dailyCarbGoal: z.number().int(),
  dailyFatGoal: z.number().int(),
  dailyWaterGoal: z.number().int(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Diet = z.infer<typeof DietSchema>

/////////////////////////////////////////
// MEAL SCHEMA
/////////////////////////////////////////

export const MealSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  time: z.string(),
  orderIndex: z.number().int(),
  dietId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Meal = z.infer<typeof MealSchema>

/////////////////////////////////////////
// FOOD IN MEAL SCHEMA
/////////////////////////////////////////

export const FoodInMealSchema = z.object({
  id: z.uuid(),
  quantity: z.number().int(),
  mealId: z.string(),
  foodId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type FoodInMeal = z.infer<typeof FoodInMealSchema>

/////////////////////////////////////////
// FOOD SCHEMA
/////////////////////////////////////////

export const FoodSchema = z.object({
  // omitted: id: z.uuid(),
  name: z.string(),
  baseUnit: z.string(),
  baseAmount: z.number().int(),
  calories: z.number().int(),
  carbohydrate: z.number().int(),
  protein: z.number().int(),
  fat: z.number().int(),
  fiber: z.number().int().nullable(),
  // omitted: userId: z.string().nullable(),
  // omitted: createdAt: z.coerce.date(),
  // omitted: updatedAt: z.coerce.date(),
})

export type Food = z.infer<typeof FoodSchema>

/////////////////////////////////////////
// WORKOUT PLAN SCHEMA
/////////////////////////////////////////

export const WorkoutPlanSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  isActive: z.boolean(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type WorkoutPlan = z.infer<typeof WorkoutPlanSchema>

/////////////////////////////////////////
// WORKOUT SCHEMA
/////////////////////////////////////////

export const WorkoutSchema = z.object({
  day: WORKOUT_DAYSchema,
  id: z.uuid(),
  name: z.string().nullable(),
  workoutPlanId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Workout = z.infer<typeof WorkoutSchema>

/////////////////////////////////////////
// WORKOUT EXERCISE SCHEMA
/////////////////////////////////////////

export const WorkoutExerciseSchema = z.object({
  id: z.uuid(),
  orderIndex: z.number().int(),
  workoutId: z.string(),
  exerciseId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type WorkoutExercise = z.infer<typeof WorkoutExerciseSchema>

/////////////////////////////////////////
// WORKOUT SET SCHEMA
/////////////////////////////////////////

export const WorkoutSetSchema = z.object({
  id: z.uuid(),
  setNumber: z.number().int(),
  repetitions: z.number().int(),
  weight: z.number().nullable(),
  restTimeSeconds: z.number().int(),
  workoutExerciseId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type WorkoutSet = z.infer<typeof WorkoutSetSchema>

/////////////////////////////////////////
// EXERCISE SCHEMA
/////////////////////////////////////////

export const ExerciseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  muscleGroup: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Exercise = z.infer<typeof ExerciseSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  auth: z.union([z.boolean(),z.lazy(() => AuthArgsSchema)]).optional(),
  Diet: z.union([z.boolean(),z.lazy(() => DietFindManyArgsSchema)]).optional(),
  WorkoutPlan: z.union([z.boolean(),z.lazy(() => WorkoutPlanFindManyArgsSchema)]).optional(),
  bodyMetrics: z.union([z.boolean(),z.lazy(() => BodyMetricFindManyArgsSchema)]).optional(),
  food: z.union([z.boolean(),z.lazy(() => FoodFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  Diet: z.boolean().optional(),
  WorkoutPlan: z.boolean().optional(),
  bodyMetrics: z.boolean().optional(),
  food: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  role: z.boolean().optional(),
  name: z.boolean().optional(),
  birthDate: z.boolean().optional(),
  gender: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  auth: z.union([z.boolean(),z.lazy(() => AuthArgsSchema)]).optional(),
  Diet: z.union([z.boolean(),z.lazy(() => DietFindManyArgsSchema)]).optional(),
  WorkoutPlan: z.union([z.boolean(),z.lazy(() => WorkoutPlanFindManyArgsSchema)]).optional(),
  bodyMetrics: z.union([z.boolean(),z.lazy(() => BodyMetricFindManyArgsSchema)]).optional(),
  food: z.union([z.boolean(),z.lazy(() => FoodFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// AUTH
//------------------------------------------------------

export const AuthIncludeSchema: z.ZodType<Prisma.AuthInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

export const AuthArgsSchema: z.ZodType<Prisma.AuthDefaultArgs> = z.object({
  select: z.lazy(() => AuthSelectSchema).optional(),
  include: z.lazy(() => AuthIncludeSchema).optional(),
}).strict();

export const AuthSelectSchema: z.ZodType<Prisma.AuthSelect> = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  password: z.boolean().optional(),
  userId: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// BODY METRIC
//------------------------------------------------------

export const BodyMetricIncludeSchema: z.ZodType<Prisma.BodyMetricInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

export const BodyMetricArgsSchema: z.ZodType<Prisma.BodyMetricDefaultArgs> = z.object({
  select: z.lazy(() => BodyMetricSelectSchema).optional(),
  include: z.lazy(() => BodyMetricIncludeSchema).optional(),
}).strict();

export const BodyMetricSelectSchema: z.ZodType<Prisma.BodyMetricSelect> = z.object({
  id: z.boolean().optional(),
  weight: z.boolean().optional(),
  height: z.boolean().optional(),
  activityLevel: z.boolean().optional(),
  bodyFat: z.boolean().optional(),
  muscleRate: z.boolean().optional(),
  userId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// DIET
//------------------------------------------------------

export const DietIncludeSchema: z.ZodType<Prisma.DietInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  Meal: z.union([z.boolean(),z.lazy(() => MealFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DietCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const DietArgsSchema: z.ZodType<Prisma.DietDefaultArgs> = z.object({
  select: z.lazy(() => DietSelectSchema).optional(),
  include: z.lazy(() => DietIncludeSchema).optional(),
}).strict();

export const DietCountOutputTypeArgsSchema: z.ZodType<Prisma.DietCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => DietCountOutputTypeSelectSchema).nullish(),
}).strict();

export const DietCountOutputTypeSelectSchema: z.ZodType<Prisma.DietCountOutputTypeSelect> = z.object({
  Meal: z.boolean().optional(),
}).strict();

export const DietSelectSchema: z.ZodType<Prisma.DietSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  dailyKcalGoal: z.boolean().optional(),
  dailyProteinGoal: z.boolean().optional(),
  dailyCarbGoal: z.boolean().optional(),
  dailyFatGoal: z.boolean().optional(),
  dailyWaterGoal: z.boolean().optional(),
  userId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  Meal: z.union([z.boolean(),z.lazy(() => MealFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DietCountOutputTypeArgsSchema)]).optional(),
}).strict()

// MEAL
//------------------------------------------------------

export const MealIncludeSchema: z.ZodType<Prisma.MealInclude> = z.object({
  diet: z.union([z.boolean(),z.lazy(() => DietArgsSchema)]).optional(),
  foods: z.union([z.boolean(),z.lazy(() => FoodInMealFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MealCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const MealArgsSchema: z.ZodType<Prisma.MealDefaultArgs> = z.object({
  select: z.lazy(() => MealSelectSchema).optional(),
  include: z.lazy(() => MealIncludeSchema).optional(),
}).strict();

export const MealCountOutputTypeArgsSchema: z.ZodType<Prisma.MealCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => MealCountOutputTypeSelectSchema).nullish(),
}).strict();

export const MealCountOutputTypeSelectSchema: z.ZodType<Prisma.MealCountOutputTypeSelect> = z.object({
  foods: z.boolean().optional(),
}).strict();

export const MealSelectSchema: z.ZodType<Prisma.MealSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  time: z.boolean().optional(),
  orderIndex: z.boolean().optional(),
  dietId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  diet: z.union([z.boolean(),z.lazy(() => DietArgsSchema)]).optional(),
  foods: z.union([z.boolean(),z.lazy(() => FoodInMealFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MealCountOutputTypeArgsSchema)]).optional(),
}).strict()

// FOOD IN MEAL
//------------------------------------------------------

export const FoodInMealIncludeSchema: z.ZodType<Prisma.FoodInMealInclude> = z.object({
  meal: z.union([z.boolean(),z.lazy(() => MealArgsSchema)]).optional(),
  food: z.union([z.boolean(),z.lazy(() => FoodArgsSchema)]).optional(),
}).strict();

export const FoodInMealArgsSchema: z.ZodType<Prisma.FoodInMealDefaultArgs> = z.object({
  select: z.lazy(() => FoodInMealSelectSchema).optional(),
  include: z.lazy(() => FoodInMealIncludeSchema).optional(),
}).strict();

export const FoodInMealSelectSchema: z.ZodType<Prisma.FoodInMealSelect> = z.object({
  id: z.boolean().optional(),
  quantity: z.boolean().optional(),
  mealId: z.boolean().optional(),
  foodId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  meal: z.union([z.boolean(),z.lazy(() => MealArgsSchema)]).optional(),
  food: z.union([z.boolean(),z.lazy(() => FoodArgsSchema)]).optional(),
}).strict()

// FOOD
//------------------------------------------------------

export const FoodIncludeSchema: z.ZodType<Prisma.FoodInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  foodInMeals: z.union([z.boolean(),z.lazy(() => FoodInMealFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => FoodCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const FoodArgsSchema: z.ZodType<Prisma.FoodDefaultArgs> = z.object({
  select: z.lazy(() => FoodSelectSchema).optional(),
  include: z.lazy(() => FoodIncludeSchema).optional(),
}).strict();

export const FoodCountOutputTypeArgsSchema: z.ZodType<Prisma.FoodCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => FoodCountOutputTypeSelectSchema).nullish(),
}).strict();

export const FoodCountOutputTypeSelectSchema: z.ZodType<Prisma.FoodCountOutputTypeSelect> = z.object({
  foodInMeals: z.boolean().optional(),
}).strict();

export const FoodSelectSchema: z.ZodType<Prisma.FoodSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  baseUnit: z.boolean().optional(),
  baseAmount: z.boolean().optional(),
  calories: z.boolean().optional(),
  carbohydrate: z.boolean().optional(),
  protein: z.boolean().optional(),
  fat: z.boolean().optional(),
  fiber: z.boolean().optional(),
  userId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  foodInMeals: z.union([z.boolean(),z.lazy(() => FoodInMealFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => FoodCountOutputTypeArgsSchema)]).optional(),
}).strict()

// WORKOUT PLAN
//------------------------------------------------------

export const WorkoutPlanIncludeSchema: z.ZodType<Prisma.WorkoutPlanInclude> = z.object({
  workouts: z.union([z.boolean(),z.lazy(() => WorkoutFindManyArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => WorkoutPlanCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const WorkoutPlanArgsSchema: z.ZodType<Prisma.WorkoutPlanDefaultArgs> = z.object({
  select: z.lazy(() => WorkoutPlanSelectSchema).optional(),
  include: z.lazy(() => WorkoutPlanIncludeSchema).optional(),
}).strict();

export const WorkoutPlanCountOutputTypeArgsSchema: z.ZodType<Prisma.WorkoutPlanCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => WorkoutPlanCountOutputTypeSelectSchema).nullish(),
}).strict();

export const WorkoutPlanCountOutputTypeSelectSchema: z.ZodType<Prisma.WorkoutPlanCountOutputTypeSelect> = z.object({
  workouts: z.boolean().optional(),
}).strict();

export const WorkoutPlanSelectSchema: z.ZodType<Prisma.WorkoutPlanSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  isActive: z.boolean().optional(),
  userId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  workouts: z.union([z.boolean(),z.lazy(() => WorkoutFindManyArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => WorkoutPlanCountOutputTypeArgsSchema)]).optional(),
}).strict()

// WORKOUT
//------------------------------------------------------

export const WorkoutIncludeSchema: z.ZodType<Prisma.WorkoutInclude> = z.object({
  workoutPlan: z.union([z.boolean(),z.lazy(() => WorkoutPlanArgsSchema)]).optional(),
  workoutExercises: z.union([z.boolean(),z.lazy(() => WorkoutExerciseFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => WorkoutCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const WorkoutArgsSchema: z.ZodType<Prisma.WorkoutDefaultArgs> = z.object({
  select: z.lazy(() => WorkoutSelectSchema).optional(),
  include: z.lazy(() => WorkoutIncludeSchema).optional(),
}).strict();

export const WorkoutCountOutputTypeArgsSchema: z.ZodType<Prisma.WorkoutCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => WorkoutCountOutputTypeSelectSchema).nullish(),
}).strict();

export const WorkoutCountOutputTypeSelectSchema: z.ZodType<Prisma.WorkoutCountOutputTypeSelect> = z.object({
  workoutExercises: z.boolean().optional(),
}).strict();

export const WorkoutSelectSchema: z.ZodType<Prisma.WorkoutSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  day: z.boolean().optional(),
  workoutPlanId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  workoutPlan: z.union([z.boolean(),z.lazy(() => WorkoutPlanArgsSchema)]).optional(),
  workoutExercises: z.union([z.boolean(),z.lazy(() => WorkoutExerciseFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => WorkoutCountOutputTypeArgsSchema)]).optional(),
}).strict()

// WORKOUT EXERCISE
//------------------------------------------------------

export const WorkoutExerciseIncludeSchema: z.ZodType<Prisma.WorkoutExerciseInclude> = z.object({
  workout: z.union([z.boolean(),z.lazy(() => WorkoutArgsSchema)]).optional(),
  exercise: z.union([z.boolean(),z.lazy(() => ExerciseArgsSchema)]).optional(),
  sets: z.union([z.boolean(),z.lazy(() => WorkoutSetFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => WorkoutExerciseCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const WorkoutExerciseArgsSchema: z.ZodType<Prisma.WorkoutExerciseDefaultArgs> = z.object({
  select: z.lazy(() => WorkoutExerciseSelectSchema).optional(),
  include: z.lazy(() => WorkoutExerciseIncludeSchema).optional(),
}).strict();

export const WorkoutExerciseCountOutputTypeArgsSchema: z.ZodType<Prisma.WorkoutExerciseCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => WorkoutExerciseCountOutputTypeSelectSchema).nullish(),
}).strict();

export const WorkoutExerciseCountOutputTypeSelectSchema: z.ZodType<Prisma.WorkoutExerciseCountOutputTypeSelect> = z.object({
  sets: z.boolean().optional(),
}).strict();

export const WorkoutExerciseSelectSchema: z.ZodType<Prisma.WorkoutExerciseSelect> = z.object({
  id: z.boolean().optional(),
  orderIndex: z.boolean().optional(),
  workoutId: z.boolean().optional(),
  exerciseId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  workout: z.union([z.boolean(),z.lazy(() => WorkoutArgsSchema)]).optional(),
  exercise: z.union([z.boolean(),z.lazy(() => ExerciseArgsSchema)]).optional(),
  sets: z.union([z.boolean(),z.lazy(() => WorkoutSetFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => WorkoutExerciseCountOutputTypeArgsSchema)]).optional(),
}).strict()

// WORKOUT SET
//------------------------------------------------------

export const WorkoutSetIncludeSchema: z.ZodType<Prisma.WorkoutSetInclude> = z.object({
  workoutExercise: z.union([z.boolean(),z.lazy(() => WorkoutExerciseArgsSchema)]).optional(),
}).strict();

export const WorkoutSetArgsSchema: z.ZodType<Prisma.WorkoutSetDefaultArgs> = z.object({
  select: z.lazy(() => WorkoutSetSelectSchema).optional(),
  include: z.lazy(() => WorkoutSetIncludeSchema).optional(),
}).strict();

export const WorkoutSetSelectSchema: z.ZodType<Prisma.WorkoutSetSelect> = z.object({
  id: z.boolean().optional(),
  setNumber: z.boolean().optional(),
  repetitions: z.boolean().optional(),
  weight: z.boolean().optional(),
  restTimeSeconds: z.boolean().optional(),
  workoutExerciseId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  workoutExercise: z.union([z.boolean(),z.lazy(() => WorkoutExerciseArgsSchema)]).optional(),
}).strict()

// EXERCISE
//------------------------------------------------------

export const ExerciseIncludeSchema: z.ZodType<Prisma.ExerciseInclude> = z.object({
  usedInWorkouts: z.union([z.boolean(),z.lazy(() => WorkoutExerciseFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ExerciseCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const ExerciseArgsSchema: z.ZodType<Prisma.ExerciseDefaultArgs> = z.object({
  select: z.lazy(() => ExerciseSelectSchema).optional(),
  include: z.lazy(() => ExerciseIncludeSchema).optional(),
}).strict();

export const ExerciseCountOutputTypeArgsSchema: z.ZodType<Prisma.ExerciseCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ExerciseCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ExerciseCountOutputTypeSelectSchema: z.ZodType<Prisma.ExerciseCountOutputTypeSelect> = z.object({
  usedInWorkouts: z.boolean().optional(),
}).strict();

export const ExerciseSelectSchema: z.ZodType<Prisma.ExerciseSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  muscleGroup: z.boolean().optional(),
  description: z.boolean().optional(),
  imageUrl: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  usedInWorkouts: z.union([z.boolean(),z.lazy(() => WorkoutExerciseFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ExerciseCountOutputTypeArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumROLEFilterSchema), z.lazy(() => ROLESchema) ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  birthDate: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  gender: z.union([ z.lazy(() => EnumGENDERFilterSchema), z.lazy(() => GENDERSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  auth: z.union([ z.lazy(() => AuthNullableScalarRelationFilterSchema), z.lazy(() => AuthWhereInputSchema) ]).optional().nullable(),
  Diet: z.lazy(() => DietListRelationFilterSchema).optional(),
  WorkoutPlan: z.lazy(() => WorkoutPlanListRelationFilterSchema).optional(),
  bodyMetrics: z.lazy(() => BodyMetricListRelationFilterSchema).optional(),
  food: z.lazy(() => FoodListRelationFilterSchema).optional(),
});

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  birthDate: z.lazy(() => SortOrderSchema).optional(),
  gender: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  auth: z.lazy(() => AuthOrderByWithRelationInputSchema).optional(),
  Diet: z.lazy(() => DietOrderByRelationAggregateInputSchema).optional(),
  WorkoutPlan: z.lazy(() => WorkoutPlanOrderByRelationAggregateInputSchema).optional(),
  bodyMetrics: z.lazy(() => BodyMetricOrderByRelationAggregateInputSchema).optional(),
  food: z.lazy(() => FoodOrderByRelationAggregateInputSchema).optional(),
});

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  role: z.union([ z.lazy(() => EnumROLEFilterSchema), z.lazy(() => ROLESchema) ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  birthDate: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  gender: z.union([ z.lazy(() => EnumGENDERFilterSchema), z.lazy(() => GENDERSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  auth: z.union([ z.lazy(() => AuthNullableScalarRelationFilterSchema), z.lazy(() => AuthWhereInputSchema) ]).optional().nullable(),
  Diet: z.lazy(() => DietListRelationFilterSchema).optional(),
  WorkoutPlan: z.lazy(() => WorkoutPlanListRelationFilterSchema).optional(),
  bodyMetrics: z.lazy(() => BodyMetricListRelationFilterSchema).optional(),
  food: z.lazy(() => FoodListRelationFilterSchema).optional(),
}));

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  birthDate: z.lazy(() => SortOrderSchema).optional(),
  gender: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
});

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumROLEWithAggregatesFilterSchema), z.lazy(() => ROLESchema) ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  birthDate: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  gender: z.union([ z.lazy(() => EnumGENDERWithAggregatesFilterSchema), z.lazy(() => GENDERSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const AuthWhereInputSchema: z.ZodType<Prisma.AuthWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => AuthWhereInputSchema), z.lazy(() => AuthWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AuthWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AuthWhereInputSchema), z.lazy(() => AuthWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
});

export const AuthOrderByWithRelationInputSchema: z.ZodType<Prisma.AuthOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
});

export const AuthWhereUniqueInputSchema: z.ZodType<Prisma.AuthWhereUniqueInput> = z.union([
  z.object({
    id: z.uuid(),
    email: z.string(),
    userId: z.string(),
  }),
  z.object({
    id: z.uuid(),
    email: z.string(),
  }),
  z.object({
    id: z.uuid(),
    userId: z.string(),
  }),
  z.object({
    id: z.uuid(),
  }),
  z.object({
    email: z.string(),
    userId: z.string(),
  }),
  z.object({
    email: z.string(),
  }),
  z.object({
    userId: z.string(),
  }),
])
.and(z.strictObject({
  id: z.uuid().optional(),
  email: z.string().optional(),
  userId: z.string().optional(),
  AND: z.union([ z.lazy(() => AuthWhereInputSchema), z.lazy(() => AuthWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AuthWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AuthWhereInputSchema), z.lazy(() => AuthWhereInputSchema).array() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
}));

export const AuthOrderByWithAggregationInputSchema: z.ZodType<Prisma.AuthOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AuthCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AuthMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AuthMinOrderByAggregateInputSchema).optional(),
});

export const AuthScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AuthScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => AuthScalarWhereWithAggregatesInputSchema), z.lazy(() => AuthScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AuthScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AuthScalarWhereWithAggregatesInputSchema), z.lazy(() => AuthScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const BodyMetricWhereInputSchema: z.ZodType<Prisma.BodyMetricWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => BodyMetricWhereInputSchema), z.lazy(() => BodyMetricWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BodyMetricWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BodyMetricWhereInputSchema), z.lazy(() => BodyMetricWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  weight: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  height: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  activityLevel: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  bodyFat: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  muscleRate: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
});

export const BodyMetricOrderByWithRelationInputSchema: z.ZodType<Prisma.BodyMetricOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  weight: z.lazy(() => SortOrderSchema).optional(),
  height: z.lazy(() => SortOrderSchema).optional(),
  activityLevel: z.lazy(() => SortOrderSchema).optional(),
  bodyFat: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  muscleRate: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
});

export const BodyMetricWhereUniqueInputSchema: z.ZodType<Prisma.BodyMetricWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => BodyMetricWhereInputSchema), z.lazy(() => BodyMetricWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BodyMetricWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BodyMetricWhereInputSchema), z.lazy(() => BodyMetricWhereInputSchema).array() ]).optional(),
  weight: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  height: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  activityLevel: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  bodyFat: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  muscleRate: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
}));

export const BodyMetricOrderByWithAggregationInputSchema: z.ZodType<Prisma.BodyMetricOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  weight: z.lazy(() => SortOrderSchema).optional(),
  height: z.lazy(() => SortOrderSchema).optional(),
  activityLevel: z.lazy(() => SortOrderSchema).optional(),
  bodyFat: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  muscleRate: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => BodyMetricCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => BodyMetricAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => BodyMetricMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => BodyMetricMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => BodyMetricSumOrderByAggregateInputSchema).optional(),
});

export const BodyMetricScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.BodyMetricScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => BodyMetricScalarWhereWithAggregatesInputSchema), z.lazy(() => BodyMetricScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => BodyMetricScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BodyMetricScalarWhereWithAggregatesInputSchema), z.lazy(() => BodyMetricScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  weight: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema), z.number() ]).optional(),
  height: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  activityLevel: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  bodyFat: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  muscleRate: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const DietWhereInputSchema: z.ZodType<Prisma.DietWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => DietWhereInputSchema), z.lazy(() => DietWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DietWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DietWhereInputSchema), z.lazy(() => DietWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  dailyKcalGoal: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  dailyProteinGoal: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  dailyCarbGoal: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  dailyFatGoal: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  dailyWaterGoal: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  Meal: z.lazy(() => MealListRelationFilterSchema).optional(),
});

export const DietOrderByWithRelationInputSchema: z.ZodType<Prisma.DietOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dailyKcalGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyProteinGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyCarbGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyFatGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyWaterGoal: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  Meal: z.lazy(() => MealOrderByRelationAggregateInputSchema).optional(),
});

export const DietWhereUniqueInputSchema: z.ZodType<Prisma.DietWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => DietWhereInputSchema), z.lazy(() => DietWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DietWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DietWhereInputSchema), z.lazy(() => DietWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  dailyKcalGoal: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  dailyProteinGoal: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  dailyCarbGoal: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  dailyFatGoal: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  dailyWaterGoal: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  Meal: z.lazy(() => MealListRelationFilterSchema).optional(),
}));

export const DietOrderByWithAggregationInputSchema: z.ZodType<Prisma.DietOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dailyKcalGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyProteinGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyCarbGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyFatGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyWaterGoal: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => DietCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => DietAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DietMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DietMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => DietSumOrderByAggregateInputSchema).optional(),
});

export const DietScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.DietScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => DietScalarWhereWithAggregatesInputSchema), z.lazy(() => DietScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => DietScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DietScalarWhereWithAggregatesInputSchema), z.lazy(() => DietScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  dailyKcalGoal: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  dailyProteinGoal: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  dailyCarbGoal: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  dailyFatGoal: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  dailyWaterGoal: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const MealWhereInputSchema: z.ZodType<Prisma.MealWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MealWhereInputSchema), z.lazy(() => MealWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MealWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MealWhereInputSchema), z.lazy(() => MealWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  time: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  orderIndex: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  dietId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  diet: z.union([ z.lazy(() => DietScalarRelationFilterSchema), z.lazy(() => DietWhereInputSchema) ]).optional(),
  foods: z.lazy(() => FoodInMealListRelationFilterSchema).optional(),
});

export const MealOrderByWithRelationInputSchema: z.ZodType<Prisma.MealOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  orderIndex: z.lazy(() => SortOrderSchema).optional(),
  dietId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  diet: z.lazy(() => DietOrderByWithRelationInputSchema).optional(),
  foods: z.lazy(() => FoodInMealOrderByRelationAggregateInputSchema).optional(),
});

export const MealWhereUniqueInputSchema: z.ZodType<Prisma.MealWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => MealWhereInputSchema), z.lazy(() => MealWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MealWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MealWhereInputSchema), z.lazy(() => MealWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  time: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  orderIndex: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  dietId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  diet: z.union([ z.lazy(() => DietScalarRelationFilterSchema), z.lazy(() => DietWhereInputSchema) ]).optional(),
  foods: z.lazy(() => FoodInMealListRelationFilterSchema).optional(),
}));

export const MealOrderByWithAggregationInputSchema: z.ZodType<Prisma.MealOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  orderIndex: z.lazy(() => SortOrderSchema).optional(),
  dietId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => MealCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => MealAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MealMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MealMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => MealSumOrderByAggregateInputSchema).optional(),
});

export const MealScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MealScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MealScalarWhereWithAggregatesInputSchema), z.lazy(() => MealScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MealScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MealScalarWhereWithAggregatesInputSchema), z.lazy(() => MealScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  time: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  orderIndex: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  dietId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const FoodInMealWhereInputSchema: z.ZodType<Prisma.FoodInMealWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => FoodInMealWhereInputSchema), z.lazy(() => FoodInMealWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FoodInMealWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FoodInMealWhereInputSchema), z.lazy(() => FoodInMealWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  mealId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  foodId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  meal: z.union([ z.lazy(() => MealScalarRelationFilterSchema), z.lazy(() => MealWhereInputSchema) ]).optional(),
  food: z.union([ z.lazy(() => FoodScalarRelationFilterSchema), z.lazy(() => FoodWhereInputSchema) ]).optional(),
});

export const FoodInMealOrderByWithRelationInputSchema: z.ZodType<Prisma.FoodInMealOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  mealId: z.lazy(() => SortOrderSchema).optional(),
  foodId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  meal: z.lazy(() => MealOrderByWithRelationInputSchema).optional(),
  food: z.lazy(() => FoodOrderByWithRelationInputSchema).optional(),
});

export const FoodInMealWhereUniqueInputSchema: z.ZodType<Prisma.FoodInMealWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => FoodInMealWhereInputSchema), z.lazy(() => FoodInMealWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FoodInMealWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FoodInMealWhereInputSchema), z.lazy(() => FoodInMealWhereInputSchema).array() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  mealId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  foodId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  meal: z.union([ z.lazy(() => MealScalarRelationFilterSchema), z.lazy(() => MealWhereInputSchema) ]).optional(),
  food: z.union([ z.lazy(() => FoodScalarRelationFilterSchema), z.lazy(() => FoodWhereInputSchema) ]).optional(),
}));

export const FoodInMealOrderByWithAggregationInputSchema: z.ZodType<Prisma.FoodInMealOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  mealId: z.lazy(() => SortOrderSchema).optional(),
  foodId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => FoodInMealCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => FoodInMealAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => FoodInMealMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => FoodInMealMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => FoodInMealSumOrderByAggregateInputSchema).optional(),
});

export const FoodInMealScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.FoodInMealScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => FoodInMealScalarWhereWithAggregatesInputSchema), z.lazy(() => FoodInMealScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => FoodInMealScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FoodInMealScalarWhereWithAggregatesInputSchema), z.lazy(() => FoodInMealScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  mealId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  foodId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const FoodWhereInputSchema: z.ZodType<Prisma.FoodWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => FoodWhereInputSchema), z.lazy(() => FoodWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FoodWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FoodWhereInputSchema), z.lazy(() => FoodWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  baseUnit: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  baseAmount: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  calories: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  carbohydrate: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  protein: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  fat: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  fiber: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  foodInMeals: z.lazy(() => FoodInMealListRelationFilterSchema).optional(),
});

export const FoodOrderByWithRelationInputSchema: z.ZodType<Prisma.FoodOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  baseUnit: z.lazy(() => SortOrderSchema).optional(),
  baseAmount: z.lazy(() => SortOrderSchema).optional(),
  calories: z.lazy(() => SortOrderSchema).optional(),
  carbohydrate: z.lazy(() => SortOrderSchema).optional(),
  protein: z.lazy(() => SortOrderSchema).optional(),
  fat: z.lazy(() => SortOrderSchema).optional(),
  fiber: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  foodInMeals: z.lazy(() => FoodInMealOrderByRelationAggregateInputSchema).optional(),
});

export const FoodWhereUniqueInputSchema: z.ZodType<Omit<Prisma.FoodWhereUniqueInput, "id" | "userId" | "createdAt" | "updatedAt">> = z.union([
  z.object({
    // omitted: id: z.uuid(),
    id_userId: z.lazy(() => FoodIdUserIdCompoundUniqueInputSchema),
  }),
  z.object({
    // omitted: id: z.uuid(),
  }),
  z.object({
    id_userId: z.lazy(() => FoodIdUserIdCompoundUniqueInputSchema),
  }),
])
.and(z.strictObject({
  // omitted: id: z.uuid().optional(),
  id_userId: z.lazy(() => FoodIdUserIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => FoodWhereInputSchema), z.lazy(() => FoodWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FoodWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FoodWhereInputSchema), z.lazy(() => FoodWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  baseUnit: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  baseAmount: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  calories: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  carbohydrate: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  protein: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  fat: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  fiber: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  // omitted: userId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  // omitted: createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  // omitted: updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  foodInMeals: z.lazy(() => FoodInMealListRelationFilterSchema).optional(),
}));

export const FoodOrderByWithAggregationInputSchema: z.ZodType<Prisma.FoodOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  baseUnit: z.lazy(() => SortOrderSchema).optional(),
  baseAmount: z.lazy(() => SortOrderSchema).optional(),
  calories: z.lazy(() => SortOrderSchema).optional(),
  carbohydrate: z.lazy(() => SortOrderSchema).optional(),
  protein: z.lazy(() => SortOrderSchema).optional(),
  fat: z.lazy(() => SortOrderSchema).optional(),
  fiber: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => FoodCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => FoodAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => FoodMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => FoodMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => FoodSumOrderByAggregateInputSchema).optional(),
});

export const FoodScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.FoodScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => FoodScalarWhereWithAggregatesInputSchema), z.lazy(() => FoodScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => FoodScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FoodScalarWhereWithAggregatesInputSchema), z.lazy(() => FoodScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  baseUnit: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  baseAmount: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  calories: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  carbohydrate: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  protein: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  fat: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  fiber: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const WorkoutPlanWhereInputSchema: z.ZodType<Prisma.WorkoutPlanWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutPlanWhereInputSchema), z.lazy(() => WorkoutPlanWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutPlanWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutPlanWhereInputSchema), z.lazy(() => WorkoutPlanWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  isActive: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  workouts: z.lazy(() => WorkoutListRelationFilterSchema).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
});

export const WorkoutPlanOrderByWithRelationInputSchema: z.ZodType<Prisma.WorkoutPlanOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  workouts: z.lazy(() => WorkoutOrderByRelationAggregateInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
});

export const WorkoutPlanWhereUniqueInputSchema: z.ZodType<Prisma.WorkoutPlanWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => WorkoutPlanWhereInputSchema), z.lazy(() => WorkoutPlanWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutPlanWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutPlanWhereInputSchema), z.lazy(() => WorkoutPlanWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  isActive: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  workouts: z.lazy(() => WorkoutListRelationFilterSchema).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
}));

export const WorkoutPlanOrderByWithAggregationInputSchema: z.ZodType<Prisma.WorkoutPlanOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => WorkoutPlanCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => WorkoutPlanMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => WorkoutPlanMinOrderByAggregateInputSchema).optional(),
});

export const WorkoutPlanScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.WorkoutPlanScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutPlanScalarWhereWithAggregatesInputSchema), z.lazy(() => WorkoutPlanScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutPlanScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutPlanScalarWhereWithAggregatesInputSchema), z.lazy(() => WorkoutPlanScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  isActive: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const WorkoutWhereInputSchema: z.ZodType<Prisma.WorkoutWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutWhereInputSchema), z.lazy(() => WorkoutWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutWhereInputSchema), z.lazy(() => WorkoutWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  day: z.union([ z.lazy(() => EnumWORKOUT_DAYFilterSchema), z.lazy(() => WORKOUT_DAYSchema) ]).optional(),
  workoutPlanId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  workoutPlan: z.union([ z.lazy(() => WorkoutPlanScalarRelationFilterSchema), z.lazy(() => WorkoutPlanWhereInputSchema) ]).optional(),
  workoutExercises: z.lazy(() => WorkoutExerciseListRelationFilterSchema).optional(),
});

export const WorkoutOrderByWithRelationInputSchema: z.ZodType<Prisma.WorkoutOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  day: z.lazy(() => SortOrderSchema).optional(),
  workoutPlanId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  workoutPlan: z.lazy(() => WorkoutPlanOrderByWithRelationInputSchema).optional(),
  workoutExercises: z.lazy(() => WorkoutExerciseOrderByRelationAggregateInputSchema).optional(),
});

export const WorkoutWhereUniqueInputSchema: z.ZodType<Prisma.WorkoutWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => WorkoutWhereInputSchema), z.lazy(() => WorkoutWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutWhereInputSchema), z.lazy(() => WorkoutWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  day: z.union([ z.lazy(() => EnumWORKOUT_DAYFilterSchema), z.lazy(() => WORKOUT_DAYSchema) ]).optional(),
  workoutPlanId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  workoutPlan: z.union([ z.lazy(() => WorkoutPlanScalarRelationFilterSchema), z.lazy(() => WorkoutPlanWhereInputSchema) ]).optional(),
  workoutExercises: z.lazy(() => WorkoutExerciseListRelationFilterSchema).optional(),
}));

export const WorkoutOrderByWithAggregationInputSchema: z.ZodType<Prisma.WorkoutOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  day: z.lazy(() => SortOrderSchema).optional(),
  workoutPlanId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => WorkoutCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => WorkoutMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => WorkoutMinOrderByAggregateInputSchema).optional(),
});

export const WorkoutScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.WorkoutScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutScalarWhereWithAggregatesInputSchema), z.lazy(() => WorkoutScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutScalarWhereWithAggregatesInputSchema), z.lazy(() => WorkoutScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  day: z.union([ z.lazy(() => EnumWORKOUT_DAYWithAggregatesFilterSchema), z.lazy(() => WORKOUT_DAYSchema) ]).optional(),
  workoutPlanId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const WorkoutExerciseWhereInputSchema: z.ZodType<Prisma.WorkoutExerciseWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutExerciseWhereInputSchema), z.lazy(() => WorkoutExerciseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutExerciseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutExerciseWhereInputSchema), z.lazy(() => WorkoutExerciseWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  orderIndex: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  workoutId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  exerciseId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  workout: z.union([ z.lazy(() => WorkoutScalarRelationFilterSchema), z.lazy(() => WorkoutWhereInputSchema) ]).optional(),
  exercise: z.union([ z.lazy(() => ExerciseScalarRelationFilterSchema), z.lazy(() => ExerciseWhereInputSchema) ]).optional(),
  sets: z.lazy(() => WorkoutSetListRelationFilterSchema).optional(),
});

export const WorkoutExerciseOrderByWithRelationInputSchema: z.ZodType<Prisma.WorkoutExerciseOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  orderIndex: z.lazy(() => SortOrderSchema).optional(),
  workoutId: z.lazy(() => SortOrderSchema).optional(),
  exerciseId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  workout: z.lazy(() => WorkoutOrderByWithRelationInputSchema).optional(),
  exercise: z.lazy(() => ExerciseOrderByWithRelationInputSchema).optional(),
  sets: z.lazy(() => WorkoutSetOrderByRelationAggregateInputSchema).optional(),
});

export const WorkoutExerciseWhereUniqueInputSchema: z.ZodType<Prisma.WorkoutExerciseWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => WorkoutExerciseWhereInputSchema), z.lazy(() => WorkoutExerciseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutExerciseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutExerciseWhereInputSchema), z.lazy(() => WorkoutExerciseWhereInputSchema).array() ]).optional(),
  orderIndex: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  workoutId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  exerciseId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  workout: z.union([ z.lazy(() => WorkoutScalarRelationFilterSchema), z.lazy(() => WorkoutWhereInputSchema) ]).optional(),
  exercise: z.union([ z.lazy(() => ExerciseScalarRelationFilterSchema), z.lazy(() => ExerciseWhereInputSchema) ]).optional(),
  sets: z.lazy(() => WorkoutSetListRelationFilterSchema).optional(),
}));

export const WorkoutExerciseOrderByWithAggregationInputSchema: z.ZodType<Prisma.WorkoutExerciseOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  orderIndex: z.lazy(() => SortOrderSchema).optional(),
  workoutId: z.lazy(() => SortOrderSchema).optional(),
  exerciseId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => WorkoutExerciseCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => WorkoutExerciseAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => WorkoutExerciseMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => WorkoutExerciseMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => WorkoutExerciseSumOrderByAggregateInputSchema).optional(),
});

export const WorkoutExerciseScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.WorkoutExerciseScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutExerciseScalarWhereWithAggregatesInputSchema), z.lazy(() => WorkoutExerciseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutExerciseScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutExerciseScalarWhereWithAggregatesInputSchema), z.lazy(() => WorkoutExerciseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  orderIndex: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  workoutId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  exerciseId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const WorkoutSetWhereInputSchema: z.ZodType<Prisma.WorkoutSetWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutSetWhereInputSchema), z.lazy(() => WorkoutSetWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutSetWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutSetWhereInputSchema), z.lazy(() => WorkoutSetWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  setNumber: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  repetitions: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  weight: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  restTimeSeconds: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  workoutExerciseId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  workoutExercise: z.union([ z.lazy(() => WorkoutExerciseScalarRelationFilterSchema), z.lazy(() => WorkoutExerciseWhereInputSchema) ]).optional(),
});

export const WorkoutSetOrderByWithRelationInputSchema: z.ZodType<Prisma.WorkoutSetOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  setNumber: z.lazy(() => SortOrderSchema).optional(),
  repetitions: z.lazy(() => SortOrderSchema).optional(),
  weight: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  restTimeSeconds: z.lazy(() => SortOrderSchema).optional(),
  workoutExerciseId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  workoutExercise: z.lazy(() => WorkoutExerciseOrderByWithRelationInputSchema).optional(),
});

export const WorkoutSetWhereUniqueInputSchema: z.ZodType<Prisma.WorkoutSetWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => WorkoutSetWhereInputSchema), z.lazy(() => WorkoutSetWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutSetWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutSetWhereInputSchema), z.lazy(() => WorkoutSetWhereInputSchema).array() ]).optional(),
  setNumber: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  repetitions: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  weight: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  restTimeSeconds: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  workoutExerciseId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  workoutExercise: z.union([ z.lazy(() => WorkoutExerciseScalarRelationFilterSchema), z.lazy(() => WorkoutExerciseWhereInputSchema) ]).optional(),
}));

export const WorkoutSetOrderByWithAggregationInputSchema: z.ZodType<Prisma.WorkoutSetOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  setNumber: z.lazy(() => SortOrderSchema).optional(),
  repetitions: z.lazy(() => SortOrderSchema).optional(),
  weight: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  restTimeSeconds: z.lazy(() => SortOrderSchema).optional(),
  workoutExerciseId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => WorkoutSetCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => WorkoutSetAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => WorkoutSetMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => WorkoutSetMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => WorkoutSetSumOrderByAggregateInputSchema).optional(),
});

export const WorkoutSetScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.WorkoutSetScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutSetScalarWhereWithAggregatesInputSchema), z.lazy(() => WorkoutSetScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutSetScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutSetScalarWhereWithAggregatesInputSchema), z.lazy(() => WorkoutSetScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  setNumber: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  repetitions: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  weight: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  restTimeSeconds: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  workoutExerciseId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const ExerciseWhereInputSchema: z.ZodType<Prisma.ExerciseWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ExerciseWhereInputSchema), z.lazy(() => ExerciseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExerciseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExerciseWhereInputSchema), z.lazy(() => ExerciseWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  muscleGroup: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  imageUrl: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  usedInWorkouts: z.lazy(() => WorkoutExerciseListRelationFilterSchema).optional(),
});

export const ExerciseOrderByWithRelationInputSchema: z.ZodType<Prisma.ExerciseOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  muscleGroup: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  imageUrl: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  usedInWorkouts: z.lazy(() => WorkoutExerciseOrderByRelationAggregateInputSchema).optional(),
});

export const ExerciseWhereUniqueInputSchema: z.ZodType<Prisma.ExerciseWhereUniqueInput> = z.union([
  z.object({
    id: z.uuid(),
    name: z.string(),
  }),
  z.object({
    id: z.uuid(),
  }),
  z.object({
    name: z.string(),
  }),
])
.and(z.strictObject({
  id: z.uuid().optional(),
  name: z.string().optional(),
  AND: z.union([ z.lazy(() => ExerciseWhereInputSchema), z.lazy(() => ExerciseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExerciseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExerciseWhereInputSchema), z.lazy(() => ExerciseWhereInputSchema).array() ]).optional(),
  muscleGroup: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  imageUrl: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  usedInWorkouts: z.lazy(() => WorkoutExerciseListRelationFilterSchema).optional(),
}));

export const ExerciseOrderByWithAggregationInputSchema: z.ZodType<Prisma.ExerciseOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  muscleGroup: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  imageUrl: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ExerciseCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ExerciseMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ExerciseMinOrderByAggregateInputSchema).optional(),
});

export const ExerciseScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ExerciseScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ExerciseScalarWhereWithAggregatesInputSchema), z.lazy(() => ExerciseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExerciseScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExerciseScalarWhereWithAggregatesInputSchema), z.lazy(() => ExerciseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  muscleGroup: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  imageUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  role: z.lazy(() => ROLESchema).optional(),
  name: z.string(),
  birthDate: z.coerce.date(),
  gender: z.lazy(() => GENDERSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  auth: z.lazy(() => AuthCreateNestedOneWithoutUserInputSchema).optional(),
  Diet: z.lazy(() => DietCreateNestedManyWithoutUserInputSchema).optional(),
  WorkoutPlan: z.lazy(() => WorkoutPlanCreateNestedManyWithoutUserInputSchema).optional(),
  bodyMetrics: z.lazy(() => BodyMetricCreateNestedManyWithoutUserInputSchema).optional(),
  food: z.lazy(() => FoodCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  role: z.lazy(() => ROLESchema).optional(),
  name: z.string(),
  birthDate: z.coerce.date(),
  gender: z.lazy(() => GENDERSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  auth: z.lazy(() => AuthUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  Diet: z.lazy(() => DietUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  WorkoutPlan: z.lazy(() => WorkoutPlanUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  bodyMetrics: z.lazy(() => BodyMetricUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  food: z.lazy(() => FoodUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => ROLESchema), z.lazy(() => EnumROLEFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  birthDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GENDERSchema), z.lazy(() => EnumGENDERFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  auth: z.lazy(() => AuthUpdateOneWithoutUserNestedInputSchema).optional(),
  Diet: z.lazy(() => DietUpdateManyWithoutUserNestedInputSchema).optional(),
  WorkoutPlan: z.lazy(() => WorkoutPlanUpdateManyWithoutUserNestedInputSchema).optional(),
  bodyMetrics: z.lazy(() => BodyMetricUpdateManyWithoutUserNestedInputSchema).optional(),
  food: z.lazy(() => FoodUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => ROLESchema), z.lazy(() => EnumROLEFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  birthDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GENDERSchema), z.lazy(() => EnumGENDERFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  auth: z.lazy(() => AuthUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  Diet: z.lazy(() => DietUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  WorkoutPlan: z.lazy(() => WorkoutPlanUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  bodyMetrics: z.lazy(() => BodyMetricUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  food: z.lazy(() => FoodUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  role: z.lazy(() => ROLESchema).optional(),
  name: z.string(),
  birthDate: z.coerce.date(),
  gender: z.lazy(() => GENDERSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => ROLESchema), z.lazy(() => EnumROLEFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  birthDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GENDERSchema), z.lazy(() => EnumGENDERFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => ROLESchema), z.lazy(() => EnumROLEFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  birthDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GENDERSchema), z.lazy(() => EnumGENDERFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const AuthCreateInputSchema: z.ZodType<Prisma.AuthCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  email: z.string(),
  password: z.string(),
  user: z.lazy(() => UserCreateNestedOneWithoutAuthInputSchema),
});

export const AuthUncheckedCreateInputSchema: z.ZodType<Prisma.AuthUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  email: z.string(),
  password: z.string(),
  userId: z.string(),
});

export const AuthUpdateInputSchema: z.ZodType<Prisma.AuthUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutAuthNestedInputSchema).optional(),
});

export const AuthUncheckedUpdateInputSchema: z.ZodType<Prisma.AuthUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const AuthCreateManyInputSchema: z.ZodType<Prisma.AuthCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  email: z.string(),
  password: z.string(),
  userId: z.string(),
});

export const AuthUpdateManyMutationInputSchema: z.ZodType<Prisma.AuthUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const AuthUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AuthUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const BodyMetricCreateInputSchema: z.ZodType<Prisma.BodyMetricCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  weight: z.number(),
  height: z.number().int(),
  activityLevel: z.number().int(),
  bodyFat: z.number().optional().nullable(),
  muscleRate: z.number().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutBodyMetricsInputSchema),
});

export const BodyMetricUncheckedCreateInputSchema: z.ZodType<Prisma.BodyMetricUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  weight: z.number(),
  height: z.number().int(),
  activityLevel: z.number().int(),
  bodyFat: z.number().optional().nullable(),
  muscleRate: z.number().optional().nullable(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const BodyMetricUpdateInputSchema: z.ZodType<Prisma.BodyMetricUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  height: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  activityLevel: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bodyFat: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  muscleRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutBodyMetricsNestedInputSchema).optional(),
});

export const BodyMetricUncheckedUpdateInputSchema: z.ZodType<Prisma.BodyMetricUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  height: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  activityLevel: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bodyFat: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  muscleRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const BodyMetricCreateManyInputSchema: z.ZodType<Prisma.BodyMetricCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  weight: z.number(),
  height: z.number().int(),
  activityLevel: z.number().int(),
  bodyFat: z.number().optional().nullable(),
  muscleRate: z.number().optional().nullable(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const BodyMetricUpdateManyMutationInputSchema: z.ZodType<Prisma.BodyMetricUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  height: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  activityLevel: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bodyFat: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  muscleRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const BodyMetricUncheckedUpdateManyInputSchema: z.ZodType<Prisma.BodyMetricUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  height: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  activityLevel: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bodyFat: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  muscleRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const DietCreateInputSchema: z.ZodType<Prisma.DietCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  dailyKcalGoal: z.number().int(),
  dailyProteinGoal: z.number().int(),
  dailyCarbGoal: z.number().int(),
  dailyFatGoal: z.number().int(),
  dailyWaterGoal: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutDietInputSchema),
  Meal: z.lazy(() => MealCreateNestedManyWithoutDietInputSchema).optional(),
});

export const DietUncheckedCreateInputSchema: z.ZodType<Prisma.DietUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  dailyKcalGoal: z.number().int(),
  dailyProteinGoal: z.number().int(),
  dailyCarbGoal: z.number().int(),
  dailyFatGoal: z.number().int(),
  dailyWaterGoal: z.number().int(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Meal: z.lazy(() => MealUncheckedCreateNestedManyWithoutDietInputSchema).optional(),
});

export const DietUpdateInputSchema: z.ZodType<Prisma.DietUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dailyKcalGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyProteinGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyCarbGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyFatGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyWaterGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutDietNestedInputSchema).optional(),
  Meal: z.lazy(() => MealUpdateManyWithoutDietNestedInputSchema).optional(),
});

export const DietUncheckedUpdateInputSchema: z.ZodType<Prisma.DietUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dailyKcalGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyProteinGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyCarbGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyFatGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyWaterGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Meal: z.lazy(() => MealUncheckedUpdateManyWithoutDietNestedInputSchema).optional(),
});

export const DietCreateManyInputSchema: z.ZodType<Prisma.DietCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  dailyKcalGoal: z.number().int(),
  dailyProteinGoal: z.number().int(),
  dailyCarbGoal: z.number().int(),
  dailyFatGoal: z.number().int(),
  dailyWaterGoal: z.number().int(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const DietUpdateManyMutationInputSchema: z.ZodType<Prisma.DietUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dailyKcalGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyProteinGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyCarbGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyFatGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyWaterGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const DietUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DietUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dailyKcalGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyProteinGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyCarbGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyFatGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyWaterGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MealCreateInputSchema: z.ZodType<Prisma.MealCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  time: z.string(),
  orderIndex: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  diet: z.lazy(() => DietCreateNestedOneWithoutMealInputSchema),
  foods: z.lazy(() => FoodInMealCreateNestedManyWithoutMealInputSchema).optional(),
});

export const MealUncheckedCreateInputSchema: z.ZodType<Prisma.MealUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  time: z.string(),
  orderIndex: z.number().int(),
  dietId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  foods: z.lazy(() => FoodInMealUncheckedCreateNestedManyWithoutMealInputSchema).optional(),
});

export const MealUpdateInputSchema: z.ZodType<Prisma.MealUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  diet: z.lazy(() => DietUpdateOneRequiredWithoutMealNestedInputSchema).optional(),
  foods: z.lazy(() => FoodInMealUpdateManyWithoutMealNestedInputSchema).optional(),
});

export const MealUncheckedUpdateInputSchema: z.ZodType<Prisma.MealUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dietId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  foods: z.lazy(() => FoodInMealUncheckedUpdateManyWithoutMealNestedInputSchema).optional(),
});

export const MealCreateManyInputSchema: z.ZodType<Prisma.MealCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  time: z.string(),
  orderIndex: z.number().int(),
  dietId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const MealUpdateManyMutationInputSchema: z.ZodType<Prisma.MealUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MealUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MealUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dietId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const FoodInMealCreateInputSchema: z.ZodType<Prisma.FoodInMealCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  quantity: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  meal: z.lazy(() => MealCreateNestedOneWithoutFoodsInputSchema),
  food: z.lazy(() => FoodCreateNestedOneWithoutFoodInMealsInputSchema),
});

export const FoodInMealUncheckedCreateInputSchema: z.ZodType<Prisma.FoodInMealUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  quantity: z.number().int(),
  mealId: z.string(),
  foodId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const FoodInMealUpdateInputSchema: z.ZodType<Prisma.FoodInMealUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  meal: z.lazy(() => MealUpdateOneRequiredWithoutFoodsNestedInputSchema).optional(),
  food: z.lazy(() => FoodUpdateOneRequiredWithoutFoodInMealsNestedInputSchema).optional(),
});

export const FoodInMealUncheckedUpdateInputSchema: z.ZodType<Prisma.FoodInMealUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  mealId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  foodId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const FoodInMealCreateManyInputSchema: z.ZodType<Prisma.FoodInMealCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  quantity: z.number().int(),
  mealId: z.string(),
  foodId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const FoodInMealUpdateManyMutationInputSchema: z.ZodType<Prisma.FoodInMealUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const FoodInMealUncheckedUpdateManyInputSchema: z.ZodType<Prisma.FoodInMealUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  mealId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  foodId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const FoodCreateInputSchema: z.ZodType<Omit<Prisma.FoodCreateInput, "id" | "createdAt" | "updatedAt">> = z.strictObject({
  // omitted: id: z.uuid().optional(),
  name: z.string(),
  baseUnit: z.string().optional(),
  baseAmount: z.number().int().optional(),
  calories: z.number().int(),
  carbohydrate: z.number().int(),
  protein: z.number().int(),
  fat: z.number().int(),
  fiber: z.number().int().optional().nullable(),
  // omitted: createdAt: z.coerce.date().optional(),
  // omitted: updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutFoodInputSchema).optional(),
  foodInMeals: z.lazy(() => FoodInMealCreateNestedManyWithoutFoodInputSchema).optional(),
});

export const FoodUncheckedCreateInputSchema: z.ZodType<Omit<Prisma.FoodUncheckedCreateInput, "id" | "userId" | "createdAt" | "updatedAt">> = z.strictObject({
  // omitted: id: z.uuid().optional(),
  name: z.string(),
  baseUnit: z.string().optional(),
  baseAmount: z.number().int().optional(),
  calories: z.number().int(),
  carbohydrate: z.number().int(),
  protein: z.number().int(),
  fat: z.number().int(),
  fiber: z.number().int().optional().nullable(),
  // omitted: userId: z.string().optional().nullable(),
  // omitted: createdAt: z.coerce.date().optional(),
  // omitted: updatedAt: z.coerce.date().optional(),
  foodInMeals: z.lazy(() => FoodInMealUncheckedCreateNestedManyWithoutFoodInputSchema).optional(),
});

export const FoodUpdateInputSchema: z.ZodType<Omit<Prisma.FoodUpdateInput, "id" | "createdAt" | "updatedAt">> = z.strictObject({
  // omitted: id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  baseUnit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  baseAmount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  calories: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  carbohydrate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  protein: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fat: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fiber: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  // omitted: createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneWithoutFoodNestedInputSchema).optional(),
  foodInMeals: z.lazy(() => FoodInMealUpdateManyWithoutFoodNestedInputSchema).optional(),
});

export const FoodUncheckedUpdateInputSchema: z.ZodType<Omit<Prisma.FoodUncheckedUpdateInput, "id" | "userId" | "createdAt" | "updatedAt">> = z.strictObject({
  // omitted: id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  baseUnit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  baseAmount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  calories: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  carbohydrate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  protein: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fat: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fiber: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  // omitted: userId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  // omitted: createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  foodInMeals: z.lazy(() => FoodInMealUncheckedUpdateManyWithoutFoodNestedInputSchema).optional(),
});

export const FoodCreateManyInputSchema: z.ZodType<Omit<Prisma.FoodCreateManyInput, "id" | "userId" | "createdAt" | "updatedAt">> = z.strictObject({
  // omitted: id: z.uuid().optional(),
  name: z.string(),
  baseUnit: z.string().optional(),
  baseAmount: z.number().int().optional(),
  calories: z.number().int(),
  carbohydrate: z.number().int(),
  protein: z.number().int(),
  fat: z.number().int(),
  fiber: z.number().int().optional().nullable(),
  // omitted: userId: z.string().optional().nullable(),
  // omitted: createdAt: z.coerce.date().optional(),
  // omitted: updatedAt: z.coerce.date().optional(),
});

export const FoodUpdateManyMutationInputSchema: z.ZodType<Omit<Prisma.FoodUpdateManyMutationInput, "id" | "createdAt" | "updatedAt">> = z.strictObject({
  // omitted: id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  baseUnit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  baseAmount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  calories: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  carbohydrate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  protein: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fat: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fiber: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  // omitted: createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const FoodUncheckedUpdateManyInputSchema: z.ZodType<Omit<Prisma.FoodUncheckedUpdateManyInput, "id" | "userId" | "createdAt" | "updatedAt">> = z.strictObject({
  // omitted: id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  baseUnit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  baseAmount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  calories: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  carbohydrate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  protein: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fat: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fiber: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  // omitted: userId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  // omitted: createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutPlanCreateInputSchema: z.ZodType<Prisma.WorkoutPlanCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  workouts: z.lazy(() => WorkoutCreateNestedManyWithoutWorkoutPlanInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutWorkoutPlanInputSchema),
});

export const WorkoutPlanUncheckedCreateInputSchema: z.ZodType<Prisma.WorkoutPlanUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  isActive: z.boolean().optional(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  workouts: z.lazy(() => WorkoutUncheckedCreateNestedManyWithoutWorkoutPlanInputSchema).optional(),
});

export const WorkoutPlanUpdateInputSchema: z.ZodType<Prisma.WorkoutPlanUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  workouts: z.lazy(() => WorkoutUpdateManyWithoutWorkoutPlanNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutWorkoutPlanNestedInputSchema).optional(),
});

export const WorkoutPlanUncheckedUpdateInputSchema: z.ZodType<Prisma.WorkoutPlanUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  workouts: z.lazy(() => WorkoutUncheckedUpdateManyWithoutWorkoutPlanNestedInputSchema).optional(),
});

export const WorkoutPlanCreateManyInputSchema: z.ZodType<Prisma.WorkoutPlanCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  isActive: z.boolean().optional(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const WorkoutPlanUpdateManyMutationInputSchema: z.ZodType<Prisma.WorkoutPlanUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutPlanUncheckedUpdateManyInputSchema: z.ZodType<Prisma.WorkoutPlanUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutCreateInputSchema: z.ZodType<Prisma.WorkoutCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string().optional().nullable(),
  day: z.lazy(() => WORKOUT_DAYSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  workoutPlan: z.lazy(() => WorkoutPlanCreateNestedOneWithoutWorkoutsInputSchema),
  workoutExercises: z.lazy(() => WorkoutExerciseCreateNestedManyWithoutWorkoutInputSchema).optional(),
});

export const WorkoutUncheckedCreateInputSchema: z.ZodType<Prisma.WorkoutUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string().optional().nullable(),
  day: z.lazy(() => WORKOUT_DAYSchema),
  workoutPlanId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  workoutExercises: z.lazy(() => WorkoutExerciseUncheckedCreateNestedManyWithoutWorkoutInputSchema).optional(),
});

export const WorkoutUpdateInputSchema: z.ZodType<Prisma.WorkoutUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  day: z.union([ z.lazy(() => WORKOUT_DAYSchema), z.lazy(() => EnumWORKOUT_DAYFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  workoutPlan: z.lazy(() => WorkoutPlanUpdateOneRequiredWithoutWorkoutsNestedInputSchema).optional(),
  workoutExercises: z.lazy(() => WorkoutExerciseUpdateManyWithoutWorkoutNestedInputSchema).optional(),
});

export const WorkoutUncheckedUpdateInputSchema: z.ZodType<Prisma.WorkoutUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  day: z.union([ z.lazy(() => WORKOUT_DAYSchema), z.lazy(() => EnumWORKOUT_DAYFieldUpdateOperationsInputSchema) ]).optional(),
  workoutPlanId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  workoutExercises: z.lazy(() => WorkoutExerciseUncheckedUpdateManyWithoutWorkoutNestedInputSchema).optional(),
});

export const WorkoutCreateManyInputSchema: z.ZodType<Prisma.WorkoutCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string().optional().nullable(),
  day: z.lazy(() => WORKOUT_DAYSchema),
  workoutPlanId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const WorkoutUpdateManyMutationInputSchema: z.ZodType<Prisma.WorkoutUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  day: z.union([ z.lazy(() => WORKOUT_DAYSchema), z.lazy(() => EnumWORKOUT_DAYFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutUncheckedUpdateManyInputSchema: z.ZodType<Prisma.WorkoutUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  day: z.union([ z.lazy(() => WORKOUT_DAYSchema), z.lazy(() => EnumWORKOUT_DAYFieldUpdateOperationsInputSchema) ]).optional(),
  workoutPlanId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutExerciseCreateInputSchema: z.ZodType<Prisma.WorkoutExerciseCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  orderIndex: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  workout: z.lazy(() => WorkoutCreateNestedOneWithoutWorkoutExercisesInputSchema),
  exercise: z.lazy(() => ExerciseCreateNestedOneWithoutUsedInWorkoutsInputSchema),
  sets: z.lazy(() => WorkoutSetCreateNestedManyWithoutWorkoutExerciseInputSchema).optional(),
});

export const WorkoutExerciseUncheckedCreateInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  orderIndex: z.number().int(),
  workoutId: z.string(),
  exerciseId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sets: z.lazy(() => WorkoutSetUncheckedCreateNestedManyWithoutWorkoutExerciseInputSchema).optional(),
});

export const WorkoutExerciseUpdateInputSchema: z.ZodType<Prisma.WorkoutExerciseUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  workout: z.lazy(() => WorkoutUpdateOneRequiredWithoutWorkoutExercisesNestedInputSchema).optional(),
  exercise: z.lazy(() => ExerciseUpdateOneRequiredWithoutUsedInWorkoutsNestedInputSchema).optional(),
  sets: z.lazy(() => WorkoutSetUpdateManyWithoutWorkoutExerciseNestedInputSchema).optional(),
});

export const WorkoutExerciseUncheckedUpdateInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  workoutId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sets: z.lazy(() => WorkoutSetUncheckedUpdateManyWithoutWorkoutExerciseNestedInputSchema).optional(),
});

export const WorkoutExerciseCreateManyInputSchema: z.ZodType<Prisma.WorkoutExerciseCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  orderIndex: z.number().int(),
  workoutId: z.string(),
  exerciseId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const WorkoutExerciseUpdateManyMutationInputSchema: z.ZodType<Prisma.WorkoutExerciseUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutExerciseUncheckedUpdateManyInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  workoutId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutSetCreateInputSchema: z.ZodType<Prisma.WorkoutSetCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  setNumber: z.number().int(),
  repetitions: z.number().int(),
  weight: z.number().optional().nullable(),
  restTimeSeconds: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  workoutExercise: z.lazy(() => WorkoutExerciseCreateNestedOneWithoutSetsInputSchema),
});

export const WorkoutSetUncheckedCreateInputSchema: z.ZodType<Prisma.WorkoutSetUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  setNumber: z.number().int(),
  repetitions: z.number().int(),
  weight: z.number().optional().nullable(),
  restTimeSeconds: z.number().int(),
  workoutExerciseId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const WorkoutSetUpdateInputSchema: z.ZodType<Prisma.WorkoutSetUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  setNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repetitions: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  restTimeSeconds: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  workoutExercise: z.lazy(() => WorkoutExerciseUpdateOneRequiredWithoutSetsNestedInputSchema).optional(),
});

export const WorkoutSetUncheckedUpdateInputSchema: z.ZodType<Prisma.WorkoutSetUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  setNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repetitions: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  restTimeSeconds: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  workoutExerciseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutSetCreateManyInputSchema: z.ZodType<Prisma.WorkoutSetCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  setNumber: z.number().int(),
  repetitions: z.number().int(),
  weight: z.number().optional().nullable(),
  restTimeSeconds: z.number().int(),
  workoutExerciseId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const WorkoutSetUpdateManyMutationInputSchema: z.ZodType<Prisma.WorkoutSetUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  setNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repetitions: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  restTimeSeconds: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutSetUncheckedUpdateManyInputSchema: z.ZodType<Prisma.WorkoutSetUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  setNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repetitions: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  restTimeSeconds: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  workoutExerciseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ExerciseCreateInputSchema: z.ZodType<Prisma.ExerciseCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  muscleGroup: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  usedInWorkouts: z.lazy(() => WorkoutExerciseCreateNestedManyWithoutExerciseInputSchema).optional(),
});

export const ExerciseUncheckedCreateInputSchema: z.ZodType<Prisma.ExerciseUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  muscleGroup: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  usedInWorkouts: z.lazy(() => WorkoutExerciseUncheckedCreateNestedManyWithoutExerciseInputSchema).optional(),
});

export const ExerciseUpdateInputSchema: z.ZodType<Prisma.ExerciseUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  muscleGroup: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  usedInWorkouts: z.lazy(() => WorkoutExerciseUpdateManyWithoutExerciseNestedInputSchema).optional(),
});

export const ExerciseUncheckedUpdateInputSchema: z.ZodType<Prisma.ExerciseUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  muscleGroup: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  usedInWorkouts: z.lazy(() => WorkoutExerciseUncheckedUpdateManyWithoutExerciseNestedInputSchema).optional(),
});

export const ExerciseCreateManyInputSchema: z.ZodType<Prisma.ExerciseCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  muscleGroup: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const ExerciseUpdateManyMutationInputSchema: z.ZodType<Prisma.ExerciseUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  muscleGroup: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ExerciseUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ExerciseUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  muscleGroup: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const EnumROLEFilterSchema: z.ZodType<Prisma.EnumROLEFilter> = z.strictObject({
  equals: z.lazy(() => ROLESchema).optional(),
  in: z.lazy(() => ROLESchema).array().optional(),
  notIn: z.lazy(() => ROLESchema).array().optional(),
  not: z.union([ z.lazy(() => ROLESchema), z.lazy(() => NestedEnumROLEFilterSchema) ]).optional(),
});

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
});

export const EnumGENDERFilterSchema: z.ZodType<Prisma.EnumGENDERFilter> = z.strictObject({
  equals: z.lazy(() => GENDERSchema).optional(),
  in: z.lazy(() => GENDERSchema).array().optional(),
  notIn: z.lazy(() => GENDERSchema).array().optional(),
  not: z.union([ z.lazy(() => GENDERSchema), z.lazy(() => NestedEnumGENDERFilterSchema) ]).optional(),
});

export const AuthNullableScalarRelationFilterSchema: z.ZodType<Prisma.AuthNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => AuthWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => AuthWhereInputSchema).optional().nullable(),
});

export const DietListRelationFilterSchema: z.ZodType<Prisma.DietListRelationFilter> = z.strictObject({
  every: z.lazy(() => DietWhereInputSchema).optional(),
  some: z.lazy(() => DietWhereInputSchema).optional(),
  none: z.lazy(() => DietWhereInputSchema).optional(),
});

export const WorkoutPlanListRelationFilterSchema: z.ZodType<Prisma.WorkoutPlanListRelationFilter> = z.strictObject({
  every: z.lazy(() => WorkoutPlanWhereInputSchema).optional(),
  some: z.lazy(() => WorkoutPlanWhereInputSchema).optional(),
  none: z.lazy(() => WorkoutPlanWhereInputSchema).optional(),
});

export const BodyMetricListRelationFilterSchema: z.ZodType<Prisma.BodyMetricListRelationFilter> = z.strictObject({
  every: z.lazy(() => BodyMetricWhereInputSchema).optional(),
  some: z.lazy(() => BodyMetricWhereInputSchema).optional(),
  none: z.lazy(() => BodyMetricWhereInputSchema).optional(),
});

export const FoodListRelationFilterSchema: z.ZodType<Prisma.FoodListRelationFilter> = z.strictObject({
  every: z.lazy(() => FoodWhereInputSchema).optional(),
  some: z.lazy(() => FoodWhereInputSchema).optional(),
  none: z.lazy(() => FoodWhereInputSchema).optional(),
});

export const DietOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DietOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutPlanOrderByRelationAggregateInputSchema: z.ZodType<Prisma.WorkoutPlanOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const BodyMetricOrderByRelationAggregateInputSchema: z.ZodType<Prisma.BodyMetricOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const FoodOrderByRelationAggregateInputSchema: z.ZodType<Prisma.FoodOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  birthDate: z.lazy(() => SortOrderSchema).optional(),
  gender: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  birthDate: z.lazy(() => SortOrderSchema).optional(),
  gender: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  birthDate: z.lazy(() => SortOrderSchema).optional(),
  gender: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const EnumROLEWithAggregatesFilterSchema: z.ZodType<Prisma.EnumROLEWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => ROLESchema).optional(),
  in: z.lazy(() => ROLESchema).array().optional(),
  notIn: z.lazy(() => ROLESchema).array().optional(),
  not: z.union([ z.lazy(() => ROLESchema), z.lazy(() => NestedEnumROLEWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumROLEFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumROLEFilterSchema).optional(),
});

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const EnumGENDERWithAggregatesFilterSchema: z.ZodType<Prisma.EnumGENDERWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => GENDERSchema).optional(),
  in: z.lazy(() => GENDERSchema).array().optional(),
  notIn: z.lazy(() => GENDERSchema).array().optional(),
  not: z.union([ z.lazy(() => GENDERSchema), z.lazy(() => NestedEnumGENDERWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumGENDERFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumGENDERFilterSchema).optional(),
});

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional(),
});

export const AuthCountOrderByAggregateInputSchema: z.ZodType<Prisma.AuthCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
});

export const AuthMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AuthMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
});

export const AuthMinOrderByAggregateInputSchema: z.ZodType<Prisma.AuthMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
});

export const FloatFilterSchema: z.ZodType<Prisma.FloatFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
});

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const FloatNullableFilterSchema: z.ZodType<Prisma.FloatNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
});

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.strictObject({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional(),
});

export const BodyMetricCountOrderByAggregateInputSchema: z.ZodType<Prisma.BodyMetricCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  weight: z.lazy(() => SortOrderSchema).optional(),
  height: z.lazy(() => SortOrderSchema).optional(),
  activityLevel: z.lazy(() => SortOrderSchema).optional(),
  bodyFat: z.lazy(() => SortOrderSchema).optional(),
  muscleRate: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const BodyMetricAvgOrderByAggregateInputSchema: z.ZodType<Prisma.BodyMetricAvgOrderByAggregateInput> = z.strictObject({
  weight: z.lazy(() => SortOrderSchema).optional(),
  height: z.lazy(() => SortOrderSchema).optional(),
  activityLevel: z.lazy(() => SortOrderSchema).optional(),
  bodyFat: z.lazy(() => SortOrderSchema).optional(),
  muscleRate: z.lazy(() => SortOrderSchema).optional(),
});

export const BodyMetricMaxOrderByAggregateInputSchema: z.ZodType<Prisma.BodyMetricMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  weight: z.lazy(() => SortOrderSchema).optional(),
  height: z.lazy(() => SortOrderSchema).optional(),
  activityLevel: z.lazy(() => SortOrderSchema).optional(),
  bodyFat: z.lazy(() => SortOrderSchema).optional(),
  muscleRate: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const BodyMetricMinOrderByAggregateInputSchema: z.ZodType<Prisma.BodyMetricMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  weight: z.lazy(() => SortOrderSchema).optional(),
  height: z.lazy(() => SortOrderSchema).optional(),
  activityLevel: z.lazy(() => SortOrderSchema).optional(),
  bodyFat: z.lazy(() => SortOrderSchema).optional(),
  muscleRate: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const BodyMetricSumOrderByAggregateInputSchema: z.ZodType<Prisma.BodyMetricSumOrderByAggregateInput> = z.strictObject({
  weight: z.lazy(() => SortOrderSchema).optional(),
  height: z.lazy(() => SortOrderSchema).optional(),
  activityLevel: z.lazy(() => SortOrderSchema).optional(),
  bodyFat: z.lazy(() => SortOrderSchema).optional(),
  muscleRate: z.lazy(() => SortOrderSchema).optional(),
});

export const FloatWithAggregatesFilterSchema: z.ZodType<Prisma.FloatWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional(),
});

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const FloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.FloatNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
});

export const MealListRelationFilterSchema: z.ZodType<Prisma.MealListRelationFilter> = z.strictObject({
  every: z.lazy(() => MealWhereInputSchema).optional(),
  some: z.lazy(() => MealWhereInputSchema).optional(),
  none: z.lazy(() => MealWhereInputSchema).optional(),
});

export const MealOrderByRelationAggregateInputSchema: z.ZodType<Prisma.MealOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const DietCountOrderByAggregateInputSchema: z.ZodType<Prisma.DietCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dailyKcalGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyProteinGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyCarbGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyFatGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyWaterGoal: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const DietAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DietAvgOrderByAggregateInput> = z.strictObject({
  dailyKcalGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyProteinGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyCarbGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyFatGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyWaterGoal: z.lazy(() => SortOrderSchema).optional(),
});

export const DietMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DietMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dailyKcalGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyProteinGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyCarbGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyFatGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyWaterGoal: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const DietMinOrderByAggregateInputSchema: z.ZodType<Prisma.DietMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dailyKcalGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyProteinGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyCarbGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyFatGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyWaterGoal: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const DietSumOrderByAggregateInputSchema: z.ZodType<Prisma.DietSumOrderByAggregateInput> = z.strictObject({
  dailyKcalGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyProteinGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyCarbGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyFatGoal: z.lazy(() => SortOrderSchema).optional(),
  dailyWaterGoal: z.lazy(() => SortOrderSchema).optional(),
});

export const DietScalarRelationFilterSchema: z.ZodType<Prisma.DietScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => DietWhereInputSchema).optional(),
  isNot: z.lazy(() => DietWhereInputSchema).optional(),
});

export const FoodInMealListRelationFilterSchema: z.ZodType<Prisma.FoodInMealListRelationFilter> = z.strictObject({
  every: z.lazy(() => FoodInMealWhereInputSchema).optional(),
  some: z.lazy(() => FoodInMealWhereInputSchema).optional(),
  none: z.lazy(() => FoodInMealWhereInputSchema).optional(),
});

export const FoodInMealOrderByRelationAggregateInputSchema: z.ZodType<Prisma.FoodInMealOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const MealCountOrderByAggregateInputSchema: z.ZodType<Prisma.MealCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  orderIndex: z.lazy(() => SortOrderSchema).optional(),
  dietId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const MealAvgOrderByAggregateInputSchema: z.ZodType<Prisma.MealAvgOrderByAggregateInput> = z.strictObject({
  orderIndex: z.lazy(() => SortOrderSchema).optional(),
});

export const MealMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MealMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  orderIndex: z.lazy(() => SortOrderSchema).optional(),
  dietId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const MealMinOrderByAggregateInputSchema: z.ZodType<Prisma.MealMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  orderIndex: z.lazy(() => SortOrderSchema).optional(),
  dietId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const MealSumOrderByAggregateInputSchema: z.ZodType<Prisma.MealSumOrderByAggregateInput> = z.strictObject({
  orderIndex: z.lazy(() => SortOrderSchema).optional(),
});

export const MealScalarRelationFilterSchema: z.ZodType<Prisma.MealScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => MealWhereInputSchema).optional(),
  isNot: z.lazy(() => MealWhereInputSchema).optional(),
});

export const FoodScalarRelationFilterSchema: z.ZodType<Prisma.FoodScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => FoodWhereInputSchema).optional(),
  isNot: z.lazy(() => FoodWhereInputSchema).optional(),
});

export const FoodInMealCountOrderByAggregateInputSchema: z.ZodType<Prisma.FoodInMealCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  mealId: z.lazy(() => SortOrderSchema).optional(),
  foodId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const FoodInMealAvgOrderByAggregateInputSchema: z.ZodType<Prisma.FoodInMealAvgOrderByAggregateInput> = z.strictObject({
  quantity: z.lazy(() => SortOrderSchema).optional(),
});

export const FoodInMealMaxOrderByAggregateInputSchema: z.ZodType<Prisma.FoodInMealMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  mealId: z.lazy(() => SortOrderSchema).optional(),
  foodId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const FoodInMealMinOrderByAggregateInputSchema: z.ZodType<Prisma.FoodInMealMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  mealId: z.lazy(() => SortOrderSchema).optional(),
  foodId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const FoodInMealSumOrderByAggregateInputSchema: z.ZodType<Prisma.FoodInMealSumOrderByAggregateInput> = z.strictObject({
  quantity: z.lazy(() => SortOrderSchema).optional(),
});

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
});

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
});

export const UserNullableScalarRelationFilterSchema: z.ZodType<Prisma.UserNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => UserWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => UserWhereInputSchema).optional().nullable(),
});

export const FoodIdUserIdCompoundUniqueInputSchema: z.ZodType<Prisma.FoodIdUserIdCompoundUniqueInput> = z.strictObject({
  id: z.string(),
  userId: z.string(),
});

export const FoodCountOrderByAggregateInputSchema: z.ZodType<Prisma.FoodCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  baseUnit: z.lazy(() => SortOrderSchema).optional(),
  baseAmount: z.lazy(() => SortOrderSchema).optional(),
  calories: z.lazy(() => SortOrderSchema).optional(),
  carbohydrate: z.lazy(() => SortOrderSchema).optional(),
  protein: z.lazy(() => SortOrderSchema).optional(),
  fat: z.lazy(() => SortOrderSchema).optional(),
  fiber: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const FoodAvgOrderByAggregateInputSchema: z.ZodType<Prisma.FoodAvgOrderByAggregateInput> = z.strictObject({
  baseAmount: z.lazy(() => SortOrderSchema).optional(),
  calories: z.lazy(() => SortOrderSchema).optional(),
  carbohydrate: z.lazy(() => SortOrderSchema).optional(),
  protein: z.lazy(() => SortOrderSchema).optional(),
  fat: z.lazy(() => SortOrderSchema).optional(),
  fiber: z.lazy(() => SortOrderSchema).optional(),
});

export const FoodMaxOrderByAggregateInputSchema: z.ZodType<Prisma.FoodMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  baseUnit: z.lazy(() => SortOrderSchema).optional(),
  baseAmount: z.lazy(() => SortOrderSchema).optional(),
  calories: z.lazy(() => SortOrderSchema).optional(),
  carbohydrate: z.lazy(() => SortOrderSchema).optional(),
  protein: z.lazy(() => SortOrderSchema).optional(),
  fat: z.lazy(() => SortOrderSchema).optional(),
  fiber: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const FoodMinOrderByAggregateInputSchema: z.ZodType<Prisma.FoodMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  baseUnit: z.lazy(() => SortOrderSchema).optional(),
  baseAmount: z.lazy(() => SortOrderSchema).optional(),
  calories: z.lazy(() => SortOrderSchema).optional(),
  carbohydrate: z.lazy(() => SortOrderSchema).optional(),
  protein: z.lazy(() => SortOrderSchema).optional(),
  fat: z.lazy(() => SortOrderSchema).optional(),
  fiber: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const FoodSumOrderByAggregateInputSchema: z.ZodType<Prisma.FoodSumOrderByAggregateInput> = z.strictObject({
  baseAmount: z.lazy(() => SortOrderSchema).optional(),
  calories: z.lazy(() => SortOrderSchema).optional(),
  carbohydrate: z.lazy(() => SortOrderSchema).optional(),
  protein: z.lazy(() => SortOrderSchema).optional(),
  fat: z.lazy(() => SortOrderSchema).optional(),
  fiber: z.lazy(() => SortOrderSchema).optional(),
});

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional(),
});

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
});

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
});

export const WorkoutListRelationFilterSchema: z.ZodType<Prisma.WorkoutListRelationFilter> = z.strictObject({
  every: z.lazy(() => WorkoutWhereInputSchema).optional(),
  some: z.lazy(() => WorkoutWhereInputSchema).optional(),
  none: z.lazy(() => WorkoutWhereInputSchema).optional(),
});

export const WorkoutOrderByRelationAggregateInputSchema: z.ZodType<Prisma.WorkoutOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutPlanCountOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutPlanCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutPlanMaxOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutPlanMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutPlanMinOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutPlanMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
});

export const EnumWORKOUT_DAYFilterSchema: z.ZodType<Prisma.EnumWORKOUT_DAYFilter> = z.strictObject({
  equals: z.lazy(() => WORKOUT_DAYSchema).optional(),
  in: z.lazy(() => WORKOUT_DAYSchema).array().optional(),
  notIn: z.lazy(() => WORKOUT_DAYSchema).array().optional(),
  not: z.union([ z.lazy(() => WORKOUT_DAYSchema), z.lazy(() => NestedEnumWORKOUT_DAYFilterSchema) ]).optional(),
});

export const WorkoutPlanScalarRelationFilterSchema: z.ZodType<Prisma.WorkoutPlanScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => WorkoutPlanWhereInputSchema).optional(),
  isNot: z.lazy(() => WorkoutPlanWhereInputSchema).optional(),
});

export const WorkoutExerciseListRelationFilterSchema: z.ZodType<Prisma.WorkoutExerciseListRelationFilter> = z.strictObject({
  every: z.lazy(() => WorkoutExerciseWhereInputSchema).optional(),
  some: z.lazy(() => WorkoutExerciseWhereInputSchema).optional(),
  none: z.lazy(() => WorkoutExerciseWhereInputSchema).optional(),
});

export const WorkoutExerciseOrderByRelationAggregateInputSchema: z.ZodType<Prisma.WorkoutExerciseOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutCountOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  day: z.lazy(() => SortOrderSchema).optional(),
  workoutPlanId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutMaxOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  day: z.lazy(() => SortOrderSchema).optional(),
  workoutPlanId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutMinOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  day: z.lazy(() => SortOrderSchema).optional(),
  workoutPlanId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const EnumWORKOUT_DAYWithAggregatesFilterSchema: z.ZodType<Prisma.EnumWORKOUT_DAYWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => WORKOUT_DAYSchema).optional(),
  in: z.lazy(() => WORKOUT_DAYSchema).array().optional(),
  notIn: z.lazy(() => WORKOUT_DAYSchema).array().optional(),
  not: z.union([ z.lazy(() => WORKOUT_DAYSchema), z.lazy(() => NestedEnumWORKOUT_DAYWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumWORKOUT_DAYFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumWORKOUT_DAYFilterSchema).optional(),
});

export const WorkoutScalarRelationFilterSchema: z.ZodType<Prisma.WorkoutScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => WorkoutWhereInputSchema).optional(),
  isNot: z.lazy(() => WorkoutWhereInputSchema).optional(),
});

export const ExerciseScalarRelationFilterSchema: z.ZodType<Prisma.ExerciseScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => ExerciseWhereInputSchema).optional(),
  isNot: z.lazy(() => ExerciseWhereInputSchema).optional(),
});

export const WorkoutSetListRelationFilterSchema: z.ZodType<Prisma.WorkoutSetListRelationFilter> = z.strictObject({
  every: z.lazy(() => WorkoutSetWhereInputSchema).optional(),
  some: z.lazy(() => WorkoutSetWhereInputSchema).optional(),
  none: z.lazy(() => WorkoutSetWhereInputSchema).optional(),
});

export const WorkoutSetOrderByRelationAggregateInputSchema: z.ZodType<Prisma.WorkoutSetOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutExerciseCountOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutExerciseCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  orderIndex: z.lazy(() => SortOrderSchema).optional(),
  workoutId: z.lazy(() => SortOrderSchema).optional(),
  exerciseId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutExerciseAvgOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutExerciseAvgOrderByAggregateInput> = z.strictObject({
  orderIndex: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutExerciseMaxOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutExerciseMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  orderIndex: z.lazy(() => SortOrderSchema).optional(),
  workoutId: z.lazy(() => SortOrderSchema).optional(),
  exerciseId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutExerciseMinOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutExerciseMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  orderIndex: z.lazy(() => SortOrderSchema).optional(),
  workoutId: z.lazy(() => SortOrderSchema).optional(),
  exerciseId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutExerciseSumOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutExerciseSumOrderByAggregateInput> = z.strictObject({
  orderIndex: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutExerciseScalarRelationFilterSchema: z.ZodType<Prisma.WorkoutExerciseScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => WorkoutExerciseWhereInputSchema).optional(),
  isNot: z.lazy(() => WorkoutExerciseWhereInputSchema).optional(),
});

export const WorkoutSetCountOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutSetCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  setNumber: z.lazy(() => SortOrderSchema).optional(),
  repetitions: z.lazy(() => SortOrderSchema).optional(),
  weight: z.lazy(() => SortOrderSchema).optional(),
  restTimeSeconds: z.lazy(() => SortOrderSchema).optional(),
  workoutExerciseId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutSetAvgOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutSetAvgOrderByAggregateInput> = z.strictObject({
  setNumber: z.lazy(() => SortOrderSchema).optional(),
  repetitions: z.lazy(() => SortOrderSchema).optional(),
  weight: z.lazy(() => SortOrderSchema).optional(),
  restTimeSeconds: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutSetMaxOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutSetMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  setNumber: z.lazy(() => SortOrderSchema).optional(),
  repetitions: z.lazy(() => SortOrderSchema).optional(),
  weight: z.lazy(() => SortOrderSchema).optional(),
  restTimeSeconds: z.lazy(() => SortOrderSchema).optional(),
  workoutExerciseId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutSetMinOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutSetMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  setNumber: z.lazy(() => SortOrderSchema).optional(),
  repetitions: z.lazy(() => SortOrderSchema).optional(),
  weight: z.lazy(() => SortOrderSchema).optional(),
  restTimeSeconds: z.lazy(() => SortOrderSchema).optional(),
  workoutExerciseId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutSetSumOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutSetSumOrderByAggregateInput> = z.strictObject({
  setNumber: z.lazy(() => SortOrderSchema).optional(),
  repetitions: z.lazy(() => SortOrderSchema).optional(),
  weight: z.lazy(() => SortOrderSchema).optional(),
  restTimeSeconds: z.lazy(() => SortOrderSchema).optional(),
});

export const ExerciseCountOrderByAggregateInputSchema: z.ZodType<Prisma.ExerciseCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  muscleGroup: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const ExerciseMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ExerciseMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  muscleGroup: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const ExerciseMinOrderByAggregateInputSchema: z.ZodType<Prisma.ExerciseMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  muscleGroup: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const AuthCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.AuthCreateNestedOneWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => AuthCreateWithoutUserInputSchema), z.lazy(() => AuthUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AuthCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => AuthWhereUniqueInputSchema).optional(),
});

export const DietCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.DietCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => DietCreateWithoutUserInputSchema), z.lazy(() => DietCreateWithoutUserInputSchema).array(), z.lazy(() => DietUncheckedCreateWithoutUserInputSchema), z.lazy(() => DietUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DietCreateOrConnectWithoutUserInputSchema), z.lazy(() => DietCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DietCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DietWhereUniqueInputSchema), z.lazy(() => DietWhereUniqueInputSchema).array() ]).optional(),
});

export const WorkoutPlanCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.WorkoutPlanCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutPlanCreateWithoutUserInputSchema), z.lazy(() => WorkoutPlanCreateWithoutUserInputSchema).array(), z.lazy(() => WorkoutPlanUncheckedCreateWithoutUserInputSchema), z.lazy(() => WorkoutPlanUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutPlanCreateOrConnectWithoutUserInputSchema), z.lazy(() => WorkoutPlanCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutPlanCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkoutPlanWhereUniqueInputSchema), z.lazy(() => WorkoutPlanWhereUniqueInputSchema).array() ]).optional(),
});

export const BodyMetricCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.BodyMetricCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => BodyMetricCreateWithoutUserInputSchema), z.lazy(() => BodyMetricCreateWithoutUserInputSchema).array(), z.lazy(() => BodyMetricUncheckedCreateWithoutUserInputSchema), z.lazy(() => BodyMetricUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BodyMetricCreateOrConnectWithoutUserInputSchema), z.lazy(() => BodyMetricCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BodyMetricCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BodyMetricWhereUniqueInputSchema), z.lazy(() => BodyMetricWhereUniqueInputSchema).array() ]).optional(),
});

export const FoodCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.FoodCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => FoodCreateWithoutUserInputSchema), z.lazy(() => FoodCreateWithoutUserInputSchema).array(), z.lazy(() => FoodUncheckedCreateWithoutUserInputSchema), z.lazy(() => FoodUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FoodCreateOrConnectWithoutUserInputSchema), z.lazy(() => FoodCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FoodCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FoodWhereUniqueInputSchema), z.lazy(() => FoodWhereUniqueInputSchema).array() ]).optional(),
});

export const AuthUncheckedCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.AuthUncheckedCreateNestedOneWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => AuthCreateWithoutUserInputSchema), z.lazy(() => AuthUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AuthCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => AuthWhereUniqueInputSchema).optional(),
});

export const DietUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.DietUncheckedCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => DietCreateWithoutUserInputSchema), z.lazy(() => DietCreateWithoutUserInputSchema).array(), z.lazy(() => DietUncheckedCreateWithoutUserInputSchema), z.lazy(() => DietUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DietCreateOrConnectWithoutUserInputSchema), z.lazy(() => DietCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DietCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DietWhereUniqueInputSchema), z.lazy(() => DietWhereUniqueInputSchema).array() ]).optional(),
});

export const WorkoutPlanUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.WorkoutPlanUncheckedCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutPlanCreateWithoutUserInputSchema), z.lazy(() => WorkoutPlanCreateWithoutUserInputSchema).array(), z.lazy(() => WorkoutPlanUncheckedCreateWithoutUserInputSchema), z.lazy(() => WorkoutPlanUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutPlanCreateOrConnectWithoutUserInputSchema), z.lazy(() => WorkoutPlanCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutPlanCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkoutPlanWhereUniqueInputSchema), z.lazy(() => WorkoutPlanWhereUniqueInputSchema).array() ]).optional(),
});

export const BodyMetricUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.BodyMetricUncheckedCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => BodyMetricCreateWithoutUserInputSchema), z.lazy(() => BodyMetricCreateWithoutUserInputSchema).array(), z.lazy(() => BodyMetricUncheckedCreateWithoutUserInputSchema), z.lazy(() => BodyMetricUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BodyMetricCreateOrConnectWithoutUserInputSchema), z.lazy(() => BodyMetricCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BodyMetricCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BodyMetricWhereUniqueInputSchema), z.lazy(() => BodyMetricWhereUniqueInputSchema).array() ]).optional(),
});

export const FoodUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.FoodUncheckedCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => FoodCreateWithoutUserInputSchema), z.lazy(() => FoodCreateWithoutUserInputSchema).array(), z.lazy(() => FoodUncheckedCreateWithoutUserInputSchema), z.lazy(() => FoodUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FoodCreateOrConnectWithoutUserInputSchema), z.lazy(() => FoodCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FoodCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FoodWhereUniqueInputSchema), z.lazy(() => FoodWhereUniqueInputSchema).array() ]).optional(),
});

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional(),
});

export const EnumROLEFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumROLEFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => ROLESchema).optional(),
});

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.strictObject({
  set: z.coerce.date().optional(),
});

export const EnumGENDERFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumGENDERFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => GENDERSchema).optional(),
});

export const AuthUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.AuthUpdateOneWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => AuthCreateWithoutUserInputSchema), z.lazy(() => AuthUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AuthCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => AuthUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => AuthWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => AuthWhereInputSchema) ]).optional(),
  connect: z.lazy(() => AuthWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AuthUpdateToOneWithWhereWithoutUserInputSchema), z.lazy(() => AuthUpdateWithoutUserInputSchema), z.lazy(() => AuthUncheckedUpdateWithoutUserInputSchema) ]).optional(),
});

export const DietUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.DietUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => DietCreateWithoutUserInputSchema), z.lazy(() => DietCreateWithoutUserInputSchema).array(), z.lazy(() => DietUncheckedCreateWithoutUserInputSchema), z.lazy(() => DietUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DietCreateOrConnectWithoutUserInputSchema), z.lazy(() => DietCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DietUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => DietUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DietCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DietWhereUniqueInputSchema), z.lazy(() => DietWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DietWhereUniqueInputSchema), z.lazy(() => DietWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DietWhereUniqueInputSchema), z.lazy(() => DietWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DietWhereUniqueInputSchema), z.lazy(() => DietWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DietUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => DietUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DietUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => DietUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DietScalarWhereInputSchema), z.lazy(() => DietScalarWhereInputSchema).array() ]).optional(),
});

export const WorkoutPlanUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.WorkoutPlanUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutPlanCreateWithoutUserInputSchema), z.lazy(() => WorkoutPlanCreateWithoutUserInputSchema).array(), z.lazy(() => WorkoutPlanUncheckedCreateWithoutUserInputSchema), z.lazy(() => WorkoutPlanUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutPlanCreateOrConnectWithoutUserInputSchema), z.lazy(() => WorkoutPlanCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkoutPlanUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => WorkoutPlanUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutPlanCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkoutPlanWhereUniqueInputSchema), z.lazy(() => WorkoutPlanWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkoutPlanWhereUniqueInputSchema), z.lazy(() => WorkoutPlanWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkoutPlanWhereUniqueInputSchema), z.lazy(() => WorkoutPlanWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkoutPlanWhereUniqueInputSchema), z.lazy(() => WorkoutPlanWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkoutPlanUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => WorkoutPlanUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkoutPlanUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => WorkoutPlanUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkoutPlanScalarWhereInputSchema), z.lazy(() => WorkoutPlanScalarWhereInputSchema).array() ]).optional(),
});

export const BodyMetricUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.BodyMetricUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => BodyMetricCreateWithoutUserInputSchema), z.lazy(() => BodyMetricCreateWithoutUserInputSchema).array(), z.lazy(() => BodyMetricUncheckedCreateWithoutUserInputSchema), z.lazy(() => BodyMetricUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BodyMetricCreateOrConnectWithoutUserInputSchema), z.lazy(() => BodyMetricCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BodyMetricUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => BodyMetricUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BodyMetricCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BodyMetricWhereUniqueInputSchema), z.lazy(() => BodyMetricWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BodyMetricWhereUniqueInputSchema), z.lazy(() => BodyMetricWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BodyMetricWhereUniqueInputSchema), z.lazy(() => BodyMetricWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BodyMetricWhereUniqueInputSchema), z.lazy(() => BodyMetricWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BodyMetricUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => BodyMetricUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BodyMetricUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => BodyMetricUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BodyMetricScalarWhereInputSchema), z.lazy(() => BodyMetricScalarWhereInputSchema).array() ]).optional(),
});

export const FoodUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.FoodUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => FoodCreateWithoutUserInputSchema), z.lazy(() => FoodCreateWithoutUserInputSchema).array(), z.lazy(() => FoodUncheckedCreateWithoutUserInputSchema), z.lazy(() => FoodUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FoodCreateOrConnectWithoutUserInputSchema), z.lazy(() => FoodCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FoodUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => FoodUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FoodCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FoodWhereUniqueInputSchema), z.lazy(() => FoodWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FoodWhereUniqueInputSchema), z.lazy(() => FoodWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FoodWhereUniqueInputSchema), z.lazy(() => FoodWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FoodWhereUniqueInputSchema), z.lazy(() => FoodWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FoodUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => FoodUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FoodUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => FoodUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FoodScalarWhereInputSchema), z.lazy(() => FoodScalarWhereInputSchema).array() ]).optional(),
});

export const AuthUncheckedUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.AuthUncheckedUpdateOneWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => AuthCreateWithoutUserInputSchema), z.lazy(() => AuthUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AuthCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => AuthUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => AuthWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => AuthWhereInputSchema) ]).optional(),
  connect: z.lazy(() => AuthWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AuthUpdateToOneWithWhereWithoutUserInputSchema), z.lazy(() => AuthUpdateWithoutUserInputSchema), z.lazy(() => AuthUncheckedUpdateWithoutUserInputSchema) ]).optional(),
});

export const DietUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.DietUncheckedUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => DietCreateWithoutUserInputSchema), z.lazy(() => DietCreateWithoutUserInputSchema).array(), z.lazy(() => DietUncheckedCreateWithoutUserInputSchema), z.lazy(() => DietUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DietCreateOrConnectWithoutUserInputSchema), z.lazy(() => DietCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DietUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => DietUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DietCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DietWhereUniqueInputSchema), z.lazy(() => DietWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DietWhereUniqueInputSchema), z.lazy(() => DietWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DietWhereUniqueInputSchema), z.lazy(() => DietWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DietWhereUniqueInputSchema), z.lazy(() => DietWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DietUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => DietUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DietUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => DietUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DietScalarWhereInputSchema), z.lazy(() => DietScalarWhereInputSchema).array() ]).optional(),
});

export const WorkoutPlanUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.WorkoutPlanUncheckedUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutPlanCreateWithoutUserInputSchema), z.lazy(() => WorkoutPlanCreateWithoutUserInputSchema).array(), z.lazy(() => WorkoutPlanUncheckedCreateWithoutUserInputSchema), z.lazy(() => WorkoutPlanUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutPlanCreateOrConnectWithoutUserInputSchema), z.lazy(() => WorkoutPlanCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkoutPlanUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => WorkoutPlanUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutPlanCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkoutPlanWhereUniqueInputSchema), z.lazy(() => WorkoutPlanWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkoutPlanWhereUniqueInputSchema), z.lazy(() => WorkoutPlanWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkoutPlanWhereUniqueInputSchema), z.lazy(() => WorkoutPlanWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkoutPlanWhereUniqueInputSchema), z.lazy(() => WorkoutPlanWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkoutPlanUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => WorkoutPlanUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkoutPlanUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => WorkoutPlanUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkoutPlanScalarWhereInputSchema), z.lazy(() => WorkoutPlanScalarWhereInputSchema).array() ]).optional(),
});

export const BodyMetricUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.BodyMetricUncheckedUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => BodyMetricCreateWithoutUserInputSchema), z.lazy(() => BodyMetricCreateWithoutUserInputSchema).array(), z.lazy(() => BodyMetricUncheckedCreateWithoutUserInputSchema), z.lazy(() => BodyMetricUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BodyMetricCreateOrConnectWithoutUserInputSchema), z.lazy(() => BodyMetricCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BodyMetricUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => BodyMetricUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BodyMetricCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BodyMetricWhereUniqueInputSchema), z.lazy(() => BodyMetricWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BodyMetricWhereUniqueInputSchema), z.lazy(() => BodyMetricWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BodyMetricWhereUniqueInputSchema), z.lazy(() => BodyMetricWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BodyMetricWhereUniqueInputSchema), z.lazy(() => BodyMetricWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BodyMetricUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => BodyMetricUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BodyMetricUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => BodyMetricUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BodyMetricScalarWhereInputSchema), z.lazy(() => BodyMetricScalarWhereInputSchema).array() ]).optional(),
});

export const FoodUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.FoodUncheckedUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => FoodCreateWithoutUserInputSchema), z.lazy(() => FoodCreateWithoutUserInputSchema).array(), z.lazy(() => FoodUncheckedCreateWithoutUserInputSchema), z.lazy(() => FoodUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FoodCreateOrConnectWithoutUserInputSchema), z.lazy(() => FoodCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FoodUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => FoodUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FoodCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FoodWhereUniqueInputSchema), z.lazy(() => FoodWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FoodWhereUniqueInputSchema), z.lazy(() => FoodWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FoodWhereUniqueInputSchema), z.lazy(() => FoodWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FoodWhereUniqueInputSchema), z.lazy(() => FoodWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FoodUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => FoodUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FoodUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => FoodUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FoodScalarWhereInputSchema), z.lazy(() => FoodScalarWhereInputSchema).array() ]).optional(),
});

export const UserCreateNestedOneWithoutAuthInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAuthInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutAuthInputSchema), z.lazy(() => UserUncheckedCreateWithoutAuthInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAuthInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const UserUpdateOneRequiredWithoutAuthNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutAuthNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutAuthInputSchema), z.lazy(() => UserUncheckedCreateWithoutAuthInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAuthInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAuthInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutAuthInputSchema), z.lazy(() => UserUpdateWithoutAuthInputSchema), z.lazy(() => UserUncheckedUpdateWithoutAuthInputSchema) ]).optional(),
});

export const UserCreateNestedOneWithoutBodyMetricsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutBodyMetricsInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutBodyMetricsInputSchema), z.lazy(() => UserUncheckedCreateWithoutBodyMetricsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutBodyMetricsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const UserUpdateOneRequiredWithoutBodyMetricsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutBodyMetricsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutBodyMetricsInputSchema), z.lazy(() => UserUncheckedCreateWithoutBodyMetricsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutBodyMetricsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutBodyMetricsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutBodyMetricsInputSchema), z.lazy(() => UserUpdateWithoutBodyMetricsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutBodyMetricsInputSchema) ]).optional(),
});

export const UserCreateNestedOneWithoutDietInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutDietInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutDietInputSchema), z.lazy(() => UserUncheckedCreateWithoutDietInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutDietInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const MealCreateNestedManyWithoutDietInputSchema: z.ZodType<Prisma.MealCreateNestedManyWithoutDietInput> = z.strictObject({
  create: z.union([ z.lazy(() => MealCreateWithoutDietInputSchema), z.lazy(() => MealCreateWithoutDietInputSchema).array(), z.lazy(() => MealUncheckedCreateWithoutDietInputSchema), z.lazy(() => MealUncheckedCreateWithoutDietInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MealCreateOrConnectWithoutDietInputSchema), z.lazy(() => MealCreateOrConnectWithoutDietInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MealCreateManyDietInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MealWhereUniqueInputSchema), z.lazy(() => MealWhereUniqueInputSchema).array() ]).optional(),
});

export const MealUncheckedCreateNestedManyWithoutDietInputSchema: z.ZodType<Prisma.MealUncheckedCreateNestedManyWithoutDietInput> = z.strictObject({
  create: z.union([ z.lazy(() => MealCreateWithoutDietInputSchema), z.lazy(() => MealCreateWithoutDietInputSchema).array(), z.lazy(() => MealUncheckedCreateWithoutDietInputSchema), z.lazy(() => MealUncheckedCreateWithoutDietInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MealCreateOrConnectWithoutDietInputSchema), z.lazy(() => MealCreateOrConnectWithoutDietInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MealCreateManyDietInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MealWhereUniqueInputSchema), z.lazy(() => MealWhereUniqueInputSchema).array() ]).optional(),
});

export const UserUpdateOneRequiredWithoutDietNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutDietNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutDietInputSchema), z.lazy(() => UserUncheckedCreateWithoutDietInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutDietInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutDietInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutDietInputSchema), z.lazy(() => UserUpdateWithoutDietInputSchema), z.lazy(() => UserUncheckedUpdateWithoutDietInputSchema) ]).optional(),
});

export const MealUpdateManyWithoutDietNestedInputSchema: z.ZodType<Prisma.MealUpdateManyWithoutDietNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MealCreateWithoutDietInputSchema), z.lazy(() => MealCreateWithoutDietInputSchema).array(), z.lazy(() => MealUncheckedCreateWithoutDietInputSchema), z.lazy(() => MealUncheckedCreateWithoutDietInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MealCreateOrConnectWithoutDietInputSchema), z.lazy(() => MealCreateOrConnectWithoutDietInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MealUpsertWithWhereUniqueWithoutDietInputSchema), z.lazy(() => MealUpsertWithWhereUniqueWithoutDietInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MealCreateManyDietInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MealWhereUniqueInputSchema), z.lazy(() => MealWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MealWhereUniqueInputSchema), z.lazy(() => MealWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MealWhereUniqueInputSchema), z.lazy(() => MealWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MealWhereUniqueInputSchema), z.lazy(() => MealWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MealUpdateWithWhereUniqueWithoutDietInputSchema), z.lazy(() => MealUpdateWithWhereUniqueWithoutDietInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MealUpdateManyWithWhereWithoutDietInputSchema), z.lazy(() => MealUpdateManyWithWhereWithoutDietInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MealScalarWhereInputSchema), z.lazy(() => MealScalarWhereInputSchema).array() ]).optional(),
});

export const MealUncheckedUpdateManyWithoutDietNestedInputSchema: z.ZodType<Prisma.MealUncheckedUpdateManyWithoutDietNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MealCreateWithoutDietInputSchema), z.lazy(() => MealCreateWithoutDietInputSchema).array(), z.lazy(() => MealUncheckedCreateWithoutDietInputSchema), z.lazy(() => MealUncheckedCreateWithoutDietInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MealCreateOrConnectWithoutDietInputSchema), z.lazy(() => MealCreateOrConnectWithoutDietInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MealUpsertWithWhereUniqueWithoutDietInputSchema), z.lazy(() => MealUpsertWithWhereUniqueWithoutDietInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MealCreateManyDietInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MealWhereUniqueInputSchema), z.lazy(() => MealWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MealWhereUniqueInputSchema), z.lazy(() => MealWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MealWhereUniqueInputSchema), z.lazy(() => MealWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MealWhereUniqueInputSchema), z.lazy(() => MealWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MealUpdateWithWhereUniqueWithoutDietInputSchema), z.lazy(() => MealUpdateWithWhereUniqueWithoutDietInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MealUpdateManyWithWhereWithoutDietInputSchema), z.lazy(() => MealUpdateManyWithWhereWithoutDietInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MealScalarWhereInputSchema), z.lazy(() => MealScalarWhereInputSchema).array() ]).optional(),
});

export const DietCreateNestedOneWithoutMealInputSchema: z.ZodType<Prisma.DietCreateNestedOneWithoutMealInput> = z.strictObject({
  create: z.union([ z.lazy(() => DietCreateWithoutMealInputSchema), z.lazy(() => DietUncheckedCreateWithoutMealInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DietCreateOrConnectWithoutMealInputSchema).optional(),
  connect: z.lazy(() => DietWhereUniqueInputSchema).optional(),
});

export const FoodInMealCreateNestedManyWithoutMealInputSchema: z.ZodType<Prisma.FoodInMealCreateNestedManyWithoutMealInput> = z.strictObject({
  create: z.union([ z.lazy(() => FoodInMealCreateWithoutMealInputSchema), z.lazy(() => FoodInMealCreateWithoutMealInputSchema).array(), z.lazy(() => FoodInMealUncheckedCreateWithoutMealInputSchema), z.lazy(() => FoodInMealUncheckedCreateWithoutMealInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FoodInMealCreateOrConnectWithoutMealInputSchema), z.lazy(() => FoodInMealCreateOrConnectWithoutMealInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FoodInMealCreateManyMealInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FoodInMealWhereUniqueInputSchema), z.lazy(() => FoodInMealWhereUniqueInputSchema).array() ]).optional(),
});

export const FoodInMealUncheckedCreateNestedManyWithoutMealInputSchema: z.ZodType<Prisma.FoodInMealUncheckedCreateNestedManyWithoutMealInput> = z.strictObject({
  create: z.union([ z.lazy(() => FoodInMealCreateWithoutMealInputSchema), z.lazy(() => FoodInMealCreateWithoutMealInputSchema).array(), z.lazy(() => FoodInMealUncheckedCreateWithoutMealInputSchema), z.lazy(() => FoodInMealUncheckedCreateWithoutMealInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FoodInMealCreateOrConnectWithoutMealInputSchema), z.lazy(() => FoodInMealCreateOrConnectWithoutMealInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FoodInMealCreateManyMealInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FoodInMealWhereUniqueInputSchema), z.lazy(() => FoodInMealWhereUniqueInputSchema).array() ]).optional(),
});

export const DietUpdateOneRequiredWithoutMealNestedInputSchema: z.ZodType<Prisma.DietUpdateOneRequiredWithoutMealNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => DietCreateWithoutMealInputSchema), z.lazy(() => DietUncheckedCreateWithoutMealInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DietCreateOrConnectWithoutMealInputSchema).optional(),
  upsert: z.lazy(() => DietUpsertWithoutMealInputSchema).optional(),
  connect: z.lazy(() => DietWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DietUpdateToOneWithWhereWithoutMealInputSchema), z.lazy(() => DietUpdateWithoutMealInputSchema), z.lazy(() => DietUncheckedUpdateWithoutMealInputSchema) ]).optional(),
});

export const FoodInMealUpdateManyWithoutMealNestedInputSchema: z.ZodType<Prisma.FoodInMealUpdateManyWithoutMealNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => FoodInMealCreateWithoutMealInputSchema), z.lazy(() => FoodInMealCreateWithoutMealInputSchema).array(), z.lazy(() => FoodInMealUncheckedCreateWithoutMealInputSchema), z.lazy(() => FoodInMealUncheckedCreateWithoutMealInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FoodInMealCreateOrConnectWithoutMealInputSchema), z.lazy(() => FoodInMealCreateOrConnectWithoutMealInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FoodInMealUpsertWithWhereUniqueWithoutMealInputSchema), z.lazy(() => FoodInMealUpsertWithWhereUniqueWithoutMealInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FoodInMealCreateManyMealInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FoodInMealWhereUniqueInputSchema), z.lazy(() => FoodInMealWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FoodInMealWhereUniqueInputSchema), z.lazy(() => FoodInMealWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FoodInMealWhereUniqueInputSchema), z.lazy(() => FoodInMealWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FoodInMealWhereUniqueInputSchema), z.lazy(() => FoodInMealWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FoodInMealUpdateWithWhereUniqueWithoutMealInputSchema), z.lazy(() => FoodInMealUpdateWithWhereUniqueWithoutMealInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FoodInMealUpdateManyWithWhereWithoutMealInputSchema), z.lazy(() => FoodInMealUpdateManyWithWhereWithoutMealInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FoodInMealScalarWhereInputSchema), z.lazy(() => FoodInMealScalarWhereInputSchema).array() ]).optional(),
});

export const FoodInMealUncheckedUpdateManyWithoutMealNestedInputSchema: z.ZodType<Prisma.FoodInMealUncheckedUpdateManyWithoutMealNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => FoodInMealCreateWithoutMealInputSchema), z.lazy(() => FoodInMealCreateWithoutMealInputSchema).array(), z.lazy(() => FoodInMealUncheckedCreateWithoutMealInputSchema), z.lazy(() => FoodInMealUncheckedCreateWithoutMealInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FoodInMealCreateOrConnectWithoutMealInputSchema), z.lazy(() => FoodInMealCreateOrConnectWithoutMealInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FoodInMealUpsertWithWhereUniqueWithoutMealInputSchema), z.lazy(() => FoodInMealUpsertWithWhereUniqueWithoutMealInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FoodInMealCreateManyMealInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FoodInMealWhereUniqueInputSchema), z.lazy(() => FoodInMealWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FoodInMealWhereUniqueInputSchema), z.lazy(() => FoodInMealWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FoodInMealWhereUniqueInputSchema), z.lazy(() => FoodInMealWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FoodInMealWhereUniqueInputSchema), z.lazy(() => FoodInMealWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FoodInMealUpdateWithWhereUniqueWithoutMealInputSchema), z.lazy(() => FoodInMealUpdateWithWhereUniqueWithoutMealInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FoodInMealUpdateManyWithWhereWithoutMealInputSchema), z.lazy(() => FoodInMealUpdateManyWithWhereWithoutMealInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FoodInMealScalarWhereInputSchema), z.lazy(() => FoodInMealScalarWhereInputSchema).array() ]).optional(),
});

export const MealCreateNestedOneWithoutFoodsInputSchema: z.ZodType<Prisma.MealCreateNestedOneWithoutFoodsInput> = z.strictObject({
  create: z.union([ z.lazy(() => MealCreateWithoutFoodsInputSchema), z.lazy(() => MealUncheckedCreateWithoutFoodsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MealCreateOrConnectWithoutFoodsInputSchema).optional(),
  connect: z.lazy(() => MealWhereUniqueInputSchema).optional(),
});

export const FoodCreateNestedOneWithoutFoodInMealsInputSchema: z.ZodType<Prisma.FoodCreateNestedOneWithoutFoodInMealsInput> = z.strictObject({
  create: z.union([ z.lazy(() => FoodCreateWithoutFoodInMealsInputSchema), z.lazy(() => FoodUncheckedCreateWithoutFoodInMealsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FoodCreateOrConnectWithoutFoodInMealsInputSchema).optional(),
  connect: z.lazy(() => FoodWhereUniqueInputSchema).optional(),
});

export const MealUpdateOneRequiredWithoutFoodsNestedInputSchema: z.ZodType<Prisma.MealUpdateOneRequiredWithoutFoodsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MealCreateWithoutFoodsInputSchema), z.lazy(() => MealUncheckedCreateWithoutFoodsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MealCreateOrConnectWithoutFoodsInputSchema).optional(),
  upsert: z.lazy(() => MealUpsertWithoutFoodsInputSchema).optional(),
  connect: z.lazy(() => MealWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MealUpdateToOneWithWhereWithoutFoodsInputSchema), z.lazy(() => MealUpdateWithoutFoodsInputSchema), z.lazy(() => MealUncheckedUpdateWithoutFoodsInputSchema) ]).optional(),
});

export const FoodUpdateOneRequiredWithoutFoodInMealsNestedInputSchema: z.ZodType<Prisma.FoodUpdateOneRequiredWithoutFoodInMealsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => FoodCreateWithoutFoodInMealsInputSchema), z.lazy(() => FoodUncheckedCreateWithoutFoodInMealsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FoodCreateOrConnectWithoutFoodInMealsInputSchema).optional(),
  upsert: z.lazy(() => FoodUpsertWithoutFoodInMealsInputSchema).optional(),
  connect: z.lazy(() => FoodWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FoodUpdateToOneWithWhereWithoutFoodInMealsInputSchema), z.lazy(() => FoodUpdateWithoutFoodInMealsInputSchema), z.lazy(() => FoodUncheckedUpdateWithoutFoodInMealsInputSchema) ]).optional(),
});

export const UserCreateNestedOneWithoutFoodInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutFoodInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutFoodInputSchema), z.lazy(() => UserUncheckedCreateWithoutFoodInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFoodInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const FoodInMealCreateNestedManyWithoutFoodInputSchema: z.ZodType<Prisma.FoodInMealCreateNestedManyWithoutFoodInput> = z.strictObject({
  create: z.union([ z.lazy(() => FoodInMealCreateWithoutFoodInputSchema), z.lazy(() => FoodInMealCreateWithoutFoodInputSchema).array(), z.lazy(() => FoodInMealUncheckedCreateWithoutFoodInputSchema), z.lazy(() => FoodInMealUncheckedCreateWithoutFoodInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FoodInMealCreateOrConnectWithoutFoodInputSchema), z.lazy(() => FoodInMealCreateOrConnectWithoutFoodInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FoodInMealCreateManyFoodInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FoodInMealWhereUniqueInputSchema), z.lazy(() => FoodInMealWhereUniqueInputSchema).array() ]).optional(),
});

export const FoodInMealUncheckedCreateNestedManyWithoutFoodInputSchema: z.ZodType<Prisma.FoodInMealUncheckedCreateNestedManyWithoutFoodInput> = z.strictObject({
  create: z.union([ z.lazy(() => FoodInMealCreateWithoutFoodInputSchema), z.lazy(() => FoodInMealCreateWithoutFoodInputSchema).array(), z.lazy(() => FoodInMealUncheckedCreateWithoutFoodInputSchema), z.lazy(() => FoodInMealUncheckedCreateWithoutFoodInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FoodInMealCreateOrConnectWithoutFoodInputSchema), z.lazy(() => FoodInMealCreateOrConnectWithoutFoodInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FoodInMealCreateManyFoodInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FoodInMealWhereUniqueInputSchema), z.lazy(() => FoodInMealWhereUniqueInputSchema).array() ]).optional(),
});

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const UserUpdateOneWithoutFoodNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutFoodNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutFoodInputSchema), z.lazy(() => UserUncheckedCreateWithoutFoodInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFoodInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutFoodInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutFoodInputSchema), z.lazy(() => UserUpdateWithoutFoodInputSchema), z.lazy(() => UserUncheckedUpdateWithoutFoodInputSchema) ]).optional(),
});

export const FoodInMealUpdateManyWithoutFoodNestedInputSchema: z.ZodType<Prisma.FoodInMealUpdateManyWithoutFoodNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => FoodInMealCreateWithoutFoodInputSchema), z.lazy(() => FoodInMealCreateWithoutFoodInputSchema).array(), z.lazy(() => FoodInMealUncheckedCreateWithoutFoodInputSchema), z.lazy(() => FoodInMealUncheckedCreateWithoutFoodInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FoodInMealCreateOrConnectWithoutFoodInputSchema), z.lazy(() => FoodInMealCreateOrConnectWithoutFoodInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FoodInMealUpsertWithWhereUniqueWithoutFoodInputSchema), z.lazy(() => FoodInMealUpsertWithWhereUniqueWithoutFoodInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FoodInMealCreateManyFoodInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FoodInMealWhereUniqueInputSchema), z.lazy(() => FoodInMealWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FoodInMealWhereUniqueInputSchema), z.lazy(() => FoodInMealWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FoodInMealWhereUniqueInputSchema), z.lazy(() => FoodInMealWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FoodInMealWhereUniqueInputSchema), z.lazy(() => FoodInMealWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FoodInMealUpdateWithWhereUniqueWithoutFoodInputSchema), z.lazy(() => FoodInMealUpdateWithWhereUniqueWithoutFoodInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FoodInMealUpdateManyWithWhereWithoutFoodInputSchema), z.lazy(() => FoodInMealUpdateManyWithWhereWithoutFoodInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FoodInMealScalarWhereInputSchema), z.lazy(() => FoodInMealScalarWhereInputSchema).array() ]).optional(),
});

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional().nullable(),
});

export const FoodInMealUncheckedUpdateManyWithoutFoodNestedInputSchema: z.ZodType<Prisma.FoodInMealUncheckedUpdateManyWithoutFoodNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => FoodInMealCreateWithoutFoodInputSchema), z.lazy(() => FoodInMealCreateWithoutFoodInputSchema).array(), z.lazy(() => FoodInMealUncheckedCreateWithoutFoodInputSchema), z.lazy(() => FoodInMealUncheckedCreateWithoutFoodInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FoodInMealCreateOrConnectWithoutFoodInputSchema), z.lazy(() => FoodInMealCreateOrConnectWithoutFoodInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FoodInMealUpsertWithWhereUniqueWithoutFoodInputSchema), z.lazy(() => FoodInMealUpsertWithWhereUniqueWithoutFoodInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FoodInMealCreateManyFoodInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FoodInMealWhereUniqueInputSchema), z.lazy(() => FoodInMealWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FoodInMealWhereUniqueInputSchema), z.lazy(() => FoodInMealWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FoodInMealWhereUniqueInputSchema), z.lazy(() => FoodInMealWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FoodInMealWhereUniqueInputSchema), z.lazy(() => FoodInMealWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FoodInMealUpdateWithWhereUniqueWithoutFoodInputSchema), z.lazy(() => FoodInMealUpdateWithWhereUniqueWithoutFoodInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FoodInMealUpdateManyWithWhereWithoutFoodInputSchema), z.lazy(() => FoodInMealUpdateManyWithWhereWithoutFoodInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FoodInMealScalarWhereInputSchema), z.lazy(() => FoodInMealScalarWhereInputSchema).array() ]).optional(),
});

export const WorkoutCreateNestedManyWithoutWorkoutPlanInputSchema: z.ZodType<Prisma.WorkoutCreateNestedManyWithoutWorkoutPlanInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutCreateWithoutWorkoutPlanInputSchema), z.lazy(() => WorkoutCreateWithoutWorkoutPlanInputSchema).array(), z.lazy(() => WorkoutUncheckedCreateWithoutWorkoutPlanInputSchema), z.lazy(() => WorkoutUncheckedCreateWithoutWorkoutPlanInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutCreateOrConnectWithoutWorkoutPlanInputSchema), z.lazy(() => WorkoutCreateOrConnectWithoutWorkoutPlanInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutCreateManyWorkoutPlanInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkoutWhereUniqueInputSchema), z.lazy(() => WorkoutWhereUniqueInputSchema).array() ]).optional(),
});

export const UserCreateNestedOneWithoutWorkoutPlanInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutWorkoutPlanInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutWorkoutPlanInputSchema), z.lazy(() => UserUncheckedCreateWithoutWorkoutPlanInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutWorkoutPlanInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const WorkoutUncheckedCreateNestedManyWithoutWorkoutPlanInputSchema: z.ZodType<Prisma.WorkoutUncheckedCreateNestedManyWithoutWorkoutPlanInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutCreateWithoutWorkoutPlanInputSchema), z.lazy(() => WorkoutCreateWithoutWorkoutPlanInputSchema).array(), z.lazy(() => WorkoutUncheckedCreateWithoutWorkoutPlanInputSchema), z.lazy(() => WorkoutUncheckedCreateWithoutWorkoutPlanInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutCreateOrConnectWithoutWorkoutPlanInputSchema), z.lazy(() => WorkoutCreateOrConnectWithoutWorkoutPlanInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutCreateManyWorkoutPlanInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkoutWhereUniqueInputSchema), z.lazy(() => WorkoutWhereUniqueInputSchema).array() ]).optional(),
});

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.strictObject({
  set: z.boolean().optional(),
});

export const WorkoutUpdateManyWithoutWorkoutPlanNestedInputSchema: z.ZodType<Prisma.WorkoutUpdateManyWithoutWorkoutPlanNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutCreateWithoutWorkoutPlanInputSchema), z.lazy(() => WorkoutCreateWithoutWorkoutPlanInputSchema).array(), z.lazy(() => WorkoutUncheckedCreateWithoutWorkoutPlanInputSchema), z.lazy(() => WorkoutUncheckedCreateWithoutWorkoutPlanInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutCreateOrConnectWithoutWorkoutPlanInputSchema), z.lazy(() => WorkoutCreateOrConnectWithoutWorkoutPlanInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkoutUpsertWithWhereUniqueWithoutWorkoutPlanInputSchema), z.lazy(() => WorkoutUpsertWithWhereUniqueWithoutWorkoutPlanInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutCreateManyWorkoutPlanInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkoutWhereUniqueInputSchema), z.lazy(() => WorkoutWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkoutWhereUniqueInputSchema), z.lazy(() => WorkoutWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkoutWhereUniqueInputSchema), z.lazy(() => WorkoutWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkoutWhereUniqueInputSchema), z.lazy(() => WorkoutWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkoutUpdateWithWhereUniqueWithoutWorkoutPlanInputSchema), z.lazy(() => WorkoutUpdateWithWhereUniqueWithoutWorkoutPlanInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkoutUpdateManyWithWhereWithoutWorkoutPlanInputSchema), z.lazy(() => WorkoutUpdateManyWithWhereWithoutWorkoutPlanInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkoutScalarWhereInputSchema), z.lazy(() => WorkoutScalarWhereInputSchema).array() ]).optional(),
});

export const UserUpdateOneRequiredWithoutWorkoutPlanNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutWorkoutPlanNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutWorkoutPlanInputSchema), z.lazy(() => UserUncheckedCreateWithoutWorkoutPlanInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutWorkoutPlanInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutWorkoutPlanInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutWorkoutPlanInputSchema), z.lazy(() => UserUpdateWithoutWorkoutPlanInputSchema), z.lazy(() => UserUncheckedUpdateWithoutWorkoutPlanInputSchema) ]).optional(),
});

export const WorkoutUncheckedUpdateManyWithoutWorkoutPlanNestedInputSchema: z.ZodType<Prisma.WorkoutUncheckedUpdateManyWithoutWorkoutPlanNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutCreateWithoutWorkoutPlanInputSchema), z.lazy(() => WorkoutCreateWithoutWorkoutPlanInputSchema).array(), z.lazy(() => WorkoutUncheckedCreateWithoutWorkoutPlanInputSchema), z.lazy(() => WorkoutUncheckedCreateWithoutWorkoutPlanInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutCreateOrConnectWithoutWorkoutPlanInputSchema), z.lazy(() => WorkoutCreateOrConnectWithoutWorkoutPlanInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkoutUpsertWithWhereUniqueWithoutWorkoutPlanInputSchema), z.lazy(() => WorkoutUpsertWithWhereUniqueWithoutWorkoutPlanInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutCreateManyWorkoutPlanInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkoutWhereUniqueInputSchema), z.lazy(() => WorkoutWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkoutWhereUniqueInputSchema), z.lazy(() => WorkoutWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkoutWhereUniqueInputSchema), z.lazy(() => WorkoutWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkoutWhereUniqueInputSchema), z.lazy(() => WorkoutWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkoutUpdateWithWhereUniqueWithoutWorkoutPlanInputSchema), z.lazy(() => WorkoutUpdateWithWhereUniqueWithoutWorkoutPlanInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkoutUpdateManyWithWhereWithoutWorkoutPlanInputSchema), z.lazy(() => WorkoutUpdateManyWithWhereWithoutWorkoutPlanInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkoutScalarWhereInputSchema), z.lazy(() => WorkoutScalarWhereInputSchema).array() ]).optional(),
});

export const WorkoutPlanCreateNestedOneWithoutWorkoutsInputSchema: z.ZodType<Prisma.WorkoutPlanCreateNestedOneWithoutWorkoutsInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutPlanCreateWithoutWorkoutsInputSchema), z.lazy(() => WorkoutPlanUncheckedCreateWithoutWorkoutsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkoutPlanCreateOrConnectWithoutWorkoutsInputSchema).optional(),
  connect: z.lazy(() => WorkoutPlanWhereUniqueInputSchema).optional(),
});

export const WorkoutExerciseCreateNestedManyWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutExerciseCreateNestedManyWithoutWorkoutInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseCreateWithoutWorkoutInputSchema).array(), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutWorkoutInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutExerciseCreateOrConnectWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseCreateOrConnectWithoutWorkoutInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutExerciseCreateManyWorkoutInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
});

export const WorkoutExerciseUncheckedCreateNestedManyWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedCreateNestedManyWithoutWorkoutInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseCreateWithoutWorkoutInputSchema).array(), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutWorkoutInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutExerciseCreateOrConnectWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseCreateOrConnectWithoutWorkoutInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutExerciseCreateManyWorkoutInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
});

export const EnumWORKOUT_DAYFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumWORKOUT_DAYFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => WORKOUT_DAYSchema).optional(),
});

export const WorkoutPlanUpdateOneRequiredWithoutWorkoutsNestedInputSchema: z.ZodType<Prisma.WorkoutPlanUpdateOneRequiredWithoutWorkoutsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutPlanCreateWithoutWorkoutsInputSchema), z.lazy(() => WorkoutPlanUncheckedCreateWithoutWorkoutsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkoutPlanCreateOrConnectWithoutWorkoutsInputSchema).optional(),
  upsert: z.lazy(() => WorkoutPlanUpsertWithoutWorkoutsInputSchema).optional(),
  connect: z.lazy(() => WorkoutPlanWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => WorkoutPlanUpdateToOneWithWhereWithoutWorkoutsInputSchema), z.lazy(() => WorkoutPlanUpdateWithoutWorkoutsInputSchema), z.lazy(() => WorkoutPlanUncheckedUpdateWithoutWorkoutsInputSchema) ]).optional(),
});

export const WorkoutExerciseUpdateManyWithoutWorkoutNestedInputSchema: z.ZodType<Prisma.WorkoutExerciseUpdateManyWithoutWorkoutNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseCreateWithoutWorkoutInputSchema).array(), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutWorkoutInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutExerciseCreateOrConnectWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseCreateOrConnectWithoutWorkoutInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkoutExerciseUpsertWithWhereUniqueWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUpsertWithWhereUniqueWithoutWorkoutInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutExerciseCreateManyWorkoutInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkoutExerciseUpdateWithWhereUniqueWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUpdateWithWhereUniqueWithoutWorkoutInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkoutExerciseUpdateManyWithWhereWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUpdateManyWithWhereWithoutWorkoutInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkoutExerciseScalarWhereInputSchema), z.lazy(() => WorkoutExerciseScalarWhereInputSchema).array() ]).optional(),
});

export const WorkoutExerciseUncheckedUpdateManyWithoutWorkoutNestedInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedUpdateManyWithoutWorkoutNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseCreateWithoutWorkoutInputSchema).array(), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutWorkoutInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutExerciseCreateOrConnectWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseCreateOrConnectWithoutWorkoutInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkoutExerciseUpsertWithWhereUniqueWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUpsertWithWhereUniqueWithoutWorkoutInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutExerciseCreateManyWorkoutInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkoutExerciseUpdateWithWhereUniqueWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUpdateWithWhereUniqueWithoutWorkoutInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkoutExerciseUpdateManyWithWhereWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUpdateManyWithWhereWithoutWorkoutInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkoutExerciseScalarWhereInputSchema), z.lazy(() => WorkoutExerciseScalarWhereInputSchema).array() ]).optional(),
});

export const WorkoutCreateNestedOneWithoutWorkoutExercisesInputSchema: z.ZodType<Prisma.WorkoutCreateNestedOneWithoutWorkoutExercisesInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutCreateWithoutWorkoutExercisesInputSchema), z.lazy(() => WorkoutUncheckedCreateWithoutWorkoutExercisesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkoutCreateOrConnectWithoutWorkoutExercisesInputSchema).optional(),
  connect: z.lazy(() => WorkoutWhereUniqueInputSchema).optional(),
});

export const ExerciseCreateNestedOneWithoutUsedInWorkoutsInputSchema: z.ZodType<Prisma.ExerciseCreateNestedOneWithoutUsedInWorkoutsInput> = z.strictObject({
  create: z.union([ z.lazy(() => ExerciseCreateWithoutUsedInWorkoutsInputSchema), z.lazy(() => ExerciseUncheckedCreateWithoutUsedInWorkoutsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ExerciseCreateOrConnectWithoutUsedInWorkoutsInputSchema).optional(),
  connect: z.lazy(() => ExerciseWhereUniqueInputSchema).optional(),
});

export const WorkoutSetCreateNestedManyWithoutWorkoutExerciseInputSchema: z.ZodType<Prisma.WorkoutSetCreateNestedManyWithoutWorkoutExerciseInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutSetCreateWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutSetCreateWithoutWorkoutExerciseInputSchema).array(), z.lazy(() => WorkoutSetUncheckedCreateWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutSetUncheckedCreateWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutSetCreateOrConnectWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutSetCreateOrConnectWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutSetCreateManyWorkoutExerciseInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkoutSetWhereUniqueInputSchema), z.lazy(() => WorkoutSetWhereUniqueInputSchema).array() ]).optional(),
});

export const WorkoutSetUncheckedCreateNestedManyWithoutWorkoutExerciseInputSchema: z.ZodType<Prisma.WorkoutSetUncheckedCreateNestedManyWithoutWorkoutExerciseInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutSetCreateWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutSetCreateWithoutWorkoutExerciseInputSchema).array(), z.lazy(() => WorkoutSetUncheckedCreateWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutSetUncheckedCreateWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutSetCreateOrConnectWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutSetCreateOrConnectWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutSetCreateManyWorkoutExerciseInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkoutSetWhereUniqueInputSchema), z.lazy(() => WorkoutSetWhereUniqueInputSchema).array() ]).optional(),
});

export const WorkoutUpdateOneRequiredWithoutWorkoutExercisesNestedInputSchema: z.ZodType<Prisma.WorkoutUpdateOneRequiredWithoutWorkoutExercisesNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutCreateWithoutWorkoutExercisesInputSchema), z.lazy(() => WorkoutUncheckedCreateWithoutWorkoutExercisesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkoutCreateOrConnectWithoutWorkoutExercisesInputSchema).optional(),
  upsert: z.lazy(() => WorkoutUpsertWithoutWorkoutExercisesInputSchema).optional(),
  connect: z.lazy(() => WorkoutWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => WorkoutUpdateToOneWithWhereWithoutWorkoutExercisesInputSchema), z.lazy(() => WorkoutUpdateWithoutWorkoutExercisesInputSchema), z.lazy(() => WorkoutUncheckedUpdateWithoutWorkoutExercisesInputSchema) ]).optional(),
});

export const ExerciseUpdateOneRequiredWithoutUsedInWorkoutsNestedInputSchema: z.ZodType<Prisma.ExerciseUpdateOneRequiredWithoutUsedInWorkoutsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ExerciseCreateWithoutUsedInWorkoutsInputSchema), z.lazy(() => ExerciseUncheckedCreateWithoutUsedInWorkoutsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ExerciseCreateOrConnectWithoutUsedInWorkoutsInputSchema).optional(),
  upsert: z.lazy(() => ExerciseUpsertWithoutUsedInWorkoutsInputSchema).optional(),
  connect: z.lazy(() => ExerciseWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ExerciseUpdateToOneWithWhereWithoutUsedInWorkoutsInputSchema), z.lazy(() => ExerciseUpdateWithoutUsedInWorkoutsInputSchema), z.lazy(() => ExerciseUncheckedUpdateWithoutUsedInWorkoutsInputSchema) ]).optional(),
});

export const WorkoutSetUpdateManyWithoutWorkoutExerciseNestedInputSchema: z.ZodType<Prisma.WorkoutSetUpdateManyWithoutWorkoutExerciseNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutSetCreateWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutSetCreateWithoutWorkoutExerciseInputSchema).array(), z.lazy(() => WorkoutSetUncheckedCreateWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutSetUncheckedCreateWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutSetCreateOrConnectWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutSetCreateOrConnectWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkoutSetUpsertWithWhereUniqueWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutSetUpsertWithWhereUniqueWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutSetCreateManyWorkoutExerciseInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkoutSetWhereUniqueInputSchema), z.lazy(() => WorkoutSetWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkoutSetWhereUniqueInputSchema), z.lazy(() => WorkoutSetWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkoutSetWhereUniqueInputSchema), z.lazy(() => WorkoutSetWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkoutSetWhereUniqueInputSchema), z.lazy(() => WorkoutSetWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkoutSetUpdateWithWhereUniqueWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutSetUpdateWithWhereUniqueWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkoutSetUpdateManyWithWhereWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutSetUpdateManyWithWhereWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkoutSetScalarWhereInputSchema), z.lazy(() => WorkoutSetScalarWhereInputSchema).array() ]).optional(),
});

export const WorkoutSetUncheckedUpdateManyWithoutWorkoutExerciseNestedInputSchema: z.ZodType<Prisma.WorkoutSetUncheckedUpdateManyWithoutWorkoutExerciseNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutSetCreateWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutSetCreateWithoutWorkoutExerciseInputSchema).array(), z.lazy(() => WorkoutSetUncheckedCreateWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutSetUncheckedCreateWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutSetCreateOrConnectWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutSetCreateOrConnectWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkoutSetUpsertWithWhereUniqueWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutSetUpsertWithWhereUniqueWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutSetCreateManyWorkoutExerciseInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkoutSetWhereUniqueInputSchema), z.lazy(() => WorkoutSetWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkoutSetWhereUniqueInputSchema), z.lazy(() => WorkoutSetWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkoutSetWhereUniqueInputSchema), z.lazy(() => WorkoutSetWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkoutSetWhereUniqueInputSchema), z.lazy(() => WorkoutSetWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkoutSetUpdateWithWhereUniqueWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutSetUpdateWithWhereUniqueWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkoutSetUpdateManyWithWhereWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutSetUpdateManyWithWhereWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkoutSetScalarWhereInputSchema), z.lazy(() => WorkoutSetScalarWhereInputSchema).array() ]).optional(),
});

export const WorkoutExerciseCreateNestedOneWithoutSetsInputSchema: z.ZodType<Prisma.WorkoutExerciseCreateNestedOneWithoutSetsInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutSetsInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutSetsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkoutExerciseCreateOrConnectWithoutSetsInputSchema).optional(),
  connect: z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).optional(),
});

export const WorkoutExerciseUpdateOneRequiredWithoutSetsNestedInputSchema: z.ZodType<Prisma.WorkoutExerciseUpdateOneRequiredWithoutSetsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutSetsInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutSetsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkoutExerciseCreateOrConnectWithoutSetsInputSchema).optional(),
  upsert: z.lazy(() => WorkoutExerciseUpsertWithoutSetsInputSchema).optional(),
  connect: z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => WorkoutExerciseUpdateToOneWithWhereWithoutSetsInputSchema), z.lazy(() => WorkoutExerciseUpdateWithoutSetsInputSchema), z.lazy(() => WorkoutExerciseUncheckedUpdateWithoutSetsInputSchema) ]).optional(),
});

export const WorkoutExerciseCreateNestedManyWithoutExerciseInputSchema: z.ZodType<Prisma.WorkoutExerciseCreateNestedManyWithoutExerciseInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutExerciseInputSchema), z.lazy(() => WorkoutExerciseCreateWithoutExerciseInputSchema).array(), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutExerciseInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutExerciseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutExerciseCreateOrConnectWithoutExerciseInputSchema), z.lazy(() => WorkoutExerciseCreateOrConnectWithoutExerciseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutExerciseCreateManyExerciseInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
});

export const WorkoutExerciseUncheckedCreateNestedManyWithoutExerciseInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedCreateNestedManyWithoutExerciseInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutExerciseInputSchema), z.lazy(() => WorkoutExerciseCreateWithoutExerciseInputSchema).array(), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutExerciseInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutExerciseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutExerciseCreateOrConnectWithoutExerciseInputSchema), z.lazy(() => WorkoutExerciseCreateOrConnectWithoutExerciseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutExerciseCreateManyExerciseInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
});

export const WorkoutExerciseUpdateManyWithoutExerciseNestedInputSchema: z.ZodType<Prisma.WorkoutExerciseUpdateManyWithoutExerciseNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutExerciseInputSchema), z.lazy(() => WorkoutExerciseCreateWithoutExerciseInputSchema).array(), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutExerciseInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutExerciseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutExerciseCreateOrConnectWithoutExerciseInputSchema), z.lazy(() => WorkoutExerciseCreateOrConnectWithoutExerciseInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkoutExerciseUpsertWithWhereUniqueWithoutExerciseInputSchema), z.lazy(() => WorkoutExerciseUpsertWithWhereUniqueWithoutExerciseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutExerciseCreateManyExerciseInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkoutExerciseUpdateWithWhereUniqueWithoutExerciseInputSchema), z.lazy(() => WorkoutExerciseUpdateWithWhereUniqueWithoutExerciseInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkoutExerciseUpdateManyWithWhereWithoutExerciseInputSchema), z.lazy(() => WorkoutExerciseUpdateManyWithWhereWithoutExerciseInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkoutExerciseScalarWhereInputSchema), z.lazy(() => WorkoutExerciseScalarWhereInputSchema).array() ]).optional(),
});

export const WorkoutExerciseUncheckedUpdateManyWithoutExerciseNestedInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedUpdateManyWithoutExerciseNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutExerciseInputSchema), z.lazy(() => WorkoutExerciseCreateWithoutExerciseInputSchema).array(), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutExerciseInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutExerciseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutExerciseCreateOrConnectWithoutExerciseInputSchema), z.lazy(() => WorkoutExerciseCreateOrConnectWithoutExerciseInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkoutExerciseUpsertWithWhereUniqueWithoutExerciseInputSchema), z.lazy(() => WorkoutExerciseUpsertWithWhereUniqueWithoutExerciseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutExerciseCreateManyExerciseInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkoutExerciseUpdateWithWhereUniqueWithoutExerciseInputSchema), z.lazy(() => WorkoutExerciseUpdateWithWhereUniqueWithoutExerciseInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkoutExerciseUpdateManyWithWhereWithoutExerciseInputSchema), z.lazy(() => WorkoutExerciseUpdateManyWithWhereWithoutExerciseInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkoutExerciseScalarWhereInputSchema), z.lazy(() => WorkoutExerciseScalarWhereInputSchema).array() ]).optional(),
});

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const NestedEnumROLEFilterSchema: z.ZodType<Prisma.NestedEnumROLEFilter> = z.strictObject({
  equals: z.lazy(() => ROLESchema).optional(),
  in: z.lazy(() => ROLESchema).array().optional(),
  notIn: z.lazy(() => ROLESchema).array().optional(),
  not: z.union([ z.lazy(() => ROLESchema), z.lazy(() => NestedEnumROLEFilterSchema) ]).optional(),
});

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
});

export const NestedEnumGENDERFilterSchema: z.ZodType<Prisma.NestedEnumGENDERFilter> = z.strictObject({
  equals: z.lazy(() => GENDERSchema).optional(),
  in: z.lazy(() => GENDERSchema).array().optional(),
  notIn: z.lazy(() => GENDERSchema).array().optional(),
  not: z.union([ z.lazy(() => GENDERSchema), z.lazy(() => NestedEnumGENDERFilterSchema) ]).optional(),
});

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const NestedEnumROLEWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumROLEWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => ROLESchema).optional(),
  in: z.lazy(() => ROLESchema).array().optional(),
  notIn: z.lazy(() => ROLESchema).array().optional(),
  not: z.union([ z.lazy(() => ROLESchema), z.lazy(() => NestedEnumROLEWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumROLEFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumROLEFilterSchema).optional(),
});

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const NestedEnumGENDERWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumGENDERWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => GENDERSchema).optional(),
  in: z.lazy(() => GENDERSchema).array().optional(),
  notIn: z.lazy(() => GENDERSchema).array().optional(),
  not: z.union([ z.lazy(() => GENDERSchema), z.lazy(() => NestedEnumGENDERWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumGENDERFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumGENDERFilterSchema).optional(),
});

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
});

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
});

export const NestedFloatWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional(),
});

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const NestedFloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
});

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
});

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
});

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional(),
});

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
});

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
});

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
});

export const NestedEnumWORKOUT_DAYFilterSchema: z.ZodType<Prisma.NestedEnumWORKOUT_DAYFilter> = z.strictObject({
  equals: z.lazy(() => WORKOUT_DAYSchema).optional(),
  in: z.lazy(() => WORKOUT_DAYSchema).array().optional(),
  notIn: z.lazy(() => WORKOUT_DAYSchema).array().optional(),
  not: z.union([ z.lazy(() => WORKOUT_DAYSchema), z.lazy(() => NestedEnumWORKOUT_DAYFilterSchema) ]).optional(),
});

export const NestedEnumWORKOUT_DAYWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumWORKOUT_DAYWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => WORKOUT_DAYSchema).optional(),
  in: z.lazy(() => WORKOUT_DAYSchema).array().optional(),
  notIn: z.lazy(() => WORKOUT_DAYSchema).array().optional(),
  not: z.union([ z.lazy(() => WORKOUT_DAYSchema), z.lazy(() => NestedEnumWORKOUT_DAYWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumWORKOUT_DAYFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumWORKOUT_DAYFilterSchema).optional(),
});

export const AuthCreateWithoutUserInputSchema: z.ZodType<Prisma.AuthCreateWithoutUserInput> = z.strictObject({
  id: z.uuid().optional(),
  email: z.string(),
  password: z.string(),
});

export const AuthUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AuthUncheckedCreateWithoutUserInput> = z.strictObject({
  id: z.uuid().optional(),
  email: z.string(),
  password: z.string(),
});

export const AuthCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AuthCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => AuthWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AuthCreateWithoutUserInputSchema), z.lazy(() => AuthUncheckedCreateWithoutUserInputSchema) ]),
});

export const DietCreateWithoutUserInputSchema: z.ZodType<Prisma.DietCreateWithoutUserInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  dailyKcalGoal: z.number().int(),
  dailyProteinGoal: z.number().int(),
  dailyCarbGoal: z.number().int(),
  dailyFatGoal: z.number().int(),
  dailyWaterGoal: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Meal: z.lazy(() => MealCreateNestedManyWithoutDietInputSchema).optional(),
});

export const DietUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.DietUncheckedCreateWithoutUserInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  dailyKcalGoal: z.number().int(),
  dailyProteinGoal: z.number().int(),
  dailyCarbGoal: z.number().int(),
  dailyFatGoal: z.number().int(),
  dailyWaterGoal: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Meal: z.lazy(() => MealUncheckedCreateNestedManyWithoutDietInputSchema).optional(),
});

export const DietCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.DietCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => DietWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DietCreateWithoutUserInputSchema), z.lazy(() => DietUncheckedCreateWithoutUserInputSchema) ]),
});

export const DietCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.DietCreateManyUserInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => DietCreateManyUserInputSchema), z.lazy(() => DietCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const WorkoutPlanCreateWithoutUserInputSchema: z.ZodType<Prisma.WorkoutPlanCreateWithoutUserInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  workouts: z.lazy(() => WorkoutCreateNestedManyWithoutWorkoutPlanInputSchema).optional(),
});

export const WorkoutPlanUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.WorkoutPlanUncheckedCreateWithoutUserInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  workouts: z.lazy(() => WorkoutUncheckedCreateNestedManyWithoutWorkoutPlanInputSchema).optional(),
});

export const WorkoutPlanCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.WorkoutPlanCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => WorkoutPlanWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkoutPlanCreateWithoutUserInputSchema), z.lazy(() => WorkoutPlanUncheckedCreateWithoutUserInputSchema) ]),
});

export const WorkoutPlanCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.WorkoutPlanCreateManyUserInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => WorkoutPlanCreateManyUserInputSchema), z.lazy(() => WorkoutPlanCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const BodyMetricCreateWithoutUserInputSchema: z.ZodType<Prisma.BodyMetricCreateWithoutUserInput> = z.strictObject({
  id: z.uuid().optional(),
  weight: z.number(),
  height: z.number().int(),
  activityLevel: z.number().int(),
  bodyFat: z.number().optional().nullable(),
  muscleRate: z.number().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const BodyMetricUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.BodyMetricUncheckedCreateWithoutUserInput> = z.strictObject({
  id: z.uuid().optional(),
  weight: z.number(),
  height: z.number().int(),
  activityLevel: z.number().int(),
  bodyFat: z.number().optional().nullable(),
  muscleRate: z.number().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const BodyMetricCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.BodyMetricCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => BodyMetricWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BodyMetricCreateWithoutUserInputSchema), z.lazy(() => BodyMetricUncheckedCreateWithoutUserInputSchema) ]),
});

export const BodyMetricCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.BodyMetricCreateManyUserInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => BodyMetricCreateManyUserInputSchema), z.lazy(() => BodyMetricCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const FoodCreateWithoutUserInputSchema: z.ZodType<Omit<Prisma.FoodCreateWithoutUserInput, "id" | "createdAt" | "updatedAt">> = z.strictObject({
  // omitted: id: z.uuid().optional(),
  name: z.string(),
  baseUnit: z.string().optional(),
  baseAmount: z.number().int().optional(),
  calories: z.number().int(),
  carbohydrate: z.number().int(),
  protein: z.number().int(),
  fat: z.number().int(),
  fiber: z.number().int().optional().nullable(),
  // omitted: createdAt: z.coerce.date().optional(),
  // omitted: updatedAt: z.coerce.date().optional(),
  foodInMeals: z.lazy(() => FoodInMealCreateNestedManyWithoutFoodInputSchema).optional(),
});

export const FoodUncheckedCreateWithoutUserInputSchema: z.ZodType<Omit<Prisma.FoodUncheckedCreateWithoutUserInput, "id" | "createdAt" | "updatedAt">> = z.strictObject({
  // omitted: id: z.uuid().optional(),
  name: z.string(),
  baseUnit: z.string().optional(),
  baseAmount: z.number().int().optional(),
  calories: z.number().int(),
  carbohydrate: z.number().int(),
  protein: z.number().int(),
  fat: z.number().int(),
  fiber: z.number().int().optional().nullable(),
  // omitted: createdAt: z.coerce.date().optional(),
  // omitted: updatedAt: z.coerce.date().optional(),
  foodInMeals: z.lazy(() => FoodInMealUncheckedCreateNestedManyWithoutFoodInputSchema).optional(),
});

export const FoodCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.FoodCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => FoodWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FoodCreateWithoutUserInputSchema), z.lazy(() => FoodUncheckedCreateWithoutUserInputSchema) ]),
});

export const FoodCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.FoodCreateManyUserInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => FoodCreateManyUserInputSchema), z.lazy(() => FoodCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const AuthUpsertWithoutUserInputSchema: z.ZodType<Prisma.AuthUpsertWithoutUserInput> = z.strictObject({
  update: z.union([ z.lazy(() => AuthUpdateWithoutUserInputSchema), z.lazy(() => AuthUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => AuthCreateWithoutUserInputSchema), z.lazy(() => AuthUncheckedCreateWithoutUserInputSchema) ]),
  where: z.lazy(() => AuthWhereInputSchema).optional(),
});

export const AuthUpdateToOneWithWhereWithoutUserInputSchema: z.ZodType<Prisma.AuthUpdateToOneWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => AuthWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AuthUpdateWithoutUserInputSchema), z.lazy(() => AuthUncheckedUpdateWithoutUserInputSchema) ]),
});

export const AuthUpdateWithoutUserInputSchema: z.ZodType<Prisma.AuthUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const AuthUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AuthUncheckedUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const DietUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.DietUpsertWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => DietWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DietUpdateWithoutUserInputSchema), z.lazy(() => DietUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => DietCreateWithoutUserInputSchema), z.lazy(() => DietUncheckedCreateWithoutUserInputSchema) ]),
});

export const DietUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.DietUpdateWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => DietWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DietUpdateWithoutUserInputSchema), z.lazy(() => DietUncheckedUpdateWithoutUserInputSchema) ]),
});

export const DietUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.DietUpdateManyWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => DietScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DietUpdateManyMutationInputSchema), z.lazy(() => DietUncheckedUpdateManyWithoutUserInputSchema) ]),
});

export const DietScalarWhereInputSchema: z.ZodType<Prisma.DietScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => DietScalarWhereInputSchema), z.lazy(() => DietScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DietScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DietScalarWhereInputSchema), z.lazy(() => DietScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  dailyKcalGoal: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  dailyProteinGoal: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  dailyCarbGoal: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  dailyFatGoal: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  dailyWaterGoal: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
});

export const WorkoutPlanUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.WorkoutPlanUpsertWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => WorkoutPlanWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => WorkoutPlanUpdateWithoutUserInputSchema), z.lazy(() => WorkoutPlanUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => WorkoutPlanCreateWithoutUserInputSchema), z.lazy(() => WorkoutPlanUncheckedCreateWithoutUserInputSchema) ]),
});

export const WorkoutPlanUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.WorkoutPlanUpdateWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => WorkoutPlanWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => WorkoutPlanUpdateWithoutUserInputSchema), z.lazy(() => WorkoutPlanUncheckedUpdateWithoutUserInputSchema) ]),
});

export const WorkoutPlanUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.WorkoutPlanUpdateManyWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => WorkoutPlanScalarWhereInputSchema),
  data: z.union([ z.lazy(() => WorkoutPlanUpdateManyMutationInputSchema), z.lazy(() => WorkoutPlanUncheckedUpdateManyWithoutUserInputSchema) ]),
});

export const WorkoutPlanScalarWhereInputSchema: z.ZodType<Prisma.WorkoutPlanScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutPlanScalarWhereInputSchema), z.lazy(() => WorkoutPlanScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutPlanScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutPlanScalarWhereInputSchema), z.lazy(() => WorkoutPlanScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  isActive: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
});

export const BodyMetricUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.BodyMetricUpsertWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => BodyMetricWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => BodyMetricUpdateWithoutUserInputSchema), z.lazy(() => BodyMetricUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => BodyMetricCreateWithoutUserInputSchema), z.lazy(() => BodyMetricUncheckedCreateWithoutUserInputSchema) ]),
});

export const BodyMetricUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.BodyMetricUpdateWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => BodyMetricWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => BodyMetricUpdateWithoutUserInputSchema), z.lazy(() => BodyMetricUncheckedUpdateWithoutUserInputSchema) ]),
});

export const BodyMetricUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.BodyMetricUpdateManyWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => BodyMetricScalarWhereInputSchema),
  data: z.union([ z.lazy(() => BodyMetricUpdateManyMutationInputSchema), z.lazy(() => BodyMetricUncheckedUpdateManyWithoutUserInputSchema) ]),
});

export const BodyMetricScalarWhereInputSchema: z.ZodType<Prisma.BodyMetricScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => BodyMetricScalarWhereInputSchema), z.lazy(() => BodyMetricScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BodyMetricScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BodyMetricScalarWhereInputSchema), z.lazy(() => BodyMetricScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  weight: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  height: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  activityLevel: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  bodyFat: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  muscleRate: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
});

export const FoodUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.FoodUpsertWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => FoodWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => FoodUpdateWithoutUserInputSchema), z.lazy(() => FoodUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => FoodCreateWithoutUserInputSchema), z.lazy(() => FoodUncheckedCreateWithoutUserInputSchema) ]),
});

export const FoodUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.FoodUpdateWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => FoodWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => FoodUpdateWithoutUserInputSchema), z.lazy(() => FoodUncheckedUpdateWithoutUserInputSchema) ]),
});

export const FoodUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.FoodUpdateManyWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => FoodScalarWhereInputSchema),
  data: z.union([ z.lazy(() => FoodUpdateManyMutationInputSchema), z.lazy(() => FoodUncheckedUpdateManyWithoutUserInputSchema) ]),
});

export const FoodScalarWhereInputSchema: z.ZodType<Prisma.FoodScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => FoodScalarWhereInputSchema), z.lazy(() => FoodScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FoodScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FoodScalarWhereInputSchema), z.lazy(() => FoodScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  baseUnit: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  baseAmount: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  calories: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  carbohydrate: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  protein: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  fat: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  fiber: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
});

export const UserCreateWithoutAuthInputSchema: z.ZodType<Prisma.UserCreateWithoutAuthInput> = z.strictObject({
  id: z.uuid().optional(),
  role: z.lazy(() => ROLESchema).optional(),
  name: z.string(),
  birthDate: z.coerce.date(),
  gender: z.lazy(() => GENDERSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Diet: z.lazy(() => DietCreateNestedManyWithoutUserInputSchema).optional(),
  WorkoutPlan: z.lazy(() => WorkoutPlanCreateNestedManyWithoutUserInputSchema).optional(),
  bodyMetrics: z.lazy(() => BodyMetricCreateNestedManyWithoutUserInputSchema).optional(),
  food: z.lazy(() => FoodCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateWithoutAuthInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAuthInput> = z.strictObject({
  id: z.uuid().optional(),
  role: z.lazy(() => ROLESchema).optional(),
  name: z.string(),
  birthDate: z.coerce.date(),
  gender: z.lazy(() => GENDERSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Diet: z.lazy(() => DietUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  WorkoutPlan: z.lazy(() => WorkoutPlanUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  bodyMetrics: z.lazy(() => BodyMetricUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  food: z.lazy(() => FoodUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserCreateOrConnectWithoutAuthInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAuthInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutAuthInputSchema), z.lazy(() => UserUncheckedCreateWithoutAuthInputSchema) ]),
});

export const UserUpsertWithoutAuthInputSchema: z.ZodType<Prisma.UserUpsertWithoutAuthInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutAuthInputSchema), z.lazy(() => UserUncheckedUpdateWithoutAuthInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutAuthInputSchema), z.lazy(() => UserUncheckedCreateWithoutAuthInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutAuthInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAuthInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutAuthInputSchema), z.lazy(() => UserUncheckedUpdateWithoutAuthInputSchema) ]),
});

export const UserUpdateWithoutAuthInputSchema: z.ZodType<Prisma.UserUpdateWithoutAuthInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => ROLESchema), z.lazy(() => EnumROLEFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  birthDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GENDERSchema), z.lazy(() => EnumGENDERFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Diet: z.lazy(() => DietUpdateManyWithoutUserNestedInputSchema).optional(),
  WorkoutPlan: z.lazy(() => WorkoutPlanUpdateManyWithoutUserNestedInputSchema).optional(),
  bodyMetrics: z.lazy(() => BodyMetricUpdateManyWithoutUserNestedInputSchema).optional(),
  food: z.lazy(() => FoodUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutAuthInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAuthInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => ROLESchema), z.lazy(() => EnumROLEFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  birthDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GENDERSchema), z.lazy(() => EnumGENDERFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Diet: z.lazy(() => DietUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  WorkoutPlan: z.lazy(() => WorkoutPlanUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  bodyMetrics: z.lazy(() => BodyMetricUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  food: z.lazy(() => FoodUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserCreateWithoutBodyMetricsInputSchema: z.ZodType<Prisma.UserCreateWithoutBodyMetricsInput> = z.strictObject({
  id: z.uuid().optional(),
  role: z.lazy(() => ROLESchema).optional(),
  name: z.string(),
  birthDate: z.coerce.date(),
  gender: z.lazy(() => GENDERSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  auth: z.lazy(() => AuthCreateNestedOneWithoutUserInputSchema).optional(),
  Diet: z.lazy(() => DietCreateNestedManyWithoutUserInputSchema).optional(),
  WorkoutPlan: z.lazy(() => WorkoutPlanCreateNestedManyWithoutUserInputSchema).optional(),
  food: z.lazy(() => FoodCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateWithoutBodyMetricsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutBodyMetricsInput> = z.strictObject({
  id: z.uuid().optional(),
  role: z.lazy(() => ROLESchema).optional(),
  name: z.string(),
  birthDate: z.coerce.date(),
  gender: z.lazy(() => GENDERSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  auth: z.lazy(() => AuthUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  Diet: z.lazy(() => DietUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  WorkoutPlan: z.lazy(() => WorkoutPlanUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  food: z.lazy(() => FoodUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserCreateOrConnectWithoutBodyMetricsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutBodyMetricsInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutBodyMetricsInputSchema), z.lazy(() => UserUncheckedCreateWithoutBodyMetricsInputSchema) ]),
});

export const UserUpsertWithoutBodyMetricsInputSchema: z.ZodType<Prisma.UserUpsertWithoutBodyMetricsInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutBodyMetricsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutBodyMetricsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutBodyMetricsInputSchema), z.lazy(() => UserUncheckedCreateWithoutBodyMetricsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutBodyMetricsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutBodyMetricsInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutBodyMetricsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutBodyMetricsInputSchema) ]),
});

export const UserUpdateWithoutBodyMetricsInputSchema: z.ZodType<Prisma.UserUpdateWithoutBodyMetricsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => ROLESchema), z.lazy(() => EnumROLEFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  birthDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GENDERSchema), z.lazy(() => EnumGENDERFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  auth: z.lazy(() => AuthUpdateOneWithoutUserNestedInputSchema).optional(),
  Diet: z.lazy(() => DietUpdateManyWithoutUserNestedInputSchema).optional(),
  WorkoutPlan: z.lazy(() => WorkoutPlanUpdateManyWithoutUserNestedInputSchema).optional(),
  food: z.lazy(() => FoodUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutBodyMetricsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutBodyMetricsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => ROLESchema), z.lazy(() => EnumROLEFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  birthDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GENDERSchema), z.lazy(() => EnumGENDERFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  auth: z.lazy(() => AuthUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  Diet: z.lazy(() => DietUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  WorkoutPlan: z.lazy(() => WorkoutPlanUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  food: z.lazy(() => FoodUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserCreateWithoutDietInputSchema: z.ZodType<Prisma.UserCreateWithoutDietInput> = z.strictObject({
  id: z.uuid().optional(),
  role: z.lazy(() => ROLESchema).optional(),
  name: z.string(),
  birthDate: z.coerce.date(),
  gender: z.lazy(() => GENDERSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  auth: z.lazy(() => AuthCreateNestedOneWithoutUserInputSchema).optional(),
  WorkoutPlan: z.lazy(() => WorkoutPlanCreateNestedManyWithoutUserInputSchema).optional(),
  bodyMetrics: z.lazy(() => BodyMetricCreateNestedManyWithoutUserInputSchema).optional(),
  food: z.lazy(() => FoodCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateWithoutDietInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutDietInput> = z.strictObject({
  id: z.uuid().optional(),
  role: z.lazy(() => ROLESchema).optional(),
  name: z.string(),
  birthDate: z.coerce.date(),
  gender: z.lazy(() => GENDERSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  auth: z.lazy(() => AuthUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  WorkoutPlan: z.lazy(() => WorkoutPlanUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  bodyMetrics: z.lazy(() => BodyMetricUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  food: z.lazy(() => FoodUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserCreateOrConnectWithoutDietInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutDietInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutDietInputSchema), z.lazy(() => UserUncheckedCreateWithoutDietInputSchema) ]),
});

export const MealCreateWithoutDietInputSchema: z.ZodType<Prisma.MealCreateWithoutDietInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  time: z.string(),
  orderIndex: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  foods: z.lazy(() => FoodInMealCreateNestedManyWithoutMealInputSchema).optional(),
});

export const MealUncheckedCreateWithoutDietInputSchema: z.ZodType<Prisma.MealUncheckedCreateWithoutDietInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  time: z.string(),
  orderIndex: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  foods: z.lazy(() => FoodInMealUncheckedCreateNestedManyWithoutMealInputSchema).optional(),
});

export const MealCreateOrConnectWithoutDietInputSchema: z.ZodType<Prisma.MealCreateOrConnectWithoutDietInput> = z.strictObject({
  where: z.lazy(() => MealWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MealCreateWithoutDietInputSchema), z.lazy(() => MealUncheckedCreateWithoutDietInputSchema) ]),
});

export const MealCreateManyDietInputEnvelopeSchema: z.ZodType<Prisma.MealCreateManyDietInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => MealCreateManyDietInputSchema), z.lazy(() => MealCreateManyDietInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const UserUpsertWithoutDietInputSchema: z.ZodType<Prisma.UserUpsertWithoutDietInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutDietInputSchema), z.lazy(() => UserUncheckedUpdateWithoutDietInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutDietInputSchema), z.lazy(() => UserUncheckedCreateWithoutDietInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutDietInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutDietInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutDietInputSchema), z.lazy(() => UserUncheckedUpdateWithoutDietInputSchema) ]),
});

export const UserUpdateWithoutDietInputSchema: z.ZodType<Prisma.UserUpdateWithoutDietInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => ROLESchema), z.lazy(() => EnumROLEFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  birthDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GENDERSchema), z.lazy(() => EnumGENDERFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  auth: z.lazy(() => AuthUpdateOneWithoutUserNestedInputSchema).optional(),
  WorkoutPlan: z.lazy(() => WorkoutPlanUpdateManyWithoutUserNestedInputSchema).optional(),
  bodyMetrics: z.lazy(() => BodyMetricUpdateManyWithoutUserNestedInputSchema).optional(),
  food: z.lazy(() => FoodUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutDietInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutDietInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => ROLESchema), z.lazy(() => EnumROLEFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  birthDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GENDERSchema), z.lazy(() => EnumGENDERFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  auth: z.lazy(() => AuthUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  WorkoutPlan: z.lazy(() => WorkoutPlanUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  bodyMetrics: z.lazy(() => BodyMetricUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  food: z.lazy(() => FoodUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const MealUpsertWithWhereUniqueWithoutDietInputSchema: z.ZodType<Prisma.MealUpsertWithWhereUniqueWithoutDietInput> = z.strictObject({
  where: z.lazy(() => MealWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MealUpdateWithoutDietInputSchema), z.lazy(() => MealUncheckedUpdateWithoutDietInputSchema) ]),
  create: z.union([ z.lazy(() => MealCreateWithoutDietInputSchema), z.lazy(() => MealUncheckedCreateWithoutDietInputSchema) ]),
});

export const MealUpdateWithWhereUniqueWithoutDietInputSchema: z.ZodType<Prisma.MealUpdateWithWhereUniqueWithoutDietInput> = z.strictObject({
  where: z.lazy(() => MealWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MealUpdateWithoutDietInputSchema), z.lazy(() => MealUncheckedUpdateWithoutDietInputSchema) ]),
});

export const MealUpdateManyWithWhereWithoutDietInputSchema: z.ZodType<Prisma.MealUpdateManyWithWhereWithoutDietInput> = z.strictObject({
  where: z.lazy(() => MealScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MealUpdateManyMutationInputSchema), z.lazy(() => MealUncheckedUpdateManyWithoutDietInputSchema) ]),
});

export const MealScalarWhereInputSchema: z.ZodType<Prisma.MealScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MealScalarWhereInputSchema), z.lazy(() => MealScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MealScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MealScalarWhereInputSchema), z.lazy(() => MealScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  time: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  orderIndex: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  dietId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
});

export const DietCreateWithoutMealInputSchema: z.ZodType<Prisma.DietCreateWithoutMealInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  dailyKcalGoal: z.number().int(),
  dailyProteinGoal: z.number().int(),
  dailyCarbGoal: z.number().int(),
  dailyFatGoal: z.number().int(),
  dailyWaterGoal: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutDietInputSchema),
});

export const DietUncheckedCreateWithoutMealInputSchema: z.ZodType<Prisma.DietUncheckedCreateWithoutMealInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  dailyKcalGoal: z.number().int(),
  dailyProteinGoal: z.number().int(),
  dailyCarbGoal: z.number().int(),
  dailyFatGoal: z.number().int(),
  dailyWaterGoal: z.number().int(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const DietCreateOrConnectWithoutMealInputSchema: z.ZodType<Prisma.DietCreateOrConnectWithoutMealInput> = z.strictObject({
  where: z.lazy(() => DietWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DietCreateWithoutMealInputSchema), z.lazy(() => DietUncheckedCreateWithoutMealInputSchema) ]),
});

export const FoodInMealCreateWithoutMealInputSchema: z.ZodType<Prisma.FoodInMealCreateWithoutMealInput> = z.strictObject({
  id: z.uuid().optional(),
  quantity: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  food: z.lazy(() => FoodCreateNestedOneWithoutFoodInMealsInputSchema),
});

export const FoodInMealUncheckedCreateWithoutMealInputSchema: z.ZodType<Prisma.FoodInMealUncheckedCreateWithoutMealInput> = z.strictObject({
  id: z.uuid().optional(),
  quantity: z.number().int(),
  foodId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const FoodInMealCreateOrConnectWithoutMealInputSchema: z.ZodType<Prisma.FoodInMealCreateOrConnectWithoutMealInput> = z.strictObject({
  where: z.lazy(() => FoodInMealWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FoodInMealCreateWithoutMealInputSchema), z.lazy(() => FoodInMealUncheckedCreateWithoutMealInputSchema) ]),
});

export const FoodInMealCreateManyMealInputEnvelopeSchema: z.ZodType<Prisma.FoodInMealCreateManyMealInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => FoodInMealCreateManyMealInputSchema), z.lazy(() => FoodInMealCreateManyMealInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const DietUpsertWithoutMealInputSchema: z.ZodType<Prisma.DietUpsertWithoutMealInput> = z.strictObject({
  update: z.union([ z.lazy(() => DietUpdateWithoutMealInputSchema), z.lazy(() => DietUncheckedUpdateWithoutMealInputSchema) ]),
  create: z.union([ z.lazy(() => DietCreateWithoutMealInputSchema), z.lazy(() => DietUncheckedCreateWithoutMealInputSchema) ]),
  where: z.lazy(() => DietWhereInputSchema).optional(),
});

export const DietUpdateToOneWithWhereWithoutMealInputSchema: z.ZodType<Prisma.DietUpdateToOneWithWhereWithoutMealInput> = z.strictObject({
  where: z.lazy(() => DietWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DietUpdateWithoutMealInputSchema), z.lazy(() => DietUncheckedUpdateWithoutMealInputSchema) ]),
});

export const DietUpdateWithoutMealInputSchema: z.ZodType<Prisma.DietUpdateWithoutMealInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dailyKcalGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyProteinGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyCarbGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyFatGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyWaterGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutDietNestedInputSchema).optional(),
});

export const DietUncheckedUpdateWithoutMealInputSchema: z.ZodType<Prisma.DietUncheckedUpdateWithoutMealInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dailyKcalGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyProteinGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyCarbGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyFatGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyWaterGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const FoodInMealUpsertWithWhereUniqueWithoutMealInputSchema: z.ZodType<Prisma.FoodInMealUpsertWithWhereUniqueWithoutMealInput> = z.strictObject({
  where: z.lazy(() => FoodInMealWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => FoodInMealUpdateWithoutMealInputSchema), z.lazy(() => FoodInMealUncheckedUpdateWithoutMealInputSchema) ]),
  create: z.union([ z.lazy(() => FoodInMealCreateWithoutMealInputSchema), z.lazy(() => FoodInMealUncheckedCreateWithoutMealInputSchema) ]),
});

export const FoodInMealUpdateWithWhereUniqueWithoutMealInputSchema: z.ZodType<Prisma.FoodInMealUpdateWithWhereUniqueWithoutMealInput> = z.strictObject({
  where: z.lazy(() => FoodInMealWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => FoodInMealUpdateWithoutMealInputSchema), z.lazy(() => FoodInMealUncheckedUpdateWithoutMealInputSchema) ]),
});

export const FoodInMealUpdateManyWithWhereWithoutMealInputSchema: z.ZodType<Prisma.FoodInMealUpdateManyWithWhereWithoutMealInput> = z.strictObject({
  where: z.lazy(() => FoodInMealScalarWhereInputSchema),
  data: z.union([ z.lazy(() => FoodInMealUpdateManyMutationInputSchema), z.lazy(() => FoodInMealUncheckedUpdateManyWithoutMealInputSchema) ]),
});

export const FoodInMealScalarWhereInputSchema: z.ZodType<Prisma.FoodInMealScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => FoodInMealScalarWhereInputSchema), z.lazy(() => FoodInMealScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FoodInMealScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FoodInMealScalarWhereInputSchema), z.lazy(() => FoodInMealScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  mealId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  foodId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
});

export const MealCreateWithoutFoodsInputSchema: z.ZodType<Prisma.MealCreateWithoutFoodsInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  time: z.string(),
  orderIndex: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  diet: z.lazy(() => DietCreateNestedOneWithoutMealInputSchema),
});

export const MealUncheckedCreateWithoutFoodsInputSchema: z.ZodType<Prisma.MealUncheckedCreateWithoutFoodsInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  time: z.string(),
  orderIndex: z.number().int(),
  dietId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const MealCreateOrConnectWithoutFoodsInputSchema: z.ZodType<Prisma.MealCreateOrConnectWithoutFoodsInput> = z.strictObject({
  where: z.lazy(() => MealWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MealCreateWithoutFoodsInputSchema), z.lazy(() => MealUncheckedCreateWithoutFoodsInputSchema) ]),
});

export const FoodCreateWithoutFoodInMealsInputSchema: z.ZodType<Omit<Prisma.FoodCreateWithoutFoodInMealsInput, "id" | "createdAt" | "updatedAt">> = z.strictObject({
  // omitted: id: z.uuid().optional(),
  name: z.string(),
  baseUnit: z.string().optional(),
  baseAmount: z.number().int().optional(),
  calories: z.number().int(),
  carbohydrate: z.number().int(),
  protein: z.number().int(),
  fat: z.number().int(),
  fiber: z.number().int().optional().nullable(),
  // omitted: createdAt: z.coerce.date().optional(),
  // omitted: updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutFoodInputSchema).optional(),
});

export const FoodUncheckedCreateWithoutFoodInMealsInputSchema: z.ZodType<Omit<Prisma.FoodUncheckedCreateWithoutFoodInMealsInput, "id" | "userId" | "createdAt" | "updatedAt">> = z.strictObject({
  // omitted: id: z.uuid().optional(),
  name: z.string(),
  baseUnit: z.string().optional(),
  baseAmount: z.number().int().optional(),
  calories: z.number().int(),
  carbohydrate: z.number().int(),
  protein: z.number().int(),
  fat: z.number().int(),
  fiber: z.number().int().optional().nullable(),
  // omitted: userId: z.string().optional().nullable(),
  // omitted: createdAt: z.coerce.date().optional(),
  // omitted: updatedAt: z.coerce.date().optional(),
});

export const FoodCreateOrConnectWithoutFoodInMealsInputSchema: z.ZodType<Prisma.FoodCreateOrConnectWithoutFoodInMealsInput> = z.strictObject({
  where: z.lazy(() => FoodWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FoodCreateWithoutFoodInMealsInputSchema), z.lazy(() => FoodUncheckedCreateWithoutFoodInMealsInputSchema) ]),
});

export const MealUpsertWithoutFoodsInputSchema: z.ZodType<Prisma.MealUpsertWithoutFoodsInput> = z.strictObject({
  update: z.union([ z.lazy(() => MealUpdateWithoutFoodsInputSchema), z.lazy(() => MealUncheckedUpdateWithoutFoodsInputSchema) ]),
  create: z.union([ z.lazy(() => MealCreateWithoutFoodsInputSchema), z.lazy(() => MealUncheckedCreateWithoutFoodsInputSchema) ]),
  where: z.lazy(() => MealWhereInputSchema).optional(),
});

export const MealUpdateToOneWithWhereWithoutFoodsInputSchema: z.ZodType<Prisma.MealUpdateToOneWithWhereWithoutFoodsInput> = z.strictObject({
  where: z.lazy(() => MealWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => MealUpdateWithoutFoodsInputSchema), z.lazy(() => MealUncheckedUpdateWithoutFoodsInputSchema) ]),
});

export const MealUpdateWithoutFoodsInputSchema: z.ZodType<Prisma.MealUpdateWithoutFoodsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  diet: z.lazy(() => DietUpdateOneRequiredWithoutMealNestedInputSchema).optional(),
});

export const MealUncheckedUpdateWithoutFoodsInputSchema: z.ZodType<Prisma.MealUncheckedUpdateWithoutFoodsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dietId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const FoodUpsertWithoutFoodInMealsInputSchema: z.ZodType<Prisma.FoodUpsertWithoutFoodInMealsInput> = z.strictObject({
  update: z.union([ z.lazy(() => FoodUpdateWithoutFoodInMealsInputSchema), z.lazy(() => FoodUncheckedUpdateWithoutFoodInMealsInputSchema) ]),
  create: z.union([ z.lazy(() => FoodCreateWithoutFoodInMealsInputSchema), z.lazy(() => FoodUncheckedCreateWithoutFoodInMealsInputSchema) ]),
  where: z.lazy(() => FoodWhereInputSchema).optional(),
});

export const FoodUpdateToOneWithWhereWithoutFoodInMealsInputSchema: z.ZodType<Prisma.FoodUpdateToOneWithWhereWithoutFoodInMealsInput> = z.strictObject({
  where: z.lazy(() => FoodWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => FoodUpdateWithoutFoodInMealsInputSchema), z.lazy(() => FoodUncheckedUpdateWithoutFoodInMealsInputSchema) ]),
});

export const FoodUpdateWithoutFoodInMealsInputSchema: z.ZodType<Omit<Prisma.FoodUpdateWithoutFoodInMealsInput, "id" | "createdAt" | "updatedAt">> = z.strictObject({
  // omitted: id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  baseUnit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  baseAmount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  calories: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  carbohydrate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  protein: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fat: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fiber: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  // omitted: createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneWithoutFoodNestedInputSchema).optional(),
});

export const FoodUncheckedUpdateWithoutFoodInMealsInputSchema: z.ZodType<Omit<Prisma.FoodUncheckedUpdateWithoutFoodInMealsInput, "id" | "userId" | "createdAt" | "updatedAt">> = z.strictObject({
  // omitted: id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  baseUnit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  baseAmount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  calories: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  carbohydrate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  protein: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fat: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fiber: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  // omitted: userId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  // omitted: createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserCreateWithoutFoodInputSchema: z.ZodType<Prisma.UserCreateWithoutFoodInput> = z.strictObject({
  id: z.uuid().optional(),
  role: z.lazy(() => ROLESchema).optional(),
  name: z.string(),
  birthDate: z.coerce.date(),
  gender: z.lazy(() => GENDERSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  auth: z.lazy(() => AuthCreateNestedOneWithoutUserInputSchema).optional(),
  Diet: z.lazy(() => DietCreateNestedManyWithoutUserInputSchema).optional(),
  WorkoutPlan: z.lazy(() => WorkoutPlanCreateNestedManyWithoutUserInputSchema).optional(),
  bodyMetrics: z.lazy(() => BodyMetricCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateWithoutFoodInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutFoodInput> = z.strictObject({
  id: z.uuid().optional(),
  role: z.lazy(() => ROLESchema).optional(),
  name: z.string(),
  birthDate: z.coerce.date(),
  gender: z.lazy(() => GENDERSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  auth: z.lazy(() => AuthUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  Diet: z.lazy(() => DietUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  WorkoutPlan: z.lazy(() => WorkoutPlanUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  bodyMetrics: z.lazy(() => BodyMetricUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserCreateOrConnectWithoutFoodInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutFoodInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutFoodInputSchema), z.lazy(() => UserUncheckedCreateWithoutFoodInputSchema) ]),
});

export const FoodInMealCreateWithoutFoodInputSchema: z.ZodType<Prisma.FoodInMealCreateWithoutFoodInput> = z.strictObject({
  id: z.uuid().optional(),
  quantity: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  meal: z.lazy(() => MealCreateNestedOneWithoutFoodsInputSchema),
});

export const FoodInMealUncheckedCreateWithoutFoodInputSchema: z.ZodType<Prisma.FoodInMealUncheckedCreateWithoutFoodInput> = z.strictObject({
  id: z.uuid().optional(),
  quantity: z.number().int(),
  mealId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const FoodInMealCreateOrConnectWithoutFoodInputSchema: z.ZodType<Prisma.FoodInMealCreateOrConnectWithoutFoodInput> = z.strictObject({
  where: z.lazy(() => FoodInMealWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FoodInMealCreateWithoutFoodInputSchema), z.lazy(() => FoodInMealUncheckedCreateWithoutFoodInputSchema) ]),
});

export const FoodInMealCreateManyFoodInputEnvelopeSchema: z.ZodType<Prisma.FoodInMealCreateManyFoodInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => FoodInMealCreateManyFoodInputSchema), z.lazy(() => FoodInMealCreateManyFoodInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const UserUpsertWithoutFoodInputSchema: z.ZodType<Prisma.UserUpsertWithoutFoodInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutFoodInputSchema), z.lazy(() => UserUncheckedUpdateWithoutFoodInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutFoodInputSchema), z.lazy(() => UserUncheckedCreateWithoutFoodInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutFoodInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutFoodInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutFoodInputSchema), z.lazy(() => UserUncheckedUpdateWithoutFoodInputSchema) ]),
});

export const UserUpdateWithoutFoodInputSchema: z.ZodType<Prisma.UserUpdateWithoutFoodInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => ROLESchema), z.lazy(() => EnumROLEFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  birthDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GENDERSchema), z.lazy(() => EnumGENDERFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  auth: z.lazy(() => AuthUpdateOneWithoutUserNestedInputSchema).optional(),
  Diet: z.lazy(() => DietUpdateManyWithoutUserNestedInputSchema).optional(),
  WorkoutPlan: z.lazy(() => WorkoutPlanUpdateManyWithoutUserNestedInputSchema).optional(),
  bodyMetrics: z.lazy(() => BodyMetricUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutFoodInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutFoodInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => ROLESchema), z.lazy(() => EnumROLEFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  birthDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GENDERSchema), z.lazy(() => EnumGENDERFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  auth: z.lazy(() => AuthUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  Diet: z.lazy(() => DietUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  WorkoutPlan: z.lazy(() => WorkoutPlanUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  bodyMetrics: z.lazy(() => BodyMetricUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const FoodInMealUpsertWithWhereUniqueWithoutFoodInputSchema: z.ZodType<Prisma.FoodInMealUpsertWithWhereUniqueWithoutFoodInput> = z.strictObject({
  where: z.lazy(() => FoodInMealWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => FoodInMealUpdateWithoutFoodInputSchema), z.lazy(() => FoodInMealUncheckedUpdateWithoutFoodInputSchema) ]),
  create: z.union([ z.lazy(() => FoodInMealCreateWithoutFoodInputSchema), z.lazy(() => FoodInMealUncheckedCreateWithoutFoodInputSchema) ]),
});

export const FoodInMealUpdateWithWhereUniqueWithoutFoodInputSchema: z.ZodType<Prisma.FoodInMealUpdateWithWhereUniqueWithoutFoodInput> = z.strictObject({
  where: z.lazy(() => FoodInMealWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => FoodInMealUpdateWithoutFoodInputSchema), z.lazy(() => FoodInMealUncheckedUpdateWithoutFoodInputSchema) ]),
});

export const FoodInMealUpdateManyWithWhereWithoutFoodInputSchema: z.ZodType<Prisma.FoodInMealUpdateManyWithWhereWithoutFoodInput> = z.strictObject({
  where: z.lazy(() => FoodInMealScalarWhereInputSchema),
  data: z.union([ z.lazy(() => FoodInMealUpdateManyMutationInputSchema), z.lazy(() => FoodInMealUncheckedUpdateManyWithoutFoodInputSchema) ]),
});

export const WorkoutCreateWithoutWorkoutPlanInputSchema: z.ZodType<Prisma.WorkoutCreateWithoutWorkoutPlanInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string().optional().nullable(),
  day: z.lazy(() => WORKOUT_DAYSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  workoutExercises: z.lazy(() => WorkoutExerciseCreateNestedManyWithoutWorkoutInputSchema).optional(),
});

export const WorkoutUncheckedCreateWithoutWorkoutPlanInputSchema: z.ZodType<Prisma.WorkoutUncheckedCreateWithoutWorkoutPlanInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string().optional().nullable(),
  day: z.lazy(() => WORKOUT_DAYSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  workoutExercises: z.lazy(() => WorkoutExerciseUncheckedCreateNestedManyWithoutWorkoutInputSchema).optional(),
});

export const WorkoutCreateOrConnectWithoutWorkoutPlanInputSchema: z.ZodType<Prisma.WorkoutCreateOrConnectWithoutWorkoutPlanInput> = z.strictObject({
  where: z.lazy(() => WorkoutWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkoutCreateWithoutWorkoutPlanInputSchema), z.lazy(() => WorkoutUncheckedCreateWithoutWorkoutPlanInputSchema) ]),
});

export const WorkoutCreateManyWorkoutPlanInputEnvelopeSchema: z.ZodType<Prisma.WorkoutCreateManyWorkoutPlanInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => WorkoutCreateManyWorkoutPlanInputSchema), z.lazy(() => WorkoutCreateManyWorkoutPlanInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const UserCreateWithoutWorkoutPlanInputSchema: z.ZodType<Prisma.UserCreateWithoutWorkoutPlanInput> = z.strictObject({
  id: z.uuid().optional(),
  role: z.lazy(() => ROLESchema).optional(),
  name: z.string(),
  birthDate: z.coerce.date(),
  gender: z.lazy(() => GENDERSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  auth: z.lazy(() => AuthCreateNestedOneWithoutUserInputSchema).optional(),
  Diet: z.lazy(() => DietCreateNestedManyWithoutUserInputSchema).optional(),
  bodyMetrics: z.lazy(() => BodyMetricCreateNestedManyWithoutUserInputSchema).optional(),
  food: z.lazy(() => FoodCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateWithoutWorkoutPlanInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutWorkoutPlanInput> = z.strictObject({
  id: z.uuid().optional(),
  role: z.lazy(() => ROLESchema).optional(),
  name: z.string(),
  birthDate: z.coerce.date(),
  gender: z.lazy(() => GENDERSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  auth: z.lazy(() => AuthUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  Diet: z.lazy(() => DietUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  bodyMetrics: z.lazy(() => BodyMetricUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  food: z.lazy(() => FoodUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserCreateOrConnectWithoutWorkoutPlanInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutWorkoutPlanInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutWorkoutPlanInputSchema), z.lazy(() => UserUncheckedCreateWithoutWorkoutPlanInputSchema) ]),
});

export const WorkoutUpsertWithWhereUniqueWithoutWorkoutPlanInputSchema: z.ZodType<Prisma.WorkoutUpsertWithWhereUniqueWithoutWorkoutPlanInput> = z.strictObject({
  where: z.lazy(() => WorkoutWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => WorkoutUpdateWithoutWorkoutPlanInputSchema), z.lazy(() => WorkoutUncheckedUpdateWithoutWorkoutPlanInputSchema) ]),
  create: z.union([ z.lazy(() => WorkoutCreateWithoutWorkoutPlanInputSchema), z.lazy(() => WorkoutUncheckedCreateWithoutWorkoutPlanInputSchema) ]),
});

export const WorkoutUpdateWithWhereUniqueWithoutWorkoutPlanInputSchema: z.ZodType<Prisma.WorkoutUpdateWithWhereUniqueWithoutWorkoutPlanInput> = z.strictObject({
  where: z.lazy(() => WorkoutWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => WorkoutUpdateWithoutWorkoutPlanInputSchema), z.lazy(() => WorkoutUncheckedUpdateWithoutWorkoutPlanInputSchema) ]),
});

export const WorkoutUpdateManyWithWhereWithoutWorkoutPlanInputSchema: z.ZodType<Prisma.WorkoutUpdateManyWithWhereWithoutWorkoutPlanInput> = z.strictObject({
  where: z.lazy(() => WorkoutScalarWhereInputSchema),
  data: z.union([ z.lazy(() => WorkoutUpdateManyMutationInputSchema), z.lazy(() => WorkoutUncheckedUpdateManyWithoutWorkoutPlanInputSchema) ]),
});

export const WorkoutScalarWhereInputSchema: z.ZodType<Prisma.WorkoutScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutScalarWhereInputSchema), z.lazy(() => WorkoutScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutScalarWhereInputSchema), z.lazy(() => WorkoutScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  day: z.union([ z.lazy(() => EnumWORKOUT_DAYFilterSchema), z.lazy(() => WORKOUT_DAYSchema) ]).optional(),
  workoutPlanId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
});

export const UserUpsertWithoutWorkoutPlanInputSchema: z.ZodType<Prisma.UserUpsertWithoutWorkoutPlanInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutWorkoutPlanInputSchema), z.lazy(() => UserUncheckedUpdateWithoutWorkoutPlanInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutWorkoutPlanInputSchema), z.lazy(() => UserUncheckedCreateWithoutWorkoutPlanInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutWorkoutPlanInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutWorkoutPlanInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutWorkoutPlanInputSchema), z.lazy(() => UserUncheckedUpdateWithoutWorkoutPlanInputSchema) ]),
});

export const UserUpdateWithoutWorkoutPlanInputSchema: z.ZodType<Prisma.UserUpdateWithoutWorkoutPlanInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => ROLESchema), z.lazy(() => EnumROLEFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  birthDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GENDERSchema), z.lazy(() => EnumGENDERFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  auth: z.lazy(() => AuthUpdateOneWithoutUserNestedInputSchema).optional(),
  Diet: z.lazy(() => DietUpdateManyWithoutUserNestedInputSchema).optional(),
  bodyMetrics: z.lazy(() => BodyMetricUpdateManyWithoutUserNestedInputSchema).optional(),
  food: z.lazy(() => FoodUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutWorkoutPlanInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutWorkoutPlanInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => ROLESchema), z.lazy(() => EnumROLEFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  birthDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GENDERSchema), z.lazy(() => EnumGENDERFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  auth: z.lazy(() => AuthUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  Diet: z.lazy(() => DietUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  bodyMetrics: z.lazy(() => BodyMetricUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  food: z.lazy(() => FoodUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const WorkoutPlanCreateWithoutWorkoutsInputSchema: z.ZodType<Prisma.WorkoutPlanCreateWithoutWorkoutsInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutWorkoutPlanInputSchema),
});

export const WorkoutPlanUncheckedCreateWithoutWorkoutsInputSchema: z.ZodType<Prisma.WorkoutPlanUncheckedCreateWithoutWorkoutsInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  isActive: z.boolean().optional(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const WorkoutPlanCreateOrConnectWithoutWorkoutsInputSchema: z.ZodType<Prisma.WorkoutPlanCreateOrConnectWithoutWorkoutsInput> = z.strictObject({
  where: z.lazy(() => WorkoutPlanWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkoutPlanCreateWithoutWorkoutsInputSchema), z.lazy(() => WorkoutPlanUncheckedCreateWithoutWorkoutsInputSchema) ]),
});

export const WorkoutExerciseCreateWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutExerciseCreateWithoutWorkoutInput> = z.strictObject({
  id: z.uuid().optional(),
  orderIndex: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  exercise: z.lazy(() => ExerciseCreateNestedOneWithoutUsedInWorkoutsInputSchema),
  sets: z.lazy(() => WorkoutSetCreateNestedManyWithoutWorkoutExerciseInputSchema).optional(),
});

export const WorkoutExerciseUncheckedCreateWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedCreateWithoutWorkoutInput> = z.strictObject({
  id: z.uuid().optional(),
  orderIndex: z.number().int(),
  exerciseId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sets: z.lazy(() => WorkoutSetUncheckedCreateNestedManyWithoutWorkoutExerciseInputSchema).optional(),
});

export const WorkoutExerciseCreateOrConnectWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutExerciseCreateOrConnectWithoutWorkoutInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutWorkoutInputSchema) ]),
});

export const WorkoutExerciseCreateManyWorkoutInputEnvelopeSchema: z.ZodType<Prisma.WorkoutExerciseCreateManyWorkoutInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => WorkoutExerciseCreateManyWorkoutInputSchema), z.lazy(() => WorkoutExerciseCreateManyWorkoutInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const WorkoutPlanUpsertWithoutWorkoutsInputSchema: z.ZodType<Prisma.WorkoutPlanUpsertWithoutWorkoutsInput> = z.strictObject({
  update: z.union([ z.lazy(() => WorkoutPlanUpdateWithoutWorkoutsInputSchema), z.lazy(() => WorkoutPlanUncheckedUpdateWithoutWorkoutsInputSchema) ]),
  create: z.union([ z.lazy(() => WorkoutPlanCreateWithoutWorkoutsInputSchema), z.lazy(() => WorkoutPlanUncheckedCreateWithoutWorkoutsInputSchema) ]),
  where: z.lazy(() => WorkoutPlanWhereInputSchema).optional(),
});

export const WorkoutPlanUpdateToOneWithWhereWithoutWorkoutsInputSchema: z.ZodType<Prisma.WorkoutPlanUpdateToOneWithWhereWithoutWorkoutsInput> = z.strictObject({
  where: z.lazy(() => WorkoutPlanWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => WorkoutPlanUpdateWithoutWorkoutsInputSchema), z.lazy(() => WorkoutPlanUncheckedUpdateWithoutWorkoutsInputSchema) ]),
});

export const WorkoutPlanUpdateWithoutWorkoutsInputSchema: z.ZodType<Prisma.WorkoutPlanUpdateWithoutWorkoutsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutWorkoutPlanNestedInputSchema).optional(),
});

export const WorkoutPlanUncheckedUpdateWithoutWorkoutsInputSchema: z.ZodType<Prisma.WorkoutPlanUncheckedUpdateWithoutWorkoutsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutExerciseUpsertWithWhereUniqueWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutExerciseUpsertWithWhereUniqueWithoutWorkoutInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => WorkoutExerciseUpdateWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUncheckedUpdateWithoutWorkoutInputSchema) ]),
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutWorkoutInputSchema) ]),
});

export const WorkoutExerciseUpdateWithWhereUniqueWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutExerciseUpdateWithWhereUniqueWithoutWorkoutInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => WorkoutExerciseUpdateWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUncheckedUpdateWithoutWorkoutInputSchema) ]),
});

export const WorkoutExerciseUpdateManyWithWhereWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutExerciseUpdateManyWithWhereWithoutWorkoutInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseScalarWhereInputSchema),
  data: z.union([ z.lazy(() => WorkoutExerciseUpdateManyMutationInputSchema), z.lazy(() => WorkoutExerciseUncheckedUpdateManyWithoutWorkoutInputSchema) ]),
});

export const WorkoutExerciseScalarWhereInputSchema: z.ZodType<Prisma.WorkoutExerciseScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutExerciseScalarWhereInputSchema), z.lazy(() => WorkoutExerciseScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutExerciseScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutExerciseScalarWhereInputSchema), z.lazy(() => WorkoutExerciseScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  orderIndex: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  workoutId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  exerciseId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
});

export const WorkoutCreateWithoutWorkoutExercisesInputSchema: z.ZodType<Prisma.WorkoutCreateWithoutWorkoutExercisesInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string().optional().nullable(),
  day: z.lazy(() => WORKOUT_DAYSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  workoutPlan: z.lazy(() => WorkoutPlanCreateNestedOneWithoutWorkoutsInputSchema),
});

export const WorkoutUncheckedCreateWithoutWorkoutExercisesInputSchema: z.ZodType<Prisma.WorkoutUncheckedCreateWithoutWorkoutExercisesInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string().optional().nullable(),
  day: z.lazy(() => WORKOUT_DAYSchema),
  workoutPlanId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const WorkoutCreateOrConnectWithoutWorkoutExercisesInputSchema: z.ZodType<Prisma.WorkoutCreateOrConnectWithoutWorkoutExercisesInput> = z.strictObject({
  where: z.lazy(() => WorkoutWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkoutCreateWithoutWorkoutExercisesInputSchema), z.lazy(() => WorkoutUncheckedCreateWithoutWorkoutExercisesInputSchema) ]),
});

export const ExerciseCreateWithoutUsedInWorkoutsInputSchema: z.ZodType<Prisma.ExerciseCreateWithoutUsedInWorkoutsInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  muscleGroup: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const ExerciseUncheckedCreateWithoutUsedInWorkoutsInputSchema: z.ZodType<Prisma.ExerciseUncheckedCreateWithoutUsedInWorkoutsInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  muscleGroup: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const ExerciseCreateOrConnectWithoutUsedInWorkoutsInputSchema: z.ZodType<Prisma.ExerciseCreateOrConnectWithoutUsedInWorkoutsInput> = z.strictObject({
  where: z.lazy(() => ExerciseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ExerciseCreateWithoutUsedInWorkoutsInputSchema), z.lazy(() => ExerciseUncheckedCreateWithoutUsedInWorkoutsInputSchema) ]),
});

export const WorkoutSetCreateWithoutWorkoutExerciseInputSchema: z.ZodType<Prisma.WorkoutSetCreateWithoutWorkoutExerciseInput> = z.strictObject({
  id: z.uuid().optional(),
  setNumber: z.number().int(),
  repetitions: z.number().int(),
  weight: z.number().optional().nullable(),
  restTimeSeconds: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const WorkoutSetUncheckedCreateWithoutWorkoutExerciseInputSchema: z.ZodType<Prisma.WorkoutSetUncheckedCreateWithoutWorkoutExerciseInput> = z.strictObject({
  id: z.uuid().optional(),
  setNumber: z.number().int(),
  repetitions: z.number().int(),
  weight: z.number().optional().nullable(),
  restTimeSeconds: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const WorkoutSetCreateOrConnectWithoutWorkoutExerciseInputSchema: z.ZodType<Prisma.WorkoutSetCreateOrConnectWithoutWorkoutExerciseInput> = z.strictObject({
  where: z.lazy(() => WorkoutSetWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkoutSetCreateWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutSetUncheckedCreateWithoutWorkoutExerciseInputSchema) ]),
});

export const WorkoutSetCreateManyWorkoutExerciseInputEnvelopeSchema: z.ZodType<Prisma.WorkoutSetCreateManyWorkoutExerciseInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => WorkoutSetCreateManyWorkoutExerciseInputSchema), z.lazy(() => WorkoutSetCreateManyWorkoutExerciseInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const WorkoutUpsertWithoutWorkoutExercisesInputSchema: z.ZodType<Prisma.WorkoutUpsertWithoutWorkoutExercisesInput> = z.strictObject({
  update: z.union([ z.lazy(() => WorkoutUpdateWithoutWorkoutExercisesInputSchema), z.lazy(() => WorkoutUncheckedUpdateWithoutWorkoutExercisesInputSchema) ]),
  create: z.union([ z.lazy(() => WorkoutCreateWithoutWorkoutExercisesInputSchema), z.lazy(() => WorkoutUncheckedCreateWithoutWorkoutExercisesInputSchema) ]),
  where: z.lazy(() => WorkoutWhereInputSchema).optional(),
});

export const WorkoutUpdateToOneWithWhereWithoutWorkoutExercisesInputSchema: z.ZodType<Prisma.WorkoutUpdateToOneWithWhereWithoutWorkoutExercisesInput> = z.strictObject({
  where: z.lazy(() => WorkoutWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => WorkoutUpdateWithoutWorkoutExercisesInputSchema), z.lazy(() => WorkoutUncheckedUpdateWithoutWorkoutExercisesInputSchema) ]),
});

export const WorkoutUpdateWithoutWorkoutExercisesInputSchema: z.ZodType<Prisma.WorkoutUpdateWithoutWorkoutExercisesInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  day: z.union([ z.lazy(() => WORKOUT_DAYSchema), z.lazy(() => EnumWORKOUT_DAYFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  workoutPlan: z.lazy(() => WorkoutPlanUpdateOneRequiredWithoutWorkoutsNestedInputSchema).optional(),
});

export const WorkoutUncheckedUpdateWithoutWorkoutExercisesInputSchema: z.ZodType<Prisma.WorkoutUncheckedUpdateWithoutWorkoutExercisesInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  day: z.union([ z.lazy(() => WORKOUT_DAYSchema), z.lazy(() => EnumWORKOUT_DAYFieldUpdateOperationsInputSchema) ]).optional(),
  workoutPlanId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ExerciseUpsertWithoutUsedInWorkoutsInputSchema: z.ZodType<Prisma.ExerciseUpsertWithoutUsedInWorkoutsInput> = z.strictObject({
  update: z.union([ z.lazy(() => ExerciseUpdateWithoutUsedInWorkoutsInputSchema), z.lazy(() => ExerciseUncheckedUpdateWithoutUsedInWorkoutsInputSchema) ]),
  create: z.union([ z.lazy(() => ExerciseCreateWithoutUsedInWorkoutsInputSchema), z.lazy(() => ExerciseUncheckedCreateWithoutUsedInWorkoutsInputSchema) ]),
  where: z.lazy(() => ExerciseWhereInputSchema).optional(),
});

export const ExerciseUpdateToOneWithWhereWithoutUsedInWorkoutsInputSchema: z.ZodType<Prisma.ExerciseUpdateToOneWithWhereWithoutUsedInWorkoutsInput> = z.strictObject({
  where: z.lazy(() => ExerciseWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ExerciseUpdateWithoutUsedInWorkoutsInputSchema), z.lazy(() => ExerciseUncheckedUpdateWithoutUsedInWorkoutsInputSchema) ]),
});

export const ExerciseUpdateWithoutUsedInWorkoutsInputSchema: z.ZodType<Prisma.ExerciseUpdateWithoutUsedInWorkoutsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  muscleGroup: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ExerciseUncheckedUpdateWithoutUsedInWorkoutsInputSchema: z.ZodType<Prisma.ExerciseUncheckedUpdateWithoutUsedInWorkoutsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  muscleGroup: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutSetUpsertWithWhereUniqueWithoutWorkoutExerciseInputSchema: z.ZodType<Prisma.WorkoutSetUpsertWithWhereUniqueWithoutWorkoutExerciseInput> = z.strictObject({
  where: z.lazy(() => WorkoutSetWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => WorkoutSetUpdateWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutSetUncheckedUpdateWithoutWorkoutExerciseInputSchema) ]),
  create: z.union([ z.lazy(() => WorkoutSetCreateWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutSetUncheckedCreateWithoutWorkoutExerciseInputSchema) ]),
});

export const WorkoutSetUpdateWithWhereUniqueWithoutWorkoutExerciseInputSchema: z.ZodType<Prisma.WorkoutSetUpdateWithWhereUniqueWithoutWorkoutExerciseInput> = z.strictObject({
  where: z.lazy(() => WorkoutSetWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => WorkoutSetUpdateWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutSetUncheckedUpdateWithoutWorkoutExerciseInputSchema) ]),
});

export const WorkoutSetUpdateManyWithWhereWithoutWorkoutExerciseInputSchema: z.ZodType<Prisma.WorkoutSetUpdateManyWithWhereWithoutWorkoutExerciseInput> = z.strictObject({
  where: z.lazy(() => WorkoutSetScalarWhereInputSchema),
  data: z.union([ z.lazy(() => WorkoutSetUpdateManyMutationInputSchema), z.lazy(() => WorkoutSetUncheckedUpdateManyWithoutWorkoutExerciseInputSchema) ]),
});

export const WorkoutSetScalarWhereInputSchema: z.ZodType<Prisma.WorkoutSetScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutSetScalarWhereInputSchema), z.lazy(() => WorkoutSetScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutSetScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutSetScalarWhereInputSchema), z.lazy(() => WorkoutSetScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  setNumber: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  repetitions: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  weight: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  restTimeSeconds: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  workoutExerciseId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
});

export const WorkoutExerciseCreateWithoutSetsInputSchema: z.ZodType<Prisma.WorkoutExerciseCreateWithoutSetsInput> = z.strictObject({
  id: z.uuid().optional(),
  orderIndex: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  workout: z.lazy(() => WorkoutCreateNestedOneWithoutWorkoutExercisesInputSchema),
  exercise: z.lazy(() => ExerciseCreateNestedOneWithoutUsedInWorkoutsInputSchema),
});

export const WorkoutExerciseUncheckedCreateWithoutSetsInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedCreateWithoutSetsInput> = z.strictObject({
  id: z.uuid().optional(),
  orderIndex: z.number().int(),
  workoutId: z.string(),
  exerciseId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const WorkoutExerciseCreateOrConnectWithoutSetsInputSchema: z.ZodType<Prisma.WorkoutExerciseCreateOrConnectWithoutSetsInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutSetsInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutSetsInputSchema) ]),
});

export const WorkoutExerciseUpsertWithoutSetsInputSchema: z.ZodType<Prisma.WorkoutExerciseUpsertWithoutSetsInput> = z.strictObject({
  update: z.union([ z.lazy(() => WorkoutExerciseUpdateWithoutSetsInputSchema), z.lazy(() => WorkoutExerciseUncheckedUpdateWithoutSetsInputSchema) ]),
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutSetsInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutSetsInputSchema) ]),
  where: z.lazy(() => WorkoutExerciseWhereInputSchema).optional(),
});

export const WorkoutExerciseUpdateToOneWithWhereWithoutSetsInputSchema: z.ZodType<Prisma.WorkoutExerciseUpdateToOneWithWhereWithoutSetsInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => WorkoutExerciseUpdateWithoutSetsInputSchema), z.lazy(() => WorkoutExerciseUncheckedUpdateWithoutSetsInputSchema) ]),
});

export const WorkoutExerciseUpdateWithoutSetsInputSchema: z.ZodType<Prisma.WorkoutExerciseUpdateWithoutSetsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  workout: z.lazy(() => WorkoutUpdateOneRequiredWithoutWorkoutExercisesNestedInputSchema).optional(),
  exercise: z.lazy(() => ExerciseUpdateOneRequiredWithoutUsedInWorkoutsNestedInputSchema).optional(),
});

export const WorkoutExerciseUncheckedUpdateWithoutSetsInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedUpdateWithoutSetsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  workoutId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutExerciseCreateWithoutExerciseInputSchema: z.ZodType<Prisma.WorkoutExerciseCreateWithoutExerciseInput> = z.strictObject({
  id: z.uuid().optional(),
  orderIndex: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  workout: z.lazy(() => WorkoutCreateNestedOneWithoutWorkoutExercisesInputSchema),
  sets: z.lazy(() => WorkoutSetCreateNestedManyWithoutWorkoutExerciseInputSchema).optional(),
});

export const WorkoutExerciseUncheckedCreateWithoutExerciseInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedCreateWithoutExerciseInput> = z.strictObject({
  id: z.uuid().optional(),
  orderIndex: z.number().int(),
  workoutId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sets: z.lazy(() => WorkoutSetUncheckedCreateNestedManyWithoutWorkoutExerciseInputSchema).optional(),
});

export const WorkoutExerciseCreateOrConnectWithoutExerciseInputSchema: z.ZodType<Prisma.WorkoutExerciseCreateOrConnectWithoutExerciseInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutExerciseInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutExerciseInputSchema) ]),
});

export const WorkoutExerciseCreateManyExerciseInputEnvelopeSchema: z.ZodType<Prisma.WorkoutExerciseCreateManyExerciseInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => WorkoutExerciseCreateManyExerciseInputSchema), z.lazy(() => WorkoutExerciseCreateManyExerciseInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const WorkoutExerciseUpsertWithWhereUniqueWithoutExerciseInputSchema: z.ZodType<Prisma.WorkoutExerciseUpsertWithWhereUniqueWithoutExerciseInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => WorkoutExerciseUpdateWithoutExerciseInputSchema), z.lazy(() => WorkoutExerciseUncheckedUpdateWithoutExerciseInputSchema) ]),
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutExerciseInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutExerciseInputSchema) ]),
});

export const WorkoutExerciseUpdateWithWhereUniqueWithoutExerciseInputSchema: z.ZodType<Prisma.WorkoutExerciseUpdateWithWhereUniqueWithoutExerciseInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => WorkoutExerciseUpdateWithoutExerciseInputSchema), z.lazy(() => WorkoutExerciseUncheckedUpdateWithoutExerciseInputSchema) ]),
});

export const WorkoutExerciseUpdateManyWithWhereWithoutExerciseInputSchema: z.ZodType<Prisma.WorkoutExerciseUpdateManyWithWhereWithoutExerciseInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseScalarWhereInputSchema),
  data: z.union([ z.lazy(() => WorkoutExerciseUpdateManyMutationInputSchema), z.lazy(() => WorkoutExerciseUncheckedUpdateManyWithoutExerciseInputSchema) ]),
});

export const DietCreateManyUserInputSchema: z.ZodType<Prisma.DietCreateManyUserInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  dailyKcalGoal: z.number().int(),
  dailyProteinGoal: z.number().int(),
  dailyCarbGoal: z.number().int(),
  dailyFatGoal: z.number().int(),
  dailyWaterGoal: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const WorkoutPlanCreateManyUserInputSchema: z.ZodType<Prisma.WorkoutPlanCreateManyUserInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const BodyMetricCreateManyUserInputSchema: z.ZodType<Prisma.BodyMetricCreateManyUserInput> = z.strictObject({
  id: z.uuid().optional(),
  weight: z.number(),
  height: z.number().int(),
  activityLevel: z.number().int(),
  bodyFat: z.number().optional().nullable(),
  muscleRate: z.number().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const FoodCreateManyUserInputSchema: z.ZodType<Omit<Prisma.FoodCreateManyUserInput, "id" | "createdAt" | "updatedAt">> = z.strictObject({
  // omitted: id: z.uuid().optional(),
  name: z.string(),
  baseUnit: z.string().optional(),
  baseAmount: z.number().int().optional(),
  calories: z.number().int(),
  carbohydrate: z.number().int(),
  protein: z.number().int(),
  fat: z.number().int(),
  fiber: z.number().int().optional().nullable(),
  // omitted: createdAt: z.coerce.date().optional(),
  // omitted: updatedAt: z.coerce.date().optional(),
});

export const DietUpdateWithoutUserInputSchema: z.ZodType<Prisma.DietUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dailyKcalGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyProteinGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyCarbGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyFatGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyWaterGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Meal: z.lazy(() => MealUpdateManyWithoutDietNestedInputSchema).optional(),
});

export const DietUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.DietUncheckedUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dailyKcalGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyProteinGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyCarbGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyFatGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyWaterGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Meal: z.lazy(() => MealUncheckedUpdateManyWithoutDietNestedInputSchema).optional(),
});

export const DietUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.DietUncheckedUpdateManyWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dailyKcalGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyProteinGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyCarbGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyFatGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyWaterGoal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutPlanUpdateWithoutUserInputSchema: z.ZodType<Prisma.WorkoutPlanUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  workouts: z.lazy(() => WorkoutUpdateManyWithoutWorkoutPlanNestedInputSchema).optional(),
});

export const WorkoutPlanUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.WorkoutPlanUncheckedUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  workouts: z.lazy(() => WorkoutUncheckedUpdateManyWithoutWorkoutPlanNestedInputSchema).optional(),
});

export const WorkoutPlanUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.WorkoutPlanUncheckedUpdateManyWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const BodyMetricUpdateWithoutUserInputSchema: z.ZodType<Prisma.BodyMetricUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  height: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  activityLevel: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bodyFat: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  muscleRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const BodyMetricUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.BodyMetricUncheckedUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  height: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  activityLevel: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bodyFat: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  muscleRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const BodyMetricUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.BodyMetricUncheckedUpdateManyWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  height: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  activityLevel: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bodyFat: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  muscleRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const FoodUpdateWithoutUserInputSchema: z.ZodType<Omit<Prisma.FoodUpdateWithoutUserInput, "id" | "createdAt" | "updatedAt">> = z.strictObject({
  // omitted: id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  baseUnit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  baseAmount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  calories: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  carbohydrate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  protein: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fat: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fiber: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  // omitted: createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  foodInMeals: z.lazy(() => FoodInMealUpdateManyWithoutFoodNestedInputSchema).optional(),
});

export const FoodUncheckedUpdateWithoutUserInputSchema: z.ZodType<Omit<Prisma.FoodUncheckedUpdateWithoutUserInput, "id" | "createdAt" | "updatedAt">> = z.strictObject({
  // omitted: id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  baseUnit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  baseAmount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  calories: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  carbohydrate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  protein: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fat: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fiber: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  // omitted: createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  foodInMeals: z.lazy(() => FoodInMealUncheckedUpdateManyWithoutFoodNestedInputSchema).optional(),
});

export const FoodUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Omit<Prisma.FoodUncheckedUpdateManyWithoutUserInput, "id" | "createdAt" | "updatedAt">> = z.strictObject({
  // omitted: id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  baseUnit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  baseAmount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  calories: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  carbohydrate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  protein: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fat: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fiber: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  // omitted: createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MealCreateManyDietInputSchema: z.ZodType<Prisma.MealCreateManyDietInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  time: z.string(),
  orderIndex: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const MealUpdateWithoutDietInputSchema: z.ZodType<Prisma.MealUpdateWithoutDietInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  foods: z.lazy(() => FoodInMealUpdateManyWithoutMealNestedInputSchema).optional(),
});

export const MealUncheckedUpdateWithoutDietInputSchema: z.ZodType<Prisma.MealUncheckedUpdateWithoutDietInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  foods: z.lazy(() => FoodInMealUncheckedUpdateManyWithoutMealNestedInputSchema).optional(),
});

export const MealUncheckedUpdateManyWithoutDietInputSchema: z.ZodType<Prisma.MealUncheckedUpdateManyWithoutDietInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const FoodInMealCreateManyMealInputSchema: z.ZodType<Prisma.FoodInMealCreateManyMealInput> = z.strictObject({
  id: z.uuid().optional(),
  quantity: z.number().int(),
  foodId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const FoodInMealUpdateWithoutMealInputSchema: z.ZodType<Prisma.FoodInMealUpdateWithoutMealInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  food: z.lazy(() => FoodUpdateOneRequiredWithoutFoodInMealsNestedInputSchema).optional(),
});

export const FoodInMealUncheckedUpdateWithoutMealInputSchema: z.ZodType<Prisma.FoodInMealUncheckedUpdateWithoutMealInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  foodId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const FoodInMealUncheckedUpdateManyWithoutMealInputSchema: z.ZodType<Prisma.FoodInMealUncheckedUpdateManyWithoutMealInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  foodId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const FoodInMealCreateManyFoodInputSchema: z.ZodType<Prisma.FoodInMealCreateManyFoodInput> = z.strictObject({
  id: z.uuid().optional(),
  quantity: z.number().int(),
  mealId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const FoodInMealUpdateWithoutFoodInputSchema: z.ZodType<Prisma.FoodInMealUpdateWithoutFoodInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  meal: z.lazy(() => MealUpdateOneRequiredWithoutFoodsNestedInputSchema).optional(),
});

export const FoodInMealUncheckedUpdateWithoutFoodInputSchema: z.ZodType<Prisma.FoodInMealUncheckedUpdateWithoutFoodInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  mealId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const FoodInMealUncheckedUpdateManyWithoutFoodInputSchema: z.ZodType<Prisma.FoodInMealUncheckedUpdateManyWithoutFoodInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  mealId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutCreateManyWorkoutPlanInputSchema: z.ZodType<Prisma.WorkoutCreateManyWorkoutPlanInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string().optional().nullable(),
  day: z.lazy(() => WORKOUT_DAYSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const WorkoutUpdateWithoutWorkoutPlanInputSchema: z.ZodType<Prisma.WorkoutUpdateWithoutWorkoutPlanInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  day: z.union([ z.lazy(() => WORKOUT_DAYSchema), z.lazy(() => EnumWORKOUT_DAYFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  workoutExercises: z.lazy(() => WorkoutExerciseUpdateManyWithoutWorkoutNestedInputSchema).optional(),
});

export const WorkoutUncheckedUpdateWithoutWorkoutPlanInputSchema: z.ZodType<Prisma.WorkoutUncheckedUpdateWithoutWorkoutPlanInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  day: z.union([ z.lazy(() => WORKOUT_DAYSchema), z.lazy(() => EnumWORKOUT_DAYFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  workoutExercises: z.lazy(() => WorkoutExerciseUncheckedUpdateManyWithoutWorkoutNestedInputSchema).optional(),
});

export const WorkoutUncheckedUpdateManyWithoutWorkoutPlanInputSchema: z.ZodType<Prisma.WorkoutUncheckedUpdateManyWithoutWorkoutPlanInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  day: z.union([ z.lazy(() => WORKOUT_DAYSchema), z.lazy(() => EnumWORKOUT_DAYFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutExerciseCreateManyWorkoutInputSchema: z.ZodType<Prisma.WorkoutExerciseCreateManyWorkoutInput> = z.strictObject({
  id: z.uuid().optional(),
  orderIndex: z.number().int(),
  exerciseId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const WorkoutExerciseUpdateWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutExerciseUpdateWithoutWorkoutInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  exercise: z.lazy(() => ExerciseUpdateOneRequiredWithoutUsedInWorkoutsNestedInputSchema).optional(),
  sets: z.lazy(() => WorkoutSetUpdateManyWithoutWorkoutExerciseNestedInputSchema).optional(),
});

export const WorkoutExerciseUncheckedUpdateWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedUpdateWithoutWorkoutInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sets: z.lazy(() => WorkoutSetUncheckedUpdateManyWithoutWorkoutExerciseNestedInputSchema).optional(),
});

export const WorkoutExerciseUncheckedUpdateManyWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedUpdateManyWithoutWorkoutInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutSetCreateManyWorkoutExerciseInputSchema: z.ZodType<Prisma.WorkoutSetCreateManyWorkoutExerciseInput> = z.strictObject({
  id: z.uuid().optional(),
  setNumber: z.number().int(),
  repetitions: z.number().int(),
  weight: z.number().optional().nullable(),
  restTimeSeconds: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const WorkoutSetUpdateWithoutWorkoutExerciseInputSchema: z.ZodType<Prisma.WorkoutSetUpdateWithoutWorkoutExerciseInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  setNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repetitions: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  restTimeSeconds: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutSetUncheckedUpdateWithoutWorkoutExerciseInputSchema: z.ZodType<Prisma.WorkoutSetUncheckedUpdateWithoutWorkoutExerciseInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  setNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repetitions: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  restTimeSeconds: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutSetUncheckedUpdateManyWithoutWorkoutExerciseInputSchema: z.ZodType<Prisma.WorkoutSetUncheckedUpdateManyWithoutWorkoutExerciseInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  setNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repetitions: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  restTimeSeconds: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutExerciseCreateManyExerciseInputSchema: z.ZodType<Prisma.WorkoutExerciseCreateManyExerciseInput> = z.strictObject({
  id: z.uuid().optional(),
  orderIndex: z.number().int(),
  workoutId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const WorkoutExerciseUpdateWithoutExerciseInputSchema: z.ZodType<Prisma.WorkoutExerciseUpdateWithoutExerciseInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  workout: z.lazy(() => WorkoutUpdateOneRequiredWithoutWorkoutExercisesNestedInputSchema).optional(),
  sets: z.lazy(() => WorkoutSetUpdateManyWithoutWorkoutExerciseNestedInputSchema).optional(),
});

export const WorkoutExerciseUncheckedUpdateWithoutExerciseInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedUpdateWithoutExerciseInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  workoutId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sets: z.lazy(() => WorkoutSetUncheckedUpdateManyWithoutWorkoutExerciseNestedInputSchema).optional(),
});

export const WorkoutExerciseUncheckedUpdateManyWithoutExerciseInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedUpdateManyWithoutExerciseInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  workoutId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(), UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(), 
  having: UserScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const AuthFindFirstArgsSchema: z.ZodType<Prisma.AuthFindFirstArgs> = z.object({
  select: AuthSelectSchema.optional(),
  include: AuthIncludeSchema.optional(),
  where: AuthWhereInputSchema.optional(), 
  orderBy: z.union([ AuthOrderByWithRelationInputSchema.array(), AuthOrderByWithRelationInputSchema ]).optional(),
  cursor: AuthWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AuthScalarFieldEnumSchema, AuthScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const AuthFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AuthFindFirstOrThrowArgs> = z.object({
  select: AuthSelectSchema.optional(),
  include: AuthIncludeSchema.optional(),
  where: AuthWhereInputSchema.optional(), 
  orderBy: z.union([ AuthOrderByWithRelationInputSchema.array(), AuthOrderByWithRelationInputSchema ]).optional(),
  cursor: AuthWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AuthScalarFieldEnumSchema, AuthScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const AuthFindManyArgsSchema: z.ZodType<Prisma.AuthFindManyArgs> = z.object({
  select: AuthSelectSchema.optional(),
  include: AuthIncludeSchema.optional(),
  where: AuthWhereInputSchema.optional(), 
  orderBy: z.union([ AuthOrderByWithRelationInputSchema.array(), AuthOrderByWithRelationInputSchema ]).optional(),
  cursor: AuthWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AuthScalarFieldEnumSchema, AuthScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const AuthAggregateArgsSchema: z.ZodType<Prisma.AuthAggregateArgs> = z.object({
  where: AuthWhereInputSchema.optional(), 
  orderBy: z.union([ AuthOrderByWithRelationInputSchema.array(), AuthOrderByWithRelationInputSchema ]).optional(),
  cursor: AuthWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const AuthGroupByArgsSchema: z.ZodType<Prisma.AuthGroupByArgs> = z.object({
  where: AuthWhereInputSchema.optional(), 
  orderBy: z.union([ AuthOrderByWithAggregationInputSchema.array(), AuthOrderByWithAggregationInputSchema ]).optional(),
  by: AuthScalarFieldEnumSchema.array(), 
  having: AuthScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const AuthFindUniqueArgsSchema: z.ZodType<Prisma.AuthFindUniqueArgs> = z.object({
  select: AuthSelectSchema.optional(),
  include: AuthIncludeSchema.optional(),
  where: AuthWhereUniqueInputSchema, 
}).strict();

export const AuthFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AuthFindUniqueOrThrowArgs> = z.object({
  select: AuthSelectSchema.optional(),
  include: AuthIncludeSchema.optional(),
  where: AuthWhereUniqueInputSchema, 
}).strict();

export const BodyMetricFindFirstArgsSchema: z.ZodType<Prisma.BodyMetricFindFirstArgs> = z.object({
  select: BodyMetricSelectSchema.optional(),
  include: BodyMetricIncludeSchema.optional(),
  where: BodyMetricWhereInputSchema.optional(), 
  orderBy: z.union([ BodyMetricOrderByWithRelationInputSchema.array(), BodyMetricOrderByWithRelationInputSchema ]).optional(),
  cursor: BodyMetricWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BodyMetricScalarFieldEnumSchema, BodyMetricScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const BodyMetricFindFirstOrThrowArgsSchema: z.ZodType<Prisma.BodyMetricFindFirstOrThrowArgs> = z.object({
  select: BodyMetricSelectSchema.optional(),
  include: BodyMetricIncludeSchema.optional(),
  where: BodyMetricWhereInputSchema.optional(), 
  orderBy: z.union([ BodyMetricOrderByWithRelationInputSchema.array(), BodyMetricOrderByWithRelationInputSchema ]).optional(),
  cursor: BodyMetricWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BodyMetricScalarFieldEnumSchema, BodyMetricScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const BodyMetricFindManyArgsSchema: z.ZodType<Prisma.BodyMetricFindManyArgs> = z.object({
  select: BodyMetricSelectSchema.optional(),
  include: BodyMetricIncludeSchema.optional(),
  where: BodyMetricWhereInputSchema.optional(), 
  orderBy: z.union([ BodyMetricOrderByWithRelationInputSchema.array(), BodyMetricOrderByWithRelationInputSchema ]).optional(),
  cursor: BodyMetricWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BodyMetricScalarFieldEnumSchema, BodyMetricScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const BodyMetricAggregateArgsSchema: z.ZodType<Prisma.BodyMetricAggregateArgs> = z.object({
  where: BodyMetricWhereInputSchema.optional(), 
  orderBy: z.union([ BodyMetricOrderByWithRelationInputSchema.array(), BodyMetricOrderByWithRelationInputSchema ]).optional(),
  cursor: BodyMetricWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const BodyMetricGroupByArgsSchema: z.ZodType<Prisma.BodyMetricGroupByArgs> = z.object({
  where: BodyMetricWhereInputSchema.optional(), 
  orderBy: z.union([ BodyMetricOrderByWithAggregationInputSchema.array(), BodyMetricOrderByWithAggregationInputSchema ]).optional(),
  by: BodyMetricScalarFieldEnumSchema.array(), 
  having: BodyMetricScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const BodyMetricFindUniqueArgsSchema: z.ZodType<Prisma.BodyMetricFindUniqueArgs> = z.object({
  select: BodyMetricSelectSchema.optional(),
  include: BodyMetricIncludeSchema.optional(),
  where: BodyMetricWhereUniqueInputSchema, 
}).strict();

export const BodyMetricFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.BodyMetricFindUniqueOrThrowArgs> = z.object({
  select: BodyMetricSelectSchema.optional(),
  include: BodyMetricIncludeSchema.optional(),
  where: BodyMetricWhereUniqueInputSchema, 
}).strict();

export const DietFindFirstArgsSchema: z.ZodType<Prisma.DietFindFirstArgs> = z.object({
  select: DietSelectSchema.optional(),
  include: DietIncludeSchema.optional(),
  where: DietWhereInputSchema.optional(), 
  orderBy: z.union([ DietOrderByWithRelationInputSchema.array(), DietOrderByWithRelationInputSchema ]).optional(),
  cursor: DietWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DietScalarFieldEnumSchema, DietScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const DietFindFirstOrThrowArgsSchema: z.ZodType<Prisma.DietFindFirstOrThrowArgs> = z.object({
  select: DietSelectSchema.optional(),
  include: DietIncludeSchema.optional(),
  where: DietWhereInputSchema.optional(), 
  orderBy: z.union([ DietOrderByWithRelationInputSchema.array(), DietOrderByWithRelationInputSchema ]).optional(),
  cursor: DietWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DietScalarFieldEnumSchema, DietScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const DietFindManyArgsSchema: z.ZodType<Prisma.DietFindManyArgs> = z.object({
  select: DietSelectSchema.optional(),
  include: DietIncludeSchema.optional(),
  where: DietWhereInputSchema.optional(), 
  orderBy: z.union([ DietOrderByWithRelationInputSchema.array(), DietOrderByWithRelationInputSchema ]).optional(),
  cursor: DietWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DietScalarFieldEnumSchema, DietScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const DietAggregateArgsSchema: z.ZodType<Prisma.DietAggregateArgs> = z.object({
  where: DietWhereInputSchema.optional(), 
  orderBy: z.union([ DietOrderByWithRelationInputSchema.array(), DietOrderByWithRelationInputSchema ]).optional(),
  cursor: DietWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const DietGroupByArgsSchema: z.ZodType<Prisma.DietGroupByArgs> = z.object({
  where: DietWhereInputSchema.optional(), 
  orderBy: z.union([ DietOrderByWithAggregationInputSchema.array(), DietOrderByWithAggregationInputSchema ]).optional(),
  by: DietScalarFieldEnumSchema.array(), 
  having: DietScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const DietFindUniqueArgsSchema: z.ZodType<Prisma.DietFindUniqueArgs> = z.object({
  select: DietSelectSchema.optional(),
  include: DietIncludeSchema.optional(),
  where: DietWhereUniqueInputSchema, 
}).strict();

export const DietFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.DietFindUniqueOrThrowArgs> = z.object({
  select: DietSelectSchema.optional(),
  include: DietIncludeSchema.optional(),
  where: DietWhereUniqueInputSchema, 
}).strict();

export const MealFindFirstArgsSchema: z.ZodType<Prisma.MealFindFirstArgs> = z.object({
  select: MealSelectSchema.optional(),
  include: MealIncludeSchema.optional(),
  where: MealWhereInputSchema.optional(), 
  orderBy: z.union([ MealOrderByWithRelationInputSchema.array(), MealOrderByWithRelationInputSchema ]).optional(),
  cursor: MealWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MealScalarFieldEnumSchema, MealScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MealFindFirstOrThrowArgsSchema: z.ZodType<Prisma.MealFindFirstOrThrowArgs> = z.object({
  select: MealSelectSchema.optional(),
  include: MealIncludeSchema.optional(),
  where: MealWhereInputSchema.optional(), 
  orderBy: z.union([ MealOrderByWithRelationInputSchema.array(), MealOrderByWithRelationInputSchema ]).optional(),
  cursor: MealWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MealScalarFieldEnumSchema, MealScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MealFindManyArgsSchema: z.ZodType<Prisma.MealFindManyArgs> = z.object({
  select: MealSelectSchema.optional(),
  include: MealIncludeSchema.optional(),
  where: MealWhereInputSchema.optional(), 
  orderBy: z.union([ MealOrderByWithRelationInputSchema.array(), MealOrderByWithRelationInputSchema ]).optional(),
  cursor: MealWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MealScalarFieldEnumSchema, MealScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MealAggregateArgsSchema: z.ZodType<Prisma.MealAggregateArgs> = z.object({
  where: MealWhereInputSchema.optional(), 
  orderBy: z.union([ MealOrderByWithRelationInputSchema.array(), MealOrderByWithRelationInputSchema ]).optional(),
  cursor: MealWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MealGroupByArgsSchema: z.ZodType<Prisma.MealGroupByArgs> = z.object({
  where: MealWhereInputSchema.optional(), 
  orderBy: z.union([ MealOrderByWithAggregationInputSchema.array(), MealOrderByWithAggregationInputSchema ]).optional(),
  by: MealScalarFieldEnumSchema.array(), 
  having: MealScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MealFindUniqueArgsSchema: z.ZodType<Prisma.MealFindUniqueArgs> = z.object({
  select: MealSelectSchema.optional(),
  include: MealIncludeSchema.optional(),
  where: MealWhereUniqueInputSchema, 
}).strict();

export const MealFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MealFindUniqueOrThrowArgs> = z.object({
  select: MealSelectSchema.optional(),
  include: MealIncludeSchema.optional(),
  where: MealWhereUniqueInputSchema, 
}).strict();

export const FoodInMealFindFirstArgsSchema: z.ZodType<Prisma.FoodInMealFindFirstArgs> = z.object({
  select: FoodInMealSelectSchema.optional(),
  include: FoodInMealIncludeSchema.optional(),
  where: FoodInMealWhereInputSchema.optional(), 
  orderBy: z.union([ FoodInMealOrderByWithRelationInputSchema.array(), FoodInMealOrderByWithRelationInputSchema ]).optional(),
  cursor: FoodInMealWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FoodInMealScalarFieldEnumSchema, FoodInMealScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const FoodInMealFindFirstOrThrowArgsSchema: z.ZodType<Prisma.FoodInMealFindFirstOrThrowArgs> = z.object({
  select: FoodInMealSelectSchema.optional(),
  include: FoodInMealIncludeSchema.optional(),
  where: FoodInMealWhereInputSchema.optional(), 
  orderBy: z.union([ FoodInMealOrderByWithRelationInputSchema.array(), FoodInMealOrderByWithRelationInputSchema ]).optional(),
  cursor: FoodInMealWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FoodInMealScalarFieldEnumSchema, FoodInMealScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const FoodInMealFindManyArgsSchema: z.ZodType<Prisma.FoodInMealFindManyArgs> = z.object({
  select: FoodInMealSelectSchema.optional(),
  include: FoodInMealIncludeSchema.optional(),
  where: FoodInMealWhereInputSchema.optional(), 
  orderBy: z.union([ FoodInMealOrderByWithRelationInputSchema.array(), FoodInMealOrderByWithRelationInputSchema ]).optional(),
  cursor: FoodInMealWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FoodInMealScalarFieldEnumSchema, FoodInMealScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const FoodInMealAggregateArgsSchema: z.ZodType<Prisma.FoodInMealAggregateArgs> = z.object({
  where: FoodInMealWhereInputSchema.optional(), 
  orderBy: z.union([ FoodInMealOrderByWithRelationInputSchema.array(), FoodInMealOrderByWithRelationInputSchema ]).optional(),
  cursor: FoodInMealWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const FoodInMealGroupByArgsSchema: z.ZodType<Prisma.FoodInMealGroupByArgs> = z.object({
  where: FoodInMealWhereInputSchema.optional(), 
  orderBy: z.union([ FoodInMealOrderByWithAggregationInputSchema.array(), FoodInMealOrderByWithAggregationInputSchema ]).optional(),
  by: FoodInMealScalarFieldEnumSchema.array(), 
  having: FoodInMealScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const FoodInMealFindUniqueArgsSchema: z.ZodType<Prisma.FoodInMealFindUniqueArgs> = z.object({
  select: FoodInMealSelectSchema.optional(),
  include: FoodInMealIncludeSchema.optional(),
  where: FoodInMealWhereUniqueInputSchema, 
}).strict();

export const FoodInMealFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.FoodInMealFindUniqueOrThrowArgs> = z.object({
  select: FoodInMealSelectSchema.optional(),
  include: FoodInMealIncludeSchema.optional(),
  where: FoodInMealWhereUniqueInputSchema, 
}).strict();

export const FoodFindFirstArgsSchema: z.ZodType<Prisma.FoodFindFirstArgs> = z.object({
  select: FoodSelectSchema.optional(),
  include: FoodIncludeSchema.optional(),
  where: FoodWhereInputSchema.optional(), 
  orderBy: z.union([ FoodOrderByWithRelationInputSchema.array(), FoodOrderByWithRelationInputSchema ]).optional(),
  cursor: FoodWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FoodScalarFieldEnumSchema, FoodScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const FoodFindFirstOrThrowArgsSchema: z.ZodType<Prisma.FoodFindFirstOrThrowArgs> = z.object({
  select: FoodSelectSchema.optional(),
  include: FoodIncludeSchema.optional(),
  where: FoodWhereInputSchema.optional(), 
  orderBy: z.union([ FoodOrderByWithRelationInputSchema.array(), FoodOrderByWithRelationInputSchema ]).optional(),
  cursor: FoodWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FoodScalarFieldEnumSchema, FoodScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const FoodFindManyArgsSchema: z.ZodType<Prisma.FoodFindManyArgs> = z.object({
  select: FoodSelectSchema.optional(),
  include: FoodIncludeSchema.optional(),
  where: FoodWhereInputSchema.optional(), 
  orderBy: z.union([ FoodOrderByWithRelationInputSchema.array(), FoodOrderByWithRelationInputSchema ]).optional(),
  cursor: FoodWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FoodScalarFieldEnumSchema, FoodScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const FoodAggregateArgsSchema: z.ZodType<Prisma.FoodAggregateArgs> = z.object({
  where: FoodWhereInputSchema.optional(), 
  orderBy: z.union([ FoodOrderByWithRelationInputSchema.array(), FoodOrderByWithRelationInputSchema ]).optional(),
  cursor: FoodWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const FoodGroupByArgsSchema: z.ZodType<Prisma.FoodGroupByArgs> = z.object({
  where: FoodWhereInputSchema.optional(), 
  orderBy: z.union([ FoodOrderByWithAggregationInputSchema.array(), FoodOrderByWithAggregationInputSchema ]).optional(),
  by: FoodScalarFieldEnumSchema.array(), 
  having: FoodScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const FoodFindUniqueArgsSchema: z.ZodType<Prisma.FoodFindUniqueArgs> = z.object({
  select: FoodSelectSchema.optional(),
  include: FoodIncludeSchema.optional(),
  where: FoodWhereUniqueInputSchema, 
}).strict();

export const FoodFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.FoodFindUniqueOrThrowArgs> = z.object({
  select: FoodSelectSchema.optional(),
  include: FoodIncludeSchema.optional(),
  where: FoodWhereUniqueInputSchema, 
}).strict();

export const WorkoutPlanFindFirstArgsSchema: z.ZodType<Prisma.WorkoutPlanFindFirstArgs> = z.object({
  select: WorkoutPlanSelectSchema.optional(),
  include: WorkoutPlanIncludeSchema.optional(),
  where: WorkoutPlanWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutPlanOrderByWithRelationInputSchema.array(), WorkoutPlanOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutPlanWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutPlanScalarFieldEnumSchema, WorkoutPlanScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutPlanFindFirstOrThrowArgsSchema: z.ZodType<Prisma.WorkoutPlanFindFirstOrThrowArgs> = z.object({
  select: WorkoutPlanSelectSchema.optional(),
  include: WorkoutPlanIncludeSchema.optional(),
  where: WorkoutPlanWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutPlanOrderByWithRelationInputSchema.array(), WorkoutPlanOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutPlanWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutPlanScalarFieldEnumSchema, WorkoutPlanScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutPlanFindManyArgsSchema: z.ZodType<Prisma.WorkoutPlanFindManyArgs> = z.object({
  select: WorkoutPlanSelectSchema.optional(),
  include: WorkoutPlanIncludeSchema.optional(),
  where: WorkoutPlanWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutPlanOrderByWithRelationInputSchema.array(), WorkoutPlanOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutPlanWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutPlanScalarFieldEnumSchema, WorkoutPlanScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutPlanAggregateArgsSchema: z.ZodType<Prisma.WorkoutPlanAggregateArgs> = z.object({
  where: WorkoutPlanWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutPlanOrderByWithRelationInputSchema.array(), WorkoutPlanOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutPlanWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const WorkoutPlanGroupByArgsSchema: z.ZodType<Prisma.WorkoutPlanGroupByArgs> = z.object({
  where: WorkoutPlanWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutPlanOrderByWithAggregationInputSchema.array(), WorkoutPlanOrderByWithAggregationInputSchema ]).optional(),
  by: WorkoutPlanScalarFieldEnumSchema.array(), 
  having: WorkoutPlanScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const WorkoutPlanFindUniqueArgsSchema: z.ZodType<Prisma.WorkoutPlanFindUniqueArgs> = z.object({
  select: WorkoutPlanSelectSchema.optional(),
  include: WorkoutPlanIncludeSchema.optional(),
  where: WorkoutPlanWhereUniqueInputSchema, 
}).strict();

export const WorkoutPlanFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.WorkoutPlanFindUniqueOrThrowArgs> = z.object({
  select: WorkoutPlanSelectSchema.optional(),
  include: WorkoutPlanIncludeSchema.optional(),
  where: WorkoutPlanWhereUniqueInputSchema, 
}).strict();

export const WorkoutFindFirstArgsSchema: z.ZodType<Prisma.WorkoutFindFirstArgs> = z.object({
  select: WorkoutSelectSchema.optional(),
  include: WorkoutIncludeSchema.optional(),
  where: WorkoutWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutOrderByWithRelationInputSchema.array(), WorkoutOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutScalarFieldEnumSchema, WorkoutScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutFindFirstOrThrowArgsSchema: z.ZodType<Prisma.WorkoutFindFirstOrThrowArgs> = z.object({
  select: WorkoutSelectSchema.optional(),
  include: WorkoutIncludeSchema.optional(),
  where: WorkoutWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutOrderByWithRelationInputSchema.array(), WorkoutOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutScalarFieldEnumSchema, WorkoutScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutFindManyArgsSchema: z.ZodType<Prisma.WorkoutFindManyArgs> = z.object({
  select: WorkoutSelectSchema.optional(),
  include: WorkoutIncludeSchema.optional(),
  where: WorkoutWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutOrderByWithRelationInputSchema.array(), WorkoutOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutScalarFieldEnumSchema, WorkoutScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutAggregateArgsSchema: z.ZodType<Prisma.WorkoutAggregateArgs> = z.object({
  where: WorkoutWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutOrderByWithRelationInputSchema.array(), WorkoutOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const WorkoutGroupByArgsSchema: z.ZodType<Prisma.WorkoutGroupByArgs> = z.object({
  where: WorkoutWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutOrderByWithAggregationInputSchema.array(), WorkoutOrderByWithAggregationInputSchema ]).optional(),
  by: WorkoutScalarFieldEnumSchema.array(), 
  having: WorkoutScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const WorkoutFindUniqueArgsSchema: z.ZodType<Prisma.WorkoutFindUniqueArgs> = z.object({
  select: WorkoutSelectSchema.optional(),
  include: WorkoutIncludeSchema.optional(),
  where: WorkoutWhereUniqueInputSchema, 
}).strict();

export const WorkoutFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.WorkoutFindUniqueOrThrowArgs> = z.object({
  select: WorkoutSelectSchema.optional(),
  include: WorkoutIncludeSchema.optional(),
  where: WorkoutWhereUniqueInputSchema, 
}).strict();

export const WorkoutExerciseFindFirstArgsSchema: z.ZodType<Prisma.WorkoutExerciseFindFirstArgs> = z.object({
  select: WorkoutExerciseSelectSchema.optional(),
  include: WorkoutExerciseIncludeSchema.optional(),
  where: WorkoutExerciseWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutExerciseOrderByWithRelationInputSchema.array(), WorkoutExerciseOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutExerciseWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutExerciseScalarFieldEnumSchema, WorkoutExerciseScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutExerciseFindFirstOrThrowArgsSchema: z.ZodType<Prisma.WorkoutExerciseFindFirstOrThrowArgs> = z.object({
  select: WorkoutExerciseSelectSchema.optional(),
  include: WorkoutExerciseIncludeSchema.optional(),
  where: WorkoutExerciseWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutExerciseOrderByWithRelationInputSchema.array(), WorkoutExerciseOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutExerciseWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutExerciseScalarFieldEnumSchema, WorkoutExerciseScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutExerciseFindManyArgsSchema: z.ZodType<Prisma.WorkoutExerciseFindManyArgs> = z.object({
  select: WorkoutExerciseSelectSchema.optional(),
  include: WorkoutExerciseIncludeSchema.optional(),
  where: WorkoutExerciseWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutExerciseOrderByWithRelationInputSchema.array(), WorkoutExerciseOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutExerciseWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutExerciseScalarFieldEnumSchema, WorkoutExerciseScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutExerciseAggregateArgsSchema: z.ZodType<Prisma.WorkoutExerciseAggregateArgs> = z.object({
  where: WorkoutExerciseWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutExerciseOrderByWithRelationInputSchema.array(), WorkoutExerciseOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutExerciseWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const WorkoutExerciseGroupByArgsSchema: z.ZodType<Prisma.WorkoutExerciseGroupByArgs> = z.object({
  where: WorkoutExerciseWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutExerciseOrderByWithAggregationInputSchema.array(), WorkoutExerciseOrderByWithAggregationInputSchema ]).optional(),
  by: WorkoutExerciseScalarFieldEnumSchema.array(), 
  having: WorkoutExerciseScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const WorkoutExerciseFindUniqueArgsSchema: z.ZodType<Prisma.WorkoutExerciseFindUniqueArgs> = z.object({
  select: WorkoutExerciseSelectSchema.optional(),
  include: WorkoutExerciseIncludeSchema.optional(),
  where: WorkoutExerciseWhereUniqueInputSchema, 
}).strict();

export const WorkoutExerciseFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.WorkoutExerciseFindUniqueOrThrowArgs> = z.object({
  select: WorkoutExerciseSelectSchema.optional(),
  include: WorkoutExerciseIncludeSchema.optional(),
  where: WorkoutExerciseWhereUniqueInputSchema, 
}).strict();

export const WorkoutSetFindFirstArgsSchema: z.ZodType<Prisma.WorkoutSetFindFirstArgs> = z.object({
  select: WorkoutSetSelectSchema.optional(),
  include: WorkoutSetIncludeSchema.optional(),
  where: WorkoutSetWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutSetOrderByWithRelationInputSchema.array(), WorkoutSetOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutSetWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutSetScalarFieldEnumSchema, WorkoutSetScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutSetFindFirstOrThrowArgsSchema: z.ZodType<Prisma.WorkoutSetFindFirstOrThrowArgs> = z.object({
  select: WorkoutSetSelectSchema.optional(),
  include: WorkoutSetIncludeSchema.optional(),
  where: WorkoutSetWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutSetOrderByWithRelationInputSchema.array(), WorkoutSetOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutSetWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutSetScalarFieldEnumSchema, WorkoutSetScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutSetFindManyArgsSchema: z.ZodType<Prisma.WorkoutSetFindManyArgs> = z.object({
  select: WorkoutSetSelectSchema.optional(),
  include: WorkoutSetIncludeSchema.optional(),
  where: WorkoutSetWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutSetOrderByWithRelationInputSchema.array(), WorkoutSetOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutSetWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutSetScalarFieldEnumSchema, WorkoutSetScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutSetAggregateArgsSchema: z.ZodType<Prisma.WorkoutSetAggregateArgs> = z.object({
  where: WorkoutSetWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutSetOrderByWithRelationInputSchema.array(), WorkoutSetOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutSetWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const WorkoutSetGroupByArgsSchema: z.ZodType<Prisma.WorkoutSetGroupByArgs> = z.object({
  where: WorkoutSetWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutSetOrderByWithAggregationInputSchema.array(), WorkoutSetOrderByWithAggregationInputSchema ]).optional(),
  by: WorkoutSetScalarFieldEnumSchema.array(), 
  having: WorkoutSetScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const WorkoutSetFindUniqueArgsSchema: z.ZodType<Prisma.WorkoutSetFindUniqueArgs> = z.object({
  select: WorkoutSetSelectSchema.optional(),
  include: WorkoutSetIncludeSchema.optional(),
  where: WorkoutSetWhereUniqueInputSchema, 
}).strict();

export const WorkoutSetFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.WorkoutSetFindUniqueOrThrowArgs> = z.object({
  select: WorkoutSetSelectSchema.optional(),
  include: WorkoutSetIncludeSchema.optional(),
  where: WorkoutSetWhereUniqueInputSchema, 
}).strict();

export const ExerciseFindFirstArgsSchema: z.ZodType<Prisma.ExerciseFindFirstArgs> = z.object({
  select: ExerciseSelectSchema.optional(),
  include: ExerciseIncludeSchema.optional(),
  where: ExerciseWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseOrderByWithRelationInputSchema.array(), ExerciseOrderByWithRelationInputSchema ]).optional(),
  cursor: ExerciseWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExerciseScalarFieldEnumSchema, ExerciseScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ExerciseFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ExerciseFindFirstOrThrowArgs> = z.object({
  select: ExerciseSelectSchema.optional(),
  include: ExerciseIncludeSchema.optional(),
  where: ExerciseWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseOrderByWithRelationInputSchema.array(), ExerciseOrderByWithRelationInputSchema ]).optional(),
  cursor: ExerciseWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExerciseScalarFieldEnumSchema, ExerciseScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ExerciseFindManyArgsSchema: z.ZodType<Prisma.ExerciseFindManyArgs> = z.object({
  select: ExerciseSelectSchema.optional(),
  include: ExerciseIncludeSchema.optional(),
  where: ExerciseWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseOrderByWithRelationInputSchema.array(), ExerciseOrderByWithRelationInputSchema ]).optional(),
  cursor: ExerciseWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExerciseScalarFieldEnumSchema, ExerciseScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ExerciseAggregateArgsSchema: z.ZodType<Prisma.ExerciseAggregateArgs> = z.object({
  where: ExerciseWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseOrderByWithRelationInputSchema.array(), ExerciseOrderByWithRelationInputSchema ]).optional(),
  cursor: ExerciseWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ExerciseGroupByArgsSchema: z.ZodType<Prisma.ExerciseGroupByArgs> = z.object({
  where: ExerciseWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseOrderByWithAggregationInputSchema.array(), ExerciseOrderByWithAggregationInputSchema ]).optional(),
  by: ExerciseScalarFieldEnumSchema.array(), 
  having: ExerciseScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ExerciseFindUniqueArgsSchema: z.ZodType<Prisma.ExerciseFindUniqueArgs> = z.object({
  select: ExerciseSelectSchema.optional(),
  include: ExerciseIncludeSchema.optional(),
  where: ExerciseWhereUniqueInputSchema, 
}).strict();

export const ExerciseFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ExerciseFindUniqueOrThrowArgs> = z.object({
  select: ExerciseSelectSchema.optional(),
  include: ExerciseIncludeSchema.optional(),
  where: ExerciseWhereUniqueInputSchema, 
}).strict();

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
}).strict();

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
  create: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
}).strict();

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const AuthCreateArgsSchema: z.ZodType<Prisma.AuthCreateArgs> = z.object({
  select: AuthSelectSchema.optional(),
  include: AuthIncludeSchema.optional(),
  data: z.union([ AuthCreateInputSchema, AuthUncheckedCreateInputSchema ]),
}).strict();

export const AuthUpsertArgsSchema: z.ZodType<Prisma.AuthUpsertArgs> = z.object({
  select: AuthSelectSchema.optional(),
  include: AuthIncludeSchema.optional(),
  where: AuthWhereUniqueInputSchema, 
  create: z.union([ AuthCreateInputSchema, AuthUncheckedCreateInputSchema ]),
  update: z.union([ AuthUpdateInputSchema, AuthUncheckedUpdateInputSchema ]),
}).strict();

export const AuthCreateManyArgsSchema: z.ZodType<Prisma.AuthCreateManyArgs> = z.object({
  data: z.union([ AuthCreateManyInputSchema, AuthCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const AuthCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AuthCreateManyAndReturnArgs> = z.object({
  data: z.union([ AuthCreateManyInputSchema, AuthCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const AuthDeleteArgsSchema: z.ZodType<Prisma.AuthDeleteArgs> = z.object({
  select: AuthSelectSchema.optional(),
  include: AuthIncludeSchema.optional(),
  where: AuthWhereUniqueInputSchema, 
}).strict();

export const AuthUpdateArgsSchema: z.ZodType<Prisma.AuthUpdateArgs> = z.object({
  select: AuthSelectSchema.optional(),
  include: AuthIncludeSchema.optional(),
  data: z.union([ AuthUpdateInputSchema, AuthUncheckedUpdateInputSchema ]),
  where: AuthWhereUniqueInputSchema, 
}).strict();

export const AuthUpdateManyArgsSchema: z.ZodType<Prisma.AuthUpdateManyArgs> = z.object({
  data: z.union([ AuthUpdateManyMutationInputSchema, AuthUncheckedUpdateManyInputSchema ]),
  where: AuthWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const AuthUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.AuthUpdateManyAndReturnArgs> = z.object({
  data: z.union([ AuthUpdateManyMutationInputSchema, AuthUncheckedUpdateManyInputSchema ]),
  where: AuthWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const AuthDeleteManyArgsSchema: z.ZodType<Prisma.AuthDeleteManyArgs> = z.object({
  where: AuthWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const BodyMetricCreateArgsSchema: z.ZodType<Prisma.BodyMetricCreateArgs> = z.object({
  select: BodyMetricSelectSchema.optional(),
  include: BodyMetricIncludeSchema.optional(),
  data: z.union([ BodyMetricCreateInputSchema, BodyMetricUncheckedCreateInputSchema ]),
}).strict();

export const BodyMetricUpsertArgsSchema: z.ZodType<Prisma.BodyMetricUpsertArgs> = z.object({
  select: BodyMetricSelectSchema.optional(),
  include: BodyMetricIncludeSchema.optional(),
  where: BodyMetricWhereUniqueInputSchema, 
  create: z.union([ BodyMetricCreateInputSchema, BodyMetricUncheckedCreateInputSchema ]),
  update: z.union([ BodyMetricUpdateInputSchema, BodyMetricUncheckedUpdateInputSchema ]),
}).strict();

export const BodyMetricCreateManyArgsSchema: z.ZodType<Prisma.BodyMetricCreateManyArgs> = z.object({
  data: z.union([ BodyMetricCreateManyInputSchema, BodyMetricCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const BodyMetricCreateManyAndReturnArgsSchema: z.ZodType<Prisma.BodyMetricCreateManyAndReturnArgs> = z.object({
  data: z.union([ BodyMetricCreateManyInputSchema, BodyMetricCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const BodyMetricDeleteArgsSchema: z.ZodType<Prisma.BodyMetricDeleteArgs> = z.object({
  select: BodyMetricSelectSchema.optional(),
  include: BodyMetricIncludeSchema.optional(),
  where: BodyMetricWhereUniqueInputSchema, 
}).strict();

export const BodyMetricUpdateArgsSchema: z.ZodType<Prisma.BodyMetricUpdateArgs> = z.object({
  select: BodyMetricSelectSchema.optional(),
  include: BodyMetricIncludeSchema.optional(),
  data: z.union([ BodyMetricUpdateInputSchema, BodyMetricUncheckedUpdateInputSchema ]),
  where: BodyMetricWhereUniqueInputSchema, 
}).strict();

export const BodyMetricUpdateManyArgsSchema: z.ZodType<Prisma.BodyMetricUpdateManyArgs> = z.object({
  data: z.union([ BodyMetricUpdateManyMutationInputSchema, BodyMetricUncheckedUpdateManyInputSchema ]),
  where: BodyMetricWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const BodyMetricUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.BodyMetricUpdateManyAndReturnArgs> = z.object({
  data: z.union([ BodyMetricUpdateManyMutationInputSchema, BodyMetricUncheckedUpdateManyInputSchema ]),
  where: BodyMetricWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const BodyMetricDeleteManyArgsSchema: z.ZodType<Prisma.BodyMetricDeleteManyArgs> = z.object({
  where: BodyMetricWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const DietCreateArgsSchema: z.ZodType<Prisma.DietCreateArgs> = z.object({
  select: DietSelectSchema.optional(),
  include: DietIncludeSchema.optional(),
  data: z.union([ DietCreateInputSchema, DietUncheckedCreateInputSchema ]),
}).strict();

export const DietUpsertArgsSchema: z.ZodType<Prisma.DietUpsertArgs> = z.object({
  select: DietSelectSchema.optional(),
  include: DietIncludeSchema.optional(),
  where: DietWhereUniqueInputSchema, 
  create: z.union([ DietCreateInputSchema, DietUncheckedCreateInputSchema ]),
  update: z.union([ DietUpdateInputSchema, DietUncheckedUpdateInputSchema ]),
}).strict();

export const DietCreateManyArgsSchema: z.ZodType<Prisma.DietCreateManyArgs> = z.object({
  data: z.union([ DietCreateManyInputSchema, DietCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const DietCreateManyAndReturnArgsSchema: z.ZodType<Prisma.DietCreateManyAndReturnArgs> = z.object({
  data: z.union([ DietCreateManyInputSchema, DietCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const DietDeleteArgsSchema: z.ZodType<Prisma.DietDeleteArgs> = z.object({
  select: DietSelectSchema.optional(),
  include: DietIncludeSchema.optional(),
  where: DietWhereUniqueInputSchema, 
}).strict();

export const DietUpdateArgsSchema: z.ZodType<Prisma.DietUpdateArgs> = z.object({
  select: DietSelectSchema.optional(),
  include: DietIncludeSchema.optional(),
  data: z.union([ DietUpdateInputSchema, DietUncheckedUpdateInputSchema ]),
  where: DietWhereUniqueInputSchema, 
}).strict();

export const DietUpdateManyArgsSchema: z.ZodType<Prisma.DietUpdateManyArgs> = z.object({
  data: z.union([ DietUpdateManyMutationInputSchema, DietUncheckedUpdateManyInputSchema ]),
  where: DietWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const DietUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.DietUpdateManyAndReturnArgs> = z.object({
  data: z.union([ DietUpdateManyMutationInputSchema, DietUncheckedUpdateManyInputSchema ]),
  where: DietWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const DietDeleteManyArgsSchema: z.ZodType<Prisma.DietDeleteManyArgs> = z.object({
  where: DietWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MealCreateArgsSchema: z.ZodType<Prisma.MealCreateArgs> = z.object({
  select: MealSelectSchema.optional(),
  include: MealIncludeSchema.optional(),
  data: z.union([ MealCreateInputSchema, MealUncheckedCreateInputSchema ]),
}).strict();

export const MealUpsertArgsSchema: z.ZodType<Prisma.MealUpsertArgs> = z.object({
  select: MealSelectSchema.optional(),
  include: MealIncludeSchema.optional(),
  where: MealWhereUniqueInputSchema, 
  create: z.union([ MealCreateInputSchema, MealUncheckedCreateInputSchema ]),
  update: z.union([ MealUpdateInputSchema, MealUncheckedUpdateInputSchema ]),
}).strict();

export const MealCreateManyArgsSchema: z.ZodType<Prisma.MealCreateManyArgs> = z.object({
  data: z.union([ MealCreateManyInputSchema, MealCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MealCreateManyAndReturnArgsSchema: z.ZodType<Prisma.MealCreateManyAndReturnArgs> = z.object({
  data: z.union([ MealCreateManyInputSchema, MealCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MealDeleteArgsSchema: z.ZodType<Prisma.MealDeleteArgs> = z.object({
  select: MealSelectSchema.optional(),
  include: MealIncludeSchema.optional(),
  where: MealWhereUniqueInputSchema, 
}).strict();

export const MealUpdateArgsSchema: z.ZodType<Prisma.MealUpdateArgs> = z.object({
  select: MealSelectSchema.optional(),
  include: MealIncludeSchema.optional(),
  data: z.union([ MealUpdateInputSchema, MealUncheckedUpdateInputSchema ]),
  where: MealWhereUniqueInputSchema, 
}).strict();

export const MealUpdateManyArgsSchema: z.ZodType<Prisma.MealUpdateManyArgs> = z.object({
  data: z.union([ MealUpdateManyMutationInputSchema, MealUncheckedUpdateManyInputSchema ]),
  where: MealWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MealUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.MealUpdateManyAndReturnArgs> = z.object({
  data: z.union([ MealUpdateManyMutationInputSchema, MealUncheckedUpdateManyInputSchema ]),
  where: MealWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MealDeleteManyArgsSchema: z.ZodType<Prisma.MealDeleteManyArgs> = z.object({
  where: MealWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const FoodInMealCreateArgsSchema: z.ZodType<Prisma.FoodInMealCreateArgs> = z.object({
  select: FoodInMealSelectSchema.optional(),
  include: FoodInMealIncludeSchema.optional(),
  data: z.union([ FoodInMealCreateInputSchema, FoodInMealUncheckedCreateInputSchema ]),
}).strict();

export const FoodInMealUpsertArgsSchema: z.ZodType<Prisma.FoodInMealUpsertArgs> = z.object({
  select: FoodInMealSelectSchema.optional(),
  include: FoodInMealIncludeSchema.optional(),
  where: FoodInMealWhereUniqueInputSchema, 
  create: z.union([ FoodInMealCreateInputSchema, FoodInMealUncheckedCreateInputSchema ]),
  update: z.union([ FoodInMealUpdateInputSchema, FoodInMealUncheckedUpdateInputSchema ]),
}).strict();

export const FoodInMealCreateManyArgsSchema: z.ZodType<Prisma.FoodInMealCreateManyArgs> = z.object({
  data: z.union([ FoodInMealCreateManyInputSchema, FoodInMealCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const FoodInMealCreateManyAndReturnArgsSchema: z.ZodType<Prisma.FoodInMealCreateManyAndReturnArgs> = z.object({
  data: z.union([ FoodInMealCreateManyInputSchema, FoodInMealCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const FoodInMealDeleteArgsSchema: z.ZodType<Prisma.FoodInMealDeleteArgs> = z.object({
  select: FoodInMealSelectSchema.optional(),
  include: FoodInMealIncludeSchema.optional(),
  where: FoodInMealWhereUniqueInputSchema, 
}).strict();

export const FoodInMealUpdateArgsSchema: z.ZodType<Prisma.FoodInMealUpdateArgs> = z.object({
  select: FoodInMealSelectSchema.optional(),
  include: FoodInMealIncludeSchema.optional(),
  data: z.union([ FoodInMealUpdateInputSchema, FoodInMealUncheckedUpdateInputSchema ]),
  where: FoodInMealWhereUniqueInputSchema, 
}).strict();

export const FoodInMealUpdateManyArgsSchema: z.ZodType<Prisma.FoodInMealUpdateManyArgs> = z.object({
  data: z.union([ FoodInMealUpdateManyMutationInputSchema, FoodInMealUncheckedUpdateManyInputSchema ]),
  where: FoodInMealWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const FoodInMealUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.FoodInMealUpdateManyAndReturnArgs> = z.object({
  data: z.union([ FoodInMealUpdateManyMutationInputSchema, FoodInMealUncheckedUpdateManyInputSchema ]),
  where: FoodInMealWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const FoodInMealDeleteManyArgsSchema: z.ZodType<Prisma.FoodInMealDeleteManyArgs> = z.object({
  where: FoodInMealWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const FoodCreateArgsSchema: z.ZodType<Omit<Prisma.FoodCreateArgs, "data"> & { data: z.infer<typeof FoodCreateInputSchema> | z.infer<typeof FoodUncheckedCreateInputSchema> }> = z.object({
  select: FoodSelectSchema.optional(),
  include: FoodIncludeSchema.optional(),
  data: z.union([ FoodCreateInputSchema, FoodUncheckedCreateInputSchema ]),
}).strict();

export const FoodUpsertArgsSchema: z.ZodType<Omit<Prisma.FoodUpsertArgs, "create" | "update"> & { create: z.infer<typeof FoodCreateInputSchema> | z.infer<typeof FoodUncheckedCreateInputSchema>, update: z.infer<typeof FoodUpdateInputSchema> | z.infer<typeof FoodUncheckedUpdateInputSchema> }> = z.object({
  select: FoodSelectSchema.optional(),
  include: FoodIncludeSchema.optional(),
  where: FoodWhereUniqueInputSchema, 
  create: z.union([ FoodCreateInputSchema, FoodUncheckedCreateInputSchema ]),
  update: z.union([ FoodUpdateInputSchema, FoodUncheckedUpdateInputSchema ]),
}).strict();

export const FoodCreateManyArgsSchema: z.ZodType<Omit<Prisma.FoodCreateManyArgs, "data"> & { data: z.infer<typeof FoodCreateManyInputSchema> | z.infer<typeof FoodCreateManyInputSchema>[] }> = z.object({
  data: z.union([ FoodCreateManyInputSchema, FoodCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const FoodCreateManyAndReturnArgsSchema: z.ZodType<Omit<Prisma.FoodCreateManyAndReturnArgs, "data"> & { data: z.infer<typeof FoodCreateManyInputSchema> | z.infer<typeof FoodCreateManyInputSchema>[] }> = z.object({
  data: z.union([ FoodCreateManyInputSchema, FoodCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const FoodDeleteArgsSchema: z.ZodType<Prisma.FoodDeleteArgs> = z.object({
  select: FoodSelectSchema.optional(),
  include: FoodIncludeSchema.optional(),
  where: FoodWhereUniqueInputSchema, 
}).strict();

export const FoodUpdateArgsSchema: z.ZodType<Omit<Prisma.FoodUpdateArgs, "data"> & { data: z.infer<typeof FoodUpdateInputSchema> | z.infer<typeof FoodUncheckedUpdateInputSchema> }> = z.object({
  select: FoodSelectSchema.optional(),
  include: FoodIncludeSchema.optional(),
  data: z.union([ FoodUpdateInputSchema, FoodUncheckedUpdateInputSchema ]),
  where: FoodWhereUniqueInputSchema, 
}).strict();

export const FoodUpdateManyArgsSchema: z.ZodType<Omit<Prisma.FoodUpdateManyArgs, "data"> & { data: z.infer<typeof FoodUpdateManyMutationInputSchema> | z.infer<typeof FoodUncheckedUpdateManyInputSchema> }> = z.object({
  data: z.union([ FoodUpdateManyMutationInputSchema, FoodUncheckedUpdateManyInputSchema ]),
  where: FoodWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const FoodUpdateManyAndReturnArgsSchema: z.ZodType<Omit<Prisma.FoodUpdateManyAndReturnArgs, "data"> & { data: z.infer<typeof FoodUpdateManyMutationInputSchema> | z.infer<typeof FoodUncheckedUpdateManyInputSchema> }> = z.object({
  data: z.union([ FoodUpdateManyMutationInputSchema, FoodUncheckedUpdateManyInputSchema ]),
  where: FoodWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const FoodDeleteManyArgsSchema: z.ZodType<Prisma.FoodDeleteManyArgs> = z.object({
  where: FoodWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const WorkoutPlanCreateArgsSchema: z.ZodType<Prisma.WorkoutPlanCreateArgs> = z.object({
  select: WorkoutPlanSelectSchema.optional(),
  include: WorkoutPlanIncludeSchema.optional(),
  data: z.union([ WorkoutPlanCreateInputSchema, WorkoutPlanUncheckedCreateInputSchema ]),
}).strict();

export const WorkoutPlanUpsertArgsSchema: z.ZodType<Prisma.WorkoutPlanUpsertArgs> = z.object({
  select: WorkoutPlanSelectSchema.optional(),
  include: WorkoutPlanIncludeSchema.optional(),
  where: WorkoutPlanWhereUniqueInputSchema, 
  create: z.union([ WorkoutPlanCreateInputSchema, WorkoutPlanUncheckedCreateInputSchema ]),
  update: z.union([ WorkoutPlanUpdateInputSchema, WorkoutPlanUncheckedUpdateInputSchema ]),
}).strict();

export const WorkoutPlanCreateManyArgsSchema: z.ZodType<Prisma.WorkoutPlanCreateManyArgs> = z.object({
  data: z.union([ WorkoutPlanCreateManyInputSchema, WorkoutPlanCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const WorkoutPlanCreateManyAndReturnArgsSchema: z.ZodType<Prisma.WorkoutPlanCreateManyAndReturnArgs> = z.object({
  data: z.union([ WorkoutPlanCreateManyInputSchema, WorkoutPlanCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const WorkoutPlanDeleteArgsSchema: z.ZodType<Prisma.WorkoutPlanDeleteArgs> = z.object({
  select: WorkoutPlanSelectSchema.optional(),
  include: WorkoutPlanIncludeSchema.optional(),
  where: WorkoutPlanWhereUniqueInputSchema, 
}).strict();

export const WorkoutPlanUpdateArgsSchema: z.ZodType<Prisma.WorkoutPlanUpdateArgs> = z.object({
  select: WorkoutPlanSelectSchema.optional(),
  include: WorkoutPlanIncludeSchema.optional(),
  data: z.union([ WorkoutPlanUpdateInputSchema, WorkoutPlanUncheckedUpdateInputSchema ]),
  where: WorkoutPlanWhereUniqueInputSchema, 
}).strict();

export const WorkoutPlanUpdateManyArgsSchema: z.ZodType<Prisma.WorkoutPlanUpdateManyArgs> = z.object({
  data: z.union([ WorkoutPlanUpdateManyMutationInputSchema, WorkoutPlanUncheckedUpdateManyInputSchema ]),
  where: WorkoutPlanWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const WorkoutPlanUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.WorkoutPlanUpdateManyAndReturnArgs> = z.object({
  data: z.union([ WorkoutPlanUpdateManyMutationInputSchema, WorkoutPlanUncheckedUpdateManyInputSchema ]),
  where: WorkoutPlanWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const WorkoutPlanDeleteManyArgsSchema: z.ZodType<Prisma.WorkoutPlanDeleteManyArgs> = z.object({
  where: WorkoutPlanWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const WorkoutCreateArgsSchema: z.ZodType<Prisma.WorkoutCreateArgs> = z.object({
  select: WorkoutSelectSchema.optional(),
  include: WorkoutIncludeSchema.optional(),
  data: z.union([ WorkoutCreateInputSchema, WorkoutUncheckedCreateInputSchema ]),
}).strict();

export const WorkoutUpsertArgsSchema: z.ZodType<Prisma.WorkoutUpsertArgs> = z.object({
  select: WorkoutSelectSchema.optional(),
  include: WorkoutIncludeSchema.optional(),
  where: WorkoutWhereUniqueInputSchema, 
  create: z.union([ WorkoutCreateInputSchema, WorkoutUncheckedCreateInputSchema ]),
  update: z.union([ WorkoutUpdateInputSchema, WorkoutUncheckedUpdateInputSchema ]),
}).strict();

export const WorkoutCreateManyArgsSchema: z.ZodType<Prisma.WorkoutCreateManyArgs> = z.object({
  data: z.union([ WorkoutCreateManyInputSchema, WorkoutCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const WorkoutCreateManyAndReturnArgsSchema: z.ZodType<Prisma.WorkoutCreateManyAndReturnArgs> = z.object({
  data: z.union([ WorkoutCreateManyInputSchema, WorkoutCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const WorkoutDeleteArgsSchema: z.ZodType<Prisma.WorkoutDeleteArgs> = z.object({
  select: WorkoutSelectSchema.optional(),
  include: WorkoutIncludeSchema.optional(),
  where: WorkoutWhereUniqueInputSchema, 
}).strict();

export const WorkoutUpdateArgsSchema: z.ZodType<Prisma.WorkoutUpdateArgs> = z.object({
  select: WorkoutSelectSchema.optional(),
  include: WorkoutIncludeSchema.optional(),
  data: z.union([ WorkoutUpdateInputSchema, WorkoutUncheckedUpdateInputSchema ]),
  where: WorkoutWhereUniqueInputSchema, 
}).strict();

export const WorkoutUpdateManyArgsSchema: z.ZodType<Prisma.WorkoutUpdateManyArgs> = z.object({
  data: z.union([ WorkoutUpdateManyMutationInputSchema, WorkoutUncheckedUpdateManyInputSchema ]),
  where: WorkoutWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const WorkoutUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.WorkoutUpdateManyAndReturnArgs> = z.object({
  data: z.union([ WorkoutUpdateManyMutationInputSchema, WorkoutUncheckedUpdateManyInputSchema ]),
  where: WorkoutWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const WorkoutDeleteManyArgsSchema: z.ZodType<Prisma.WorkoutDeleteManyArgs> = z.object({
  where: WorkoutWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const WorkoutExerciseCreateArgsSchema: z.ZodType<Prisma.WorkoutExerciseCreateArgs> = z.object({
  select: WorkoutExerciseSelectSchema.optional(),
  include: WorkoutExerciseIncludeSchema.optional(),
  data: z.union([ WorkoutExerciseCreateInputSchema, WorkoutExerciseUncheckedCreateInputSchema ]),
}).strict();

export const WorkoutExerciseUpsertArgsSchema: z.ZodType<Prisma.WorkoutExerciseUpsertArgs> = z.object({
  select: WorkoutExerciseSelectSchema.optional(),
  include: WorkoutExerciseIncludeSchema.optional(),
  where: WorkoutExerciseWhereUniqueInputSchema, 
  create: z.union([ WorkoutExerciseCreateInputSchema, WorkoutExerciseUncheckedCreateInputSchema ]),
  update: z.union([ WorkoutExerciseUpdateInputSchema, WorkoutExerciseUncheckedUpdateInputSchema ]),
}).strict();

export const WorkoutExerciseCreateManyArgsSchema: z.ZodType<Prisma.WorkoutExerciseCreateManyArgs> = z.object({
  data: z.union([ WorkoutExerciseCreateManyInputSchema, WorkoutExerciseCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const WorkoutExerciseCreateManyAndReturnArgsSchema: z.ZodType<Prisma.WorkoutExerciseCreateManyAndReturnArgs> = z.object({
  data: z.union([ WorkoutExerciseCreateManyInputSchema, WorkoutExerciseCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const WorkoutExerciseDeleteArgsSchema: z.ZodType<Prisma.WorkoutExerciseDeleteArgs> = z.object({
  select: WorkoutExerciseSelectSchema.optional(),
  include: WorkoutExerciseIncludeSchema.optional(),
  where: WorkoutExerciseWhereUniqueInputSchema, 
}).strict();

export const WorkoutExerciseUpdateArgsSchema: z.ZodType<Prisma.WorkoutExerciseUpdateArgs> = z.object({
  select: WorkoutExerciseSelectSchema.optional(),
  include: WorkoutExerciseIncludeSchema.optional(),
  data: z.union([ WorkoutExerciseUpdateInputSchema, WorkoutExerciseUncheckedUpdateInputSchema ]),
  where: WorkoutExerciseWhereUniqueInputSchema, 
}).strict();

export const WorkoutExerciseUpdateManyArgsSchema: z.ZodType<Prisma.WorkoutExerciseUpdateManyArgs> = z.object({
  data: z.union([ WorkoutExerciseUpdateManyMutationInputSchema, WorkoutExerciseUncheckedUpdateManyInputSchema ]),
  where: WorkoutExerciseWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const WorkoutExerciseUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.WorkoutExerciseUpdateManyAndReturnArgs> = z.object({
  data: z.union([ WorkoutExerciseUpdateManyMutationInputSchema, WorkoutExerciseUncheckedUpdateManyInputSchema ]),
  where: WorkoutExerciseWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const WorkoutExerciseDeleteManyArgsSchema: z.ZodType<Prisma.WorkoutExerciseDeleteManyArgs> = z.object({
  where: WorkoutExerciseWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const WorkoutSetCreateArgsSchema: z.ZodType<Prisma.WorkoutSetCreateArgs> = z.object({
  select: WorkoutSetSelectSchema.optional(),
  include: WorkoutSetIncludeSchema.optional(),
  data: z.union([ WorkoutSetCreateInputSchema, WorkoutSetUncheckedCreateInputSchema ]),
}).strict();

export const WorkoutSetUpsertArgsSchema: z.ZodType<Prisma.WorkoutSetUpsertArgs> = z.object({
  select: WorkoutSetSelectSchema.optional(),
  include: WorkoutSetIncludeSchema.optional(),
  where: WorkoutSetWhereUniqueInputSchema, 
  create: z.union([ WorkoutSetCreateInputSchema, WorkoutSetUncheckedCreateInputSchema ]),
  update: z.union([ WorkoutSetUpdateInputSchema, WorkoutSetUncheckedUpdateInputSchema ]),
}).strict();

export const WorkoutSetCreateManyArgsSchema: z.ZodType<Prisma.WorkoutSetCreateManyArgs> = z.object({
  data: z.union([ WorkoutSetCreateManyInputSchema, WorkoutSetCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const WorkoutSetCreateManyAndReturnArgsSchema: z.ZodType<Prisma.WorkoutSetCreateManyAndReturnArgs> = z.object({
  data: z.union([ WorkoutSetCreateManyInputSchema, WorkoutSetCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const WorkoutSetDeleteArgsSchema: z.ZodType<Prisma.WorkoutSetDeleteArgs> = z.object({
  select: WorkoutSetSelectSchema.optional(),
  include: WorkoutSetIncludeSchema.optional(),
  where: WorkoutSetWhereUniqueInputSchema, 
}).strict();

export const WorkoutSetUpdateArgsSchema: z.ZodType<Prisma.WorkoutSetUpdateArgs> = z.object({
  select: WorkoutSetSelectSchema.optional(),
  include: WorkoutSetIncludeSchema.optional(),
  data: z.union([ WorkoutSetUpdateInputSchema, WorkoutSetUncheckedUpdateInputSchema ]),
  where: WorkoutSetWhereUniqueInputSchema, 
}).strict();

export const WorkoutSetUpdateManyArgsSchema: z.ZodType<Prisma.WorkoutSetUpdateManyArgs> = z.object({
  data: z.union([ WorkoutSetUpdateManyMutationInputSchema, WorkoutSetUncheckedUpdateManyInputSchema ]),
  where: WorkoutSetWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const WorkoutSetUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.WorkoutSetUpdateManyAndReturnArgs> = z.object({
  data: z.union([ WorkoutSetUpdateManyMutationInputSchema, WorkoutSetUncheckedUpdateManyInputSchema ]),
  where: WorkoutSetWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const WorkoutSetDeleteManyArgsSchema: z.ZodType<Prisma.WorkoutSetDeleteManyArgs> = z.object({
  where: WorkoutSetWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ExerciseCreateArgsSchema: z.ZodType<Prisma.ExerciseCreateArgs> = z.object({
  select: ExerciseSelectSchema.optional(),
  include: ExerciseIncludeSchema.optional(),
  data: z.union([ ExerciseCreateInputSchema, ExerciseUncheckedCreateInputSchema ]),
}).strict();

export const ExerciseUpsertArgsSchema: z.ZodType<Prisma.ExerciseUpsertArgs> = z.object({
  select: ExerciseSelectSchema.optional(),
  include: ExerciseIncludeSchema.optional(),
  where: ExerciseWhereUniqueInputSchema, 
  create: z.union([ ExerciseCreateInputSchema, ExerciseUncheckedCreateInputSchema ]),
  update: z.union([ ExerciseUpdateInputSchema, ExerciseUncheckedUpdateInputSchema ]),
}).strict();

export const ExerciseCreateManyArgsSchema: z.ZodType<Prisma.ExerciseCreateManyArgs> = z.object({
  data: z.union([ ExerciseCreateManyInputSchema, ExerciseCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ExerciseCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ExerciseCreateManyAndReturnArgs> = z.object({
  data: z.union([ ExerciseCreateManyInputSchema, ExerciseCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ExerciseDeleteArgsSchema: z.ZodType<Prisma.ExerciseDeleteArgs> = z.object({
  select: ExerciseSelectSchema.optional(),
  include: ExerciseIncludeSchema.optional(),
  where: ExerciseWhereUniqueInputSchema, 
}).strict();

export const ExerciseUpdateArgsSchema: z.ZodType<Prisma.ExerciseUpdateArgs> = z.object({
  select: ExerciseSelectSchema.optional(),
  include: ExerciseIncludeSchema.optional(),
  data: z.union([ ExerciseUpdateInputSchema, ExerciseUncheckedUpdateInputSchema ]),
  where: ExerciseWhereUniqueInputSchema, 
}).strict();

export const ExerciseUpdateManyArgsSchema: z.ZodType<Prisma.ExerciseUpdateManyArgs> = z.object({
  data: z.union([ ExerciseUpdateManyMutationInputSchema, ExerciseUncheckedUpdateManyInputSchema ]),
  where: ExerciseWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ExerciseUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ExerciseUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ExerciseUpdateManyMutationInputSchema, ExerciseUncheckedUpdateManyInputSchema ]),
  where: ExerciseWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ExerciseDeleteManyArgsSchema: z.ZodType<Prisma.ExerciseDeleteManyArgs> = z.object({
  where: ExerciseWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();