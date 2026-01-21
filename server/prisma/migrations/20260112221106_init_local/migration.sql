-- CreateTable
CREATE TABLE "public"."User" (
    "user_id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_password" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."BodyComposition" (
    "body_composition_id" TEXT NOT NULL,
    "body_composition_birth" DATE NOT NULL,
    "body_composition_weight" INTEGER NOT NULL,
    "body_composition_height" INTEGER NOT NULL,
    "body_composition_gender" BOOLEAN NOT NULL,
    "body_composition_activity_level" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "BodyComposition_pkey" PRIMARY KEY ("body_composition_id")
);

-- CreateTable
CREATE TABLE "public"."DietGoal" (
    "diet_goal_id" TEXT NOT NULL,
    "diet_goal_carbohydrate" INTEGER NOT NULL,
    "diet_goal_protein" INTEGER NOT NULL,
    "diet_goal_fat" INTEGER NOT NULL,
    "diet_goal_fiber" INTEGER NOT NULL,
    "diet_goal_water" INTEGER NOT NULL,
    "diet_id" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "DietGoal_pkey" PRIMARY KEY ("diet_goal_id")
);

-- CreateTable
CREATE TABLE "public"."Diet" (
    "user_id" TEXT NOT NULL,
    "diet_goal_id" TEXT NOT NULL,
    "diet_id" TEXT NOT NULL,
    "diet_name" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Diet_pkey" PRIMARY KEY ("diet_id")
);

-- CreateTable
CREATE TABLE "public"."Meal" (
    "meal_id" TEXT NOT NULL,
    "meal_name" VARCHAR(64) NOT NULL,
    "meal_time" TIMESTAMP(3) NOT NULL,
    "diet_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("meal_id")
);

-- CreateTable
CREATE TABLE "public"."Food" (
    "food_id" TEXT NOT NULL,
    "food_name" VARCHAR(64) NOT NULL,
    "food_carbohydrate" DOUBLE PRECISION NOT NULL,
    "food_protein" DOUBLE PRECISION NOT NULL,
    "food_fat" DOUBLE PRECISION NOT NULL,
    "food_fiber" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("food_id")
);

-- CreateTable
CREATE TABLE "public"."MealWithFood" (
    "meal_id" TEXT NOT NULL,
    "food_id" TEXT NOT NULL,
    "meal_with_food_id" TEXT NOT NULL,
    "quantity_per_100g" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "MealWithFood_pkey" PRIMARY KEY ("meal_with_food_id")
);

-- CreateTable
CREATE TABLE "public"."Exercise" (
    "exercise_id" TEXT NOT NULL,
    "exercise_name" VARCHAR(64) NOT NULL,
    "exercise_description" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("exercise_id")
);

-- CreateTable
CREATE TABLE "public"."Sets" (
    "set_id" TEXT NOT NULL,
    "set_load" INTEGER NOT NULL,
    "set_repetitions" INTEGER NOT NULL,
    "set_rest_time" TIME NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Sets_pkey" PRIMARY KEY ("set_id")
);

-- CreateTable
CREATE TABLE "public"."ExerciseWithSets" (
    "exercise_id" TEXT NOT NULL,
    "set_id" TEXT NOT NULL,
    "exercise_with_set_id" TEXT NOT NULL,
    "especificWorkoutEspecific_workout_id" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "ExerciseWithSets_pkey" PRIMARY KEY ("exercise_with_set_id")
);

-- CreateTable
CREATE TABLE "public"."EspecificWorkout" (
    "especific_workout_id" TEXT NOT NULL,
    "especific_workout_day" DATE NOT NULL,
    "globalWorkoutGlobal_workout_id" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "EspecificWorkout_pkey" PRIMARY KEY ("especific_workout_id")
);

-- CreateTable
CREATE TABLE "public"."GlobalWorkout" (
    "user_id" TEXT NOT NULL,
    "global_workout_id" TEXT NOT NULL,
    "global_workout_name" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "GlobalWorkout_pkey" PRIMARY KEY ("global_workout_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_email_key" ON "public"."User"("user_email");

-- CreateIndex
CREATE UNIQUE INDEX "BodyComposition_user_id_key" ON "public"."BodyComposition"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "DietGoal_diet_id_key" ON "public"."DietGoal"("diet_id");

-- CreateIndex
CREATE UNIQUE INDEX "Diet_user_id_key" ON "public"."Diet"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Diet_diet_goal_id_key" ON "public"."Diet"("diet_goal_id");

-- AddForeignKey
ALTER TABLE "public"."BodyComposition" ADD CONSTRAINT "BodyComposition_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Diet" ADD CONSTRAINT "Diet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Diet" ADD CONSTRAINT "Diet_diet_goal_id_fkey" FOREIGN KEY ("diet_goal_id") REFERENCES "public"."DietGoal"("diet_goal_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Meal" ADD CONSTRAINT "Meal_diet_id_fkey" FOREIGN KEY ("diet_id") REFERENCES "public"."Diet"("diet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MealWithFood" ADD CONSTRAINT "MealWithFood_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "public"."Meal"("meal_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MealWithFood" ADD CONSTRAINT "MealWithFood_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "public"."Food"("food_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExerciseWithSets" ADD CONSTRAINT "ExerciseWithSets_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."Exercise"("exercise_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExerciseWithSets" ADD CONSTRAINT "ExerciseWithSets_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "public"."Sets"("set_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExerciseWithSets" ADD CONSTRAINT "ExerciseWithSets_especificWorkoutEspecific_workout_id_fkey" FOREIGN KEY ("especificWorkoutEspecific_workout_id") REFERENCES "public"."EspecificWorkout"("especific_workout_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EspecificWorkout" ADD CONSTRAINT "EspecificWorkout_globalWorkoutGlobal_workout_id_fkey" FOREIGN KEY ("globalWorkoutGlobal_workout_id") REFERENCES "public"."GlobalWorkout"("global_workout_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GlobalWorkout" ADD CONSTRAINT "GlobalWorkout_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
