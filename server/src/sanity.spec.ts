import { describe, it , expect } from "vitest";

describe('test environment',()=>{
    it('should be able to sum 1 + 1',()=>{
        const sum = 1+1;
        expect(sum).toBe(2)
    })
})