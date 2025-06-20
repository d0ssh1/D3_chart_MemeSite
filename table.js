// Функция для вывода таблицы на страницу
let createTable = (data, idTable) => {
    let table = document.getElementById(idTable);
    table.innerHTML = '';

    // Проверяем, есть ли данные
    if (data.length === 0) {
        table.innerHTML = '<tr><td colspan="100%">Нет данных для отображения</td></tr>';
        return;
    }

    // Создаём заголовочную часть таблицы (thead)
    let thead = document.createElement('thead');
    let trHead = document.createElement('tr');

    // Формируем заголовки из ключей первого элемента массива данных
    for (let key in data[0]) {
        let th = document.createElement('th');
        th.innerHTML = key;
        trHead.append(th);
    }
    thead.append(trHead);
    table.append(thead);

    // Создаём тело таблицы (tbody)
    let tbody = document.createElement('tbody');

    // Перебираем данные и создаём строки таблицы
    data.forEach((item) => {
        let tr = document.createElement('tr');
        for (let key in item) {
            let td = document.createElement('td');
            td.innerHTML = item[key];
            tr.append(td);
        }
        tbody.append(tr);
    });
    table.append(tbody);
};

// Функция для очистки таблицы
let clearTable = (idTable) => {
    let table = document.getElementById(idTable);
    table.innerHTML = '';
};
