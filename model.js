class List {
    constructor(id, name, author) {
        this.id = id || undefined;  // Default to undefined if not provided
        this.name = name;
        this.author = author;
        this.items = [];
    }

    addItem(item) {
        this.items.push(item);
        
    }



    sortItems() {

        return this.items.sort(
            (a, b) => b.points - a.points
          );

     }

}


class Item {
    constructor(id, list_id, name, points, description, image_link) {
        this.id = id;
        this.list_id = list_id;
        this.name = name;
        this.points = points;
        this.description = description;
        this.image_link = image_link;
    }
}


class pageState {
    constructor(state) {
        this.state = state;
    }
    setPageState(state){
        sessionStorage.setItem("page_state", `${state}`);
    }
}