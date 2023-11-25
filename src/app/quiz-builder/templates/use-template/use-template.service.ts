import { Injectable } from "@angular/core";

@Injectable()
export class UseTemplateService {
    private selectedTypes: number[] = [];
    private selectedCategory: number[] = [];

    constructor() {
    }


    getSelectedTypes(): number[] {
        return this.selectedTypes;
    }
    
    setSelectedTypes(selectedTypes: number[]): void {
        this.selectedTypes = selectedTypes;
    }

    getSelectedCategory(): number[] {
        return this.selectedCategory;
    }

    setSelectedCategory(selectedCategory: number[]): void {
        this.selectedCategory = selectedCategory;
    }


}