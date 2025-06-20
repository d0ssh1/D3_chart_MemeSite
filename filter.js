let correspond = {
    "Название": "structure",
    "Страна": "country",
    "Тема": "theme",
    "Источник": "source",
    "Год": ["yearFrom", "yearTo"],
    "Рейтинг": "score"
}

let dataFilter = (dataForm) => {
    let dictFilter = {};
    // перебираем все элементы формы с фильтрами
    for (let j = 0; j < dataForm.elements.length; j++) {

        // выделяем очередной элемент формы
        let item = dataForm.elements[j];

        if (item.type === "text" || item.type === "number") {
            // получаем значение элемента
            let valInput = item.value;

            // если поле типа text - приводим его значение к нижнему регистру
            if (item.type === "text") {
                valInput = valInput.toLowerCase();
            } else if (item.type === "number") {
                if (valInput === "") {
                    if (item.id.includes("From")) {
                        valInput = -Infinity;
                    } else if (item.id.includes("To")) {
                        valInput = Infinity;
                    }
                } else {
                    valInput = parseFloat(valInput);
                }
            }

            // формируем очередной элемент ассоциативного массива
            dictFilter[item.id] = valInput;
        }
    }

    return dictFilter;
};

let filterTable = (data, idTable, dataForm) => {
    let datafilter = dataFilter(dataForm);

    let tableFilter = data.filter(item => {
        let result = true;

        for (let key in item) {
            let val = item[key];

            if (typeof val === "string") {
                let mappedField = correspond[key];
                let filterValue = datafilter[mappedField];
                result = result && (filterValue === "" || val.toLowerCase().includes(filterValue));
            }
            else if (typeof val === "number") {
                let mappedField = correspond[key];

                if (Array.isArray(mappedField)) {
                    // Для года
                    let from = datafilter[mappedField[0]];
                    let to = datafilter[mappedField[1]];
                    result = result && (val >= from && val <= to);
                } else {
                    // Для рейтинга - исправляем условие
                    let filterValue = datafilter[mappedField];
                    result = result && (isNaN(filterValue) || filterValue === "" || val === filterValue);
                }
            }
        }

        return result;
    });

    createTable(tableFilter, idTable);
};


//очистка фильтров
let clearFilters = () => {
    document.getElementById("filter").reset();
    document.getElementById('sort').reset();
    createTable(memes, 'memeTable');
};

//применение фильтров
let applyFilters = () => {
    let form = document.getElementById("filter");
    filterTable(memes, 'memeTable', form);
};