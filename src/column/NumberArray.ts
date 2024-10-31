function $sum(arr: number[]): number {
    let result = 0;
    for (let i = 0; i < arr.length; i++) {
        result += arr[i];
    }
    return result;
}

class NumberArray {
    data: number[];
    dirty: boolean;
    #sum: number;

    constructor(init?: number | number[], initialSum?: number) {
        this.#sum = 0;
        this.dirty = true;
        if (Array.isArray(init)) {
            this.data = init;
        } else {
            this.data = init ? new Array(init) : [];
            this.data.fill(0);
            this.#sum = 0;
            this.dirty = false;
        }
        if (initialSum !== undefined) {
            this.#sum = initialSum;
            this.dirty = false;
        }
    }

    setSum(sum: number) {
        this.#sum = sum;
        this.dirty = false;
    }

    total(): number {
        if (this.dirty) {
            this.#sum = $sum(this.data);
        }
        return this.#sum;
    }

    dirtify() {
        this.dirty = true;
    }

    update(index: number, newval: number) {
        this.$preupdate();
        if (isNaN(newval)) {
            console.error("newval is NaN");
            newval = 0;
        }
        const current = this.data[index];
        if (newval === current) return;
        const diff = newval - current;
        this.#sum = this.#sum + diff;
        this.data[index] = newval;
        this.dirty = false;
    }

    remove(index: number) {
        this.$preupdate();
        const current = this.data[index];
        this.#sum -= current;
        this.data.splice(index, 1);
        this.dirty = false;
    }

    add(value: number) {
        if (isNaN(value)) {
            console.error("value is NaN");
            value = 0;
        }
        this.$preupdate();
        this.data.push(value);
        this.#sum += value;
        this.dirty = false;
    }

    private $preupdate() {
        if (this.dirty) {
            this.total();
        }
    }
}

export {NumberArray};