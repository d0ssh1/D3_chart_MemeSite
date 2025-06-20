document.addEventListener('DOMContentLoaded', () => {
    createTable(memes, 'memeTable');
    setSortSelects(memes[0], document.getElementById('sort'));

    //Находим первый SELECT
    const firstSelect = document.getElementById('fieldsFirst');

    //Добавляем обработчик события change
    firstSelect.addEventListener('change', function () {
        const secondSelect = document.getElementById('fieldsSecond');

        //Если в первом SELECT выбрано "Нет", отключаем второй SELECT
        if (this.value === "0") {
            secondSelect.disabled = true;
        } else {
            //Иначе включаем второй SELECT и обновляем его опции
            secondSelect.disabled = false;
            changeNextSelect('fieldsSecond', this);
        }
    });

});

const firstSelect = document.getElementById('fieldsFirst');
const secondSelect = document.getElementById('fieldsSecond');

secondSelect.addEventListener('change', function () {
    const thirdSelect = document.getElementById('fieldsThird');

    if (this.value === "0") {
        thirdSelect.disabled = true;
    } else {
        thirdSelect.disabled = false;
        changeNextSelect('fieldsThird', this);
    }
})

firstSelect.addEventListener('change', function () {
    const secondSelect = document.getElementById('fieldsSecond');
    const thirdSelect = document.getElementById('fieldsThird');

    if (this.value == "0") {
        // Сбрасываем и отключаем ВСЕ следующие уровни
        secondSelect.disabled = true;
        secondSelect.value = 0; // Сбрасываем выбор

        thirdSelect.disabled = true;
        thirdSelect.value = 0; // Сбрасываем выбор
    } else {
        secondSelect.disabled = false;
        changeNextSelect('fieldsSecond', this);

        // При изменении первого - сбрасываем третий
        thirdSelect.disabled = true;
        thirdSelect.value = 0;
    }
});

secondSelect.addEventListener('change', function () {
    const thirdSelect = document.getElementById('fieldsThird');

    if (this.value === "0") {
        thirdSelect.disabled = true;
        thirdSelect.value = 0; // Сбрасываем выбор
    } else {
        thirdSelect.disabled = false;
        changeNextSelect('fieldsThird', this)
    }
});


// формирование полей элемента списка с заданным текстом и значением

let createOption = (str, val) => {
    let item = document.createElement('option');
    item.text = str;
    item.value = val;
    return item;
}
// формирование полей со списком из заголовков таблицы
// параметры – массив из заголовков таблицы и элемент select
let setSortSelect = (head, sortSelect) => {

    // создаем OPTION Нет и добавляем ее в SELECT
    sortSelect.append(createOption('Нет', 0));

    // перебираем все ключи переданного элемента массива данных
    for (let i in head) {
        // создаем OPTION из очередного ключа и добавляем в SELECT
        // значение атрибута VAL увеличиваем на 1, так как значение 0 имеет опция Нет
        sortSelect.append(createOption(head[i], Number(i) + 1));
    }
}

// формируем поля со списком для многоуровневой сортировки
let setSortSelects = (data, dataForm) => {

    // выделяем ключи словаря в массив
    let head = Object.keys(data);

    // находим все SELECT в форме
    let allSelect = dataForm.getElementsByTagName('select');

    for (let j = 0; j < allSelect.length; j++) {
        //формируем опции очередного SELECT
        setSortSelect(head, allSelect[j]);

        //самостоятельно все SELECT, кроме первого, сделать неизменяемыми
        if (j !== 0) allSelect[j].disabled = true;
    }
};

/*//Событие изменения первого уровня сортировки
document.getElementById('fieldsFirst').addEventListener('change', function () {
    changeNextSelect('fieldsSecond', this);
});*/

// настраиваем поле для следующего уровня сортировки
let changeNextSelect = (nextSelectId, curSelect) => {
    let nextSelect = document.getElementById(nextSelectId);
    nextSelect.disabled = false;

    // Копируем все опции
    nextSelect.innerHTML = curSelect.innerHTML;

    if (curSelect.value !== 0) {
        // Находим опцию по VALUE и удаляем её
        let optionToRemove = nextSelect.querySelector(`option[value="${curSelect.value}"]`);
        if (optionToRemove) {
            optionToRemove.remove();
        }
    } else {
        nextSelect.disabled = true;
    }
}




   