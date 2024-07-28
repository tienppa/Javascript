export default class Dinosaur {
    constructor(species, weight, height, diet, where, when, fact) {
        this.species = species;
        this.weight = Number(weight);
        this.height = Number(height);
        this.diet = diet;
        this.where = where;
        this.when = when;
        this.fact = fact;

        this.heightRatio = "";
        this.weightRatio = "";
        this.dietDescription = "";
        this.title = '';
    }

    compare(human) {
        this.compareHeight(human);
        this.compareWeight(human);
        this.compareDiet(human);
    }

    // Create Dino Compare Method 1
    compareHeight(human) {
        const { feet, inches } = human;
        const _height = feet * 12 + inches;
        if (!_height) return;
        this.heightRatio = (this.height / _height).toFixed(1);
    }

    // Create Dino Compare Method 2
    compareWeight(human) {
        if (!human.weight) return;
        this.weightRatio = (this.weight / human.weight).toFixed(1);
    }

    // Create Dino Compare Method 3
    compareDiet(human) {
        if (human.diet.trim().toLowerCase() === this.diet.trim().toLowerCase()) {
            this.dietDescription = `${this.species} is ${this.diet} like ${human.name}`;
            return
        }
        this.dietDescription = `${this.species} is ${this.diet} but ${human.name} is ${human.diet} `;
    }
}