// chart.js

/**
 * Главная функция для отрисовки графика.
 * Вызывается при нажатии кнопки "Построить" или после фильтрации/сортировки.
 * @param {Array} data - Массив с данными для построения (обычно отфильтрованные данные из таблицы).
 */
function drawGraph(data) {
    // Получаем настройки графика от пользователя
    const keyX = d3.select('input[name="ox"]:checked').node().value; // Ось X: "Год" или "Страна"
    const chartType = d3.select("#type").node().value; // Тип графика: "first", "second", "third"
    const showMax = d3.select("#check1").node().checked; // Показывать макс. рейтинг?
    const showMin = d3.select("#check2").node().checked; // Показывать мин. рейтинг?

    // Обрабатываем данные: группируем и находим мин/макс значения
    const arrGraph = createArrGraph(data, keyX);

    // Выбираем SVG-контейнер для графика
    const svg = d3.select("#chart-container");
    // Полностью очищаем предыдущий график перед новой отрисовкой
    svg.selectAll("*").remove();

    // Задаем размеры и отступы для области построения
    const margin = {top: 50, right: 50, bottom: 60, left: 50};
    const width = parseFloat(svg.style("width")) - margin.left - margin.right;
    const height = parseFloat(svg.style("height")) - margin.top - margin.bottom;

    // Создаем основную группу <g>, в которой будет рисоваться график, и смещаем ее на величину отступов
    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Создаем оси и получаем шкалы для преобразования координат
    const [scaleX, scaleY] = createAxes(chart, arrGraph, width, height);

    // В зависимости от выбора пользователя вызываем соответствующую функцию отрисовки
    if (chartType === "first") {
        createChartGist(chart, arrGraph, scaleX, scaleY, height, showMax, showMin);
    } else if (chartType === "second") {
        createChartDot(chart, arrGraph, scaleX, scaleY, showMax, showMin);
    } else if (chartType === "third") {
        createChartLine(chart, arrGraph, scaleX, scaleY, showMax, showMin);
    }
}

/**
 * Подготавливает данные для графика: группирует и вычисляет мин/макс значения.
 * @param {Array} data - Исходный массив объектов.
 * @param {string} key - Ключ для группировки ("Год" или "Страна").
 * @returns {Array} - Массив объектов, готовый для отрисовки.
 */
function createArrGraph(data, key) {
    // Группируем данные с помощью d3.group
    const groupObj = d3.group(data, d => d[key]);

    const arrGraph = [];
    for (const [groupKey, values] of groupObj) {
        // Для каждой группы находим минимальное и максимальное значение по полю "Рейтинг"
        // Адаптировано под ваши данные: используется ключ "Рейтинг"[1]
        const minMax = d3.extent(values, d => d["Рейтинг"]);
        arrGraph.push({labelX: groupKey, values: minMax});
    }
    return arrGraph;
}

/**
 * Создает и отрисовывает оси X и Y для графика.
 * @param {object} chart - d3 selection объекта <g>, в котором будут рисоваться оси.
 * @param {Array} data - Подготовленные данные для графика.
 * @param {number} width - Ширина области графика.
 * @param {number} height - Высота области графика.
 * @returns {Array} - Массив из двух шкал [scaleX, scaleY].
 */
function createAxes(chart, data, width, height) {
    // Шкала X (ось категорий: Год, Страна)
    const scaleX = d3.scaleBand()
        .domain(data.map(d => d.labelX).sort((a, b) => a - b)) // Сортируем домен для корректного отображения
        .range([0, width])
        .padding(0.2);

    // Находим общий минимум и максимум для оси Y
    const allValues = data.flatMap(d => d.values);
    const [min, max] = d3.extent(allValues);

    // Шкала Y (ось значений: Рейтинг)
    const scaleY = d3.scaleLinear()
        .domain([min > 0 ? min * 0.9 : 0, max * 1.05]) // Даем небольшой отступ сверху и снизу
        .range([height, 0]);

    // Создаем и добавляем ось X
    chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(scaleX))
        .selectAll("text") // Поворачиваем подписи для лучшей читаемости
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    // Создаем и добавляем ось Y
    chart.append("g")
        .call(d3.axisLeft(scaleY));

    return [scaleX, scaleY];
}

/**
 * Рисует гистограмму (столбчатую диаграмму).
 */
function createChartGist(chart, data, scaleX, scaleY, height, showMax, showMin) {
    const drawGist = (valueAccessor, color, shift) => {
        chart.selectAll(`.gist-${color}`)
            .data(data)
            .enter()
            .append("rect")
            .attr("class", `gist-${color}`)
            .attr("x", d => scaleX(d.labelX) + shift)
            .attr("y", d => scaleY(valueAccessor(d)))
            .attr("width", scaleX.bandwidth() / (showMax && showMin ? 2 : 1))
            .attr("height", d => height - scaleY(valueAccessor(d)))
            .attr("fill", color);
    };

    if (showMax && showMin) {
        drawGist(d => d.values[1], "red", 0); // Макс. значения
        drawGist(d => d.values[0], "blue", scaleX.bandwidth() / 2); // Мин. значения
    } else if (showMax) {
        drawGist(d => d.values[1], "red", 0);
    } else if (showMin) {
        drawGist(d => d.values[0], "blue", 0);
    }
}

/**
 * Рисует точечную диаграмму.
 */
function createChartDot(chart, data, scaleX, scaleY, showMax, showMin) {
    const drawDots = (valueAccessor, color) => {
        chart.selectAll(`.dot-${color}`)
            .data(data)
            .enter()
            .append("circle")
            .attr("class", `dot-${color}`)
            .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
            .attr("cy", d => scaleY(valueAccessor(d)))
            .attr("r", 5)
            .attr("fill", color);
    };

    if (showMax) drawDots(d => d.values[1], "red");
    if (showMin) drawDots(d => d.values[0], "blue");
}

/**
 * Рисует линейный график.
 */
function createChartLine(chart, data, scaleX, scaleY, showMax, showMin) {
    const drawLine = (valueAccessor, color) => {
        const lineGenerator = d3.line()
            .x(d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
            .y(d => scaleY(valueAccessor(d)));

        // Рисуем саму линию
        chart.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("d", lineGenerator);

        // Рисуем точки на линии
        createChartDot(chart, data, scaleX, scaleY, valueAccessor, color);
    };

    if (showMax) drawLine(d => d.values[1], "red");
    if (showMin) drawLine(d => d.values[0], "blue");
}
