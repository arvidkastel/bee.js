type DashboardElement = {element: HTMLElement, row: number, col}; 
class Dashboard extends HTMLElement {
    private _elements:DashboardElement[];
    appendElement(element: HTMLElement, row:number, col:number) {
        this._elements.push({
            element,
            row,
            col
        });
    }
    public render() {
        $(document).append("<div id='main' class='container'></div>")
    }
    private _numberOfRows() {
        return _.uniq(
            _.map(this._elements, 'row')
            ).length;
    }

    private
}

console.log("jlkjlkj");