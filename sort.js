/*формируем массив для сортировки по уровням вида:
 [
 {column: номер столбца,
 order: порядок сортировки (true по убыванию, false по возрастанию)
 },
 {column: номер столбца,
 order: порядок сортировки
 }

 ]
*/

let createSortArr = (data) => {
    let sortArr = [];

    let sortSelects = data.getElementsByTagName('select');

    for (let i = 0; i < sortSelects.length; i++) {

        // получаем номер выбранной опции
        let keySort = sortSelects[i].value;
        // в случае, если выбрана опция Нет, заканчиваем формировать массив
        if (keySort === "0") {
            break;
        }
        // получаем номер значение флажка для порядка сортировки
        // имя флажка сформировано как имя поля SELECT и слова Desc
        let desc = document.getElementById(sortSelects[i].id + 'Desc').checked;
        sortArr.push({column: keySort - 1, order: desc});
    }
    return sortArr;
};


let sortTable = (idTable, data) => {

    // формируем управляющий массив для сортировки
    let sortArr = createSortArr(data);

    // сортировать таблицу не нужно, во всех полях выбрана опция Нет
    if (sortArr.length === 0) {
        return false;
    }
    //находим нужную таблицу
    let table = document.getElementById(idTable);
    // преобразуем строки таблицы в массив
    let rowData = Array.from(table.rows);

    // удаляем элемент с заголовками таблицы
    rowData.shift();

    //сортируем данные по возрастанию по всем уровням сортировки
    rowData.sort((first, second) => {
        for(let i in sortArr) {
            let key = sortArr[i].column;
            let order = sortArr[i].order ? -1 : 1;
            if (key === 4 || key === 5) {
                const a = +first.cells[key].innerHTML;
                const b = +second.cells[key].innerHTML;
                if (a > b)   return order;
                if (a < b)   return -order;
            } else {
                const a = first.cells[key].innerHTML;
                const b = second.cells[key].innerHTML;
                if (a > b)   return order;
                if (a < b)   return -order;
            }

        }
        return 0;
    });

    //выводим отсортированную таблицу на страницу
    table.innerHTML = table.rows[0].innerHTML;
    rowData.forEach(item => {
        table.append(item);
    });

    // Обновляем график после сортировки
    drawGraph(getFilteredDataFromTable());
}


//сброс сортировки
let resetSort = () => {
    // Сбрасываем формы
    document.getElementById('sort').reset();
    document.getElementById("filter").reset();
    const secondSelect = document.getElementById('fieldsSecond');
    const thirdSelect = document.getElementById('fieldsThird');

    if (secondSelect) {
        secondSelect.disabled = true;
        secondSelect.value = "0";
    }

    if (thirdSelect) {
        thirdSelect.disabled = true;
        thirdSelect.value = "0";
    }

    createTable(memes, 'memeTable');

    setSortSelects(buildings[0], document.getElementById('sort'));
};
