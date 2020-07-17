export class House {
    idHouse: string;
    laneHouse: string;
    colorHouse: string;
    areaHouse: string;

    clear(): void {
        this.idHouse = '';
        this.laneHouse = '';
        this.colorHouse = '';
        this.areaHouse = '';
    }
}
