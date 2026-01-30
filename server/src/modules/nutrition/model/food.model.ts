export interface FoodModel{
    id: string;
    name: string;

    baseUnit:string;
    baseAmount:number;

    calories:number;
    carbohydrate:number;
    protein:number;
    fat:number;
    fiber?:number | null;

    createdAt:Date;
    updatedAt:Date;
}