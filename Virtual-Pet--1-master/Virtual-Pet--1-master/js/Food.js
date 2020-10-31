class Food {
    constructor(x, y) {
        var foodStock;
        var lastFed;

        this.foodStock = 0;
        this.image = loadImage("images/milk.png");
    }
    getFoodStock() {
        return this.foodStock;
    }
    updateFoodStock(foodStock) {
        this.foodStock = foodStock;
    }
    deductFood() {
        if (this.foodStock > 0) {
            this.foodStock = this.foodStock - 1;
        }
    }
    display() {
        var x = 80, y = 100;

        imageMode(CENTER);

        if (this.foodStock != 0)
            for (var i = 0; i < this.foodStock; i++) {
                if (i % 10 == 0) {
                    x = 80;
                    y = y + 50;
                }
                image(this.image, x, y, 50, 50);
                x = x + 30;
            }
    }
    bedroom() {
        background(bedroom, 300, 250);
    }
    washroom() {
        background(washroom, 300, 250);
    }
    garden() {
        background(garden, 300, 250);
    }
}